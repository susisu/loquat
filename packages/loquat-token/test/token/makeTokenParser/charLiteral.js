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

describe("charLiteral", () => {
  it("should be a parser that parses a character literal", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const charLiteral = tp.charLiteral;
    expect(charLiteral).to.be.a.parser;
    // csucc
    // letter
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'A' XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "A",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 4, 1, 5),
          "none"
        )
      ));
    }
    // escape
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\n'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "\n",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 4, 1, 5),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\10'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "\n",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 5, 1, 6),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\o12'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 6, 1, 7),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "\n",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 6, 1, 7),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\xA'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "\n",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 5, 1, 6),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\LF'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "\n",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 5, 1, 6),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\NUL'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 6, 1, 7),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "\u0000",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 6, 1, 7),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\^H'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "\u0008",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 5, 1, 6),
          "none"
        )
      ));
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("Y")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "end of character"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "''XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("'")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("'")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "literal character"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\n'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "literal character"),
          ]
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\?XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res.success).to.be.false;
      expect(res.consumed).to.be.true;
      expect(res.err).to.be.an.instanceOf(ParseError);
      expect(res.err.pos).to.be.an.equalPositionTo(new SourcePos("main", 2, 1, 3));
      expect(
        res.err.msgs.some(msg =>
          msg.type === ErrorMessageType.SYSTEM_UNEXPECT
            && msg.str === show("?")
        )
      ).to.be.true;
      expect(
        res.err.msgs.some(msg =>
          msg.type === ErrorMessageType.EXPECT
            && msg.str === "escape code"
        )
      ).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "'\\oU'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
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
        "'\\xU'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
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
        "'\\^?'XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("?")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "uppercase letter"),
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
      const res = charLiteral.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "character"),
          ]
        )
      ));
    }
  });
});
