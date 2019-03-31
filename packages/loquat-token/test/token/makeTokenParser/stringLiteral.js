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

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

describe(".stringLiteral", () => {
  it("should parse a character literal", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const stringLiteral = tp.stringLiteral;
    expect(stringLiteral).to.be.a.parser;
    // csucc
    // empty
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    // letter
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"ABC\" XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 7),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "ABC",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 7),
            "none"
          )
        )
      )).to.be.true;
    }
    // escape
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"AB\\\t\n \\C\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 2, 5),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "ABC",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 2, 5),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"AB\\&C\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 8),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "ABC",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 8),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"AB\\10\\o12\\xA\\LF\\NUL\\^HC\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 26),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "AB\n\n\n\n\u0000\u0008C",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 26),
            "none"
          )
        )
      )).to.be.true;
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 5),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""), // letter
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""), // escape
              ErrorMessage.create(ErrorMessageType.EXPECT, "string character"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""), // end
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of string"),
            ]
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"\n\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")), // letter
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")), // escape
              ErrorMessage.create(ErrorMessageType.EXPECT, "string character"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")), // end
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of string"),
            ]
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"\\ XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of string gap"),
            ]
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"\\?XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(res).to.be.an.instanceOf(Result);
      expect(res.consumed).to.be.true;
      expect(res.success).to.be.false;
      expect(res.err).to.be.an.instanceOf(ParseError);
      expect(SourcePos.equal(
        res.err.pos,
        new SourcePos("foobar", 1, 3)
      )).to.be.true;
      expect(
        res.err.msgs.some(msg =>
          msg.type === ErrorMessageType.SYSTEM_UNEXPECT
                    && msg.msgStr === show("?")
        )
      ).to.be.true;
      expect(
        res.err.msgs.some(msg =>
          msg.type === ErrorMessageType.EXPECT
                    && msg.msgStr === "escape code"
        )
      ).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\"\\oU\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
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
        "\"\\xU\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
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
        "\"\\^?\"XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("?")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "uppercase letter"),
            ]
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
      const res = stringLiteral.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "literal string"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
