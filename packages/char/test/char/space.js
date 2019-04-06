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

const { space } = $char;

describe("space", () => {
  it("should be a parser that accepts a space character", () => {
    expect(space).to.be.a.parser;
    // match
    for (const c of " \f\r\v") {
      const initState = new State(
        new Config(),
        c + "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = space.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        c,
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // \n
    {
      const initState = new State(
        new Config(),
        "\nABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = space.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 2, 1)),
        "\n",
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 1, 2, 1),
          "none"
        )
      ));
    }
    // \t
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\tABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = space.run(initState);
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
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = space.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
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
      const res = space.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
          ]
        )
      ));
    }
  });
});
