/*
 * loquat-prim test / prim.fmap()
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
        const func = x => x.toUpperCase();
        const mappedFunc = fmap(func);
        expect(mappedFunc).is.a("function");

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
            const mapped = mappedFunc(parser);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(err, "NYANCAT", finalState))).to.be.true;
        }
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            const mapped = mappedFunc(parser);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(err))).to.be.true;
        }
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            const mapped = mappedFunc(parser);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.esuc(err, "NYANCAT", finalState))).to.be.true;
        }
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            const mapped = mappedFunc(parser);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.eerr(err))).to.be.true;
        }
    });

    it("should obey the functor laws", () => {
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

        const csuc = new Parser(() => Result.csuc(err, "nyan", finalState));
        const cerr = new Parser(() => Result.cerr(err));
        const esuc = new Parser(() => Result.esuc(err, "nyan", finalState));
        const eerr = new Parser(() => Result.eerr(err));

        // id parser = fmap id parser
        {
            const id = x => x;

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
            const f = x => x.toUpperCase();
            const g = x => x + "cat";

            const func1 = fmap(x => f(g(x)));
            const func2 = x => fmap(f)(fmap(g)(x));

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
