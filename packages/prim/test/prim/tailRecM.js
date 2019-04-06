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

const { pure, bind, tailRecM } = $prim;

describe("tailRecM", () => {
  it("should create a parser that repeats applying a function to the previous value and running"
    + " returned parser until it is done", () => {
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
      return val => {
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
      };
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
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(err, { done: true, value: "bar" }, finalState);
        });
      };
      const parser = tailRecM("foo", func);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "bar", finalState));
    }
    // cfail
    {
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.cfail(err);
        });
      };
      const parser = tailRecM("foo", func);
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
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(err, { done: true, value: "bar" }, finalState);
        });
      };
      const parser = tailRecM("foo", func);
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
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.efail(err);
        });
      };
      const parser = tailRecM("foo", func);
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
      const parser = tailRecM(initVal, func);
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
      const vals = ["bar"];
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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
      const parser = tailRecM(initVal, func);
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

  it("should be the same as the parser that calls `bind` recursively", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const initVal = "init";
    function generateParsers(success, consumed, vals, states, errs) {
      const len = success.length;
      let i = 0;
      return {
        tailRecM: tailRecM(initVal, val => {
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
        }),
        bind: success.reduce(
          (acc, _, i) => bind(acc, val => {
            expect(val).to.equal(i === 0 ? initVal : vals[i - 1]);
            return new StrictParser(state => {
              expect(state).to.be.an.equalStateTo(i === 0 ? initState : states[i - 1]);
              const _success  = success[i];
              const _consumed = consumed[i];
              const _val      = vals[i];
              const _state    = states[i];
              const _err      = errs[i];
              return _success
                ? Result.succ(_consumed, _err, _val, _state)
                : Result.fail(_consumed, _err);
            });
          }),
          pure(initVal)
        ),
      };
    }
    const vals = ["foo", "bar", "baz"];
    const states = [
      new State(
        new Config(),
        "restA",
        new SourcePos("mainb", 0, 1, 1),
        "someA"
      ),
      new State(
        new Config(),
        "restB",
        new SourcePos("mainb", 0, 1, 1),
        "someB"
      ),
      new State(
        new Config(),
        "restC",
        new SourcePos("mainb", 0, 1, 1),
        "someC"
      ),
    ];
    const errs = [
      new StrictParseError(
        new SourcePos("mainb", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      ),
      new StrictParseError(
        new SourcePos("mainb", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      ),
      new StrictParseError(
        new SourcePos("mainb", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      ),
    ];
    const tf = [true, false];
    const success = [];
    const consumed = [];
    for (const b1 of tf) {
      for (const b2 of tf) {
        for (const b3 of tf) {
          success.push([b1, b2, b3]);
          consumed.push([b1, b2, b3]);
        }
      }
    }
    for (const ss of success) {
      for (const cs of consumed) {
        const ps = generateParsers(ss, cs, vals, states, errs);
        const lhs = ps.tailRecM.run(initState);
        const rhs = ps.bind.run(initState);
        expect(lhs).to.be.an.equalResultTo(rhs);
      }
    }
  });

  it("should be stack-safe", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    let i = 0;
    const func = () => {
      const done = i >= 20000;
      i += 1;
      return pure({ done: done, value: undefined });
    };
    const parser = tailRecM(undefined, func);
    expect(() => {
      parser.run(initState);
    }).not.to.throw(RangeError, /stack/);
  });
});
