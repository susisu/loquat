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

describe(".spaces", () => {
  it("should return a parser that skips many space characters", () => {
    expect(spaces).to.be.a.parser;
    // match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        " \f\n\r\t\vABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = spaces.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 2, 10),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
            ]
          ),
          undefined,
          new State(
            initState.config,
            "ABC",
            new SourcePos("foobar", 2, 10),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        " \f\n\r\t\v",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = spaces.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 2, 10),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
            ]
          ),
          undefined,
          new State(
            initState.config,
            "",
            new SourcePos("foobar", 2, 10),
            "none"
          )
        )
      )).to.be.true;
    }
    // not match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = spaces.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "white space"),
            ]
          ),
          undefined,
          new State(
            initState.config,
            "ABC",
            new SourcePos("foobar", 1, 1),
            "none"
          )
        )
      )).to.be.true;
    }
    // empty input
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = spaces.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "white space"),
            ]
          ),
          undefined,
          new State(
            initState.config,
            "",
            new SourcePos("foobar", 1, 1),
            "none"
          )
        )
      )).to.be.true;
    }
  });
});
