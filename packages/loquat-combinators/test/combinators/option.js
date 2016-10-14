/*
 * loquat-combinators test / combinators.option()
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

const option = _combinators.option;

describe(".option(val, parser)", () => {
    it("should return a parser that attempts to parse by `parser',"
        + " and returns its result unless it empty fails, or returns `val'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let finalState = new State(
            new Config({ tabWidth: 4 }),
            "rest",
            new SourcePos("foobar", 496, 28),
            "some"
        );
        let err = new ParseError(
            new SourcePos("foobar", 496, 28),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
        );
        // csuc
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(err, "nyan", finalState);
            });
            let optParser = option("cat", parser);
            assertParser(optParser);
            let res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(err, "nyan", finalState)
            )).to.be.true;
        }
        // cerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            let optParser = option("cat", parser);
            assertParser(optParser);
            let res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(err)
            )).to.be.true;
        }
        // esuc
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyan", finalState);
            });
            let optParser = option("cat", parser);
            assertParser(optParser);
            let res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, "nyan", finalState)
            )).to.be.true;
        }
        // eerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            let optParser = option("cat", parser);
            assertParser(optParser);
            let res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, "cat", initState)
            )).to.be.true;
        }
    });
});
