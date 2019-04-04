"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError, StrictParseError } = _error;
const { Config, State, Result, StrictParser, parse } = _parser;

describe("parse", () => {
  it("should run `parser' and return result as a simple object", () => {
    // csucc
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 0, 1, 1),
          "none"
        ))).to.be.true;
        return Result.csucc(
          new StrictParseError(
            new SourcePos("main", 496, 6, 28),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
            ]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 506, 7, 29),
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
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 0, 1, 1),
          "none"
        ))).to.be.true;
        return Result.cfail(
          new StrictParseError(
            new SourcePos("main", 496, 6, 28),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
            ]
          )
        );
      });
      const res = parse(parser, "main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(ParseError.equal(res.error, new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ))).to.be.true;
    }
    // esucc
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 0, 1, 1),
          "none"
        ))).to.be.true;
        return Result.esucc(
          new StrictParseError(
            new SourcePos("main", 496, 6, 28),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
            ]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 506, 7, 29),
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
    // efail
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 0, 1, 1),
          "none"
        ))).to.be.true;
        return Result.efail(
          new StrictParseError(
            new SourcePos("main", 496, 6, 28),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
            ]
          )
        );
      });
      const res = parse(parser, "main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(ParseError.equal(res.error, new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ))).to.be.true;
    }
    // use default parameters
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, new State(
          new Config(),
          "test",
          new SourcePos("main", 0, 1, 1),
          undefined
        ))).to.be.true;
        return Result.csucc(
          new StrictParseError(
            new SourcePos("main", 496, 6, 28),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
            ]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 4, unicode: true }),
            "rest",
            new SourcePos("main", 506, 7, 29),
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
