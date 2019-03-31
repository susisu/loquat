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

describe(".integer", () => {
  it("should parse an integer", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const integer = tp.integer;
    expect(integer).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          0,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 2),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+0UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          0,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-0UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          -0,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0x90ABCDEFUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 11),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          0x90ABCDEF,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+0x90ABCDEFUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          0x90ABCDEF,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 12),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-0x90ABCDEFUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          -0x90ABCDEF,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 12),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0o12345670UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 11),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          2739128, // 0o12345670
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+0o12345670UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          2739128, // 0o12345670
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 12),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-0o12345670UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          -2739128, // -0o12345670
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 12),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "01234567890UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 12),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 12),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+01234567890UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 13),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          +1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 13),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-01234567890UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 13),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          -1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 13),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "1234567890UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
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
          1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 11),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+ 1234567890 UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 14),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 14),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "- 1234567890 UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 14),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          -1234567890,
          new State(
            new Config({ tabWidth: 8 }),
            "UVW",
            new SourcePos("foobar", 1, 14),
            "none"
          )
        )
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
      const res = integer.run(initState);
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
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "0oUVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
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
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "-UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // lexeme
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
            ]
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "+UVW",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // lexeme
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
              ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
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
      const res = integer.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // -
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // +
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // lexeme
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
              ErrorMessage.create(ErrorMessageType.EXPECT, "integer"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
