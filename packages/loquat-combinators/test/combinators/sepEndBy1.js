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

const { sepEndBy1 } = _combinators;

describe("sepEndBy1", () => {
  it("should create a parser that parses one or more tokens separated or ended by symbols", () => {
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

    // csucc, csucc, csucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, true, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 4, 1, 5),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 5, 1, 6),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, csucc, csucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, true, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 4, 1, 5),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 4, 1, 5),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 4, 1, 5),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, csucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, true, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // csucc, csucc, csucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, true, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, csucc, csucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, true, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 3, 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 3, 1, 4),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, csucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, true, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 3, 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
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
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // csucc, csucc, esucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, false, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, csucc, esucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, false, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 3, 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 3, 1, 4),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, csucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, false, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // csucc, csucc, esucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, false, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, csucc, esucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, true, false, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 2, 1, 3),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, csucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, false, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
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
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          ),
          ["nyan"],
          new State(
            new Config(),
            "restB",
            new SourcePos("main", 2, 1, 3),
            "someB"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, cfail
    {
      const success = [true, false];
      const consumed = [true, true];
      const vals = ["nyan"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // csucc, esucc, csucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, true, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, esucc, csucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, true, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 3, 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 3, 1, 4),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, esucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, true, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // csucc, esucc, csucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, true, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, esucc, csucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, true, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 2, 1, 3),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, esucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, true, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
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
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // csucc, esucc, esucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, false, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, esucc, esucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, false, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 2, 1, 3),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, esucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, false, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // csucc, esucc, esucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, false, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // csucc, esucc, esucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [true, false, false, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 1, 1, 2),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, esucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, false, false, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
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
    // csucc, esucc, efail
    {
      const success = [true, true, false];
      const consumed = [true, false, false];
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
          ["nyan"],
          new State(
            new Config(),
            "restB",
            new SourcePos("main", 1, 1, 2),
            "someB"
          )
        ),
        chai.util.eql
      );
    }
    // csucc, efail
    {
      const success = [true, false];
      const consumed = [true, false];
      const vals = ["nyan"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
          ["nyan"],
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
    // esucc, csucc, csucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, true, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 4, 1, 5),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, csucc, csucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, true, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 3, 1, 4),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 3, 1, 4),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 3, 1, 4),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, csucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, true, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // esucc, csucc, csucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, true, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, csucc, csucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, true, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 2, 1, 3),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, csucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, true, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
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
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // esucc, csucc, esucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, false, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, csucc, esucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, false, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 2, 1, 3),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, csucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, false, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // esucc, csucc, esucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, false, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, csucc, esucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, true, false, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 1, 1, 2),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, csucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, true, false, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
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
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          ),
          ["nyan"],
          new State(
            new Config(),
            "restB",
            new SourcePos("main", 1, 1, 2),
            "someB"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, cfail
    {
      const success = [true, false];
      const consumed = [false, true];
      const vals = ["nyan"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // esucc, esucc, csucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, true, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 3, 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, esucc, csucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, true, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 2, 1, 3),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 2, 1, 3),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, esucc, csucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, true, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // esucc, esucc, csucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, true, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, esucc, csucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, true, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 1, 1, 2),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, esucc, csucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, true, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
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
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // esucc, esucc, esucc, csucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, false, true, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, esucc, esucc, csucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, false, true, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 1, 1, 2),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 1, 1, 2),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, esucc, esucc, cfail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, false, true];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
        )
      ));
    }
    // esucc, esucc, esucc, esucc, cfail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, false, false, true];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 0, 1, 1),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        )
      ));
    }
    // esucc, esucc, esucc, esucc, efail
    {
      const success = [true, true, true, true, false];
      const consumed = [false, false, false, false, false];
      const vals = ["nyan", undefined, "cat", undefined];
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
        new State(
          new Config(),
          "restD",
          new SourcePos("main", 0, 1, 1),
          "someD"
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
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
        ),
      ];
      const parsers = generateParsers(success, consumed, vals, states, errs);
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testE"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restD",
            new SourcePos("main", 0, 1, 1),
            "someD"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, esucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [false, false, false, false];
      const vals = ["nyan", undefined, "cat"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testD"),
            ]
          ),
          ["nyan", "cat"],
          new State(
            new Config(),
            "restC",
            new SourcePos("main", 0, 1, 1),
            "someC"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, esucc, efail
    {
      const success = [true, true, false];
      const consumed = [false, false, false];
      const vals = ["nyan", undefined];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
          ["nyan"],
          new State(
            new Config(),
            "restB",
            new SourcePos("main", 0, 1, 1),
            "someB"
          )
        ),
        chai.util.eql
      );
    }
    // esucc, efail
    {
      const success = [true, false];
      const consumed = [false, false];
      const vals = ["nyan"];
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
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
          ["nyan"],
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
      const manyParser = sepEndBy1(parsers[0], parsers[1]);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
  });
});
