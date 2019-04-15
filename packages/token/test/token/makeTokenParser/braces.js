"use strict";

const { expect, assert } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = $core;

const { LanguageDef } = $language;
const { makeTokenParser } = $token;

describe("braces", () => {
  it("should create a parser that parses tokens between braces", () => {
    const def = LanguageDef.create({});
    const { braces } = makeTokenParser(def);
    expect(braces).to.be.a("function");
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{ ABC } DEF",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 8 }),
          "ABC } DEF",
          new SourcePos("main", 1, 3),
          "none"
        ));
        return Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 7),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "} XYZ",
            new SourcePos("main", 1, 7),
            "some"
          )
        );
      });
      const parser = braces(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 9),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 1, 9),
          "some"
        )
      ));
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{ ABC } DEF",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 8 }),
          "ABC } DEF",
          new SourcePos("main", 1, 3),
          "none"
        ));
        return Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 7),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = braces(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 7),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
        )
      ));
    }
    // esucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{ ABC } DEF",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 8 }),
          "ABC } DEF",
          new SourcePos("main", 1, 3),
          "none"
        ));
        return Result.esucc(
          new StrictParseError(
            new SourcePos("main", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "} XYZ",
            new SourcePos("main", 1, 3),
            "some"
          )
        );
      });
      const parser = braces(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 5),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 1, 5),
          "some"
        )
      ));
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{ ABC } DEF",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 8 }),
          "ABC } DEF",
          new SourcePos("main", 1, 3),
          "none"
        ));
        return Result.efail(
          new StrictParseError(
            new SourcePos("main", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = braces(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
          ]
        )
      ));
    }
    // not braces
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC } DEF",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(_state => assert.fail("expect function to not be called"));
      const parser = braces(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("{")),
          ]
        )
      ));
    }
    // not closed
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{ ABC } DEF",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 8 }),
          "ABC } DEF",
          new SourcePos("main", 1, 3),
          "none"
        ));
        return Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 7),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 1, 7),
            "some"
          )
        );
      });
      const parser = braces(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 7),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, show("}")),
          ]
        )
      ));
    }
  });
});
