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
            forever,
            voidM,
            join,
            when
        });
    }

    const lazy = _core.lazy;

    const _prim = require("loquat-prim")(_core);
    const map  = _prim.map;
    const pure = _prim.pure;
    const bind = _prim.bind;
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

    /**
     * @function module:monad.voidM
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function voidM(parser) {
        return map(parser, () => undefined);
    }

    /**
     * @function module:monad.join
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function join(parser) {
        return bind(parser, val => val);
    }

    /**
     * @function module:monad.when
     * @static
     * @param {boolean} flag
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function when(flag, parser) {
        return flag ? parser : pure(undefined);
    }

    return end();
};
