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

describe(".brackets(parser)", () => {
  it("should return a parser that parses token between brackets", () => {
    const def = new LanguageDef({});
    const tp = makeTokenParser(def);
    const brackets = tp.brackets;
    expect(brackets).to.be.a("function");
    // csucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "[ ABC ] DEF",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(State.equal(
          state,
          new State(
            new Config({ tabWidth: 8 }),
            "ABC ] DEF",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )).to.be.true;
        return Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 7),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "] XYZ",
            new SourcePos("foobar", 1, 7),
            "some"
          )
        );
      });
      const parser = brackets(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 9),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 9),
            "some"
          )
        )
      )).to.be.true;
    }
    // cfail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "[ ABC ] DEF",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(State.equal(
          state,
          new State(
            new Config({ tabWidth: 8 }),
            "ABC ] DEF",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )).to.be.true;
        return Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 7),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = brackets(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 7),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        )
      )).to.be.true;
    }
    // esucc
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "[ ABC ] DEF",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(State.equal(
          state,
          new State(
            new Config({ tabWidth: 8 }),
            "ABC ] DEF",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )).to.be.true;
        return Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "] XYZ",
            new SourcePos("foobar", 1, 3),
            "some"
          )
        );
      });
      const parser = brackets(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 5),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 5),
            "some"
          )
        )
      )).to.be.true;
    }
    // efail
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "[ ABC ] DEF",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(State.equal(
          state,
          new State(
            new Config({ tabWidth: 8 }),
            "ABC ] DEF",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )).to.be.true;
        return Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        );
      });
      const parser = brackets(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
            ]
          )
        )
      )).to.be.true;
    }
    // not brackets
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC ] DEF",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = brackets(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("[")),
            ]
          )
        )
      )).to.be.true;
    }
    // not closed
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "[ ABC ] DEF",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const p = new StrictParser(state => {
        expect(State.equal(
          state,
          new State(
            new Config({ tabWidth: 8 }),
            "ABC ] DEF",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )).to.be.true;
        return Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 7),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("foobar", 1, 7),
            "some"
          )
        );
      });
      const parser = brackets(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 7),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, show("]")),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
