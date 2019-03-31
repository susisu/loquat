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

describe(".symbol(name)", () => {
  it("should return a parser that parses string `name' and skips trailing spaces and"
    + " comments", () => {
    const def = new LanguageDef({
      commentLine   : "--",
      commentStart  : "{-",
      commentEnd    : "-}",
      nestedComments: true,
    });
    const tp = makeTokenParser(def);
    const symbol = tp.symbol;
    expect(symbol).to.be.a("function");
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = symbol("AB");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "AB",
          new State(
            new Config({ tabWidth: 8 }),
            "C",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "AB{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = symbol("AB");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 5, 9),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "AB",
          new State(
            new Config({ tabWidth: 8 }),
            "C",
            new SourcePos("foobar", 5, 9),
            "none"
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
      const parser = symbol("AD");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("B")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("AD")),
            ]
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
      const parser = symbol("DE");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("DE")),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
