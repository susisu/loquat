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

const { tab } = _char;

describe("tab", () => {
  it("should be a parser that accepts a tab character", () => {
    expect(tab).to.be.a.parser;
    // match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\tABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = tab.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 9)),
        "\t",
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 1, 1, 9),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = tab.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "tab"),
          ]
        )
      ));
    }
    // empty input
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = tab.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "tab"),
          ]
        )
      ));
    }
  });
});
