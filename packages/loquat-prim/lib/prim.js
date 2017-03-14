/*
 * loquat-prim / prim.js
 */

/**
 * @module prim
 */

"use strict";

module.exports = _core => {
    function end() {
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
            setState
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
            const res = parser.run(state);
            return res.success
                ? new Result(res.consumed, true, res.err, func(res.val), res.state)
                : res;
        });
    }

    /**
     * @function module:prim.fmap
     * @static
     * @param {function} func
     * @returns {function}
     */
    function fmap(func) {
        return parser => map(parser, func);
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
        return new Parser(state => {
            const resA = parserA.run(state);
            if (resA.success) {
                const func = resA.val;
                const resB = parserB.run(resA.state);
                if (resB.success) {
                    return new Result(
                        resA.consumed || resB.consumed,
                        true,
                        resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
                        func(resB.val),
                        resB.state
                    );
                }
                else {
                    return new Result(
                        resA.consumed || resB.consumed,
                        false,
                        resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err)
                    );
                }
            }
            else {
                return resA;
            }
        });
    }

    /**
     * @function module:prim.left
     * @static
     * @param {AbstractParser} parserA
     * @param {AbstractParser} parserB
     * @returns {AbstractParser}
     */
    function left(parserA, parserB) {
        return new Parser(state => {
            const resA = parserA.run(state);
            if (resA.success) {
                const resB = parserB.run(resA.state);
                if (resB.success) {
                    return new Result(
                        resA.consumed || resB.consumed,
                        true,
                        resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
                        resA.val,
                        resB.state
                    );
                }
                else {
                    return new Result(
                        resA.consumed || resB.consumed,
                        false,
                        resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err)
                    );
                }
            }
            else {
                return resA;
            }
        });
    }

    /**
     * @function module:prim.right
     * @static
     * @param {AbstractParser} parserA
     * @param {AbstractParser} parserB
     * @returns {AbstractParser}
     */
    function right(parserA, parserB) {
        return new Parser(state => {
            const resA = parserA.run(state);
            if (resA.success) {
                const resB = parserB.run(resA.state);
                if (resB.success) {
                    return new Result(
                        resA.consumed || resB.consumed,
                        true,
                        resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err),
                        resB.val,
                        resB.state
                    );
                }
                else {
                    return new Result(
                        resA.consumed || resB.consumed,
                        false,
                        resB.consumed ? resB.err : ParseError.merge(resA.err, resB.err)
                    );
                }
            }
            else {
                return resA;
            }
        });
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
            const resA = parser.run(state);
            if (resA.success) {
                const parserB = func(resA.val);
                const resB = parserB.run(resA.state);
                return resB.consumed
                    ? resB
                    : new Result(
                        resA.consumed,
                        resB.success,
                        ParseError.merge(resA.err, resB.err),
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
        return new Parser(state => {
            const resA = parserA.run(state);
            if (resA.success) {
                const resB = parserB.run(resA.state);
                return resB.consumed
                    ? resB
                    : new Result(
                        resA.consumed,
                        resB.success,
                        ParseError.merge(resA.err, resB.err),
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
     * @function module:prim.tailRecM
     * @static
     * @param {*} initVal
     * @param {function} func
     * @returns {AbstractParser}
     */
    function tailRecM(initVal, func) {
        return new Parser(state => {
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
                            return Result.csuc(res.err, res.val.value, res.state);
                        }
                        else {
                            consumed = true;
                            currentVal = res.val.value;
                            currentState = res.state;
                            currentErr = res.err;
                        }
                    }
                    else {
                        if (res.val.done) {
                            return consumed
                                ? Result.csuc(ParseError.merge(currentErr, res.err), res.val.value, res.state)
                                : Result.esuc(ParseError.merge(currentErr, res.err), res.val.value, res.state);
                        }
                        else {
                            currentVal = res.val.value;
                            currentState = res.state;
                            currentErr = ParseError.merge(currentErr, res.err);
                        }
                    }
                }
                else {
                    if (res.consumed) {
                        return res;
                    }
                    else {
                        return consumed
                            ? Result.cerr(ParseError.merge(currentErr, res.err))
                            : Result.eerr(ParseError.merge(currentErr, res.err));
                    }
                }
            }
        });
    }

    /**
     * @function module:prim.ftailRecM
     * @static
     * @param {function} func
     * @returns {function}
     */
    function ftailRecM(func) {
        return initVal => tailRecM(initVal, func);
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
            const resA = parserA.run(state);
            if (!resA.consumed && !resA.success) {
                const resB = parserB.run(state);
                return resB.consumed
                    ? resB
                    : new Result(
                        resB.consumed,
                        resB.success,
                        ParseError.merge(resA.err, resB.err),
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
            const res = parser.run(state);
            if (res.consumed) {
                return res;
            }
            else {
                return new Result(
                    false,
                    res.success,
                    res.success
                        ? new LazyParseError(() => res.err.isUnknown() ? res.err : setExpects(res.err))
                        : setExpects(res.err),
                    res.val,
                    res.state
                );
            }
        });
    }

    /**
     * @function module:prim.hidden
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function hidden(parser) {
        return label(parser, "");
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
            const res = parser.run(state);
            return res.consumed && !res.success
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
        return new Parser(state => {
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
                    }
                    else {
                        throw new Error("`many' is applied to a parser that accepts an empty string");
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
        return new Parser(state => {
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
                    }
                    else {
                        throw new Error("`many' is applied to a parser that accepts an empty string");
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
        return new Parser(state => {
            const unconsed = uncons(state.input, state.config.unicode);
            if (unconsed.empty) {
                return Result.eerr(systemUnexpectError(state.pos, ""));
            }
            else {
                const maybeVal = calcValue(unconsed.head, state.config);
                if (maybeVal.empty) {
                    return Result.eerr(systemUnexpectError(state.pos, tokenToString(unconsed.head)));
                }
                else {
                    const newPos = calcNextPos(state.pos, unconsed.head, unconsed.tail, state.config);
                    const newUserState = calcNextUserState === undefined
                        ? state.userState
                        : calcNextUserState(state.userState, state.pos, unconsed.head, unconsed.tail, state.config);
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
    const getParserState = new Parser(state => Result.esuc(ParseError.unknown(state.pos), state, state));

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
        return new Parser(state => {
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

    return end();
};
