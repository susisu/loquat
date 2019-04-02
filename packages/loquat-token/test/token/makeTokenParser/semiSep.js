"use strict";

const chai = require("chai");
const { expect } = chai;

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

describe("semiSep", () => {
  const p = new StrictParser(state => {
    const u = uncons(state.input, state.config);
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
      const newPos = state.pos.addChar(u.head, state.config.tabWidth);
      return Result.csucc(
        new StrictParseError(
          newPos,
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "C")]
        ),
        u.head,
        new State(state.config, u.tail, newPos, state.userState)
      );
    }
    case "c": {
      const newPos = state.pos.addChar(u.head, state.config.tabWidth);
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
        new State(state.config, u.tail, state.pos, state.userState)
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

  it("should create a parser that parses zero or more tokens separated by semicolons", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const semiSep = tp.semiSep;
    expect(semiSep).to.be.a("function");
    const parser = semiSep(p);
    expect(parser).to.be.a.parser;
    // empty
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "X",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
          ),
          [],
          initState
        ),
        chai.util.eql
      );
    }
    // many
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "C; C; CX",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 7, 1, 8),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show(";")),
            ]
          ),
          ["C", "C", "C"],
          new State(
            new Config({ tabWidth: 8 }),
            "X",
            new SourcePos("main", 7, 1, 8),
            "none"
          )
        ),
        chai.util.eql
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "C; C; C; X",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 9, 1, 10),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
          ]
        )
      ));
    }
  });
});
