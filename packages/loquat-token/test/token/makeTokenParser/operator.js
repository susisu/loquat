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

describe(".operator", () => {
  it("should parse an operator", () => {
    const def = new LanguageDef({
      opStart : opStart,
      opLetter: opLetter,
    });
    const tp = makeTokenParser(def);
    const operator = tp.operator;
    expect(operator).to.be.a.parser;
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+: XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = operator.run(initState);
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
          "+:",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 4),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        ":+ XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = operator.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"),
            ]
          )
        )
      )).to.be.true;
    }
  });

  it("should not accept reserved operator", () => {
    {
      const def = new LanguageDef({
        opStart    : opStart,
        opLetter   : opLetter,
        reservedOps: [],
      });
      const tp = makeTokenParser(def);
      const operator = tp.operator;
      expect(operator).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-> XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = operator.run(initState);
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
          "->",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 4),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const def = new LanguageDef({
        opStart    : opStart,
        opLetter   : opLetter,
        reservedOps: ["=", "->", "<-"],
      });
      const tp = makeTokenParser(def);
      const operator = tp.operator;
      expect(operator).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-> XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = operator.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved operator " + show("->")),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
