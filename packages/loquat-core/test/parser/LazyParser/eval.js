/*
 * loquat-core test / parser.LazyParser#eval()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Parser     = _parser.Parser;
const LazyParser = _parser.LazyParser;

describe("#eval()", () => {
    it("should evaluate the thunk then return a `Parser' object obtained as a result and cahce it"
        + " if there is no cache", () => {
        const p = new Parser(() => {});
        {
            const parser = new LazyParser(() => p);
            const res = parser.eval();
            expect(res).to.equal(p);
        }
        // a multiply-nested LazyParser object is also evaluated to a Parser object
        {
            const parser = new LazyParser(() =>
                new LazyParser(() => p)
            );
            const res = parser.eval();
            expect(res).to.equal(p);
        }
    });

    it("should return the cached result if it exists", () => {
        {
            let evalCount = 0;
            const parser = new LazyParser(() => {
                evalCount += 1;
                return new Parser(() => {});
            });
            const resA = parser.eval();
            const resB = parser.eval();
            // the cached result is returned
            expect(evalCount).to.equal(1);
            expect(resA).to.equal(resB);
        }
        // all LazyParser objects are evaluated only once
        {
            let intermediateEvalCount = 0;
            let evalCount = 0;
            const parser = new LazyParser(() => {
                evalCount += 1;
                return new LazyParser(() => {
                    intermediateEvalCount += 1;
                    return new Parser(() => {});
                });
            });
            const resA = parser.eval();
            const resB = parser.eval();
            expect(intermediateEvalCount).to.equal(1);
            expect(evalCount).to.equal(1);
            expect(resA).to.equal(resB);
        }
        {
            let intermediateEvalCount = 0;
            const intermediateParser = new LazyParser(() => {
                intermediateEvalCount += 1;
                return new Parser(() => {});
            });
            let evalCount = 0;
            const parser = new LazyParser(() => {
                evalCount += 1;
                return intermediateParser;
            });
            // evaluate intermediate one first
            const intermediateRes = intermediateParser.eval();
            const resA = parser.eval();
            const resB = parser.eval();
            expect(intermediateEvalCount).to.equal(1);
            expect(evalCount).to.equal(1);
            expect(resA).to.equal(resB);
            expect(resA).to.equal(intermediateRes);
        }
    });

    it("should throw a `TypeError' if invalid thunk (not a function) found in the evaluation", () => {
        const invalidThunks = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {}
        ];
        for (const thunk of invalidThunks) {
            {
                const parser = new LazyParser(thunk);
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
            {
                const parser = new LazyParser(() => new LazyParser(thunk));
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
        }
    });

    it("should throw a `TypeError' if the final evaluation result is not a `Parser' object", () => {
        const invalidResults = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {},
            () => {}
        ];
        for (const res of invalidResults) {
            {
                const parser = new LazyParser(() => res);
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
            {
                const parser = new LazyParser(() => new LazyParser(() => res));
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
        }
    });
});
