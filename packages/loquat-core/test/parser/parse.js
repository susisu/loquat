"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;
const { Config, State, Result, Parser, parse } = _parser;

describe("parse", () => {
  it("should run `parser' and return result as a simple object", () => {
    // csuc
    {
      const parser = new Parser(state => {
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
          "nyancat",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 6, 28),
            "some"
          )
        );
      });
      const res = parse(parser, "main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.deep.equal({
        success: true,
        value  : "nyancat",
      });
    }
    // cerr
    {
      const parser = new Parser(state => {
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
      const res = parse(parser, "main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(res.error).to.be.an.equalErrorTo(
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
    }
    // esuc
    {
      const parser = new Parser(state => {
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
          "nyancat",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 6, 28),
            "some"
          )
        );
      });
      const res = parse(parser, "main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.deep.equal({
        success: true,
        value  : "nyancat",
      });
    }
    // eerr
    {
      const parser = new Parser(state => {
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
      const res = parse(parser, "main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(res.error).to.be.an.equalErrorTo(
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
    }
    // use default parameters
    {
      const parser = new Parser(state => {
        expect(State.equal(
          state,
          new State(
            new Config(),
            "test",
            new SourcePos("main", 1, 1),
            undefined
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
          "nyancat",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 6, 28),
            "some"
          )
        );
      });
      const res = parse(parser, "main", "test", undefined);
      expect(res).to.deep.equal({
        success: true,
        value  : "nyancat",
      });
    }
  });
});
