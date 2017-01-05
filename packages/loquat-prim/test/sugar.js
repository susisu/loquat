/*
 * loquat-prim test / sugar
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai   = require("chai");
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

function objEqual(x, y) {
    return typeof x === "object" && typeof y === "object"
        && x !== null && y !== null
        && x.type === y.type && x.value === y.value;
}

describe("sugar", () => {
    it("should contain parser extension methods", () => {
        expect(_sugar.map).to.be.a("function");
        assertParser(_sugar.map.call(
            new Parser(() => {}),
            () => {}
        ));

        expect(_sugar.return).to.be.a("function");
        assertParser(_sugar.return.call(
            new Parser(() => {}),
            "nyancat"
        ));

        expect(_sugar.ap).to.be.a("function");
        assertParser(_sugar.ap.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.left).to.be.a("function");
        assertParser(_sugar.left.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.skip).to.be.a("function");
        assertParser(_sugar.skip.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.right).to.be.a("function");
        assertParser(_sugar.right.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.bind).to.be.a("function");
        assertParser(_sugar.bind.call(
            new Parser(() => {}),
            () => new Parser(() => {})
        ));

        expect(_sugar.and).to.be.a("function");
        assertParser(_sugar.and.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.fail).to.be.a("function");
        assertParser(_sugar.fail.call(
            new Parser(() => {}),
            "test"
        ));

        expect(_sugar.done).to.be.a("function");
        assertParser(_sugar.done.call(
            new Parser(() => {})
        ));
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "input",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            // csuc
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        "nyancat",
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    );
                });
                const parser = _sugar.done.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        { done: true, value: "nyancat" },
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
            // cerr
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    );
                });
                const parser = _sugar.done.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
            // esuc
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        "nyancat",
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    );
                });
                const parser = _sugar.done.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        { done: true, value: "nyancat" },
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
            // eerr
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    );
                });
                const parser = _sugar.done.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
        }

        expect(_sugar.cont).to.be.a("function");
        assertParser(_sugar.cont.call(
            new Parser(() => {})
        ));
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "input",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            // csuc
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        "nyancat",
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    );
                });
                const parser = _sugar.cont.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        { done: false, value: "nyancat" },
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
            // cerr
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    );
                });
                const parser = _sugar.cont.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
            // esuc
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        "nyancat",
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    );
                });
                const parser = _sugar.cont.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        ),
                        { done: false, value: "nyancat" },
                        new State(
                            new Config({ tabWidth: 8 }),
                            "rest",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
            // eerr
            {
                const p = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    );
                });
                const parser = _sugar.cont.call(p);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                        )
                    ),
                    objEqual
                )).to.be.true;
            }
        }

        expect(_sugar.or).to.be.a("function");
        assertParser(_sugar.or.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));

        expect(_sugar.label).to.be.a("function");
        assertParser(_sugar.label.call(
            new Parser(() => {}),
            "label"
        ));

        expect(_sugar.hidden).to.be.a("function");
        assertParser(_sugar.hidden.call(
            new Parser(() => {})
        ));

        expect(_sugar.try).to.be.a("function");
        assertParser(_sugar.try.call(
            new Parser(() => {})
        ));

        expect(_sugar.lookAhead).to.be.a("function");
        assertParser(_sugar.lookAhead.call(
            new Parser(() => {})
        ));

        expect(_sugar.reduceMany).to.be.a("function");
        assertParser(_sugar.reduceMany.call(
            new Parser(() => {}),
            () => {},
            "nyancat"
        ));

        expect(_sugar.many).to.be.a("function");
        assertParser(_sugar.many.call(
            new Parser(() => {})
        ));

        expect(_sugar.skipMany).to.be.a("function");
        assertParser(_sugar.skipMany.call(
            new Parser(() => {})
        ));
        assertParser(_sugar.skipMany.call(
            new Parser(() => {}),
            new Parser(() => {})
        ));
    });
});
