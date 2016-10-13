/*
 * loquat-monad / monad.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module monad
 */

"use strict";

module.exports = _core => {
    function end() {
        return Object.freeze({
            forever
        });
    }

    const lazy = _core.lazy;

    const _prim = require("loquat-prim")(_core);
    const then = _prim.then;

    /**
     * @function module:monad.forever
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function forever(parser) {
        const rec = lazy(() => then(parser, rec));
        return rec;
    }

    return end();
};
