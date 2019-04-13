"use strict";

const { expect } = require("chai");

const { OperatorType, OperatorAssoc, Operator } = $expr;

const { createDummyParser } = $testutil.helpers;

describe("infix", () => {
  it("should create an infix operator object", () => {
    const parser = createDummyParser();
    {
      const op = Operator.infix(parser, OperatorAssoc.NONE);
      expect(op).to.deep.equal({
        type  : OperatorType.INFIX,
        parser: parser,
        assoc : OperatorAssoc.NONE,
      });
    }
    {
      const op = Operator.infix(parser, OperatorAssoc.LEFT);
      expect(op).to.deep.equal({
        type  : OperatorType.INFIX,
        parser: parser,
        assoc : OperatorAssoc.LEFT,
      });
    }
    {
      const op = Operator.infix(parser, OperatorAssoc.RIGHT);
      expect(op).to.deep.equal({
        type  : OperatorType.INFIX,
        parser: parser,
        assoc : OperatorAssoc.RIGHT,
      });
    }
  });
});
