/*
 * loquat-prim test / prim.setConfig()
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
const setConfig = _prim.setConfig;

describe(".setConfig(config)", () => {
    it("should return a parser that sets parser config to `config' and empty succeeds", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let parser = setConfig(new Config({ tabWidth: 4, useCodePoint: true }));
        assertParser(parser);
        let res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(new SourcePos("foobar", 1, 1)),
                undefined,
                new State(
                    new Config({ tabWidth: 4, useCodePoint: true }),
                    "input",
                    new SourcePos("foobar", 1, 1),
                    "none"
                )
            )
        )).to.be.true;
    });
});
