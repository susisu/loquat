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
            fail
        });
    }

    const ErrorMessageType = _core.ErrorMessageType;
    const ErrorMessage     = _core.ErrorMessage;
    const ParseError       = _core.ParseError;
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

    return end();
};
