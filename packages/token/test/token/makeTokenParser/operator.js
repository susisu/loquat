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
} = _core;

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

describe("operator", () => {
  function genCharParser(re) {
    return new StrictParser(state => {
      const unconsed = uncons(state.input, state.config);
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

  it("should be a parser that parses an operator", () => {
    const def = LanguageDef.create({
      opStart : opStart,
      opLetter: opLetter,
    });
    const { operator } = makeTokenParser(def);
    expect(operator).to.be.a.parser;
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+: XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = operator.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "+:",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 3, 1, 4),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        ":+ XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = operator.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "operator"),
          ]
        )
      ));
    }
  });

  it("should not accept any reserved operator", () => {
    {
      const def = LanguageDef.create({
        opStart    : opStart,
        opLetter   : opLetter,
        reservedOps: [],
      });
      const { operator } = makeTokenParser(def);
      expect(operator).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-> XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = operator.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "->",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 3, 1, 4),
          "none"
        )
      ));
    }
    {
      const def = LanguageDef.create({
        opStart    : opStart,
        opLetter   : opLetter,
        reservedOps: ["=", "->", "<-"],
      });
      const { operator } = makeTokenParser(def);
      expect(operator).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-> XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = operator.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved operator " + show("->")),
          ]
        )
      ));
    }
  });

  it("should always fails without consumption if either or both of opStart or opLetter is not"
    + " specified", () => {
    const def = LanguageDef.create();
    const { operator } = makeTokenParser(def);
    expect(operator).to.be.a.parser;
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "XYZ",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = operator.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(
      new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "operator parser(s) not specified")]
      )
    ));
  });
});
