/*
 * loquat-core test / parser.LazyParser#eval()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { Parser, LazyParser } = require("parser.js");

describe("#eval()", () => {
    it("should evaluate the thunk then return a `Parser' object obtained as a result and cahce it"
        + " if there is no cache", () => {
        let p = new Parser(() => {});
        {
            let parser = new LazyParser(() => p);
            let res = parser.eval();
            expect(res).to.equal(p);
        }
        // a multiply-nested LazyParser object is also evaluated to a Parser object
        {
            let parser = new LazyParser(() =>
                new LazyParser(() => p)
            );
            let res = parser.eval();
            expect(res).to.equal(p);
        }
    });

    it("should return the cached result if it exists", () => {
        {
            let evalCount = 0;
            let parser = new LazyParser(() => {
                evalCount += 1;
                return new Parser(() => {});
            });
            let resA = parser.eval();
            let resB = parser.eval();
            // the cached result is returned
            expect(evalCount).to.equal(1);
            expect(resA).to.equal(resB);
        }
        // all LazyParser objects are evaluated only once
        {
            let intermediateEvalCount = 0;
            let evalCount = 0;
            let parser = new LazyParser(() => {
                evalCount += 1;
                return new LazyParser(() => {
                    intermediateEvalCount += 1;
                    return new Parser(() => {});
                });
            });
            let resA = parser.eval();
            let resB = parser.eval();
            expect(intermediateEvalCount).to.equal(1);
            expect(evalCount).to.equal(1);
            expect(resA).to.equal(resB);
        }
    });

    it("should throw a `TypeError' if invalid thunk (not a function) found in the evaluation", () => {
        let invalidThunks = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {}
        ];
        for (let thunk of invalidThunks) {
            {
                let parser = new LazyParser(thunk);
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
            {
                let parser = new LazyParser(() => new LazyParser(thunk));
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
        }
    });

    it("should throw a `TypeError' if the final evaluation result is not a `Parser' object", () => {
        let invalidResults = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {},
            () => {}
        ];
        for (let res of invalidResults) {
            {
                let parser = new LazyParser(() => res);
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
            {
                let parser = new LazyParser(() => new LazyParser(() => res));
                expect(() => { parser.eval(); }).to.throw(TypeError);
            }
        }
    });
});
