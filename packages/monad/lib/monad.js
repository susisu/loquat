"use strict";

module.exports = ($core, { $prim }) => {
  const { ParseError, Result, StrictParser } = $core;
  const { map, pure, bind, then, tailRecM, mzero } = $prim;

  /**
   * forever: [S, U, A, B](parser: Parser[S, U, A]) => Parser[S, U, B]
   */
  function forever(parser) {
    return tailRecM(undefined, _ =>
      map(parser, _ => ({ done: false, value: undefined }))
    );
  }

  /**
   * discard: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, undefined]
   */
  function discard(parser) {
    return map(parser, _ => undefined);
  }

  /**
   * join: [S, U, A](parser: Parser[S, U, Parser[S, U, A]]) => Parser[S, U, A]
   */
  function join(parser) {
    return bind(parser, val => val);
  }

  /**
   * when: [S, U](cond: boolean, parser: Parser[S, U, undefined]) => Parser[S, U, undefined]
   */
  function when(cond, parser) {
    return cond ? parser : pure(undefined);
  }

  /**
   * unless: [S, U](cond: boolean, parser: Parser[S, U, undefined]) => Parser[S, U, undefined]
   */
  function unless(cond, parser) {
    return cond ? pure(undefined) : parser;
  }

  /**
   * liftM: [S, U, A, B](func: A => B) => Parser[S, U, A] => Parser[S, U, B]
   */
  function liftM(func) {
    return parser => bind(parser, val => pure(func(val)));
  }

  /**
   * liftM2: [S, U, A, B, C](
   *   func: (A, B) => C
   * ) => (Parser[S, U, A], Parser[S, U, B]) => Parser[S, U, C]
   */
  function liftM2(func) {
    return (parserA, parserB) =>
      bind(parserA, valA =>
        bind(parserB, valB =>
          pure(func(valA, valB))
        )
      );
  }

  /**
   * liftM3: [S, U, A, B, C, D](
   *   func: (A, B, C) => D
   * ) => (Parser[S, U, A], Parser[S, U, B], Parser[S, U, C]) => Parser[S, U, D]
   */
  function liftM3(func) {
    return (parserA, parserB, parserC) =>
      bind(parserA, valA =>
        bind(parserB, valB =>
          bind(parserC, valC =>
            pure(func(valA, valB, valC))
          )
        )
      );
  }

  /**
   * liftM4: [S, U, A, B, C, D, E](
   *   func: (A, B, C, D) => E
   * ) => (Parser[S, U, A], Parser[S, U, B], Parser[S, U, C], Parser[S, U, D]) => Parser[S, U, E]
   */
  function liftM4(func) {
    return (parserA, parserB, parserC, parserD) =>
      bind(parserA, valA =>
        bind(parserB, valB =>
          bind(parserC, valC =>
            bind(parserD, valD =>
              pure(func(valA, valB, valC, valD))
            )
          )
        )
      );
  }

  /**
   * liftM5: [S, U, A, B, C, D, E, F](
   *   func: (A, B, C, D, E) => F
   * ) => (Parser[S, U, A], Parser[S, U, B], Parser[S, U, C], Parser[S, U, D], Parser[S, U, E])
   *   => Parser[S, U, F]
   */
  function liftM5(func) {
    return (parserA, parserB, parserC, parserD, parserE) =>
      bind(parserA, valA =>
        bind(parserB, valB =>
          bind(parserC, valC =>
            bind(parserD, valD =>
              bind(parserE, valE =>
                pure(func(valA, valB, valC, valD, valE))
              )
            )
          )
        )
      );
  }

  /**
   * ltor: [S, U, A, B, C](
   *   funcA: A => Parser[S, U, B],
   *   funcB: B => Parser[S, U, C]
   * ) => A => Parser[S, U, C]
   */
  function ltor(funcA, funcB) {
    return val => bind(funcA(val), funcB);
  }

  /**
   * rtol: [S, U, A, B, C](
   *   funcA: B => Parser[S, U, C],
   *   funcB: A => Parser[S, U, B]
   * ) => A => Parser[S, U, C]
   */
  function rtol(funcA, funcB) {
    return val => bind(funcB(val), funcA);
  }

  /**
   * sequence: [S, U, A](parsers: Array[Parser[S, U, A]]) => Parser[S, U, Array[A]]
   */
  function sequence(parsers) {
    return new StrictParser(state => {
      const accum = [];
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (const parser of parsers) {
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum.push(res.val);
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum.push(res.val);
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
      }
      return consumed
        ? Result.csucc(currentErr, accum, currentState)
        : Result.esucc(currentErr, accum, currentState);
    });
  }

  /**
   * sequence_: [S, U, A](parsers: Array[Parser[S, U, A]]) => Parser[S, U, undefined]
   */
  function sequence_(parsers) {
    return new StrictParser(state => {
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (const parser of parsers) {
        const res = parser.run(currentState);
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
      }
      return consumed
        ? Result.csucc(currentErr, undefined, currentState)
        : Result.esucc(currentErr, undefined, currentState);
    });
  }

  /**
   * mapM: [S, U, A, B](func: A => Parser[S, U, B], arr: Array[A]) => Parser[S, U, Array[B]]
   */
  function mapM(func, arr) {
    return new StrictParser(state => {
      const accum = [];
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (const elem of arr) {
        const parser = func(elem);
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum.push(res.val);
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum.push(res.val);
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
      }
      return consumed
        ? Result.csucc(currentErr, accum, currentState)
        : Result.esucc(currentErr, accum, currentState);
    });
  }

  /**
   * mapM_: [S, U, A, B](func: A => Parser[S, U, B], arr: Array[A]) => Parser[S, U, undefined]
   */
  function mapM_(func, arr) {
    return new StrictParser(state => {
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (const elem of arr) {
        const parser = func(elem);
        const res = parser.run(currentState);
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
      }
      return consumed
        ? Result.csucc(currentErr, undefined, currentState)
        : Result.esucc(currentErr, undefined, currentState);
    });
  }

  /**
   * forM: [S, U, A, B](arr: Array[A], func: A => Parser[S, U, B]) => Parser[S, U, Array[B]]
   */
  function forM(arr, func) {
    return mapM(func, arr);
  }

  /**
   * forM_: [S, U, A, B](arr: Array[A], func: A => Parser[S, U, B]) => Parser[S, U, undefined]
   */
  function forM_(arr, func) {
    return mapM_(func, arr);
  }

  /**
   * filterM: [S, U, A](test: A => Parser[S, U, boolean], arr: Array[A]) => Parser[S, U, Array[A]]
   */
  function filterM(test, arr) {
    return new StrictParser(state => {
      const accum = [];
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (const elem of arr) {
        const parser = test(elem);
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            if (res.val) {
              accum.push(elem);
            }
            currentState = res.state;
            currentErr = res.err;
          } else {
            if (res.val) {
              accum.push(elem);
            }
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
      }
      return consumed
        ? Result.csucc(currentErr, accum, currentState)
        : Result.esucc(currentErr, accum, currentState);
    });
  }

  /**
   * zipWithM: [S, U, A, B, C](
   *   func: (A, B) => Parser[S, U, C],
   *   arrA: Array[A],
   *   arrB: Array[B]
   * ) => Parser[S, U, Array[C]]
   */
  function zipWithM(func, arrA, arrB) {
    return new StrictParser(state => {
      const accum = [];
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      const len = Math.min(arrA.length, arrB.length);
      for (let i = 0; i < len; i++) {
        const parser = func(arrA[i], arrB[i]);
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum.push(res.val);
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum.push(res.val);
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
      }
      return consumed
        ? Result.csucc(currentErr, accum, currentState)
        : Result.esucc(currentErr, accum, currentState);
    });
  }

  /**
   * zipWithM: [S, U, A, B, C](
   *   func: (A, B) => Parser[S, U, C],
   *   arrA: Array[A],
   *   arrB: Array[B]
   * ) => Parser[S, U, undefined]
   */
  function zipWithM_(func, arrA, arrB) {
    return new StrictParser(state => {
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      const len = Math.min(arrA.length, arrB.length);
      for (let i = 0; i < len; i++) {
        const parser = func(arrA[i], arrB[i]);
        const res = parser.run(currentState);
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
      }
      return consumed
        ? Result.csucc(currentErr, undefined, currentState)
        : Result.esucc(currentErr, undefined, currentState);
    });
  }

  /**
   * foldM: [S, U, A, B](
   *   func: (A, B) => Parser[S, U, A],
   *   initVal: A,
   *   arr: Array[B]
   * ) => Parser[S, U, A]
   */
  function foldM(func, initVal, arr) {
    return new StrictParser(state => {
      let accum = initVal;
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (const elem of arr) {
        const parser = func(accum, elem);
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum = res.val;
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum = res.val;
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
      }
      return consumed
        ? Result.csucc(currentErr, accum, currentState)
        : Result.esucc(currentErr, accum, currentState);
    });
  }

  /**
   * foldM_: [S, U, A, B](
   *   func: (A, B) => Parser[S, U, A],
   *   initVal: A,
   *   arr: Array[B]
   * ) => Parser[S, U, undefined]
   */
  function foldM_(func, initVal, arr) {
    return then(foldM(func, initVal, arr), pure(undefined));
  }

  /**
   * replicateM: [S, U, A](num: int, parser: Parser[S, U, A]) => Parser[S, U, Array[A]]
   */
  function replicateM(num, parser) {
    return new StrictParser(state => {
      const accum = [];
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (let i = 0; i < num; i++) {
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum.push(res.val);
            currentState = res.state;
            currentErr = res.err;
          } else {
            accum.push(res.val);
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
      }
      return consumed
        ? Result.csucc(currentErr, accum, currentState)
        : Result.esucc(currentErr, accum, currentState);
    });
  }

  /**
   * replicateM_: [S, U, A](num: int, parser: Parser[S, U, A]) => Parser[S, U, undefined]
   */
  function replicateM_(num, parser) {
    return new StrictParser(state => {
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      let consumed = false;
      for (let i = 0; i < num; i++) {
        const res = parser.run(currentState);
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
      }
      return consumed
        ? Result.csucc(currentErr, undefined, currentState)
        : Result.esucc(currentErr, undefined, currentState);
    });
  }

  /**
   * guard: [S, U, A](cond: boolean) => Parser[S, U, A]
   */
  function guard(cond) {
    return cond ? pure(undefined) : mzero;
  }

  /**
   * msum: [S, U, A](parsers: Array[Parser[S, U, A]]) => Parser[S, U, A]
   */
  function msum(parsers) {
    return new StrictParser(state => {
      let currentErr = ParseError.unknown(state.pos);
      for (const parser of parsers) {
        const res = parser.run(state);
        if (res.success) {
          return res.consumed
            ? res
            : Result.esucc(ParseError.merge(currentErr, res.err), res.val, res.state);
        } else {
          if (res.consumed) {
            return res;
          } else {
            currentErr = ParseError.merge(currentErr, res.err);
          }
        }
      }
      return Result.efail(currentErr);
    });
  }

  /**
   * mfilter: [S, U, A](test: A => boolean, parser: Parser[S, U, A]) => Parser[S, U, A]
   */
  function mfilter(test, parser) {
    return bind(parser, val => test(val) ? pure(val) : mzero);
  }

  return Object.freeze({
    forever,
    discard,
    join,
    when,
    unless,
    liftM,
    liftM2,
    liftM3,
    liftM4,
    liftM5,
    ltor,
    rtol,
    sequence,
    sequence_,
    mapM,
    mapM_,
    forM,
    forM_,
    filterM,
    zipWithM,
    zipWithM_,
    foldM,
    foldM_,
    replicateM,
    replicateM_,
    guard,
    msum,
    mfilter,
  });
};
