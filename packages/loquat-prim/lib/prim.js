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
            return: __return__
        });
    }

    const ParseError = _core.ParseError;
    const Result     = _core.Result;
    const Parser     = _core.Parser;

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
     * @function module:prim.return
     * @static
     * @param {*} val
     * @returns {AbstractParser}
     */
    function __return__(val) {
        return new Parser(state => Result.esuc(ParseError.unknown(state.pos), val, state));
    }

    return end();
};
