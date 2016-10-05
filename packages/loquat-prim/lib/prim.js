/*
 * loquat-prim / prim.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module prim
 */

"use strict";

module.exports = _core => {
    function end() {
        return Object.freeze({
            map,
            pure,
            ap,
            left,
            right,
            bind,
            then,
            fail,
            mzero,
            mplus,
            label,
            labels,
            unexpected,
            tryParse,
            lookAhead,
            reduceMany,
            many,
            skipMany,
            tokens,
            token,
            tokenPrim,
            getState,
            setState,
            updateState,
            getConfig,
            setConfig,
            getInput,
            setInput,
            getPosition,
            setPosition,
            getUserState,
            setUserState
        });
    }

    const ErrorMessageType = _core.ErrorMessageType;
    const ErrorMessage     = _core.ErrorMessage;
    const ParseError       = _core.ParseError;
    const LazyParseError   = _core.LazyParseError;
    const uncons           = _core.uncons;
    const State            = _core.State;
    const Result           = _core.Result;
    const Parser           = _core.Parser;

    /**
     * @function module:prim.map
     * @static
     * @param {AbstractParser} parser
     * @param {function} func
     * @returns {AbstractParser}
     */
    function map(parser, func) {
        return new Parser(state => {
            let res = parser.run(state);
            return res.succeeded
                ? new Result(res.consumed, true, res.err, func(res.val), res.state)
                : res;
        });
    }

    /**
     * @function module:prim.pure
     * @static
     * @param {*} val
     * @returns {AbstractParser}
     */
    function pure(val) {
        return new Parser(state => Result.esuc(ParseError.unknown(state.pos), val, state));
    }

    /**
     * @function module:prim.ap
     * @static
     * @param {AbstractParser} parserA
     * @param {AbstractParser} parserB
     * @returns {AbstractParser}
     */
    function ap(parserA, parserB) {
        return bind(parserA, valA =>
            bind(parserB, valB =>
                pure(valA(valB))
            )
        );
    }

    const former = x => () => x;
    const latter = () => y => y;

    /**
     * @function module:prim.left
     * @static
     * @param {AbstractParser} parserA
     * @param {AbstractParser} parserB
     * @returns {AbstractParser}
     */
    function left(parserA, parserB) {
        return ap(map(parserA, former), parserB);
    }

    /**
     * @function module:prim.right
     * @static
     * @param {AbstractParser} parserA
     * @param {AbstractParser} parserB
     * @returns {AbstractParser}
     */
    function right(parserA, parserB) {
        return ap(map(parserA, latter), parserB);
    }

    /**
     * @function module:prim.bind
     * @static
     * @param {AbstractParser} parser
     * @param {function} func
     * @returns {AbstractParser}
     */
    function bind(parser, func) {
        return new Parser(state => {
            let resA = parser.run(state);
            if (resA.succeeded) {
                let parserB = func(resA.val);
                let resB = parserB.run(resA.state);
                return new Result(
                    resA.consumed || resB.consumed,
                    resB.succeeded,
                    resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
                    resB.val,
                    resB.state
                );
            }
            else {
                return resA;
            }
        });
    }

    /**
     * @function module:prim.then
     * @static
     * @param {AbstractParser} parserA
     * @param {AbstractParser} parserB
     * @returns {AbstracParser}
     */
    function then(parserA, parserB) {
        return bind(parserA, () => parserB);
    }

    /**
     * @function module:prim.fail
     * @static
     * @param {string} msgStr
     * @returns {AbstractParser}
     */
    function fail(msgStr) {
        return new Parser(state => Result.eerr(
            new ParseError(state.pos, [new ErrorMessage(ErrorMessageType.MESSAGE, msgStr)])
        ));
    }

    /**
     * @constant module:prim.mzero
     * @static
     * @type {AbstractParser}
     */
    const mzero = new Parser(state => Result.eerr(ParseError.unknown(state.pos)));

    /**
     * @function module:prim.mplus
     * @static
     * @param {AbstractParser} parserA
     * @param {AbstractParser} parserB
     * @returns {AbstractParser}
     */
    function mplus(parserA, parserB) {
        return new Parser(state => {
            let resA = parserA.run(state);
            if (!resA.consumed && !resA.succeeded) {
                let resB = parserB.run(state);
                return new Result(
                    resB.consumed,
                    resB.succeeded,
                    resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
                    resB.val,
                    resB.state
                );
            }
            else {
                return resA;
            }
        });
    }

    /**
     * @function module:prim.label
     * @static
     * @param {AbstractParser} parser
     * @param {string} labelStr
     * @returns {AbstractParser}
     */
    function label(parser, labelStr) {
        return labels(parser, [labelStr]);
    }

    /**
     * @function module:prim.labels
     * @static
     * @param {AbstractParser} parser
     * @param {Array.<string>} labelStrs
     * @returns {AbstractParser}
     */
    function labels(parser, labelStrs) {
        function setExpects(err) {
            return err.setSpecificTypeMessages(ErrorMessageType.EXPECT, labelStrs.length === 0 ? [""] : labelStrs);
        }
        return new Parser(state => {
            let res = parser.run(state);
            if (res.consumed) {
                return res;
            }
            else {
                let err = res.err;
                return new Result(
                    false,
                    res.succeeded,
                    res.succeeded
                        ? new LazyParseError(() => err.isUnknown() ? err : setExpects(err))
                        : setExpects(err),
                    res.val,
                    res.state
                );
            }
        });
    }

    /**
     * @function module:prim.unexpected
     * @static
     * @param {string} msgStr
     * @returns {AbstractParser}
     */
    function unexpected(msgStr) {
        return new Parser(state => Result.eerr(
            new ParseError(
                state.pos,
                [new ErrorMessage(ErrorMessageType.UNEXPECT, msgStr)]
            )
        ));
    }

    /**
     * @function module:prim.tryParse
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function tryParse(parser) {
        return new Parser(state => {
            let res = parser.run(state);
            return res.consumed && !res.succeeded
                ? Result.eerr(res.err)
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
        return new Parser(state => {
            let res = parser.run(state);
            return res.succeeded
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
        return new Parser(state => {
            let accum = initVal;
            let consumed = false;
            let currentState = state;
            while (true) {
                let res = parser.run(currentState);
                if (res.succeeded) {
                    if (res.consumed) {
                        consumed = true;
                        accum = callback(accum, res.val);
                        currentState = res.state;
                    }
                    else {
                        throw new Error("'many' is applied to a parser that accepts an empty string");
                    }
                }
                else {
                    if (res.consumed) {
                        return res;
                    }
                    else {
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
        return reduceMany(parser, (accum, val) => { accum.push(val); return accum; }, []);
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
                    new ErrorMessage(ErrorMessageType.EXPECT, tokensToString(expectTokens))
                ]
            );
        }
        function expectError(pos, token) {
            return new ParseError(
                pos,
                [
                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, tokensToString([token])),
                    new ErrorMessage(ErrorMessageType.EXPECT, tokensToString(expectTokens))
                ]
            );
        }
        return new Parser(state => {
            let len = expectTokens.length;
            if (len === 0) {
                return Result.esuc(ParseError.unknown(state.pos), [], state);
            }
            let rest = state.input;
            for (let i = 0; i < len; i++) {
                let unconsed = uncons(rest);
                if (unconsed.empty) {
                    return i === 0
                        ? Result.eerr(eofError(state.pos))
                        : Result.cerr(eofError(state.pos));
                }
                else {
                    if (tokenEqual(expectTokens[i], unconsed.head)) {
                        rest = unconsed.tail;
                    }
                    else {
                        return i === 0
                            ? Result.eerr(expectError(state.pos, unconsed.head))
                            : Result.cerr(expectError(state.pos, unconsed.head));
                    }
                }
            }
            let newPos = calcNextPos(state.pos, expectTokens);
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
        function calcNextPos(pos, token, rest) {
            let unconsed = uncons(rest);
            return unconsed.empty
                ? calcPos(token)
                : calcPos(unconsed.head);
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
        return new Parser(state => {
            let unconsed = uncons(state.input);
            if (unconsed.empty) {
                return Result.eerr(systemUnexpectError(state.pos, ""));
            }
            else {
                let maybeVal = calcValue(unconsed.head);
                if (maybeVal.empty) {
                    return Result.eerr(systemUnexpectError(state.pos, tokenToString(unconsed.head)));
                }
                else {
                    let newPos = calcNextPos(state.pos, unconsed.head, unconsed.tail);
                    let newUserState = calcNextUserState === undefined
                        ? state.userState
                        : calcNextUserState(state.userState, state.pos, unconsed.head, unconsed.tail);
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
     * @constant module:prim.getState
     * @static
     * @type {AbstractParser}
     */
    const getState = new Parser(state => Result.esuc(ParseError.unknown(state.pos), state, state));

    /**
     * @function module:prim.setState
     * @static
     * @param {State} state
     * @returns {AbstractParser}
     */
    function setState(state) {
        return updateState(() => state);
    }

    /**
     * @function module:prim.updateState
     * @static
     * @param {function} func
     * @returns {AbstractParser}
     */
    function updateState(func) {
        return new Parser(state => {
            let newState = func(state);
            return Result.esuc(ParseError.unknown(newState.pos), newState, newState);
        });
    }

    /**
     * @constant module:prim.getConfig
     * @static
     * @type {AbstractParser}
     */
    const getConfig = bind(getState, state => pure(state.config));

    /**
     * @function module:prim.setConfig
     * @static
     * @param {Config} config
     * @returns {AbstractParser}
     */
    function setConfig(config) {
        return then(
            updateState(state => state.setConfig(config)),
            pure(undefined)
        );
    }

    /**
     * @constant module:prim.getInput
     * @static
     * @type {AbstractParser}
     */
    const getInput = bind(getState, state => pure(state.input));

    /**
     * @function module:prim.setInput
     * @static
     * @param {(string|Array|IStream)} input
     * @returns {AbstractParser}
     */
    function setInput(input) {
        return then(
            updateState(state => state.setInput(input)),
            pure(undefined)
        );
    }

    /**
     * @constant module:prim.getPosition
     * @static
     * @type {AbstractParser}
     */
    const getPosition = bind(getState, state => pure(state.pos));

    /**
     * @function module:prim.setPosition
     * @static
     * @param {SourcePos} pos
     * @returns {AbstractParser}
     */
    function setPosition(pos) {
        return then(
            updateState(state => state.setPosition(pos)),
            pure(undefined)
        );
    }

    /**
     * @constant module:prim.getUserState
     * @static
     * @type {AbstractParser}
     */
    const getUserState = bind(getState, state => pure(state.userState));

    /**
     * @function module:prim.setUserState
     * @static
     * @param {*} userState
     * @returns {AbstractParser}
     */
    function setUserState(userState) {
        return then(
            updateState(state => state.setUserState(userState)),
            pure(undefined)
        );
    }

    return end();
};
