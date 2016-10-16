/*
 * loquat-prim test / prim.map()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const map = _prim.map;

describe(".map(parser, func)", () => {
    it("should return a parser that runs `parser' and maps `func' to the result value", () => {
        let func = x => x.toUpperCase();

        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let finalState = new State(
            new Config({ tabWidth: 4 }),
            "rest",
            new SourcePos("foobar", 1, 2),
            "some"
        );
        let err = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
        );

        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(err, "nyancat", finalState);
            });
            let mapped = map(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(err, "NYANCAT", finalState))).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            let mapped = map(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(err))).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            let mapped = map(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.esuc(err, "NYANCAT", finalState))).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            let mapped = map(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.eerr(err))).to.be.true;
        }
    });
});
