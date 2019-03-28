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

const { chainl } = _combinators;

describe(".chainl(term, op, defaultVal)", () => {
  it("should return a parser that parses zero or more terms accepted by `term' and operators"
    + " accepted by `op', and reduces the values to a single value from left to right", () => {
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
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 5),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // csucc, csucc, csucc, efail
    {
      const consumed = [true, true, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 4),
            "someC"
          )
        )
      )).to.be.true;
    }
    // csucc, csucc, cfail
    {
      const consumed = [true, true, true];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        )
      )).to.be.true;
    }
    // csucc, csucc, esucc, cfail
    {
      const consumed = [true, true, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // csucc, csucc, esucc, efail
    {
      const consumed = [true, true, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 3),
            "someC"
          )
        )
      )).to.be.true;
    }
    // csucc, csucc, efail
    {
      const consumed = [true, true, false];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
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
    // csucc, esucc, csucc, cfail
    {
      const consumed = [true, false, true, true];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // csucc, esucc, csucc, efail
    {
      const consumed = [true, false, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 3),
            "someC"
          )
        )
      )).to.be.true;
    }
    // csucc, esucc, cfail
    {
      const consumed = [true, false, true];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        )
      )).to.be.true;
    }
    // csucc, esucc, esucc, cfail
    {
      const consumed = [true, false, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // csucc, esucc, esucc, efail
    {
      const consumed = [true, false, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 2),
            "someC"
          )
        )
      )).to.be.true;
    }
    // csucc, esucc, efail
    {
      const consumed = [true, false, false];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
          "nyan",
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
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
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
          "nyan",
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
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
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
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
    // esucc, csucc, csucc, cfail
    {
      const consumed = [false, true, true, true];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // esucc, csucc, csucc, efail
    {
      const consumed = [false, true, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 3),
            "someC"
          )
        )
      )).to.be.true;
    }
    // esucc, csucc, cfail
    {
      const consumed = [false, true, true];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        )
      )).to.be.true;
    }
    // esucc, csucc, esucc, cfail
    {
      const consumed = [false, true, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // esucc, csucc, esucc, efail
    {
      const consumed = [false, true, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 2),
            "someC"
          )
        )
      )).to.be.true;
    }
    // esucc, csucc, efail
    {
      const consumed = [false, true, false];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
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
    // esucc, esucc, csucc, cfail
    {
      const consumed = [false, false, true, true];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // esucc, esucc, csucc, efail
    {
      const consumed = [false, false, true, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 2),
            "someC"
          )
        )
      )).to.be.true;
    }
    // esucc, esucc, cfail
    {
      const consumed = [false, false, true];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
          )
        )
      )).to.be.true;
    }
    // esucc, esucc, esucc, cfail
    {
      const consumed = [false, false, false, true];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          )
        )
      )).to.be.true;
    }
    // esucc, esucc, esucc, efail
    {
      const consumed = [false, false, false, false];
      const success = [true, true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          "nyanCAT",
          new State(
            new Config({ tabWidth: 8 }),
            "restC",
            new SourcePos("foobar", 1, 1),
            "someC"
          )
        )
      )).to.be.true;
    }
    // esucc, esucc, efail
    {
      const consumed = [false, false, false];
      const success = [true, true, false];
      const vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
          "nyan",
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 1),
            "someA"
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
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
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
          "nyan",
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 1),
            "someA"
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
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          ),
          "xyz",
          initState
        )
      )).to.be.true;
    }
    // left to right: csucc, csucc, csucc, csucc, csucc, efail
    {
      const consumed = [true, true, true, true, true, false];
      const success = [true, true, true, true, true, false];
      const vals = [
        "c",
        (x, y) => x + y.toUpperCase(),
        "a",
        (x, y) => x + y.toLowerCase(),
        "T",
      ];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 5),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 6),
          "someE"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 6),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 6),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1], "xyz");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 6),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testF"),
            ]
          ),
          "cAt",
          new State(
            new Config({ tabWidth: 8 }),
            "restE",
            new SourcePos("foobar", 1, 6),
            "someE"
          )
        )
      )).to.be.true;
    }
    // left to right: csucc, csucc, csucc, csucc, csucc, esucc, efail
    {
      const consumed = [true, true, true, true, true, false, false];
      const success = [true, true, true, true, true, true, false];
      const vals = [
        "c",
        (x, y) => x + y.toUpperCase(),
        "a",
        (x, y) => x + y.toLowerCase(),
        "T",
        (x, y) => x + y.toUpperCase(),
      ];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 5),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 6),
          "someE"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restF",
          new SourcePos("foobar", 1, 6),
          "someF"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 6),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 6),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 6),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testG")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const manyParser = chainl(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 6),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testF"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testG"),
            ]
          ),
          "cAt",
          new State(
            new Config({ tabWidth: 8 }),
            "restE",
            new SourcePos("foobar", 1, 6),
            "someE"
          )
        )
      )).to.be.true;
    }
  });
});
