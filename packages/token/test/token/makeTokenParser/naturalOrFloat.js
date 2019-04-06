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

describe("naturalOrFloat", () => {
  const EPS = 1e-15;
  function floatSimEqual(x, y) {
    const m = Math.abs(Math.max(x, y));
    return m === 0
      ? Math.abs(x - y) < EPS
      : Math.abs(x - y) / m < EPS;
  }
  function naturalOrFloatSimEqual(x, y) {
    return typeof x === "object" && typeof y === "object"
      && x !== null && y !== null
      && x.type === y.type && floatSimEqual(x.value, y.value);
  }

  it("should be a parser that pases a natural number or a floating-point number and returns an"
    + " object contains the parsed value and its type", () => {
    const def = LanguageDef.create({});
    const { naturalOrFloat } = makeTokenParser(def);
    expect(naturalOrFloat).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0xABCDEF.06789UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 8, 1, 9),
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
            new SourcePos("main", 8, 1, 9),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0o12345670.06789UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 10, 1, 11),
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
            new SourcePos("main", 10, 1, 11),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "01234567890UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 11, 1, 12),
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
            new SourcePos("main", 11, 1, 12),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "09876.5432e-10UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 14, 1, 15),
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
            new SourcePos("main", 14, 1, 15),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0.5432e-10UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 10, 1, 11),
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
            new SourcePos("main", 10, 1, 11),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
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
            new SourcePos("main", 1, 1, 2),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "1234567890UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 10, 1, 11),
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
            new SourcePos("main", 10, 1, 11),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "9876.5432e-10 UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 14, 1, 15),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          { type: "float", value: 9876.5432e-10 },
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("main", 14, 1, 15),
            "none"
          )
        ),
        naturalOrFloatSimEqual
      );
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0xUVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0oUVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0.UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0eUVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("-")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("+")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0e-UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "987.UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "987eUVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("-")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("+")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "987e-UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = naturalOrFloat.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
            ErrorMessage.create(ErrorMessageType.EXPECT, "number"),
          ]
        )
      ));
    }
  });
});
