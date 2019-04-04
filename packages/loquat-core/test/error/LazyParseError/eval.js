"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _error;

describe("#eval", () => {
  it("should evaluate the thunk then return a fully evaluated `StrictParseError`", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    {
      const err = new LazyParseError(() => new StrictParseError(pos, msgs));
      const res = err.eval();
      expect(res).to.be.an.instanceOf(StrictParseError);
      expect(SourcePos.equal(res.pos, pos)).to.be.true;
      expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
    }
    // a multiply-nested LazyParseError object is also evaluated to a StrictParseError object
    {
      const err = new LazyParseError(() =>
        new LazyParseError(() =>
          new StrictParseError(pos, msgs)
        )
      );
      const res = err.eval();
      expect(res).to.be.an.instanceOf(StrictParseError);
      expect(SourcePos.equal(res.pos, pos)).to.be.true;
      expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
    }
  });

  it("should cache the evaluated result and return it if called next time", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    {
      let evalCount = 0;
      const err = new LazyParseError(() => {
        evalCount += 1;
        return new StrictParseError(pos, msgs);
      });
      const resA = err.eval();
      const resB = err.eval();
      // the cached result is returned
      expect(evalCount).to.equal(1);
      expect(resA).to.be.an.equalErrorTo(resB);
    }
    // all LazyParseError objects are evaluated only once
    {
      let intermediateEvalCount = 0;
      let evalCount = 0;
      const err = new LazyParseError(() => {
        evalCount += 1;
        return new LazyParseError(() => {
          intermediateEvalCount += 1;
          return new StrictParseError(pos, msgs);
        });
      });
      const resA = err.eval();
      const resB = err.eval();
      expect(intermediateEvalCount).to.equal(1);
      expect(evalCount).to.equal(1);
      expect(resA).to.be.an.equalErrorTo(resB);
    }
    {
      let intermediateEvalCount = 0;
      const intermediateErr = new LazyParseError(() => {
        intermediateEvalCount += 1;
        return new StrictParseError(pos, msgs);
      });
      let evalCount = 0;
      const err = new LazyParseError(() => {
        evalCount += 1;
        return intermediateErr;
      });
      // evaluate intermediate one first
      const intermediateRes = intermediateErr.eval();
      const resA = err.eval();
      const resB = err.eval();
      expect(intermediateEvalCount).to.equal(1);
      expect(evalCount).to.equal(1);
      expect(resA).to.be.an.equalErrorTo(resB);
      expect(resA).to.be.an.equalErrorTo(intermediateRes);
    }
  });

  it("should throw `TypeError` if invalid thunk found in the evaluation", () => {
    const invalidThunks = [
      null,
      undefined,
      "foo",
      42,
      true,
      {},
    ];
    for (const thunk of invalidThunks) {
      {
        const err = new LazyParseError(thunk);
        expect(() => { err.eval(); }).to.throw(TypeError);
      }
      {
        const err = new LazyParseError(() => new LazyParseError(thunk));
        expect(() => { err.eval(); }).to.throw(TypeError, /thunk is not a function/i);
      }
    }
  });

  it("should throw a `TypeError` if the final result is not a `StrictParseError` object", () => {
    const invalidResults = [
      null,
      undefined,
      "foo",
      42,
      true,
      {},
      () => {},
    ];
    for (const res of invalidResults) {
      {
        const err = new LazyParseError(() => res);
        expect(() => {
          err.eval();
        }).to.throw(TypeError, /evaluation result is not a StrictParseError obejct/i);
      }
      {
        const err = new LazyParseError(() => new LazyParseError(() => res));
        expect(() => {
          err.eval();
        }).to.throw(TypeError, /evaluation result is not a StrictParseError obejct/i);
      }
    }
  });
});
