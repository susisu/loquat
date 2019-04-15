"use strict";

const { expect, assert } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  ParseError,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = $core;

const { qo } = $qo;

describe("qo", () => {
  it("should create a parser from a generator that yields parsers", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    // empty
    {
      const parser = qo(function* () {});
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(initState.pos),
        undefined,
        initState
      ));
    }
    // just return
    {
      const parser = qo(function* () {
        return "foo";
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(initState.pos),
        "foo",
        initState
      ));
    }
    // csucc, csucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        const resB = yield parserB;
        expect(resB).to.equal("bar");
        return "baz";
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "baz", stateB));
    }
    // csucc, cfail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        yield parserB;
        assert.fail("expect to be unreachable");
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        const resB = yield parserB;
        expect(resB).to.equal("bar");
        return "baz";
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errA, errB), "baz", stateB));
    }
    // csucc, efail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        yield parserB;
        assert.fail("expect to be unreachable");
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });

      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = qo(function* () {
        yield parserA;
        yield parserB;
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        const resB = yield parserB;
        expect(resB).to.equal("bar");
        return "baz";
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "baz", stateB));
    }
    // esucc, cfail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        yield parserB;
        assert.fail("expect to be unreachable");
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 1),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        const resB = yield parserB;
        expect(resB).to.equal("bar");
        return "baz";
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "baz", stateB));
    }
    // esucc, efail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });

      const parser = qo(function* () {
        const resA = yield parserA;
        expect(resA).to.equal("foo");
        yield parserB;
        assert.fail("expect to be unreachable");
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });

      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = qo(function* () {
        yield parserA;
        yield parserB;
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });

  it("should run a parser if thrown by the generator, and always fails even if it succeeds", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    // csucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const parser = qo(function* () {
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const dummy = new StrictParser(state =>
        Result.esucc(ParseError.unknown(state.pos), undefined, state)
      );
      const parser = qo(function* () {
        yield dummy;
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // cfail
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const parser = qo(function* () {
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const dummy = new StrictParser(state =>
        Result.esucc(ParseError.unknown(state.pos), undefined, state)
      );
      const parser = qo(function* () {
        yield dummy;
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const parser = qo(function* () {
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const dummy = new StrictParser(state =>
        Result.esucc(ParseError.unknown(state.pos), undefined, state)
      );
      const parser = qo(function* () {
        yield dummy;
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
    // efail
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parser = qo(function* () {
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const dummy = new StrictParser(state =>
        Result.esucc(ParseError.unknown(state.pos), undefined, state)
      );
      const parser = qo(function* () {
        yield dummy;
        throw parserA;
      });
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });

  it("should rethrow non-parser values thrown by the generator", () => {
    {
      const initState = new State(
        new Config(),
        "input",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = qo(function* () {
        throw new Error("test");
      });
      expect(() => {
        parser.run(initState);
      }).to.throw(Error, /test/);
    }
    {
      const initState = new State(
        new Config(),
        "input",
        new SourcePos("main", 1, 1),
        "none"
      );
      const dummy = new StrictParser(state =>
        Result.esucc(ParseError.unknown(state.pos), undefined, state)
      );
      const parser = qo(function* () {
        yield dummy;
        throw new Error("test");
      });
      expect(() => {
        parser.run(initState);
      }).to.throw(Error, /test/);
    }
  });
});
