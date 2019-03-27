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
} = _core;

const { spaces } = _char;

describe("spaces", () => {
  it("should be a parser that skips many space characters", () => {
    expect(spaces).to.be.a.parser;
    // match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        " \f\n\r\t\vABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = spaces.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 6, 2, 10),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
          ]
        ),
        undefined,
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 6, 2, 10),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        " \f\n\r\t\v",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = spaces.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 6, 2, 10),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
          ]
        ),
        undefined,
        new State(
          initState.config,
          "",
          new SourcePos("main", 6, 2, 10),
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
      const res = spaces.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "white space"),
          ]
        ),
        undefined,
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 0, 1, 1),
          "none"
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
      const res = spaces.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "white space"),
          ]
        ),
        undefined,
        new State(
          initState.config,
          "",
          new SourcePos("main", 0, 1, 1),
          "none"
        )
      ));
    }
  });
});
