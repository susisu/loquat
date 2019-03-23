"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;
const { Config, State, Result } = _parser;

describe(".constructor", () => {
  it("should create a new `Result` instance", () => {
    const res = new Result(
      true,
      true,
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
        new SourcePos("main", 6, 29),
        "none"
      )
    );
    expect(res).to.be.an.instanceOf(Result);
    expect(res.consumed).to.be.true;
    expect(res.success).to.be.true;
    expect(res.err).to.be.an.equalErrorTo(new ParseError(
      new SourcePos("main", 6, 28),
      [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ]
    ));
    expect(res.val).to.equal("val");
    expect(res.state).to.be.an.equalStateTo(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "rest",
      new SourcePos("main", 6, 29),
      "none"
    ));
  });
});
