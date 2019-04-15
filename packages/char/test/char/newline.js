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
} = $core;

const { newline } = $char;

describe("newline", () => {
  it("should be a parser that accepts a newline character (LF)", () => {
    expect(newline).to.be.a.parser;
    // match
    {
      const initState = new State(
        new Config(),
        "\nABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = newline.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1)),
        "\n",
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 2, 1),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = newline.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "new-line"),
          ]
        )
      ));
    }
    // empty input
    {
      const initState = new State(
        new Config(),
        "",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = newline.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "new-line"),
          ]
        )
      ));
    }
  });
});
