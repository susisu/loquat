"use strict";

const { expect, assert, AssertionError } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result } = _parser;

describe(".equal", () => {
  it("should return true if two results are equal", () => {
    // use default arguments
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(Result.equal(resA, resB)).to.be.true;
    }
    // specify equal functions
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        "VAL",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "REST",
          new SourcePos("main", 497, 7, 29),
          "NONE"
        )
      );
      const ieq = (strA, strB) => strA.toLowerCase() === strB.toLowerCase();
      expect(Result.equal(resA, resB, ieq, ieq, ieq)).to.be.true;
    }
  });

  it("should return false if two results are different", () => {
    // different `consumed`
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.esucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(Result.equal(resA, resB)).to.be.false;
    }
    // different `success`
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.cfail(
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
      expect(Result.equal(resA, resB)).to.be.false;
    }
    // different errors
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "C"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "D"),
          ]
        ),
        "val",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(Result.equal(resA, resB)).to.be.false;
    }
    // different values
    {
      const resA = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        "A",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        "B",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(Result.equal(resA, resB)).to.be.false;
    }
    // different states
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.csucc(
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
          new SourcePos("main", 7, 28),
          "none"
        )
      );
      expect(Result.equal(resA, resB)).to.be.false;
    }
    // all
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.efail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "C"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "D"),
          ]
        )
      );
      expect(Result.equal(resA, resB)).to.be.false;
    }
  });

  it("should compare `val` and `state` properties only if both results are success", () => {
    const ieq = (_a, _b) => assert.fail("expect function to not be called");
    // both are failure
    {
      const resA = Result.cfail(
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
      const resB = Result.cfail(
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
      expect(() => {
        Result.equal(resA, resB, ieq, ieq, ieq);
      }).to.not.throw(AssertionError);
    }
    // one of resA or resB is failure
    {
      const resA = Result.csucc(
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
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const resB = Result.cfail(
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
      expect(() => {
        Result.equal(resA, resB, ieq, ieq, ieq);
      }).to.not.throw(AssertionError);
      expect(() => {
        Result.equal(resB, resA, ieq, ieq, ieq);
      }).to.not.throw(AssertionError);
    }
  });
});
