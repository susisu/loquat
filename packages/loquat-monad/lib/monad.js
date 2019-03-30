"use strict";

module.exports = (_core, { _prim }) => {
  const { ParseError, Result, StrictParser } = _core;

  const { map, pure, bind, then, tailRecM, mzero, mplus } = _prim;

  /**
   * forever: [S, U, A, B](parser: Parser[S, U, A]) => Parser[S, U, B]
   */
  function forever(parser) {
    return tailRecM(undefined, acc =>
      map(parser, val => ({ done: false, value: undefined }))
    );
  }

  /**
   * discard: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, undefined]
   */
  function discard(parser) {
    return map(parser, val => undefined);
  }

  /**
   * join: [S, U, A](parser: Parser[S, U, Parser[S, U, A]]) => Parser[S, U, A]
   */
  function join(parser) {
    return bind(parser, val => val);
  }

  /**
   * when: [S, U, A](cond: boolean, parser: Parser[S, U, A]) => Parser[S, U, undefined]
   */
  function when(cond, parser) {
    return cond ? parser : pure(undefined);
  }

  /**
   * unless: [S, U, A](cond: boolean, parser: Parser[S, U, A]) => Parser[S, U, undefined]
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
   *   => Parser[S, U, E]
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
    return parsers.reduceRight((accum, parser) => then(parser, accum), pure(undefined));
  }

  /**
   * mapM: [S, U, A, B](func: A => Parser[S, U, B], arr: Array[A]) => Parser[S, U, Array[B]]
   */
  function mapM(func, arr) {
    return sequence(arr.map(elem => func(elem)));
  }

  /**
   * mapM_: [S, U, A, B](func: A => Parser[S, U, B], arr: Array[A]) => Parser[S, U, undefined]
   */
  function mapM_(func, arr) {
    return sequence_(arr.map(elem => func(elem)));
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
   * zipWith: [A, B, C](func: (A, B) => C, arrA: Array[A], arrB: Array[B]) => Array[C]
   */
  function zipWith(func, arrA, arrB) {
    const res = [];
    const len = Math.min(arrA.length, arrB.length);
    for (let i = 0; i < len; i++) {
      res.push(func(arrA[i], arrB[i]));
    }
    return res;
  }

  /**
   * zipWithM: [S, U, A, B, C](
   *   func: (A, B) => Parser[S, U, C],
   *   arrA: Array[A],
   *   arrB: Array[B]
   * ) => Parser[S, U, Array[C]]
   */
  function zipWithM(func, arrA, arrB) {
    return sequence(zipWith(func, arrA, arrB));
  }

  /**
   * zipWithM: [S, U, A, B, C](
   *   func: (A, B) => Parser[S, U, C],
   *   arrA: Array[A],
   *   arrB: Array[B]
   * ) => Parser[S, U, undefined]
   */
  function zipWithM_(func, arrA, arrB) {
    return sequence_(zipWith(func, arrA, arrB));
  }

  /**
     * @function module:monad.foldM
     * @static
     * @param {function} func
     * @param {*} initVal
     * @param {Array} arr
     * @returns {AbstractParser}
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
     * @function module:monad.foldM_
     * @static
     * @param {function} func
     * @param {*} initVal
     * @param {Array} arr
     * @returns {AbstractParser}
     */
  function foldM_(func, initVal, arr) {
    return then(foldM(func, initVal, arr), pure(undefined));
  }

  /**
     * @function module:monad.replicateM
     * @static
     * @param {number} num
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
  function replicateM(num, parser) {
    return sequence(new Array(num).fill(parser));
  }

  /**
     * @function module:monad.replicateM_
     * @static
     * @param {number} num
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
  function replicateM_(num, parser) {
    return sequence_(new Array(num).fill(parser));
  }

  /**
     * @function module:monad.guard
     * @static
     * @param {boolean} cond
     * @returns {AbstractParser}
     */
  function guard(cond) {
    return cond ? pure(undefined) : mzero;
  }

  /**
     * @function module:monad.msum
     * @static
     * @param {Array.<AbstractParser>} parsers
     * @returns {AbstractParser}
     */
  function msum(parsers) {
    return parsers.reduceRight((accum, parser) => mplus(parser, accum), mzero);
  }

  /**
     * @function module:monad.mfilter
     * @static
     * @param {function} test
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
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
    _internal: {
      zipWith,
    },
  });
};
