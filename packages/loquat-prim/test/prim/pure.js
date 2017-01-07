/*
 * loquat-prim test / prim.pure()
 * copyright (c) 2016 Susisu
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

const pure = _prim.pure;

describe(".pure(val)", () => {
    it("should return a parser that always empty succeeds with `val'", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const parser = pure("nyancat");
        assertParser(parser);
        const res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(new SourcePos("foobar", 1, 1)),
                "nyancat",
                initState
            )
        )).to.be.true;
    });
});
