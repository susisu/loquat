"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = _core;

const { fmap } = _prim;

describe("fmap", () => {
  it("should lift a function on values to a function on parsers", () => {
    const func = x => x.toUpperCase();
    const mappedFunc = fmap(func);
    expect(mappedFunc).is.a("function");

    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const finalState = new State(
      new Config(),
      "rest",
      new SourcePos("main", 1, 1, 2),
      "some"
    );
    const err = new StrictParseError(
      new SourcePos("main", 1, 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
    );

    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });
      const mapped = mappedFunc(parser);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "FOO", finalState));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const mapped = mappedFunc(parser);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      const mapped = mappedFunc(parser);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "FOO", finalState));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const mapped = mappedFunc(parser);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
  });

  it("should satisfy the functor laws", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const finalState = new State(
      new Config(),
      "rest",
      new SourcePos("main", 1, 1, 2),
      "some"
    );
    const err = new StrictParseError(
      new SourcePos("main", 1, 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
    );

    const parsers = [
      new StrictParser(() => Result.csucc(err, "foo", finalState)),
      new StrictParser(() => Result.cfail(err)),
      new StrictParser(() => Result.esucc(err, "foo", finalState)),
      new StrictParser(() => Result.efail(err)),
    ];

    // id parser = fmap id parser
    {
      const id = x => x;

      for (const parser of parsers) {
        const lhs = id(parser).run(initState);
        const rhs = fmap(id)(parser).run(initState);
        expect(lhs).to.be.an.equalResultTo(rhs);
      }
    }

    // fmap (f . g) parser = (fmap f . fmap g) parser
    {
      const f = x => x.toUpperCase();
      const g = x => x + "bar";

      const func1 = fmap(x => f(g(x)));
      const func2 = x => fmap(f)(fmap(g)(x));

      for (const parser of parsers) {
        const lhs = func1(parser).run(initState);
        const rhs = func2(parser).run(initState);
        expect(lhs).to.be.an.equalResultTo(rhs);
      }
    }
  });
});
