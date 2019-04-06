"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  ParseError,
  StrictParseError,
  Config,
  State,
  Result,
} = _core;

const { letter } = _char;

describe("letter", () => {
  it("should be a parser that parses an alphabetical letter", () => {
    expect(letter).to.be.a.parser;
    // match
    for (const c of "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
      const initState = new State(
        new Config(),
        c + "012",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = letter.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        c,
        new State(
          initState.config,
          "012",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "012",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = letter.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("0")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "letter"),
          ]
        )
      ));
    }
    // empty input
    {
      const initState = new State(
        new Config(),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = letter.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "letter"),
          ]
        )
      ));
    }
  });
});
