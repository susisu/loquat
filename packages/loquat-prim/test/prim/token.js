/*
 * loquat-prim test / prim.token()
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
const assertParser     = _core.assertParser;

const _prim = require("prim.js")(_core);
const token = _prim.token;

describe(".token(calcValue, tokenToString, calcPos)", () => {
    it("should return a parser that parses a token", () => {
        // calcValue succeeds, abundant input
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = token(
                x => {
                    expect(x).to.equal("A");
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                x => {
                    expect(x).to.equal("B");
                    return new SourcePos("foobar", 1, 2);
                }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "nyancat",
                    new State(
                        initState.config,
                        "BC",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // calcValue succeeds, minimal input
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "A",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = token(
                x => {
                    expect(x).to.equal("A");
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                x => {
                    expect(x).to.equal("A");
                    return new SourcePos("foobar", 1, 2);
                }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "nyancat",
                    new State(
                        initState.config,
                        "",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // calcValue fails
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = token(
                x => {
                    expect(x).to.equal("A");
                    return { empty: true };
                },
                x => {
                    expect(x).to.equal("A");
                    return "nyancat";
                },
                () => { throw new Error("unexpected call"); }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "nyancat")]
                    )
                )
            )).to.be.true;
        }
        // empty input
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = token(
                () => { throw new Error("unexpected call"); },
                () => { throw new Error("unexpected call"); },
                () => { throw new Error("unexpected call"); }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "")]
                    )
                )
            )).to.be.true;
        }
    });
});
