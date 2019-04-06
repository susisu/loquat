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

const { reduceMany } = _prim;

describe("reduceMany", () => {
  it("should create a parser that runs the given parser until it fails without consumption and"
    + " reduces the result values using the specified function", () => {
    const initState = new State(
      new Config(),
      "init",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    function generateParser(success, consumed, vals, states, errs) {
      let i = 0;
      return new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(i === 0 ? initState : states[i - 1]);
        const _success  = success[i];
        const _consumed = consumed[i];
        const _val      = vals[i];
        const _state    = states[i];
        const _err      = errs[i];
        i += 1;
        return _success
          ? Result.succ(_consumed, _err, _val, _state)
          : Result.fail(_consumed, _err);
      });
    }
    // cfail
    {
      const success = [false];
      const consumed = [true];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = reduceMany(parser, (x, y) => x + y, "?");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
    // many csucc, cfail
    {
      const success = [true, true, false];
      const consumed = [true, true, true];
      const vals = ["A", "B"];
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

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = reduceMany(parser, (x, y) => x + y, "?");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
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

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = reduceMany(parser, (x, y) => x + y, "?");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        "?",
        initState
      ));
    }
    // many csucc, efail
    {
      const success = [true, true, false];
      const consumed = [true, true, false];
      const vals = ["A", "B"];
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

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = reduceMany(parser, (x, y) => x + y, "?");
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
        "?AB",
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
        )
      ));
    }
  });

  it("should throw Error if the given parser succeeds without consumption", () => {
    const initState = new State(
      new Config(),
      "init",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    function generateParser(success, consumed, vals, states, errs) {
      let i = 0;
      return new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(i === 0 ? initState : states[i - 1]);
        const _success  = success[i];
        const _consumed = consumed[i];
        const _val      = vals[i];
        const _state    = states[i];
        const _err      = errs[i];
        i += 1;
        return _success
          ? Result.succ(_consumed, _err, _val, _state)
          : Result.fail(_consumed, _err);
      });
    }

    // esucc, efail
    {
      const success = [true, false];
      const consumed = [false, false];
      const vals = ["A"];
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
      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = reduceMany(parser, (x, y) => x + y, "?");
      expect(manyParser).to.be.a.parser;
      expect(() => {
        manyParser.run(initState);
      }).to.throw(Error, /many/);
    }
    // many csucc, esucc, efail
    {
      const success = [true, true, true, false];
      const consumed = [true, true, false, false];
      const vals = ["A", "B", "C"];
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

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = reduceMany(parser, (x, y) => x + y, "?");
      expect(manyParser).to.be.a.parser;
      expect(() => {
        manyParser.run(initState);
      }).to.throw(Error, /many/);
    }
  });
});
