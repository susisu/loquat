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

describe("decimal", () => {
  it("should be a parser that parses decimal digits and returns an parsed integer", () => {
    const def = LanguageDef.create({});
    const { decimal } = makeTokenParser(def);
    expect(decimal).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "1234567890XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = decimal.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 11),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
          ]
        ),
        1234567890,
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 1, 11),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "1234567890 XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = decimal.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 11),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
          ]
        ),
        1234567890,
        new State(
          new Config({ tabWidth: 8 }),
          " XYZ",
          new SourcePos("main", 1, 11),
          "none"
        )
      ));
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = decimal.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
          ]
        )
      ));
    }
  });
});
