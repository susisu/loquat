/*
 * loquat-prim test / prim.setPosition()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos    = _core.SourcePos;
const ParseError   = _core.ParseError;
const Config       = _core.Config;
const State        = _core.State;
const Result       = _core.Result;
const assertParser = _core.assertParser;

const setPosition = _prim.setPosition;

describe(".setPosition(pos)", () => {
    it("should return a parser that sets parser position to `pos' and empty succeeds", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const parser = setPosition(new SourcePos("nyancat", 496, 28));
        assertParser(parser);
        const res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(new SourcePos("nyancat", 496, 28)),
                undefined,
                new State(
                    new Config({ tabWidth: 8 }),
                    "input",
                    new SourcePos("nyancat", 496, 28),
                    "none"
                )
            )
        )).to.be.true;
    });
});
