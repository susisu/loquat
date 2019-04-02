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

describe("float", () => {
  const EPS = 1e-15;
  function floatSimEqual(x, y) {
    const m = Math.abs(Math.max(x, y));
    return m === 0
      ? Math.abs(x - y) < EPS
      : Math.abs(x - y) / m < EPS;
  }

  it("should be a parser that parses a floating-point number", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const float = tp.float;
    expect(float).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "12345.06789XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 11, 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          12345.06789,
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 11, 1, 12),
            "none"
          )
        ),
        floatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "98765432E10XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 11, 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          98765432e+10,
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 11, 1, 12),
            "none"
          )
        ),
        floatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "98765432e+10XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 12, 1, 13),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          98765432e+10,
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 12, 1, 13),
            "none"
          )
        ),
        floatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "98765432e-10XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 12, 1, 13),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          98765432e-10,
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 12, 1, 13),
            "none"
          )
        ),
        floatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "9876.5432e-10XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 13, 1, 14),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          9876.5432e-10,
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 13, 1, 14),
            "none"
          )
        ),
        floatSimEqual
      );
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "9876.5432e-10 XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 14, 1, 15),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          9876.5432e-10,
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 14, 1, 15),
            "none"
          )
        ),
        floatSimEqual
      );
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "123XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "123.XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "fraction"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "123eXYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("-")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("+")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "123e-XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "123e+XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "123.456eXYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 8, 1, 9),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("-")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("+")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "exponent"),
          ]
        )
      ));
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = float.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "float"),
          ]
        )
      ));
    }
  });
});
