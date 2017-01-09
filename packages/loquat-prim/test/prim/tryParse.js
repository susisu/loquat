/*
 * loquat-prim test / prim.tryParse()
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

const tryParse = _prim.tryParse;

describe(".tryParse(parser)", () => {
    it("should return a parser that treats consumed failed result as if it was empty failed", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const finalState = new State(
            new Config({ tabWidth: 4 }),
            "rest",
            new SourcePos("foobar", 1, 2),
            "some"
        );
        const err = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
        );
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(err, "nyancat", finalState);
            });
            const tryParser = tryParse(parser);
            assertParser(tryParser);
            const res = tryParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(err, "nyancat", finalState)
            )).to.be.true;
        }
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            const tryParser = tryParse(parser);
            assertParser(tryParser);
            const res = tryParser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(err)
            )).to.be.true;
        }
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            const tryParser = tryParse(parser);
            assertParser(tryParser);
            const res = tryParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, "nyancat", finalState)
            )).to.be.true;
        }
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            const tryParser = tryParse(parser);
            assertParser(tryParser);
            const res = tryParser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(err)
            )).to.be.true;
        }
    });
});
