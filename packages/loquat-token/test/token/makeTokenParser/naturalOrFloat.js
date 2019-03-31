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

const EPS = 1e-15;

function floatEqual(x, y) {
  const m = Math.abs(Math.max(x, y));
  return m === 0
        ? Math.abs(x - y) < EPS
        : Math.abs(x - y) / m < EPS;
}

function objEqual(x, y) {
  return typeof x === "object" && typeof y === "object"
        && x !== null && y !== null
        && x.type === y.type && floatEqual(x.value, y.value);
}

describe(".naturalOrFloat", () => {
  it("should parse a natural or floating-point number"
        + " and return the result as an object with `type' and `value'", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const naturalOrFloat = tp.naturalOrFloat;
    expect(naturalOrFloat).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0xABCDEF.06789UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 9),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "natural", value: 0xABCDEF },
          new State(
            new Config({ tabWidth: 8 }),
            ".06789UVW",
            new SourcePos("foobar", 1, 9),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0o12345670.06789UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 11),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "natural", value: 2739128 }, // 0o12345670
          new State(
            new Config({ tabWidth: 8 }),
            ".06789UVW",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "01234567890UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "natural", value: 1234567890 },
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 12),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "09876.5432e-10UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 15),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "float", value: 9876.5432e-10 },
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 15),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0.5432e-10UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 11),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "float", value: 0.5432e-10 },
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // hexadecimal
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // octal
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "natural", value: 0 },
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 2),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "1234567890UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 11),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "natural", value: 1234567890 },
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "9876.5432e-10 UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 15),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "float", value: 9876.5432e-10 },
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 15),
            "none"
          )
        ),
        objEqual
      )).to.be.true;
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0xUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0oUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0.UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0eUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("-")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("+")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0e-UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "987.UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 5),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "987eUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 5),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("-")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("+")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "987e-UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 6),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
            ]
          )
        ),
        objEqual
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
      const res = naturalOrFloat.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
              ErrorMessage.create(ErrorMessageType.EXPECT, "number"),
            ]
          )
        ),
        objEqual
      )).to.be.true;
    }
  });
});
