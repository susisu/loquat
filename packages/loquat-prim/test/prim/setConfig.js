/*
 * loquat-prim test / prim.setConfig()
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

const setConfig = _prim.setConfig;

describe(".setConfig(config)", () => {
    it("should return a parser that sets parser config to `config' and empty succeeds", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const parser = setConfig(new Config({ tabWidth: 4, unicode: true }));
        assertParser(parser);
        const res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.esuc(
                ParseError.unknown(new SourcePos("foobar", 1, 1)),
                undefined,
                new State(
                    new Config({ tabWidth: 4, unicode: true }),
                    "input",
                    new SourcePos("foobar", 1, 1),
                    "none"
                )
            )
        )).to.be.true;
    });
});
