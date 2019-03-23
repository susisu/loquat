"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result, StrictParser } = _parser;

describe("#parse", () => {
  it("should run the parser with a new state and return result as a simple object", () => {
    // csuc
    {
      const parser = new StrictParser(state => {
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
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
    // cerr
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 0, 1, 1),
          "none"
        ));
        return Result.cerr(
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
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
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
      const parser = new StrictParser(state => {
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
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
    // eerr
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 0, 1, 1),
          "none"
        ));
        return Result.eerr(
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
      const res = parser.parse("main", "test", "none", { tabWidth: 4, unicode: true });
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
      const parser = new StrictParser(state => {
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
      const res = parser.parse("main", "test", "none");
      expect(res).to.deep.equal({
        success: true,
        value  : "val",
      });
    }
  });
});
