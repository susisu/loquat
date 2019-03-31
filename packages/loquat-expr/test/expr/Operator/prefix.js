"use strict";

const { expect } = require("chai");

const { OperatorType, Operator } = _expr;

const { createDummyParser } = _test.helper;

describe("prefix", () => {
  it("should create a prefix operator object", () => {
    const parser = createDummyParser();
    const op = Operator.prefix(parser);
    expect(op).to.deep.equal({
      type  : OperatorType.PREFIX,
      parser: parser,
    });
  });
});
