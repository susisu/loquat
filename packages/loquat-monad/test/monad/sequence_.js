"use strict";

const { expect } = require("chai");

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
} = _core;

const { sequence_ } = _monad;

describe(".sequence_(parsers)", () => {
  it("should return a parser that runs `parsers' sequentially and discards result values", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // empty
    {
      const parser = sequence_([]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.unknown(initState.pos), undefined, initState)
      )).to.be.true;
    }
    // csucc, csucc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });

      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "cat", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errB, undefined, stateB)
      )).to.be.true;
    }
    // csucc, cfail
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cfail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // csucc, esucc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });

      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "cat", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errA, errB), undefined, stateB)
      )).to.be.true;
    }
    // csucc, efail
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.efail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(errA);
      });

      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errA)
      )).to.be.true;
    }
    // esucc, csucc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });

      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "cat", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errB, undefined, stateB)
      )).to.be.true;
    }
    // esucc, cfail
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cfail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // esucc, esucc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });

      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "cat", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.merge(errA, errB), undefined, stateB)
      )).to.be.true;
    }
    // esucc, efail
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.efail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // efail, *
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });

      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(errA)
      )).to.be.true;
    }
  });
});
