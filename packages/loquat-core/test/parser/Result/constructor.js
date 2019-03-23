"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result } = _parser;

describe(".constructor", () => {
  it("should create a new `Result` instance", () => {
    const res = new Result(
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
    );
    expect(res).to.be.an.instanceOf(Result);
    expect(res.consumed).to.be.true;
    expect(res.success).to.be.true;
    expect(res.err).to.be.an.equalErrorTo(new StrictParseError(
      new SourcePos("main", 496, 6, 28),
      [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ]
    ));
    expect(res.val).to.equal("val");
    expect(res.state).to.be.an.equalStateTo(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "rest",
      new SourcePos("main", 506, 7, 29),
      "none"
    ));
  });
});
