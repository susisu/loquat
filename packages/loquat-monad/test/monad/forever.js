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

const { forever } = _monad;

describe(".forever(parser)", () => {
  it("should return a parser that runs `parser' repeatedly till it fails", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "abc",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    function generateParser(consumed, success, vals, states, errs) {
      let i = 0;
      return new StrictParser(state => {
        expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
        const _consumed = consumed[i];
        const _success  = success[i];
        const _val      = vals[i];
        const _state    = states[i];
        const _err      = errs[i];
        i += 1;
        return new Result(_consumed, _success, _err, _val, _state);
      });
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

      const parser = generateParser(consumed, success, vals, states, errs);
      const manyParser = forever(parser);
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
    // many csucc, cfail
    {
      const consumed = [true, true, true];
      const success = [true, true, false];
      const vals = ["A", "B"];
      const states = [
        new State(
          new Config({ tabWidth: 4 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 4 }),
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

      const parser = generateParser(consumed, success, vals, states, errs);
      const manyParser = forever(parser);
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
    // many esucc, cfail
    {
      const consumed = [false, false, true];
      const success = [true, true, false];
      const vals = ["A", "B"];
      const states = [
        new State(
          new Config({ tabWidth: 4 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 4 }),
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

      const parser = generateParser(consumed, success, vals, states, errs);
      const manyParser = forever(parser);
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

      const parser = generateParser(consumed, success, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
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
    // many csucc, efail
    {
      const consumed = [true, true, false];
      const success = [true, true, false];
      const vals = ["A", "B"];
      const states = [
        new State(
          new Config({ tabWidth: 4 }),
          "restA",
          new SourcePos("foobar", 1, 2),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 4 }),
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

      const parser = generateParser(consumed, success, vals, states, errs);
      const manyParser = forever(parser);
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
    // many esucc, efail
    {
      const consumed = [false, false, false];
      const success = [true, true, false];
      const vals = ["A", "B"];
      const states = [
        new State(
          new Config({ tabWidth: 4 }),
          "restA",
          new SourcePos("foobar", 1, 1),
          "someA"
        ),
        new State(
          new Config({ tabWidth: 4 }),
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

      const parser = generateParser(consumed, success, vals, states, errs);
      const manyParser = forever(parser);
      expect(manyParser).to.be.a.parser;
      const res = manyParser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testC"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});
