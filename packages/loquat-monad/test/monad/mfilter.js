/*
 * loquat-monad test / monad.mfilter()
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

const mfilter = _monad.mfilter;

describe(".mfilter(test, parser)", () => {
    it("returns a parser that runs `parser' and calls `test' with its resultant value,"
        + " then only succeeds when `test' returns `true'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // csuc
        {
            let finalState = new State(
                new Config({ tabWidth: 8 }),
                "rest",
                new SourcePos("foobar", 1, 2),
                "some"
            );
            let err = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(err, "nyancat", finalState);
            });
            // true
            {
                let test = val => {
                    expect(val).to.equal("nyancat");
                    return true;
                };
                let filtered = mfilter(test, parser);
                assertParser(filtered);
                let res = filtered.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(err, "nyancat", finalState)
                )).to.be.true;
            }
            // false
            {
                let test = val => {
                    expect(val).to.equal("nyancat");
                    return false;
                };
                let filtered = mfilter(test, parser);
                assertParser(filtered);
                let res = filtered.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(err)
                )).to.be.true;
            }
        }
        // cerr
        {
            let err = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            let test = () => { throw new Error("unexpected call"); };
            let filtered = mfilter(test, parser);
            assertParser(filtered);
            let res = filtered.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(err)
            )).to.be.true;
        }
        // esuc
        {
            let finalState = new State(
                new Config({ tabWidth: 8 }),
                "rest",
                new SourcePos("foobar", 1, 1),
                "some"
            );
            let err = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            // true
            {
                let test = val => {
                    expect(val).to.equal("nyancat");
                    return true;
                };
                let filtered = mfilter(test, parser);
                assertParser(filtered);
                let res = filtered.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(err, "nyancat", finalState)
                )).to.be.true;
            }
            // false
            {
                let test = val => {
                    expect(val).to.equal("nyancat");
                    return false;
                };
                let filtered = mfilter(test, parser);
                assertParser(filtered);
                let res = filtered.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(err)
                )).to.be.true;
            }
        }
        // eerr
        {
            let err = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            let test = () => { throw new Error("unexpected call"); };
            let filtered = mfilter(test, parser);
            assertParser(filtered);
            let res = filtered.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(err)
            )).to.be.true;
        }
    });
});
