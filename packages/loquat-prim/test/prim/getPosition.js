/*
 * loquat-prim test / prim.getPosition
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
const getPosition = _prim.getPosition;

describe(".getPosition", () => {
    it("should get the current position of parser", () => {
        assertParser(getPosition);
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let res = getPosition.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(new SourcePos("foobar", 1, 1)),
                initState.pos,
                initState
            )
        )).to.be.true;
    });
});
