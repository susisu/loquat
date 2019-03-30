"use strict";

module.exports = _core => {
  const { ParseError, Result, StrictParser, isParser } = _core;

  /**
   * qo: [S, U, A](genFunc: () => Generator) => Parser[S, U, A]
   */
  function qo(genFunc) {
    return new StrictParser(state => {
      const gen = genFunc();

      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;

      let genRes;
      try {
        genRes = gen.next();
      } catch (err) {
        if (isParser(err)) {
          const errRes = err.run(currentState);
          if (errRes.success) {
            return errRes.consumed
              ? Result.cfail(errRes.err)
              : Result.efail(ParseError.merge(currentErr, errRes.err));
          } else {
            return errRes.consumed
              ? errRes
              : Result.efail(ParseError.merge(currentErr, errRes.err));
          }
        } else {
          throw err;
        }
      }

      while (!genRes.done) {
        const res = genRes.value.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            currentState = res.state;
            currentErr = res.err;
          } else {
            currentState = res.state;
            currentErr = ParseError.merge(currentErr, res.err);
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.cfail(ParseError.merge(currentErr, res.err))
              : Result.efail(ParseError.merge(currentErr, res.err));
          }
        }

        try {
          genRes = gen.next(res.val);
        } catch (err) {
          if (isParser(err)) {
            const errRes = err.run(currentState);
            if (errRes.success) {
              return errRes.consumed
                ? Result.cfail(errRes.err)
                : Result.efail(ParseError.merge(currentErr, errRes.err));
            } else {
              return errRes.consumed
                ? errRes
                : Result.efail(ParseError.merge(currentErr, errRes.err));
            }
          } else {
            throw err;
          }
        }
      }

      return consumed
        ? Result.csucc(currentErr, genRes.value, currentState)
        : Result.esucc(currentErr, genRes.value, currentState);
    });
  }

  return Object.freeze({
    qo,
  });
};
