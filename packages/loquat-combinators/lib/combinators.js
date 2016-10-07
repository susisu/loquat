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
            option
        });
    }

    const _prim = require("loquat-prim")(_core);
    const pure  = _prim.pure;
    const mzero = _prim.mzero;
    const mplus = _prim.mplus;

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

    return end();
};
