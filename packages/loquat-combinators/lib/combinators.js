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
            choice
        });
    }

    const _prim = require("loquat-prim")(_core);
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

    return end();
};
