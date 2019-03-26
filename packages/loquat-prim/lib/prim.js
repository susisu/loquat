"use strict";

module.exports = _core => {
  const {
    ErrorMessageType,
    ErrorMessage,
    ParseError,
    StrictParseError,
    LazyParseError,
    State,
    Result,
    StrictParser,
    uncons,
  } = _core;

  /**
   * map: [S, U, A, B](parser: Parser[S, U, A], func: A => B): Parser[S, U, B]
   */
  function map(parser, func) {
    return new StrictParser(state => {
      const res = parser.run(state);
      return res.success
        ? Result.succ(res.consumed, res.err, func(res.val), res.state)
        : res;
    });
  }

  /**
   * fmap: [S, U, A, B](func: A => B): Parser[S, U, A] => Parser[S, U, B]
   */
  function fmap(func) {
    return parser => map(parser, func);
  }

  /**
   * pure: [S, U, A](val: A): Parser[S, U, A]
   */
  function pure(val) {
    return new StrictParser(state => Result.esucc(ParseError.unknown(state.pos), val, state));
  }

  /**
   * ap: [S, U, A, B](parserA: Parser[S, U, A => B], parserB: Parser[S, U, A]): Parser[S, U, B]
   */
  function ap(parserA, parserB) {
    return new StrictParser(state => {
      const resA = parserA.run(state);
      if (resA.success) {
        const func = resA.val;
        const resB = parserB.run(resA.state);
        if (resB.success) {
          return Result.succ(
            resA.consumed || resB.consumed,
            resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
            func(resB.val),
            resB.state
          );
        } else {
          return Result.fail(
            resA.consumed || resB.consumed,
            resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err)
          );
        }
      } else {
        return resA;
      }
    });
  }

  /**
   * left: [S, U, A, B](parserA: Parser[S, U, A], parserB: Parser[S, U, B]): Parser[S, U, A]
   */
  function left(parserA, parserB) {
    return new StrictParser(state => {
      const resA = parserA.run(state);
      if (resA.success) {
        const resB = parserB.run(resA.state);
        if (resB.success) {
          return Result.succ(
            resA.consumed || resB.consumed,
            resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
            resA.val,
            resB.state
          );
        } else {
          return Result.fail(
            resA.consumed || resB.consumed,
            resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err)
          );
        }
      } else {
        return resA;
      }
    });
  }

  /**
   * right: [S, U, A, B](parserA: Parser[S, U, A], parserB: Parser[S, U, B]): Parser[S, U, B]
   */
  function right(parserA, parserB) {
    return new StrictParser(state => {
      const resA = parserA.run(state);
      if (resA.success) {
        const resB = parserB.run(resA.state);
        if (resB.success) {
          return Result.succ(
            resA.consumed || resB.consumed,
            resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
            resB.val,
            resB.state
          );
        } else {
          return Result.fail(
            resA.consumed || resB.consumed,
            resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err)
          );
        }
      } else {
        return resA;
      }
    });
  }

  /**
   * bind: [S, U, A, B](parser: Parser[S, U, A], func: A => Parser[S, U, B]): Parser[S, U, B]
   */
  function bind(parser, func) {
    return new StrictParser(state => {
      const resA = parser.run(state);
      if (resA.success) {
        const parserB = func(resA.val);
        const resB = parserB.run(resA.state);
        if (resB.success) {
          return resB.consumed
            ? resB
            : Result.succ(
              resA.consumed,
              ParseError.merge(resA.err, resB.err),
              resB.val,
              resB.state
            );
        } else {
          return resB.consumed
            ? resB
            : Result.fail(
              resA.consumed,
              ParseError.merge(resA.err, resB.err)
            );
        }
      } else {
        return resA;
      }
    });
  }

  /**
   * then: [S, U, A, B](parserA: Parser[S, U, A], parserB: Parser[S, U, B]): Parser[S, U, B]
   */
  function then(parserA, parserB) {
    return new StrictParser(state => {
      const resA = parserA.run(state);
      if (resA.success) {
        const resB = parserB.run(resA.state);
        if (resB.success) {
          return resB.consumed
            ? resB
            : Result.succ(
              resA.consumed,
              ParseError.merge(resA.err, resB.err),
              resB.val,
              resB.state
            );
        } else {
          return resB.consumed
            ? resB
            : Result.fail(
              resA.consumed,
              ParseError.merge(resA.err, resB.err)
            );
        }
      } else {
        return resA;
      }
    });
  }

  /**
   * fail: [S, U, A](str: string) => Parser[S, U, A]
   */
  function fail(str) {
    return new StrictParser(state =>
      Result.efail(
        new StrictParseError(state.pos, [ErrorMessage.create(ErrorMessageType.MESSAGE, str)])
      )
    );
  }

  /**
   * type Cont[A, B] = { done: false, value: A } \/ { done: true, value: B }
   */

  /**
   * tailRecM: [S, U, A, B](initVal: A, func: A => Parser[S, U, Cont[A, B]]) => Parser[S, U, B]
   */
  function tailRecM(initVal, func) {
    return new StrictParser(state => {
      let consumed = false;
      let currentVal = initVal;
      let currentState = state;
      let currentErr = ParseError.unknown(state.pos);
      while (true) {
        const parser = func(currentVal);
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            if (res.val.done) {
              return Result.csucc(res.err, res.val.value, res.state);
            } else {
              consumed = true;
              currentVal = res.val.value;
              currentState = res.state;
              currentErr = res.err;
            }
          } else {
            if (res.val.done) {
              return Result.succ(
                consumed,
                ParseError.merge(currentErr, res.err),
                res.val.value,
                res.state
              );
            } else {
              currentVal = res.val.value;
              currentState = res.state;
              currentErr = ParseError.merge(currentErr, res.err);
            }
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return Result.fail(consumed, ParseError.merge(currentErr, res.err));
          }
        }
      }
    });
  }

  /**
   * ftailRecM: [S, U, A, B](func: A => Parser[S, U, Cont[A, B]]) => (initVal: A) => Parser[S, U, B]
   */
  function ftailRecM(func) {
    return initVal => tailRecM(initVal, func);
  }

  /**
   * mzero: [S, U, A]Parser[S, U, A]
   */
  const mzero = new StrictParser(state => Result.efail(ParseError.unknown(state.pos)));

  /**
   * mplus: [S, U, A, B](parserA: Parser[S, U, A], parserB: Parser[S, U, B]) => Parser[S, U, A \/ B]
   */
  function mplus(parserA, parserB) {
    return new StrictParser(state => {
      const resA = parserA.run(state);
      if (!resA.success && !resA.consumed) {
        const resB = parserB.run(state);
        if (resB.success) {
          return resB.consumed
            ? resB
            : Result.esucc(
              ParseError.merge(resA.err, resB.err),
              resB.val,
              resB.state
            );
        } else {
          return resB.consumed
            ? resB
            : Result.efail(
              ParseError.merge(resA.err, resB.err)
            );
        }
      } else {
        return resA;
      }
    });
  }

  /**
   * label: [S, U, A](parser: Parser[S, U, A], str: string) => Parser[S, U, A]
   */
  function label(parser, str) {
    return labels(parser, [str]);
  }

  /**
   * labels: [S, U, A](parser: Parser[S, U, A], strs: string[]) => Parser[S, U, A]
   */
  function labels(parser, strs) {
    function setExpects(err) {
      return err.setSpecificTypeMessages(
        ErrorMessageType.EXPECT,
        strs.length === 0 ? [""] : strs
      );
    }
    return new StrictParser(state => {
      const res = parser.run(state);
      if (res.success) {
        return res.consumed
          ? res
          : Result.esucc(
            new LazyParseError(() => res.err.isUnknown() ? res.err : setExpects(res.err)),
            res.val,
            res.state
          );
      } else {
        return res.consumed
          ? res
          : Result.efail(setExpects(res.err));
      }
    });
  }

  /**
   * hidden: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, A]
   */
  function hidden(parser) {
    return label(parser, "");
  }

  /**
   * unexpected: [S, U, A](str: string) => Parser[S, U, A]
   */
  function unexpected(str) {
    return new StrictParser(state =>
      Result.efail(
        new StrictParseError(state.pos, [ErrorMessage.create(ErrorMessageType.UNEXPECT, str)])
      )
    );
  }

  /**
   * tryParse: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, A]
   */
  function tryParse(parser) {
    return new StrictParser(state => {
      const res = parser.run(state);
      return !res.success && res.consumed
        ? Result.efail(res.err)
        : res;
    });
  }

  /**
   * lookAhead: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, A]
   */
  function lookAhead(parser) {
    return new StrictParser(state => {
      const res = parser.run(state);
      return res.success
        ? Result.esucc(ParseError.unknown(state.pos), res.val, state)
        : res;
    });
  }

  /**
   * reduceMany: [S, U, A, B](
   *   parser: Parser[S, U, A],
   *   callback: (B, A) => B,
   *   initVal: B
   * ) => Parser[S, U, B]
   */
  function reduceMany(parser, callback, initVal) {
    return new StrictParser(state => {
      let accum = initVal;
      let consumed = false;
      let currentState = state;
      while (true) {
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum = callback(accum, res.val);
            currentState = res.state;
          } else {
            throw new Error("`many` is applied to a parser that accepts an empty string");
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.csucc(res.err, accum, currentState)
              : Result.esucc(res.err, accum, currentState);
          }
        }
      }
    });
  }

  /**
   * many: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, Array[A]]
   */
  function many(parser) {
    return new StrictParser(state => {
      const accum = [];
      let consumed = false;
      let currentState = state;
      while (true) {
        const res = parser.run(currentState);
        if (res.success) {
          if (res.consumed) {
            consumed = true;
            accum.push(res.val);
            currentState = res.state;
          } else {
            throw new Error("`many` is applied to a parser that accepts an empty string");
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.csucc(res.err, accum, currentState)
              : Result.esucc(res.err, accum, currentState);
          }
        }
      }
    });
  }

  /**
   * skipMany: [S, U, A](parser: Parser[S, U, A]) => Parser[S, U, undefined]
   */
  function skipMany(parser) {
    return reduceMany(parser, accum => accum, undefined);
  }

  /**
   * tokens: [S <: Stream[S], U](
   *   expectTokens: Array[S#Token],
   *   tokenEqual: (S#Token, S#Token) => boolean,
   *   tokensToString: Array[S#Token] => string
   *   calcNextPos: (SourcePos, Array[S#Token], Config) => SourcePos
   *  ): Parser[S, U, Array[S#Token]]
   */
  function tokens(expectTokens, tokenEqual, tokensToString, calcNextPos) {
    function eofError(pos) {
      return new StrictParseError(
        pos,
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
          ErrorMessage.create(ErrorMessageType.EXPECT, tokensToString(expectTokens)),
        ]
      );
    }
    function expectError(pos, token) {
      return new StrictParseError(
        pos,
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, tokensToString([token])),
          ErrorMessage.create(ErrorMessageType.EXPECT, tokensToString(expectTokens)),
        ]
      );
    }
    return new StrictParser(state => {
      const len = expectTokens.length;
      if (len === 0) {
        return Result.esucc(ParseError.unknown(state.pos), [], state);
      }
      let rest = state.input;
      for (let i = 0; i < len; i++) {
        const unconsed = uncons(rest, state.config);
        if (unconsed.empty) {
          return i === 0
            ? Result.efail(eofError(state.pos))
            : Result.cfail(eofError(state.pos));
        } else {
          if (tokenEqual(expectTokens[i], unconsed.head)) {
            rest = unconsed.tail;
          } else {
            return i === 0
              ? Result.efail(expectError(state.pos, unconsed.head))
              : Result.cfail(expectError(state.pos, unconsed.head));
          }
        }
      }
      const newPos = calcNextPos(state.pos, expectTokens, state.config);
      return Result.csucc(
        ParseError.unknown(newPos),
        expectTokens,
        new State(state.config, rest, newPos, state.userState)
      );
    });
  }

  /**
   * type Option[A] = { empty: true } \/ { empty: false, value: A }
   */

  /**
   * token: [S <: Stream[S], U, A](
   *   calcValue: (S#Token, Config) => Option[A],
   *   tokenToString: S#Token => string,
   *   calcPos: (S#Token, COnfig) => SourcePos
   * ) => Parser[S, U, A]
   */
  function token(calcValue, tokenToString, calcPos) {
    function calcNextPos(pos, token, rest, config) {
      const unconsed = uncons(rest, config);
      return unconsed.empty
        ? calcPos(token, config)
        : calcPos(unconsed.head, config);
    }
    return tokenPrim(calcValue, tokenToString, calcNextPos);
  }

  /**
   * tokenPrim: [S <: Stream[S], U, A](
   *   calcValue: (S#Token, Config) => A,
   *   tokenToString: S#Token => string,
   *   calcNextPos: (SourcePos, S#Token, S, Config) => SourcePos,
   *   calcNextUserState?: (U, SourcePos, S#Token, S, Config) => U
   * ) => Parser[S, U, A]
   */
  function tokenPrim(calcValue, tokenToString, calcNextPos, calcNextUserState) {
    function systemUnexpectError(pos, str) {
      return new StrictParseError(
        pos,
        [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, str)]
      );
    }
    return new StrictParser(state => {
      const unconsed = uncons(state.input, state.config);
      if (unconsed.empty) {
        return Result.efail(systemUnexpectError(state.pos, ""));
      } else {
        const maybeVal = calcValue(unconsed.head, state.config);
        if (maybeVal.empty) {
          return Result.efail(systemUnexpectError(state.pos, tokenToString(unconsed.head)));
        } else {
          const newPos = calcNextPos(state.pos, unconsed.head, unconsed.tail, state.config);
          const newUserState = calcNextUserState === undefined
            ? state.userState
            : calcNextUserState(
              state.userState,
              state.pos,
              unconsed.head,
              unconsed.tail,
              state.config
            );
          return Result.csucc(
            ParseError.unknown(newPos),
            maybeVal.value,
            new State(state.config, unconsed.tail, newPos, newUserState)
          );
        }
      }
    });
  }

  /**
   * getParserState: [S, U]Parser[S, U, State[S, U]]
   */
  const getParserState = new StrictParser(state =>
    Result.esucc(ParseError.unknown(state.pos), state, state)
  );

  /**
   * setParserState: [S, U](state: State[S, U]) => Parser[S, U, State[S, U]]
   */
  function setParserState(state) {
    return updateParserState(() => state);
  }

  /**
   * updateParserState: [S, U](func: State[S, U] => State[S, U]) => Parser[S, U, State[S, U]]
   */
  function updateParserState(func) {
    return new StrictParser(state => {
      const newState = func(state);
      return Result.esucc(ParseError.unknown(newState.pos), newState, newState);
    });
  }

  /**
   * getConfig: [S, U]Parser[S, U, Config]
   */
  const getConfig = bind(getParserState, state => pure(state.config));

  /**
   * setConfig: [S, U](config: Config) => Parser[S, U, undefined]
   */
  function setConfig(config) {
    return then(
      updateParserState(state => state.setConfig(config)),
      pure(undefined)
    );
  }

  /**
   * @constant module:prim.getInput
   * @static
   * @type {AbstractParser}
   */
  const getInput = bind(getParserState, state => pure(state.input));

  /**
   * @function module:prim.setInput
   * @static
   * @param {(string|Array|IStream)} input
   * @returns {AbstractParser}
   */
  function setInput(input) {
    return then(
      updateParserState(state => state.setInput(input)),
      pure(undefined)
    );
  }

  /**
   * @constant module:prim.getPosition
   * @static
   * @type {AbstractParser}
   */
  const getPosition = bind(getParserState, state => pure(state.pos));

  /**
   * @function module:prim.setPosition
   * @static
   * @param {SourcePos} pos
   * @returns {AbstractParser}
   */
  function setPosition(pos) {
    return then(
      updateParserState(state => state.setPosition(pos)),
      pure(undefined)
    );
  }

  /**
   * @constant module:prim.getState
   * @static
   * @type {AbstractParser}
   */
  const getState = bind(getParserState, state => pure(state.userState));

  /**
   * @function module:prim.setState
   * @static
   * @param {*} userState
   * @returns {AbstractParser}
   */
  function setState(userState) {
    return then(
      updateParserState(state => state.setUserState(userState)),
      pure(undefined)
    );
  }

  return Object.freeze({
    map,
    fmap,
    pure,
    ap,
    left,
    right,
    bind,
    then,
    fail,
    tailRecM,
    ftailRecM,
    mzero,
    mplus,
    label,
    labels,
    hidden,
    unexpected,
    tryParse,
    lookAhead,
    reduceMany,
    many,
    skipMany,
    tokens,
    token,
    tokenPrim,
    getParserState,
    setParserState,
    updateParserState,
    getConfig,
    setConfig,
    getInput,
    setInput,
    getPosition,
    setPosition,
    getState,
    setState,
  });
};
