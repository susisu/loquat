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

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

describe(".decimal", () => {
  it("should parse decimal digits and return an integer", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const decimal = tp.decimal;
    expect(decimal).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "1234567890XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = decimal.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 11),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
            ]
          ),
          1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "1234567890 XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = decimal.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 11),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
            ]
          ),
          1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            " XYZ",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        )
      )).to.be.true;
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = decimal.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
