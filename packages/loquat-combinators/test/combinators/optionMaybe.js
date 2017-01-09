/*
 * loquat-combinators test / combinators.optionMaybe()
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

const optionMaybe = _combinators.optionMaybe;

describe(".optionMaybe(parser)", () => {
    it("should return a parser that attempts to parse by `parser',"
        + " and returns some result unless it empty fails, or returns empty", () => {
        const objEqual = (objA, objB) => {
            const keysA = Object.keys(objA);
            const keysB = Object.keys(objB);
            return keysA.length === keysB.length
                && keysA.every(key => objA[key] === objB[key]);
        };
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
            const optParser = optionMaybe(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(err, { empty: false, value: "nyancat" }, finalState),
                objEqual
            )).to.be.true;
        }
        // cerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            const optParser = optionMaybe(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(err),
                objEqual
            )).to.be.true;
        }
        // esuc
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            const optParser = optionMaybe(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, { empty: false, value: "nyancat" }, finalState),
                objEqual
            )).to.be.true;
        }
        // eerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            const optParser = optionMaybe(parser);
            assertParser(optParser);
            const res = optParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, { empty: true }, initState),
                objEqual
            )).to.be.true;
        }
    });
});
