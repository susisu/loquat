"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  ParseError,
  StrictParseError,
  Config,
  State,
  Result,
} = _core;

const { anyChar } = _char;

describe("anyChar", () => {
  it("should be a parser that accepts any character", () => {
    expect(anyChar).to.be.a.parser;
    // non-empty input
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = anyChar.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "A",
        new State(
          initState.config,
          "BC",
          new SourcePos("main", 1, 1, 2),
          "none"
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
      const res = anyChar.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "")]
        )
      ));
    }
  });

  it("should use the unicode flag of the config", () => {
    // unicode = false
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = anyChar.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "\uD83C",
        new State(
          initState.config,
          "\uDF63ABC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // unicode = true
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = anyChar.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 2)),
        "\uD83C\uDF63",
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 2, 1, 2),
          "none"
        )
      ));
    }
  });
});
