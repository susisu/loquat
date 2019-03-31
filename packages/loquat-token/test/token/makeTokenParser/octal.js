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

describe(".octal", () => {
  it("should parse octal digits after a character O/o and return an integer", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const octal = tp.octal;
    expect(octal).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "O12345670UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = octal.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 10),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
            ]
          ),
          2739128, // 0o12345670
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 10),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "o12345670 UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = octal.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 10),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
            ]
          ),
          2739128, // 0o12345670
          new State(
            new Config({ tabWidth: 8 }),
            " UVW",
            new SourcePos("foobar", 1, 10),
            "none"
          )
        )
      )).to.be.true;
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "oUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = octal.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
            ]
          )
        )
      )).to.be.true;
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = octal.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U"))]
          )
        )
      )).to.be.true;
    }
  });
});
