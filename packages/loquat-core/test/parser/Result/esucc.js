"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result } = _parser;

describe(".esucc", () => {
  it("should create an empty success result object", () => {
    const res = Result.esucc(
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
        "none"
      )
    );
    expect(Result.equal(res, {
      success : true,
      consumed: false,
      err     : new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ),
      val  : "val",
      state: new State(
        new Config({ tabWidth: 4, unicode: true }),
        "rest",
        new SourcePos("main", 506, 7, 29),
        "none"
      ),
    })).to.be.true;
  });
});
