"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = _error;

describe("#eval", () => {
  it("should evaluate the thunk then return a fully evaluated `ParseError`", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    {
      const err = new LazyParseError(() => new ParseError(pos, msgs));
      const res = err.eval();
      expect(res).to.be.an.instanceOf(ParseError);
      expect(SourcePos.equal(res.pos, pos)).to.be.true;
      expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
    }
    // a multiply-nested LazyParseError object is also evaluated to a ParseError object
    {
      const err = new LazyParseError(() =>
        new LazyParseError(() =>
          new ParseError(pos, msgs)
        )
      );
      const res = err.eval();
      expect(res).to.be.an.instanceOf(ParseError);
      expect(SourcePos.equal(res.pos, pos)).to.be.true;
      expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
    }
  });

  it("should cache the evaluated result and return it if called next time", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    {
      let evalCount = 0;
      const err = new LazyParseError(() => {
        evalCount += 1;
        return new ParseError(pos, msgs);
      });
      const resA = err.eval();
      const resB = err.eval();
      // the cached result is returned
      expect(evalCount).to.equal(1);
      expect(ParseError.equal(resA, resB)).to.be.true;
    }
    // all LazyParseError objects are evaluated only once
    {
      let intermediateEvalCount = 0;
      let evalCount = 0;
      const err = new LazyParseError(() => {
        evalCount += 1;
        return new LazyParseError(() => {
          intermediateEvalCount += 1;
          return new ParseError(pos, msgs);
        });
      });
      const resA = err.eval();
      const resB = err.eval();
      expect(intermediateEvalCount).to.equal(1);
      expect(evalCount).to.equal(1);
      expect(ParseError.equal(resA, resB)).to.be.true;
    }
    {
      let intermediateEvalCount = 0;
      const intermediateErr = new LazyParseError(() => {
        intermediateEvalCount += 1;
        return new ParseError(pos, msgs);
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
      expect(ParseError.equal(resA, resB)).to.be.true;
      expect(ParseError.equal(resA, intermediateRes)).to.be.true;
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

  it("should throw a `TypeError` if the final result is not a `ParseError` object", () => {
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
        }).to.throw(TypeError, /evaluation result is not a ParseError obejct/i);
      }
      {
        const err = new LazyParseError(() => new LazyParseError(() => res));
        expect(() => {
          err.eval();
        }).to.throw(TypeError, /evaluation result is not a ParseError obejct/i);
      }
    }
  });
});
