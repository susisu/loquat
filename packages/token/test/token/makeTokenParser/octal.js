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
} = $core;

const { LanguageDef } = $language;
const { makeTokenParser } = $token;

describe("octal", () => {
  it("should be a parser that parses octal digits after a character O/o and returns an parsed"
    + " integer", () => {
    const def = LanguageDef.create({});
    const { octal } = makeTokenParser(def);
    expect(octal).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "O12345670UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = octal.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 9, 1, 10),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
          ]
        ),
        2739128, // 0o12345670
        new State(
          new Config({ tabWidth: 8 }),
          "UVW",
          new SourcePos("main", 9, 1, 10),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "o12345670 UVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = octal.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 9, 1, 10),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
          ]
        ),
        2739128, // 0o12345670
        new State(
          new Config({ tabWidth: 8 }),
          " UVW",
          new SourcePos("main", 9, 1, 10),
          "none"
        )
      ));
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "oUVW",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = octal.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
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
      const res = octal.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("U"))]
        )
      ));
    }
  });
});
