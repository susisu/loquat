/*
 * loquat-prim test / prim.lookAhead()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _core = require("loquat-core");
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const _prim = require("prim.js")(_core);
const lookAhead = _prim.lookAhead;

describe(".lookAhead(parser)", () => {
    it("should return a parser that always runs `parser' "
        + "and returns back to the original state if succeeded", () => {
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
            let aheadParser = lookAhead(parser);
            assertParser(aheadParser);
            let res = aheadParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.unknown(new SourcePos("foobar", 1, 1)), "nyancat", initState)
            )).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            let aheadParser = lookAhead(parser);
            assertParser(aheadParser);
            let res = aheadParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(err)
            )).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            let aheadParser = lookAhead(parser);
            assertParser(aheadParser);
            let res = aheadParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.unknown(new SourcePos("foobar", 1, 1)), "nyancat", initState)
            )).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            let aheadParser = lookAhead(parser);
            assertParser(aheadParser);
            let res = aheadParser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(err)
            )).to.be.true;
        }
    });
});
