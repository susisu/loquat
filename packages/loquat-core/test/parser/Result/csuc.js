"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result } = _parser;

describe(".csuc", () => {
  it("should create a consumed success result object", () => {
    const res = Result.csuc(
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
    expect(res).to.be.an.equalResultTo(new Result(
      true,
      true,
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
    ));
  });
});
