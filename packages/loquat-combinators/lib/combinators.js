/*
 * loquat-combinators / combinators.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module combinators
 */

"use strict";

module.exports = _core => {
    function end() {
        return Object.freeze({
            choice,
            option,
            optionMaybe,
            optional,
            between,
            many1,
            skipMany1
        });
    }

    const _prim = require("loquat-prim")(_core);
    const map      = _prim.map;
    const pure     = _prim.pure;
    const bind     = _prim.bind;
    const then     = _prim.then;
    const mzero    = _prim.mzero;
    const mplus    = _prim.mplus;
    const many     = _prim.many;
    const skipMany = _prim.skipMany;

    /**
     * @function module:combinators.choice
     * @static
     * @param {Array.<AbstractParser>} parsers
     * @returns {AbstractParser}
     */
    function choice(parsers) {
        return parsers.reduceRight((accum, parser) => mplus(parser, accum), mzero);
    }

    /**
     * @function module:combinators.option
     * @static
     * @param {*} val
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function option(val, parser) {
        return mplus(parser, pure(val));
    }

    /**
     * @function module:combinators.optionmaybe
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function optionMaybe(parser) {
        return mplus(
            map(parser, val => ({ empty: false, value: val })),
            bind(pure(undefined), () => ({ empty: true }))
        );
    }

    /**
     * @function module:combinators.optional
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function optional(parser) {
        return mplus(then(parser, pure(undefined)), pure(undefined));
    }

    /**
     * @function module:combinators.between
     * @static
     * @param {AbstractParser} open
     * @param {AbstractParser} close
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function between(open, close, parser) {
        return then(open, bind(parser, val => then(close, pure(val))));
    }

    /**
     * @function module:combinators.many1
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function many1(parser) {
        return bind(parser, head => bind(many(parser), tail => pure([head].concat(tail))));
    }

    /**
     * @function module:combinators.skipMany1
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function skipMany1(parser) {
        return then(parser, skipMany(parser));
    }

    return end();
};
