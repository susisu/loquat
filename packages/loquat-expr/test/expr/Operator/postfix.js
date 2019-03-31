"use strict";

const { expect } = require("chai");

const { OperatorType, Operator } = _expr;

const { createDummyParser } = _test.helper;

describe("postfix", () => {
  it("should create a postfix operator object", () => {
    const parser = createDummyParser();
    const op = Operator.postfix(parser);
    expect(op).to.deep.equal({
      type  : OperatorType.POSTFIX,
      parser: parser,
    });
  });
});
