/*
 * loquat-prim test / prim.return()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _core = require("loquat-core");
const SourcePos  = _core.SourcePos;
const ParseError = _core.ParseError;
const Config     = _core.Config;
const State      = _core.State;
const Result     = _core.Result;

const _prim = require("prim.js")(_core);
const __return__ = _prim.return;

describe(".return(val)", () => {
    it("should return a parser that always empty succeeds with `val'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let res = __return__("nyancat").run(initState);
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
