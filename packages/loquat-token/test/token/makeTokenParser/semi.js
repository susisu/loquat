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

describe("semi", () => {
  it("should be a parser that parses a semicolon", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const semi = tp.semi;
    expect(semi).to.be.a.parser;
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "; ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = semi.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        ";",
        new State(
          new Config({ tabWidth: 8 }),
          "ABC",
          new SourcePos("main", 2, 1, 3),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        ";ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = semi.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        ";",
        new State(
          new Config({ tabWidth: 8 }),
          "ABC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = semi.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show(";")),
          ]
        )
      ));
    }
  });
});
