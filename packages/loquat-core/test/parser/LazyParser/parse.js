"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result, StrictParser, LazyParser } = _parser;

describe("#parse", () => {
  it("should run the parser with a new state and return result as a simple object", () => {
    // csuc
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(new State(
            new Config({ tabWidth: 4, unicode: true }),
            "test",
            new SourcePos("main", 0, 1, 1),
            "none"
          ));
          return Result.csuc(
            new StrictParseError(
              new SourcePos("main", 496, 6, 28),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
                ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
              ]
            ),
            "val",
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "rest",
              new SourcePos("main", 506, 7, 29),
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
    // cfail
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(new State(
            new Config({ tabWidth: 4, unicode: true }),
            "test",
            new SourcePos("main", 0, 1, 1),
            "none"
          ));
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
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(evaluated).to.be.true;
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(res.error).to.be.an.equalErrorTo(new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ));
    }
    // esuc
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(new State(
            new Config({ tabWidth: 4, unicode: true }),
            "test",
            new SourcePos("main", 0, 1, 1),
            "none"
          ));
          return Result.esuc(
            new StrictParseError(
              new SourcePos("main", 496, 6, 28),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
                ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
              ]
            ),
            "val",
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "rest",
              new SourcePos("main", 506, 7, 29),
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
    // efail
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(new State(
            new Config({ tabWidth: 4, unicode: true }),
            "test",
            new SourcePos("main", 0, 1, 1),
            "none"
          ));
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
      });
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(evaluated).to.be.true;
      expect(res).to.be.an("object");
      expect(res.success).to.be.false;
      expect(res.error).to.be.an.equalErrorTo(new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ));
    }
    // use default parameters
    {
      let evaluated = false;
      const parser = new LazyParser(() => {
        evaluated = true;
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(new State(
            new Config(),
            "test",
            new SourcePos("main", 0, 1, 1),
            "none"
          ));
          return Result.csuc(
            new StrictParseError(
              new SourcePos("main", 496, 6, 28),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
                ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
              ]
            ),
            "val",
            new State(
              new Config({ tabWidth: 4, unicode: true }),
              "rest",
              new SourcePos("main", 506, 7, 29),
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
