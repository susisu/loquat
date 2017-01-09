/*
 * loquat-combinators test / combinators.optional()
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

const optional = _combinators.optional;

describe(".optional(parser)", () => {
    it("should return a parser that attempts to parse by `parser',"
        + " and returns `undefined' unless it consumed and failed", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const finalState = new State(
            new Config({ tabWidth: 4 }),
            "rest",
            new SourcePos("foobar", 496, 28),
            "some"
        );
        const err = new ParseError(
            new SourcePos("foobar", 496, 28),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
        );
        // csuc
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(err, "nyancat", finalState);
            });
            const optParser = optional(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(err, undefined, finalState)
            )).to.be.true;
        }
        // cerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            const optParser = optional(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(err)
            )).to.be.true;
        }
        // esuc
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            const optParser = optional(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, undefined, finalState)
            )).to.be.true;
        }
        // eerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            const optParser = optional(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, undefined, initState)
            )).to.be.true;
        }
    });
});
