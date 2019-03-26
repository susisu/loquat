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
   * @function module:prim.lookAhead
   * @static
   * @param {AbstractParser} parser
   * @returns {AbstractParser}
   */
  function lookAhead(parser) {
    return new StrictParser(state => {
      const res = parser.run(state);
      return res.success
        ? Result.esuc(ParseError.unknown(state.pos), res.val, state)
        : res;
    });
  }

  /**
   * @function module:prim.reduceMany
   * @static
   * @param {AbstractParser} parser
   * @param {function} callback
   * @param {*} initVal
   * @returns {AbstractParser}
   * @throws {Error} `parser` accepts an empty string.
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
            throw new Error("`many' is applied to a parser that accepts an empty string");
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.csuc(res.err, accum, currentState)
              : Result.esuc(res.err, accum, currentState);
          }
        }
      }
    });
  }

  /**
   * @function module:prim.many
   * @static
   * @param {AbstractParser} parser
   * @returns {AbstractParser}
   * @throws {Error} `parser` accepts an empty string.
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
            throw new Error("`many' is applied to a parser that accepts an empty string");
          }
        } else {
          if (res.consumed) {
            return res;
          } else {
            return consumed
              ? Result.csuc(res.err, accum, currentState)
              : Result.esuc(res.err, accum, currentState);
          }
        }
      }
    });
  }

  /**
   * @function module:prim.skipMany
   * @static
   * @param {AbstractParser} parser
   * @returns {AbstractParser}
   * @throws {Error} `parser` accepts an empty string.
   */
  function skipMany(parser) {
    return reduceMany(parser, accum => accum, undefined);
  }

  /**
   * @function module:prim.tokens
   * @static
   * @param {Array.<*>} expectTokens
   * @param {function} tokenEqual
   * @param {function} tokensToString
   * @param {function} calcNextPos
   * @returns {AbstractParser}
   */
  function tokens(expectTokens, tokenEqual, tokensToString, calcNextPos) {
    function eofError(pos) {
      return new ParseError(
        pos,
        [
          new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
          new ErrorMessage(ErrorMessageType.EXPECT, tokensToString(expectTokens)),
        ]
      );
    }
    function expectError(pos, token) {
      return new ParseError(
        pos,
        [
          new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, tokensToString([token])),
          new ErrorMessage(ErrorMessageType.EXPECT, tokensToString(expectTokens)),
        ]
      );
    }
    return new StrictParser(state => {
      const len = expectTokens.length;
      if (len === 0) {
        return Result.esuc(ParseError.unknown(state.pos), [], state);
      }
      let rest = state.input;
      for (let i = 0; i < len; i++) {
        const unconsed = uncons(rest, state.config.unicode);
        if (unconsed.empty) {
          return i === 0
            ? Result.eerr(eofError(state.pos))
            : Result.cerr(eofError(state.pos));
        } else {
          if (tokenEqual(expectTokens[i], unconsed.head)) {
            rest = unconsed.tail;
          } else {
            return i === 0
              ? Result.eerr(expectError(state.pos, unconsed.head))
              : Result.cerr(expectError(state.pos, unconsed.head));
          }
        }
      }
      const newPos = calcNextPos(state.pos, expectTokens, state.config);
      return Result.csuc(
        ParseError.unknown(newPos),
        expectTokens,
        new State(state.config, rest, newPos, state.userState)
      );
    });
  }

  /**
   * @function module:prim.token
   * @static
   * @param {function} calcValue
   * @param {function} tokenToString
   * @param {function} calcPos
   * @returns {AbstractParser}
   */
  function token(calcValue, tokenToString, calcPos) {
    function calcNextPos(pos, token, rest, config) {
      const unconsed = uncons(rest, config.unicode);
      return unconsed.empty
        ? calcPos(token, config)
        : calcPos(unconsed.head, config);
    }
    return tokenPrim(calcValue, tokenToString, calcNextPos);
  }

  /**
   * @function module:prim.tokenPrim
   * @static
   * @param {function} calcValue
   * @param {function} tokenToString
   * @param {function} calcNextPos
   * @param {function} [calcNextUserState = x => x]
   * @returns {AbstractParser}
   */
  function tokenPrim(calcValue, tokenToString, calcNextPos, calcNextUserState) {
    function systemUnexpectError(pos, str) {
      return new ParseError(
        pos,
        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, str)]
      );
    }
    return new StrictParser(state => {
      const unconsed = uncons(state.input, state.config.unicode);
      if (unconsed.empty) {
        return Result.eerr(systemUnexpectError(state.pos, ""));
      } else {
        const maybeVal = calcValue(unconsed.head, state.config);
        if (maybeVal.empty) {
          return Result.eerr(systemUnexpectError(state.pos, tokenToString(unconsed.head)));
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
          return Result.csuc(
            ParseError.unknown(newPos),
            maybeVal.value,
            new State(state.config, unconsed.tail, newPos, newUserState)
          );
        }
      }
    });
  }

  /**
   * @constant module:prim.getParserState
   * @static
   * @type {AbstractParser}
   */
  const getParserState = new StrictParser(state =>
    Result.esuc(ParseError.unknown(state.pos), state, state)
  );

  /**
   * @function module:prim.setParserState
   * @static
   * @param {State} state
   * @returns {AbstractParser}
   */
  function setParserState(state) {
    return updateParserState(() => state);
  }

  /**
   * @function module:prim.updateParserState
   * @static
   * @param {function} func
   * @returns {AbstractParser}
   */
  function updateParserState(func) {
    return new StrictParser(state => {
      const newState = func(state);
      return Result.esuc(ParseError.unknown(newState.pos), newState, newState);
    });
  }

  /**
   * @constant module:prim.getConfig
   * @static
   * @type {AbstractParser}
   */
  const getConfig = bind(getParserState, state => pure(state.config));

  /**
   * @function module:prim.setConfig
   * @static
   * @param {Config} config
   * @returns {AbstractParser}
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
