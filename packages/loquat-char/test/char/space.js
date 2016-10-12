/*
 * loquat-char test / char.space
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

const space = _char.space;

describe(".space", () => {
    it("should return a parser that parses a space character", () => {
        assertParser(space);
        // match
        {
            for (let c of " \f\r\v") {
                let initState = new State(
                    new Config({ tabWidth: 8 }),
                    c + "ABC",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                let res = space.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        ParseError.unknown(new SourcePos("foobar", 1, 2)),
                        c,
                        new State(
                            initState.config,
                            "ABC",
                            new SourcePos("foobar", 1, 2),
                            "none"
                        )
                    )
                )).to.be.true;
            }
            // \n
            {
                let initState = new State(
                    new Config({ tabWidth: 8 }),
                    "\nABC",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                let res = space.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        ParseError.unknown(new SourcePos("foobar", 2, 1)),
                        "\n",
                        new State(
                            initState.config,
                            "ABC",
                            new SourcePos("foobar", 2, 1),
                            "none"
                        )
                    )
                )).to.be.true;
            }
            // \t
            {
                let initState = new State(
                    new Config({ tabWidth: 8 }),
                    "\tABC",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                let res = space.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        ParseError.unknown(new SourcePos("foobar", 1, 9)),
                        "\t",
                        new State(
                            initState.config,
                            "ABC",
                            new SourcePos("foobar", 1, 9),
                            "none"
                        )
                    )
                )).to.be.true;
            }
        }
        // not match
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let res = space.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "space")
                        ]
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
            let res = space.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "space")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});
