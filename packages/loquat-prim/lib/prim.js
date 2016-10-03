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
            reduceMany
        });
    }

    const ErrorMessageType = _core.ErrorMessageType;
    const ErrorMessage     = _core.ErrorMessage;
    const ParseError       = _core.ParseError;
    const LazyParseError   = _core.LazyParseError;
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

    return end();
};
