"use strict";

const chai = require("chai");
const { expect } = chai;

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = $core;

const { manyTill } = $combinators;

describe("manyTill", () => {
  it("should create a parser that parses zero or more tokens until the end and returns an array of"
    + " the result values", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    function generateParsers(success, consumed, vals, states, errs) {
      let i = 0;
      let j = 1;
      return [
        new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(i === 0 ? initState : states[j - 2]);
          const _success  = success[i];
          const _consumed = consumed[i];
          const _val      = vals[i];
          const _state    = states[i];
          const _err      = errs[i];
          i += 2;
          return _success
            ? Result.succ(_consumed, _err, _val, _state)
            : Result.fail(_consumed, _err);
        }),
        new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(i === 2 ? initState : states[j - 2]);
          const _success  = success[j];
          const _consumed = consumed[j];
          const _val      = vals[j];
          const _state    = states[j];
          const _err      = errs[j];
          j += 2;
          return _success
            ? Result.succ(_consumed, _err, _val, _state)
            : Result.fail(_consumed, _err);
        }),
      ];
    }

    // empty csucc
    {
      const success = [true];
      const consumed = [true];
      const vals = [undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 2),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          ),
          [],
          new State(
            new Config(),
            "restA",
            new SourcePos("main", 1, 2),
            "someA"
          )
        ),
        chai.util.eql
      );
    }
    // many csucc, ended by csucc
    {
      const success = [false, true, false, true, true];
      const consumed = [false, true, false, true, true];
      const vals = [undefined, "foo", undefined, "bar", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 2),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 3),
          "someD"
        ),
        new State(
          new Config(),
          "restE",
          new SourcePos("main", 1, 4),
          "someE"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restE",
            new SourcePos("main", 1, 4),
            "someE"
          )
        ),
        chai.util.eql
      );
    }
    // many esucc, ended by csucc
    {
      const success = [false, true, false, true, true];
      const consumed = [false, false, false, false, true];
      const vals = [undefined, "foo", undefined, "bar", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1),
          "someD"
        ),
        new State(
          new Config(),
          "restE",
          new SourcePos("main", 1, 2),
          "someE"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restE",
            new SourcePos("main", 1, 2),
            "someE"
          )
        ),
        chai.util.eql
      );
    }
    // empty cfail
    {
      const success = [false];
      const consumed = [true];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
    // many csucc, ended by cfail
    {
      const success = [false, true, false, true, false];
      const consumed = [false, true, false, true, true];
      const vals = [undefined, "foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 2),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 3),
          "someD"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // many esucc, ended by cfail
    {
      const success = [false, true, false, true, false];
      const consumed = [false, false, false, false, true];
      const vals = [undefined, "foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1),
          "someD"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // empty esucc
    {
      const success = [true];
      const consumed = [false];
      const vals = [undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          ),
          [],
          new State(
            new Config(),
            "restA",
            new SourcePos("main", 1, 1),
            "someA"
          )
        ),
        chai.util.eql
      );
    }
    // many csucc, ended by esucc
    {
      const success = [false, true, false, true, true];
      const consumed = [false, true, false, true, false];
      const vals = [undefined, "foo", undefined, "bar", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 2),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 3),
          "someD"
        ),
        new State(
          new Config(),
          "restE",
          new SourcePos("main", 1, 3),
          "someE"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restE",
            new SourcePos("main", 1, 3),
            "someE"
          )
        ),
        chai.util.eql
      );
    }
    // many esucc, ended by esucc
    {
      const success = [false, true, false, true, true];
      const consumed = [false, false, false, false, false];
      const vals = [undefined, "foo", undefined, "bar", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1),
          "someD"
        ),
        new State(
          new Config(),
          "restE",
          new SourcePos("main", 1, 1),
          "someE"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restE",
            new SourcePos("main", 1, 1),
            "someE"
          )
        ),
        chai.util.eql
      );
    }
    // cfail
    {
      const success = [false, false];
      const consumed = [false, true];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // many csucc, cfail
    {
      const success = [false, true, false, true, false, false];
      const consumed = [false, true, false, true, false, true];
      const vals = [undefined, "foo", undefined, "bar", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 2),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 3),
          "someD"
        ),
        new State(
          new Config(),
          "restE",
          new SourcePos("main", 1, 3),
          "someE"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
        )
      ));
    }
    // efail
    {
      const success = [false, false];
      const consumed = [false, false];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
          ]
        )
      ));
    }
    // many csucc, efail
    {
      const success = [false, true, false, true, false, false];
      const consumed = [false, true, false, true, false, false];
      const vals = [undefined, "foo", undefined, "bar", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 2),
          "someC"
        ),
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 3),
          "someD"
        ),
        new State(
          new Config(),
          "restE",
          new SourcePos("main", 1, 3),
          "someE"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const parser = manyTill(parsers[1], parsers[0]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testF"),
          ]
        )
      ));
    }
  });
});
