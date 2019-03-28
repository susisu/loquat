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

const { reduceManyTill } = _combinators;

describe(".reduceManyTill(parser, end, callback, initVal)", () => {
  it("should return a parser that parses zero or more tokens accepted by `parser' until `end'"
    + " succeeds, and reduces the resultant values by a function `callback'", () => {
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
          expect(State.equal(state, i === 2 ? initState : states[j - 2])).to.be.true;
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
    // empty csucc
    {
      const consumed = [true];
      const success = [true];
      const vals = [undefined];
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
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          ),
          "",
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
          )
        )
      )).to.be.true;
    }
    // many csucc, ended by csucc
    {
      const consumed = [false, true, false, true, true];
      const success = [false, true, false, true, true];
      const vals = [undefined, "nyan", undefined, "cat", undefined];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 3),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 4),
          "someE"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "restE",
            new SourcePos("foobar", 1, 4),
            "someE"
          )
        )
      )).to.be.true;
    }
    // many esucc, ended by csucc
    {
      const consumed = [false, false, false, false, true];
      const success = [false, true, false, true, true];
      const vals = [undefined, "nyan", undefined, "cat", undefined];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 1),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 2),
          "someE"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "restE",
            new SourcePos("foobar", 1, 2),
            "someE"
          )
        )
      )).to.be.true;
    }
    // empty cfail
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
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
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
    // many csucc, ended by cfail
    {
      const consumed = [false, true, false, true, true];
      const success = [false, true, false, true, false];
      const vals = [undefined, "nyan", undefined, "cat"];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
          )
        )
      )).to.be.true;
    }
    // many esucc, ended by cfail
    {
      const consumed = [false, false, false, false, true];
      const success = [false, true, false, true, false];
      const vals = [undefined, "nyan", undefined, "cat"];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 1),
          "someD"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
          )
        )
      )).to.be.true;
    }
    // empty esucc
    {
      const consumed = [false];
      const success = [true];
      const vals = [undefined];
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
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          ),
          "",
          new State(
            new Config({ tabWidth: 8 }),
            "restA",
            new SourcePos("foobar", 1, 1),
            "someA"
          )
        )
      )).to.be.true;
    }
    // many csucc, ended by esucc
    {
      const consumed = [false, true, false, true, false];
      const success = [false, true, false, true, true];
      const vals = [undefined, "nyan", undefined, "cat", undefined];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 3),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 3),
          "someE"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "restE",
            new SourcePos("foobar", 1, 3),
            "someE"
          )
        )
      )).to.be.true;
    }
    // many esucc, ended by esucc
    {
      const consumed = [false, false, false, false, false];
      const success = [false, true, false, true, true];
      const vals = [undefined, "nyan", undefined, "cat", undefined];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 1),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 1),
          "someE"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
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
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          "nyancat",
          new State(
            new Config({ tabWidth: 8 }),
            "restE",
            new SourcePos("foobar", 1, 1),
            "someE"
          )
        )
      )).to.be.true;
    }
    // cfail
    {
      const consumed = [false, true];
      const success = [false, false];
      const vals = [];
      const states = [];
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
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
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
    // many csucc, cfail
    {
      const consumed = [false, true, false, true, false, true];
      const success = [false, true, false, true, false, false];
      const vals = [undefined, "nyan", undefined, "cat", undefined];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 3),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 3),
          "someE"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
          )
        )
      )).to.be.true;
    }
    // efail
    {
      const consumed = [false, false];
      const success = [false, false];
      const vals = [];
      const states = [];
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
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
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
    // many csucc, efail
    {
      const consumed = [false, true, false, true, false, false];
      const success = [false, true, false, true, false, false];
      const vals = [undefined, "nyan", undefined, "cat", undefined];
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
        new State(
          new Config({ tabWidth: 8 }),
          "restD",
          new SourcePos("foobar", 1, 3),
          "someD"
        ),
        new State(
          new Config({ tabWidth: 8 }),
          "restE",
          new SourcePos("foobar", 1, 3),
          "someE"
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
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
        new StrictParseError(
          new SourcePos("foobar", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
        ),
      ];
      const parsers = generateParsers(consumed, success, vals, states, errs);
      const parser = reduceManyTill(parsers[1], parsers[0], (x, y) => x + y, "");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testF"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
