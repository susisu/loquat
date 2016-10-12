/*
 * loquat-char test / char.satisfy()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show             = _core.show;
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const satisfy = _char.satisfy;

describe(".satisfy(test)", () => {
    it("should return a parser that parses a character satisfying `test'", () => {
        // test succeeds
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = satisfy(
                (char, config) => {
                    expect(char).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8}))).to.be.true;
                    return true;
                }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "A",
                    new State(
                        initState.config,
                        "BC",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // test fails
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = satisfy(
                (x, config) => {
                    expect(x).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8 }))).to.be.true;
                    return false;
                }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A"))]
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
            let parser = satisfy(() => { throw new Error("unexpected call"); });
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
