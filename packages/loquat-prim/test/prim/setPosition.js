/*
 * loquat-prim test / prim.setPosition()
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
const setPosition = _prim.setPosition;

describe(".setPosition(pos)", () => {
    it("should return a parser that sets parser position to `pos' and empty succeeds", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let parser = setPosition(new SourcePos("nyancat", 496, 28));
        assertParser(parser);
        let res = parser.run(initState);
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
