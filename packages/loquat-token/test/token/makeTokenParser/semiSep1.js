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

const p = new StrictParser(state => {
  const u = uncons(state.input);
  if (u.empty) {
    return Result.efail(
      new StrictParseError(
        state.pos,
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
      )
    );
  }
  switch (u.head) {
  case "C": {
    const newPos = state.pos.addChar(u.head);
    return Result.csucc(
      new StrictParseError(
        newPos,
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "C")]
      ),
      u.head,
      new State(
        state.config,
        u.tail,
        newPos,
        state.userState
      )
    );
  }
  case "c": {
    const newPos = state.pos.addChar(u.head);
    return Result.cfail(
      new StrictParseError(
        newPos,
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "c")]
      )
    );
  }
  case "E":
    return Result.esucc(
      new StrictParseError(
        state.pos,
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "E")]
      ),
      u.head,
      new State(
        state.config,
        u.tail,
        state.pos,
        state.userState
      )
    );
  case "e":
  default:
    return Result.efail(
      new StrictParseError(
        state.pos,
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
      )
    );
  }
});

const arrayEqual = (xs, ys) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);

describe(".semiSep1(parser)", () => {
  it("should return a parser that parses one or more tokens separated by semicolons", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const semiSep1 = tp.semiSep1;
    expect(semiSep1).to.be.a("function");
    const parser = semiSep1(p);
    expect(parser).to.be.a.parser;
    // empty
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "X",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // many
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "C; C; CX",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 8),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show(";")),
            ]
          ),
          ["C", "C", "C"],
          new State(
            new Config({ tabWidth: 8 }),
            "X",
            new SourcePos("foobar", 1, 8),
            "none"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "C; C; C; X",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 10),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
            ]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
  });
});
