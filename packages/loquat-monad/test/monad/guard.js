/*
 * loquat-monad test / monad.guard()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const guard = _monad.guard;

describe(".guard(cond)", () => {
    it("returns a parser that empty succeeds with undefined if `cond' is `true'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let parser = guard(true);
        assertParser(parser);
        let res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(initState.pos),
                undefined,
                initState
            )
        )).to.be.true;
    });

    it("returns a parser that empty fails with undefined if `cond' is `empty fails'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let parser = guard(false);
        assertParser(parser);
        let res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.eerr(ParseError.unknown(initState.pos))
        )).to.be.true;
    });
});
