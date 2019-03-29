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

const { createDummyParser } = _test.helper;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // map
    {
      expect(_sugar.map).to.be.a("function");
      const parser = _sugar.map.call(self, x => x);
      expect(parser).to.be.a.parser;
    }
    // return
    {
      expect(_sugar.return).to.be.a("function");
      const parser = _sugar.return.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // ap
    {
      expect(_sugar.ap).to.be.a("function");
      const parser = _sugar.ap.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // left
    {
      expect(_sugar.left).to.be.a("function");
      const parser = _sugar.left.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // skip
    {
      expect(_sugar.skip).to.be.a("function");
      const parser = _sugar.skip.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // right
    {
      expect(_sugar.right).to.be.a("function");
      const parser = _sugar.right.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // bind
    {
      expect(_sugar.bind).to.be.a("function");
      const parser = _sugar.bind.call(self, x => createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // and
    {
      expect(_sugar.and).to.be.a("function");
      const parser = _sugar.and.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // fail
    {
      expect(_sugar.fail).to.be.a("function");
      const parser = _sugar.fail.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // done
    {
      expect(_sugar.done).to.be.a("function");
      const parser = _sugar.done.call(self);
      expect(parser).to.be.a.parser;
    }
    {
      const initState = new State(
        new Config(),
        "input",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      // csucc
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(
            new StrictParseError(
              new SourcePos("main", 1, 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            "foo",
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 1, 1, 2),
              "some"
            )
          );
        });
        const parser = _sugar.done.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(
          Result.csucc(
            new StrictParseError(
              new SourcePos("main", 1, 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            { done: true, value: "foo" },
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 1, 1, 2),
              "some"
            )
          ),
          chai.util.eql
        );
      }
      // cfail
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.cfail(
            new StrictParseError(
              new SourcePos("main", 1, 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            )
          );
        });
        const parser = _sugar.done.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        ));
      }
      // esucc
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            "foo",
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 0, 1, 1),
              "some"
            )
          );
        });
        const parser = _sugar.done.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(
          Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            { done: true, value: "foo" },
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 0, 1, 1),
              "some"
            )
          ),
          chai.util.eql
        );
      }
      // efail
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.efail(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            )
          );
        });
        const parser = _sugar.done.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        ));
      }
    }
    // cont
    {
      expect(_sugar.cont).to.be.a("function");
      const parser = _sugar.cont.call(self);
      expect(parser).to.be.a.parser;
    }
    {
      const initState = new State(
        new Config(),
        "input",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      // csucc
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(
            new StrictParseError(
              new SourcePos("main", 1, 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            "foo",
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 1, 1, 2),
              "some"
            )
          );
        });
        const parser = _sugar.cont.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(
          Result.csucc(
            new StrictParseError(
              new SourcePos("main", 1, 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            { done: false, value: "foo" },
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 1, 1, 2),
              "some"
            )
          ),
          chai.util.eql
        );
      }
      // cfail
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.cfail(
            new StrictParseError(
              new SourcePos("main", 1, 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            )
          );
        });
        const parser = _sugar.cont.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        ));
      }
      // esucc
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            "foo",
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 0, 1, 1),
              "some"
            )
          );
        });
        const parser = _sugar.cont.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(
          Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            ),
            { done: false, value: "foo" },
            new State(
              new Config(),
              "rest",
              new SourcePos("main", 0, 1, 1),
              "some"
            )
          ),
          chai.util.eql
        );
      }
      // efail
      {
        const p = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.efail(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
            )
          );
        });
        const parser = _sugar.cont.call(p);
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          )
        ));
      }
    }
    // or
    {
      expect(_sugar.or).to.be.a("function");
      const parser = _sugar.or.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // label
    {
      expect(_sugar.label).to.be.a("function");
      const parser = _sugar.label.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // hidden
    {
      expect(_sugar.hidden).to.be.a("function");
      const parser = _sugar.hidden.call(self);
      expect(parser).to.be.a.parser;
    }
    // try
    {
      expect(_sugar.try).to.be.a("function");
      const parser = _sugar.try.call(self);
      expect(parser).to.be.a.parser;
    }
    // lookAhead
    {
      expect(_sugar.lookAhead).to.be.a("function");
      const parser = _sugar.lookAhead.call(self);
      expect(parser).to.be.a.parser;
    }
    // reduceMany
    {
      expect(_sugar.reduceMany).to.be.a("function");
      const parser = _sugar.reduceMany.call(self, (accum, x) => accum, "foo");
      expect(parser).to.be.a.parser;
    }
    // many
    {
      expect(_sugar.many).to.be.a("function");
      const parser = _sugar.many.call(self);
      expect(parser).to.be.a.parser;
    }
    // skipMany
    {
      expect(_sugar.skipMany).to.be.a("function");
      const parser = _sugar.skipMany.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = _sugar.skipMany.call(self);
      expect(parser).to.be.a.parser;
    }
  });
});
