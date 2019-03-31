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
          new State(
            state.config,
            unconsed.tail,
            newPos,
            state.userState
          )
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

describe(".reservedOp(name)", () => {
  const def = new LanguageDef({
    opStart : opStart,
    opLetter: opLetter,
  });
  const tp = makeTokenParser(def);
  const reservedOp = tp.reservedOp;

  it("should parse a reserved operator `name'", () => {
    expect(reservedOp).to.be.a("function");
    const parser = reservedOp("->");
    expect(parser).to.be.a.parser;
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "-> XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          undefined,
          new State(
            new Config({ tabWidth: 8, unicode: false }),
            "XYZ",
            new SourcePos("foobar", 1, 4),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "- XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("->")),
            ]
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "->+",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "C"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, show("+")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of " + show("->")),
            ]
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("->")),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
