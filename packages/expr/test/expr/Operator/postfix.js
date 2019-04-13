"use strict";

const { expect } = require("chai");

const { OperatorType, Operator } = $expr;

const { createDummyParser } = $testutil.helpers;

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
