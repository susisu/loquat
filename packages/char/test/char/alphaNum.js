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

const { alphaNum } = _char;

describe("alphaNum", () => {
  it("should be a parser that accepts an alphabetical letter or a decimal digit", () => {
    expect(alphaNum).to.be.a.parser;
    // match
    for (const c of "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
      const initState = new State(
        new Config(),
        c + "+-*",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = alphaNum.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        c,
        new State(
          initState.config,
          "+-*",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "+-*",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = alphaNum.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("+")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "letter or digit"),
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
      const res = alphaNum.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "letter or digit"),
          ]
        )
      ));
    }
  });
});
