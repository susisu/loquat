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

const { zipWithM } = _monad;

describe(".zipWithM(func, arrA, arrB)", () => {
  it("should return a parser that zips arrays with `func' and runs the resultant parsers"
    + " sequentially", () => {
    const arrayEqual = (arrA, arrB) => arrA.length === arrB.length
      && arrA.every((elem, i) => elem === arrB[i]);

    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );

    function generateFunc(consumed, success, vals, states, errs) {
      return (i, v) => new StrictParser(state => {
        expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
        expect(v).to.equal(vals[i]);
        const _consumed = consumed[i];
        const _success  = success[i];
        const _val      = vals[i];
        const _state    = states[i];
        const _err      = errs[i];
        return new Result(_consumed, _success, _err, _val, _state);
      });
    }

    // empty
    {
      const func = generateFunc([], [], [], [], []);
      const parser = zipWithM(func, [], []);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.unknown(initState.pos), [], initState),
        arrayEqual
      )).to.be.true;
    }
    // csucc, csucc
    {
      const consumed = [true, true];
      const success = [true, true];
      const vals = ["nyan", "cat"];
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
      ];
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 3),
            "someB"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, cfail
    {
      const consumed = [true, true];
      const success = [true, false];
      const vals = ["nyan", "cat"];
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
    // csucc, esucc
    {
      const consumed = [true, false];
      const success = [true, true];
      const vals = ["nyan", "cat"];
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
      ];
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // csucc, efail
    {
      const consumed = [true, false];
      const success = [true, false];
      const vals = ["nyan", "cat"];
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // cfail
    {
      const consumed = [true];
      const success = [false];
      const vals = ["nyan", "cat"];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
    // esucc, csucc
    {
      const consumed = [false, true];
      const success = [true, true];
      const vals = ["nyan", "cat"];
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
      ];
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          ),
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, cfail
    {
      const consumed = [false, true];
      const success = [true, false];
      const vals = ["nyan", "cat"];
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
    // esucc, esucc
    {
      const consumed = [false, false];
      const success = [true, true];
      const vals = ["nyan", "cat"];
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
      ];
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
          ["nyan", "cat"],
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 1),
            "someB"
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // esucc, efail
    {
      const consumed = [false, false];
      const success = [true, false];
      const vals = ["nyan", "cat"];
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0, 1], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
    // efail
    {
      const consumed = [false];
      const success = [false];
      const vals = ["nyan", "cat"];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = zipWithM(func, [0], ["nyan", "cat"]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          )
        ),
        arrayEqual
      )).to.be.true;
    }
  });
});
