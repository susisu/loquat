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
  StrictParser,
} = $core;

const { LanguageDef } = $language;
const { makeTokenParser } = $token;

describe("lexeme", () => {
  it("should create a parser that skips trailing spaces and comments", () => {
    const def = LanguageDef.create({
      commentLine   : "--",
      commentStart  : "{-",
      commentEnd    : "-}",
      nestedComments: true,
    });
    const { lexeme } = makeTokenParser(def);
    expect(lexeme).to.be.a("function");
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tXYZ",
            new SourcePos("main", 1, 2),
            "some"
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 9),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 5, 9),
          "some"
        )
      ));
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
        )
      ));
    }
    // esucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(
          new StrictParseError(
            new SourcePos("main", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tXYZ",
            new SourcePos("main", 1, 1),
            "some"
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 5, 9),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),
          ]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 8 }),
          "XYZ",
          new SourcePos("main", 5, 9),
          "some"
        )
      ));
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(
          new StrictParseError(
            new SourcePos("main", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
        )
      ));
    }
  });
});
