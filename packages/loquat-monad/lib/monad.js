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
            when,
            unless,
            liftM,
            liftM2,
            liftM3,
            liftM4,
            liftM5,
            ltor
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

    /**
     * @function module:monad.unless
     * @static
     * @param {boolean} flag
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function unless(flag, parser) {
        return flag ? pure(undefined) : parser;
    }

    /**
     * @function module:monad.liftM
     * @static
     * @param {function} func
     * @returns {function}
     */
    function liftM(func) {
        return parser => bind(parser, val => pure(func(val)));
    }

    /**
     * @function module:monad.liftM2
     * @static
     * @param {function} func
     * @returns {function}
     */
    function liftM2(func) {
        return (parserA, parserB) =>
            bind(parserA, valA =>
                bind(parserB, valB =>
                    pure(func(valA, valB))
                )
            );
    }

    /**
     * @function module:monad.liftM3
     * @static
     * @param {function} func
     * @returns {function}
     */
    function liftM3(func) {
        return (parserA, parserB, parserC) =>
            bind(parserA, valA =>
                bind(parserB, valB =>
                    bind(parserC, valC =>
                        pure(func(valA, valB, valC))
                    )
                )
            );
    }

    /**
     * @function module:monad.liftM4
     * @static
     * @param {function} func
     * @returns {function}
     */
    function liftM4(func) {
        return (parserA, parserB, parserC, parserD) =>
            bind(parserA, valA =>
                bind(parserB, valB =>
                    bind(parserC, valC =>
                        bind(parserD, valD =>
                            pure(func(valA, valB, valC, valD))
                        )
                    )
                )
            );
    }

    /**
     * @function module:monad.liftM5
     * @static
     * @param {function} func
     * @returns {function}
     */
    function liftM5(func) {
        return (parserA, parserB, parserC, parserD, parserE) =>
            bind(parserA, valA =>
                bind(parserB, valB =>
                    bind(parserC, valC =>
                        bind(parserD, valD =>
                            bind(parserE, valE =>
                                pure(func(valA, valB, valC, valD, valE))
                            )
                        )
                    )
                )
            );
    }

    /**
     * @function module:monad.ltor
     * @static
     * @param {function} funcA
     * @param {function} funcB
     * @returns {function}
     */
    function ltor(funcA, funcB) {
        return val => bind(funcA(val), funcB);
    }

    return end();
};
