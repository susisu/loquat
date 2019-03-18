"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;
const { Config, State, Result, Parser, LazyParser } = _parser;

describe("#parse", () => {
  it("should run the parser with a new state and return result as a simple object", () => {
    // csuc
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new Parser(state => {
          expect(State.equal(
            state,
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "test",
              new SourcePos("main", 1, 1),
              "none"
            )
          )).to.be.true;
          return Result.csuc(
            new ParseError(
              new SourcePos("main", 6, 28),
              [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
              ]
            ),
            "val",
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "rest",
              new SourcePos("main", 6, 28),
              "some"
            )
          );
        });
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(evaluated).to.be.true;
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
    // cerr
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new Parser(state => {
          expect(State.equal(
            state,
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "test",
              new SourcePos("main", 1, 1),
              "none"
            )
          )).to.be.true;
          return Result.cerr(
            new ParseError(
              new SourcePos("main", 6, 28),
              [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
              ]
            )
          );
        });
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(evaluated).to.be.true;
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(ParseError.equal(
        res.error,
        new ParseError(
          new SourcePos("main", 6, 28),
          [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
          ]
        )
      )).to.be.true;
    }
    // esuc
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new Parser(state => {
          expect(State.equal(
            state,
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "test",
              new SourcePos("main", 1, 1),
              "none"
            )
          )).to.be.true;
          return Result.esuc(
            new ParseError(
              new SourcePos("main", 6, 28),
              [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
              ]
            ),
            "val",
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "rest",
              new SourcePos("main", 6, 28),
              "some"
            )
          );
        });
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(evaluated).to.be.true;
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
    // eerr
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new Parser(state => {
          expect(State.equal(
            state,
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "test",
              new SourcePos("main", 1, 1),
              "none"
            )
          )).to.be.true;
          return Result.eerr(
            new ParseError(
              new SourcePos("main", 6, 28),
              [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
              ]
            )
          );
        });
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(evaluated).to.be.true;
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(ParseError.equal(
        res.error,
        new ParseError(
          new SourcePos("main", 6, 28),
          [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
          ]
        )
      )).to.be.true;
    }
    // use default parameters
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new Parser(state => {
          expect(State.equal(
            state,
            new State(
              new Config(),
              "test",
              new SourcePos("main", 1, 1),
              "none"
            )
          )).to.be.true;
          return Result.csuc(
            new ParseError(
              new SourcePos("main", 6, 28),
              [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
              ]
            ),
            "val",
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "rest",
              new SourcePos("main", 6, 28),
              "some"
            )
          );
        });
      });
      const res = parser.parse("main", "test", "none");
      expect(evaluated).to.be.true;
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
  });
});
