/*
 * loquat-core test / parser.AbstractParser#run()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParser = _parser.AbstractParser;

describe("#run()", () => {
    it("should throw an `Error'", () => {
        const TestParser = class extends AbstractParser {
            constructor() {
                super();
            }
        };
        const parser = new TestParser();
        expect(() => { parser.run(); }).to.throw(Error);
    });
});
