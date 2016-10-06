/*
 * loquat-prim test / prim.setState()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _core = require("loquat-core");
const SourcePos    = _core.SourcePos;
const ParseError   = _core.ParseError;
const Config       = _core.Config;
const State        = _core.State;
const Result       = _core.Result;
const assertParser = _core.assertParser;

const _prim = require("prim.js")(_core);
const setState = _prim.setState;

describe(".setState(state)", () => {
    it("should return a parser that sets parser state to `state' and empty succeeds", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let newState = new State(
            new Config({ tabWidth: 4 }),
            "rest",
            new SourcePos("foobar", 1, 2),
            "some"
        );
        let parser = setState(newState);
        assertParser(parser);
        let res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(newState.pos),
                newState,
                newState
            )
        )).to.be.true;
    });
});