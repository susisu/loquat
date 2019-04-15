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
} = $core;

const { forever } = $monad;

describe("forever", () => {
  it("should create a parser that runs the given parser repeatedly until it finally fails", () => {
    const initState = new State(
      new Config(),
      "abc",
      new SourcePos("main", 1, 1),
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
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 2),
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
          new SourcePos("main", 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 3),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 4),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        )
      ));
    }
    // many esucc, cfail
    {
      const success = [true, true, false];
      const consumed = [false, false, true];
      const vals = ["A", "B"];
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
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 2),
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
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
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
          new SourcePos("main", 1, 2),
          "someA"
        ),
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 3),
          "someB"
        ),
      ];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
        ),
      ];

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 3),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
          ]
        )
      ));
    }
    // many esucc, efail
    {
      const success = [true, true, false];
      const consumed = [false, false, false];
      const vals = ["A", "B"];
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
      ];

      const parser = generateParser(success, consumed, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
          ]
        )
      ));
    }
  });
});
