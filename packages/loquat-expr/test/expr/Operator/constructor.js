/*
 * loquat-expr test / expr.Operator constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Parser = _core.Parser;

const OperatorType  = _expr.OperatorType;
const OperatorAssoc = _expr.OperatorAssoc;
const Operator      = _expr.Operator;

describe("constructor(type, parser, assoc)", () => {
    it("should create a new `Operator' instance", () => {
        // infix operator
        {
            let parser = new Parser(() => {});
            let op = new Operator(OperatorType.INFIX, parser, OperatorAssoc.NONE);
            expect(op.type).to.equal(OperatorType.INFIX);
            expect(op.parser).to.equal(parser);
            expect(op.assoc).to.equal(OperatorAssoc.NONE);
        }
        // prefix operator
        {
            let parser = new Parser(() => {});
            let op = new Operator(OperatorType.PREFIX, parser);
            expect(op.type).to.equal(OperatorType.PREFIX);
            expect(op.parser).to.equal(parser);
        }
        // postfix operator
        {
            let parser = new Parser(() => {});
            let op = new Operator(OperatorType.POSTFIX, parser);
            expect(op.type).to.equal(OperatorType.POSTFIX);
            expect(op.parser).to.equal(parser);
        }
    });
});
