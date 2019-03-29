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

const { foldM_ } = _monad;

describe(".foldM_(func, initVal, arr)", () => {
  it("should return a parser that call `func' with accumulator and an element of `arr'"
    + " sequentially, runs returned parser, and returns last value as a result", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );

    function generateFunc(consumed, success, vals, states, errs) {
      return (acc, i) => new StrictParser(state => {
        expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
        const _consumed = consumed[i];
        const _success  = success[i];
        const _val      = acc + vals[i];
        const _state    = states[i];
        const _err      = errs[i];
        return new Result(_consumed, _success, _err, _val, _state);
      });
    }

    // empty
    {
      const func = generateFunc([], [], [], [], []);
      const parser = foldM_(func, "xyz", []);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.unknown(initState.pos), undefined, initState)
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
      const parser = foldM_(func, "xyz", [0, 1]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          ),
          undefined,
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 3),
            "someB"
          )
        )
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = foldM_(func, "xyz", [0, 1]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          )
        )
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
      const parser = foldM_(func, "xyz", [0, 1]);
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
          undefined,
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
          )
        )
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = foldM_(func, "xyz", [0, 1]);
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
        )
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = foldM_(func, "xyz", [0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          )
        )
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
      const parser = foldM_(func, "xyz", [0, 1]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          ),
          undefined,
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
          )
        )
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = foldM_(func, "xyz", [0, 1]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          )
        )
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
      const parser = foldM_(func, "xyz", [0, 1]);
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
          undefined,
          new State(
            new Config({ tabWidth: 8 }),
            "restB",
            new SourcePos("foobar", 1, 1),
            "someB"
          )
        )
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = foldM_(func, "xyz", [0, 1]);
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
        )
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
      const func = generateFunc(consumed, success, vals, states, errs);
      const parser = foldM_(func, "xyz", [0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          )
        )
      )).to.be.true;
    }
  });
});
