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

const { ftailRecM } = $prim;

describe("ftailRecM", () => {
  it("should create a function that chains the given function from a value to a parser", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const initVal = "init";
    function generateFunc(success, consumed, vals, states, errs) {
      let i = 0;
      const len = success.length;
      return ftailRecM(val => {
        expect(val).to.equal(i === 0 ? initVal : vals[i - 1]);
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(i === 0 ? initState : states[i - 1]);
          const _success  = success[i];
          const _consumed = consumed[i];
          const _val      = { done: i === len - 1, value: vals[i] };
          const _state    = states[i];
          const _err      = errs[i];
          i += 1;
          return _success
            ? Result.succ(_consumed, _err, _val, _state)
            : Result.fail(_consumed, _err);
        });
      });
    }
    // immediately done
    // csucc
    {
      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 1, 1, 2),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const func = ftailRecM(val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(err, { done: true, value: "bar" }, finalState);
        });
      });
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "bar", finalState));
    }
    // cfail
    {
      const err = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const func = ftailRecM(val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.cfail(err);
        });
      });
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    // esucc
    {
      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 0, 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const func = ftailRecM(val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(err, { done: true, value: "bar" }, finalState);
        });
      });
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "bar", finalState));
    }
    // efail
    {
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const func = ftailRecM(val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.efail(err);
        });
      });
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
    // recursive
    // csucc, csucc
    {
      const success = [true, true];
      const consumed = [true, true];
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        "bar",
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 2, 1, 3),
          "someB"
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 2, 1, 3),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // csucc, esucc
    {
      const success = [true, true];
      const consumed = [true, false];
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
          ]
        ),
        "bar",
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
        )
      ));
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
    // cfail, efail
    {
      const success = [false, false];
      const consumed = [true, false];
      const vals = [];
      const states = [];
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
    // esucc, csucc
    {
      const success = [true, true];
      const consumed = [false, true];
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        ),
        "bar",
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 1, 1, 2),
          "someB"
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 1, 1, 2),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
        )
      ));
    }
    // esucc, esucc
    {
      const success = [true, true];
      const consumed = [false, false];
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testA"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "testB"),
          ]
        ),
        "bar",
        new State(
          new Config(),
          "restB",
          new SourcePos("main", 0, 1, 1),
          "someB"
        )
      ));
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
    // efail, efail
    {
      const success = [false, false];
      const consumed = [false, false];
      const vals = [];
      const states = [];
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
      const func = generateFunc(success, consumed, vals, states, errs);
      const parser = func(initVal);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
        )
      ));
    }
  });
});
