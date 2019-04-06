"use strict";

const chai = require("chai");
const { expect, assert } = chai;

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
} = $core;

const { count } = $combinators;

describe("count", () => {
  it("should create a parser that runs the given parser n times and returns an array of result"
    + " values", () => {
    const initState = new State(
      new Config(),
      "input",
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

    // empty
    {
      const parser = new StrictParser(_ => assert.fail("expect function to not be called"));
      const repParser = count(0, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          ParseError.unknown(initState.pos),
          [],
          initState
        ),
        chai.util.eql
      );
    }
    // csucc, csucc
    {
      const consumed = [true, true];
      const success = [true, true];
      const vals = ["foo", "bar"];
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
      ];
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          ),
          ["foo", "bar"],
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
      const consumed = [true, true];
      const success = [true, false];
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
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // csucc, esucc
    {
      const consumed = [true, false];
      const success = [true, true];
      const vals = ["foo", "bar"];
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
      ];
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          ),
          ["foo", "bar"],
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
      const consumed = [true, false];
      const success = [true, false];
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
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
          ]
        )
      ));
    }
    // cfail
    {
      const consumed = [true];
      const success = [false];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
    // esucc, csucc
    {
      const consumed = [false, true];
      const success = [true, true];
      const vals = ["foo", "bar"];
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
      ];
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
          ),
          ["foo", "bar"],
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
      const consumed = [false, true];
      const success = [true, false];
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
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // esucc, esucc
    {
      const consumed = [false, false];
      const success = [true, true];
      const vals = ["foo", "bar"];
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
      ];
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
            ]
          ),
          ["foo", "bar"],
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
      const consumed = [false, false];
      const success = [true, false];
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
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
          ]
        )
      ));
    }
    // efail
    {
      const consumed = [false];
      const success = [false];
      const vals = [];
      const states = [];
      const errs = [
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        ),
      ];
      const parser = generateParser(success, consumed, vals, states, errs);
      const repParser = count(2, parser);
      expect(repParser).to.be.a.parser;
      const res = repParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
  });
});
