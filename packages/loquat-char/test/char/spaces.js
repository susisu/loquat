/*
 * loquat-char test / char.spaces
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

const spaces = _char.spaces;

describe(".spaces", () => {
    it("should return a parser that skips many space characters", () => {
        assertParser(spaces);
        // match
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                " \f\n\r\t\vABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = spaces.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 2, 10),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "space")
                        ]
                    ),
                    undefined,
                    new State(
                        initState.config,
                        "ABC",
                        new SourcePos("foobar", 2, 10),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                " \f\n\r\t\v",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = spaces.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 2, 10),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "space")
                        ]
                    ),
                    undefined,
                    new State(
                        initState.config,
                        "",
                        new SourcePos("foobar", 2, 10),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // not match
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = spaces.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "white space")
                        ]
                    ),
                    undefined,
                    new State(
                        initState.config,
                        "ABC",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // empty input
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = spaces.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "white space")
                        ]
                    ),
                    undefined,
                    new State(
                        initState.config,
                        "",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                )
            )).to.be.true;
        }
    });
});
