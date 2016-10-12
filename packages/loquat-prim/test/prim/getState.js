/*
 * loquat-prim test / prim.getState
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

const getState = _prim.getState;

describe(".getState", () => {
    it("should get current state of parser", () => {
        assertParser(getState);
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let res = getState.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(new SourcePos("foobar", 1, 1)),
                initState,
                initState
            )
        )).to.be.true;
    });
});
