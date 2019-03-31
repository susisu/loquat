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
} = _core;

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

describe(".lexeme(parser)", () => {
  it("should return a parser that skips trailing spaces and comments", () => {
    const def = new LanguageDef({
      commentLine   : "--",
      commentStart  : "{-",
      commentEnd    : "-}",
      nestedComments: true,
    });
    const tp = makeTokenParser(def);
    const lexeme = tp.lexeme;
    expect(lexeme).to.be.a("function");
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tXYZ",
            new SourcePos("foobar", 1, 2),
            "some"
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 5, 9),
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
            new SourcePos("foobar", 5, 9),
            "some"
          )
        )
      )).to.be.true;
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        )
      )).to.be.true;
    }
    // esucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tXYZ",
            new SourcePos("foobar", 1, 1),
            "some"
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 5, 9),
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
            new SourcePos("foobar", 5, 9),
            "some"
          )
        )
      )).to.be.true;
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = lexeme(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        )
      )).to.be.true;
    }
  });
});
