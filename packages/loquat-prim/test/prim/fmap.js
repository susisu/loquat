/*
 * loquat-prim test / prim.fmap()
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

const fmap = _prim.fmap;

describe(".fmap(func)", () => {
    it("should map a function `func' to a function from parser to parser", () => {
        let func = x => x.toUpperCase();
        let mappedFunc = fmap(func);
        expect(mappedFunc).is.a("function");

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
            let mapped = mappedFunc(parser);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(err, "NYANCAT", finalState))).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            let mapped = mappedFunc(parser);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(err))).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            let mapped = mappedFunc(parser);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.esuc(err, "NYANCAT", finalState))).to.be.true;
        }
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            let mapped = mappedFunc(parser);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.eerr(err))).to.be.true;
        }
    });

    it("should obey the functor laws", () => {
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

        let csuc = new Parser(() => Result.csuc(err, "nyan", finalState));
        let cerr = new Parser(() => Result.cerr(err));
        let esuc = new Parser(() => Result.esuc(err, "nyan", finalState));
        let eerr = new Parser(() => Result.eerr(err));

        // id parser = fmap id parser
        {
            let id = x => x;

            expect(Result.equal(
                id(csuc).run(initState),
                fmap(id)(csuc).run(initState)
            )).to.be.true;

            expect(Result.equal(
                id(cerr).run(initState),
                fmap(id)(cerr).run(initState)
            )).to.be.true;

            expect(Result.equal(
                id(esuc).run(initState),
                fmap(id)(esuc).run(initState)
            )).to.be.true;

            expect(Result.equal(
                id(eerr).run(initState),
                fmap(id)(eerr).run(initState)
            )).to.be.true;
        }

        // fmap (f . g) parser = (fmap f . fmap g) parser
        {
            let f = x => x.toUpperCase();
            let g = x => x + "cat";

            let func1 = fmap(x => f(g(x)));
            let func2 = x => fmap(f)(fmap(g)(x));

            expect(Result.equal(
                func1(csuc).run(initState),
                func2(csuc).run(initState)
            )).to.be.true;

            expect(Result.equal(
                func1(cerr).run(initState),
                func2(cerr).run(initState)
            )).to.be.true;

            expect(Result.equal(
                func1(esuc).run(initState),
                func2(esuc).run(initState)
            )).to.be.true;

            expect(Result.equal(
                func1(eerr).run(initState),
                func2(eerr).run(initState)
            )).to.be.true;
        }
    });
});
