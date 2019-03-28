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

const { sepBy } = _combinators;

describe(".sepBy(parser, sep)", () => {
  it("should return a parser that parses zero or more tokens accepted by `parser' separated by"
    + " token accepted by `sep', and concats the resultant values into an array", () => {
    const arrayEqual = (arrA, arrB) => arrA.length === arrB.length
    && arrA.every((elem, i) => elem === arrB[i]);

    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    function generateParsers(consumed, success, vals, states, errs) {
      let i = 0;
      let j = 1;
      return [
        new StrictParser(state => {
          expect(State.equal(state, i === 0 ? initState : states[j - 2])).to.be.true;
          const _consumed = consumed[i];
          const _success  = success[i];
          const _val      = vals[i];
          const _state    = states[i];
          const _err      = errs[i];
          i += 2;
          return new Result(_consumed, _success, _err, _val, _state);
        }),
        new StrictParser(state => {
          expect(State.equal(state, states[i - 2])).to.be.true;
          const _consumed = consumed[j];
          const _success  = success[j];
          const _val      = vals[j];
          const _state    = states[j];
          const _err      = errs[j];
          j += 2;
          return new Result(_consumed, _success, _err, _val, _state);
        }),
      ];
    }
    // csucc, csucc, csucc, cfail
    {
      const consumed = [true, true, true, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 3),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 4),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 5),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, csucc, csucc, efail
    {
      const consumed = [true, true, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 3),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 4),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 4),
            "someC"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, csucc, cfail
    {
      const consumed = [true, true, true];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 3),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, csucc, esucc, cfail
    {
      const consumed = [true, true, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 3),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, csucc, esucc, efail
    {
      const consumed = [true, true, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 3),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 3),
            "someC"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, csucc, efail
    {
      const consumed = [true, true, false];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 3),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, cfail
    {
      const consumed = [true, true];
      const success = [true, false];
      const vals = ["nyan"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, esucc, csucc, cfail
    {
      const consumed = [true, false, true, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, esucc, csucc, efail
    {
      const consumed = [true, false, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 3),
            "someC"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, esucc, cfail
    {
      const consumed = [true, false, true];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, esucc, esucc, cfail -> error
    // csucc, esucc, esucc, efail -> error
    // csucc, esucc, efail
    {
      const consumed = [true, false, false];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          ),
          ["nyan"],
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, efail
    {
      const consumed = [true, false];
      const success = [true, false];
      const vals = ["nyan"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          ),
          ["nyan"],
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // cfail
    {
      const consumed = [true];
      const success = [false];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, csucc, csucc, cfail
    {
      const consumed = [false, true, true, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, csucc, csucc, efail
    {
      const consumed = [false, true, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 3),
            "someC"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, csucc, cfail
    {
      const consumed = [false, true, true];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, csucc, esucc, cfail
    {
      const consumed = [false, true, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, csucc, esucc, efail
    {
      const consumed = [false, true, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 2),
            "someC"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, csucc, efail
    {
      const consumed = [false, true, false];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, cfail
    {
      const consumed = [false, true];
      const success = [true, false];
      const vals = ["nyan"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, esucc, csucc, cfail
    {
      const consumed = [false, false, true, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 1),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, esucc, csucc, efail
    {
      const consumed = [false, false, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 1),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 2),
            "someC"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, esucc, cfail
    {
      const consumed = [false, false, true];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 1),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, esucc, esucc, cfail -> error
    // esucc, esucc, esucc, efail -> error
    // esucc, esucc, efail
    {
      const consumed = [false, false, false];
      const success = [true, true, false];
      const vals = ["nyan", undefined];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 1),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          ),
          ["nyan"],
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 1),
            "someA"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, efail
    {
      const consumed = [false, false];
      const success = [true, false];
      const vals = ["nyan"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          ),
          ["nyan"],
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 1),
            "someA"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // efail
    {
      const consumed = [false];
      const success = [false];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          ),
          [],
          initState
        ),
        arrayEqual
      )).to.be.true;
    }
  });

  it("should throw an `Error' if both separator and parser succeed without consuming input", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    function generateParsers(consumed, success, vals, states, errs) {
      let i = 0;
      let j = 1;
      return [
        new StrictParser(state => {
          expect(State.equal(state, i === 0 ? initState : states[j - 2])).to.be.true;
          const _consumed = consumed[i];
          const _success  = success[i];
          const _val      = vals[i];
          const _state    = states[i];
          const _err      = errs[i];
          i += 2;
          return new Result(_consumed, _success, _err, _val, _state);
        }),
        new StrictParser(state => {
          expect(State.equal(state, states[i - 2])).to.be.true;
          const _consumed = consumed[j];
          const _success  = success[j];
          const _val      = vals[j];
          const _state    = states[j];
          const _err      = errs[j];
          j += 2;
          return new Result(_consumed, _success, _err, _val, _state);
        }),
      ];
    }
    // csucc, esucc, esucc, cfail
    {
      const consumed = [true, false, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
    }
    // csucc, esucc, esucc, efail
    {
      const consumed = [true, false, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 2),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
    }
    // esucc, esucc, esucc, cfail
    {
      const consumed = [false, false, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 1),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 1),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
    }
    // esucc, esucc, esucc, efail
    {
      const consumed = [false, false, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
      const states = [
        new State(
          new Config({ tabWidth: 8 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restB",
          new SourcePos("foobar", 1, 1),
          "someB"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restC",
          new SourcePos("foobar", 1, 1),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
    }
  });
});
