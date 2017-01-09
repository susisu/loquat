/*
 * loquat-prim test / prim.setInput()
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

const setInput = _prim.setInput;

describe(".setInput(input)", () => {
    it("should return a parser that sets parser input to `input' and empty succeeds", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const parser = setInput("rest");
        assertParser(parser);
        const res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(new SourcePos("foobar", 1, 1)),
                undefined,
                new State(
                    new Config({ tabWidth: 8 }),
                    "rest",
                    new SourcePos("foobar", 1, 1),
                    "none"
                )
            )
        )).to.be.true;
    });
});
