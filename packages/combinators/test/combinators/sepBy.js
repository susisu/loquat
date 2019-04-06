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
} = _core;

const { sepBy } = _combinators;

describe("sepBy", () => {
  it("should create a parser that parses zero or more tokens separated by symbols", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
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
          expect(state).to.be.an.equalStateTo(states[i - 2]);
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

    // csucc, csucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, true, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 3, 1, 4),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // csucc, csucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, true, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 3, 1, 4),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 3, 1, 4),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restC",
            new SourcePos("main", 3, 1, 4),
            "someC"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, csucc, cfail
    {
      const success = [true, true, false];
      const consumed = [true, true, true];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // csucc, csucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, false, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 2, 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // csucc, csucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, false, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 2, 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restC",
            new SourcePos("main", 2, 1, 3),
            "someC"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, csucc, efail
    {
      const success = [true, true, false];
      const consumed = [true, true, false];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
          ]
        )
      ));
    }
    // csucc, cfail
    {
      const success = [true, false];
      const consumed = [true, true];
      const vals = ["foo"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // csucc, esucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, true, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 2, 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // csucc, esucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, true, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 2, 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restC",
            new SourcePos("main", 2, 1, 3),
            "someC"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, esucc, cfail
    {
      const success = [true, true, false];
      const consumed = [true, false, true];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // csucc, esucc, esucc, cfail -> error
    // csucc, esucc, esucc, efail -> error
    // csucc, esucc, efail
    {
      const success = [true, true, false];
      const consumed = [true, false, false];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          ),
          ["foo"],
          new State(
            new Config(),
            "restA",
            new SourcePos("main", 1, 1, 2),
            "someA"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, efail
    {
      const success = [true, false];
      const consumed = [true, false];
      const vals = ["foo"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          ),
          ["foo"],
          new State(
            new Config(),
            "restA",
            new SourcePos("main", 1, 1, 2),
            "someA"
          )
        ),
        chai.util.eql
      );
    }
    // cfail
    {
      const success = [false];
      const consumed = [true];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
    // esucc, csucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, true, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 2, 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // esucc, csucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, true, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 2, 1, 3),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restC",
            new SourcePos("main", 2, 1, 3),
            "someC"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, csucc, cfail
    {
      const success = [true, true, false];
      const consumed = [false, true, true];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // esucc, csucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, false, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // esucc, csucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, false, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restC",
            new SourcePos("main", 1, 1, 2),
            "someC"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, csucc, efail
    {
      const success = [true, true, false];
      const consumed = [false, true, false];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
          ]
        )
      ));
    }
    // esucc, cfail
    {
      const success = [true, false];
      const consumed = [false, true];
      const vals = ["foo"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // esucc, esucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, true, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 0, 1, 1),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // esucc, esucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, true, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 0, 1, 1),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
          ),
          ["foo", "bar"],
          new State(
            new Config(),
            "restC",
            new SourcePos("main", 1, 1, 2),
            "someC"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, esucc, cfail
    {
      const success = [true, true, false];
      const consumed = [false, false, true];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 0, 1, 1),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // esucc, esucc, esucc, cfail -> error
    // esucc, esucc, esucc, efail -> error
    // esucc, esucc, efail
    {
      const success = [true, true, false];
      const consumed = [false, false, false];
      const vals = ["foo", undefined];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 0, 1, 1),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          ),
          ["foo"],
          new State(
            new Config(),
            "restA",
            new SourcePos("main", 0, 1, 1),
            "someA"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, efail
    {
      const success = [true, false];
      const consumed = [false, false];
      const vals = ["foo"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          ),
          ["foo"],
          new State(
            new Config(),
            "restA",
            new SourcePos("main", 0, 1, 1),
            "someA"
          )
        ),
        chai.util.eql
      );
    }
    // efail
    {
      const success = [false];
      const consumed = [false];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
          ),
          [],
          initState
        ),
        chai.util.eql
      );
    }
  });

  it("should throw Error if bothg of the given parser and the separator succeeds without"
    + " consumption", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
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
          expect(state).to.be.an.equalStateTo(states[i - 2]);
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

    // csucc, esucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, false, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => {
        manyParser.run(initState);
      }).to.throw(Error, /many/);
    }
    // csucc, esucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, false, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 1, 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 1, 1, 2),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => {
        manyParser.run(initState);
      }).to.throw(Error, /many/);
    }
    // esucc, esucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, false, true];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 0, 1, 1),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 0, 1, 1),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => {
        manyParser.run(initState);
      }).to.throw(Error, /many/);
    }
    // esucc, esucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, false, false];
      const vals = ["foo", undefined, "bar"];
      const states = [
        new State(
          new Config(),
          "restA",
          new SourcePos("main", 0, 1, 1),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 0, 1, 1),
          "someB"
        ),
        new State(
          new Config(),
          "restC",
          new SourcePos("main", 0, 1, 1),
          "someC"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepBy(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      expect(() => {
        manyParser.run(initState);
      }).to.throw(Error, /many/);
    }
  });
});
