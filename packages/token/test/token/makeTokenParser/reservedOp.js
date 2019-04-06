"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
  uncons,
} = $core;

const { LanguageDef } = $language;
const { makeTokenParser } = $token;

describe("reservedOp", () => {
  function genCharParser(re) {
    return new StrictParser(state => {
      const unconsed = uncons(state.input, state.config.unicode);
      if (unconsed.empty) {
        return Result.efail(
          new StrictParseError(
            state.pos,
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
          )
        );
      } else {
        if (re.test(unconsed.head)) {
          const newPos = state.pos.addChar(unconsed.head, state.config.tabWidth);
          return Result.csucc(
            new StrictParseError(
              newPos,
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "C")]
            ),
            unconsed.head,
            new State(state.config, unconsed.tail, newPos, state.userState)
          );
        } else {
          return Result.efail(
            new StrictParseError(
              state.pos,
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
            )
          );
        }
      }
    });
  }

  const opStart = genCharParser(/[+\-*/%=<>]/);
  const opLetter = genCharParser(/[+\-*/%=<>:]/);

  it("should create a parser that parses the given reserved operator", () => {
    const def = LanguageDef.create({
      opStart : opStart,
      opLetter: opLetter,
    });
    const { reservedOp } = makeTokenParser(def);
    expect(reservedOp).to.be.a("function");
    const parser = reservedOp("->");
    expect(parser).to.be.a.parser;
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "-> XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        undefined,
        new State(
          new Config({ tabWidth: 8, unicode: false }),
          "XYZ",
          new SourcePos("main", 3, 1, 4),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "- XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("->")),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "->+",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "C"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, show("+")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "end of " + show("->")),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("->")),
          ]
        )
      ));
    }
  });

  it("should always fails without consumption if either or both of opStart or opLetter is not"
    + " specified", () => {
    const def = LanguageDef.create();
    const { reservedOp } = makeTokenParser(def);
    expect(reservedOp).to.be.a("function");
    const parser = reservedOp("->");
    expect(parser).to.be.a.parser;
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "XYZ",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(
      new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "operator parser(s) not specified")]
      )
    ));
  });
});
