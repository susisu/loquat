/*
 * loquat-monad / monad.js
 */

/**
 * @module monad
 */

"use strict";

module.exports = (_core, _prim) => {
    function end() {
        return Object.freeze({
            forever,
            discard,
            join,
            when,
            unless,
            liftM,
            liftM2,
            liftM3,
            liftM4,
            liftM5,
            ltor,
            rtol,
            sequence,
            sequence_,
            mapM,
            mapM_,
            forM,
            forM_,
            filterM,
            zipWithM,
            zipWithM_,
            foldM,
            foldM_,
            replicateM,
            replicateM_,
            guard,
            msum,
            mfilter,
            _internal: {
                zipWith
            }
        });
    }

    const ParseError = _core.ParseError;
    const Result     = _core.Result;
    const Parser     = _core.Parser;

    const map      = _prim.map;
    const pure     = _prim.pure;
    const bind     = _prim.bind;
    const then     = _prim.then;
    const tailRecM = _prim.tailRecM;
    const mzero    = _prim.mzero;
    const mplus    = _prim.mplus;

    /**
     * @function module:monad.forever
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function forever(parser) {
        return tailRecM(
            undefined,
            () => map(parser, () => ({ done: false, value: undefined }))
        );
    }

    /**
     * @function module:monad.discard
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function discard(parser) {
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
     * @param {boolean} cond
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function when(cond, parser) {
        return cond ? parser : pure(undefined);
    }

    /**
     * @function module:monad.unless
     * @static
     * @param {boolean} cond
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function unless(cond, parser) {
        return cond ? pure(undefined) : parser;
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

    /**
     * @function module:monad.rtol
     * @static
     * @param {function} funcA
     * @param {function} funcB
     * @returns {function}
     */
    function rtol(funcA, funcB) {
        return val => bind(funcB(val), funcA);
    }

    /**
     * @function module:monad.sequence
     * @static
     * @param {Array.<AbstractParser>} parsers
     * @returns {AbstractParser}
     */
    function sequence(parsers) {
        return new Parser(state => {
            const accum = [];
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;
            for (const parser of parsers) {
                const res = parser.run(currentState);
                if (res.success) {
                    if (res.consumed) {
                        consumed = true;
                        accum.push(res.val);
                        currentState = res.state;
                        currentErr = res.err;
                    }
                    else {
                        accum.push(res.val);
                        currentState = res.state;
                        currentErr = ParseError.merge(currentErr, res.err);
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
            return consumed
                ? Result.csuc(currentErr, accum, currentState)
                : Result.esuc(currentErr, accum, currentState);
        });
    }

    /**
     * @function module:monad.sequence
     * @static
     * @param {Array.<AbstractParser>} parsers
     * @returns {AbstractParser}
     */
    function sequence_(parsers) {
        return parsers.reduceRight((accum, parser) => then(parser, accum), pure(undefined));
    }

    /**
     * @function module:monad.mapM
     * @static
     * @param {function} func
     * @param {Array} arr
     * @returns {AbstractParser}
     */
    function mapM(func, arr) {
        return sequence(arr.map(elem => func(elem)));
    }

    /**
     * @function module:monad.mapM_
     * @static
     * @param {function} func
     * @param {Array} arr
     * @returns {AbstractParser}
     */
    function mapM_(func, arr) {
        return sequence_(arr.map(elem => func(elem)));
    }

    /**
     * @function module:monad.forM
     * @static
     * @param {Array} arr
     * @param {function} func
     * @returns {AbstractParser}
     */
    function forM(arr, func) {
        return mapM(func, arr);
    }

    /**
     * @function module:monad.forM_
     * @static
     * @param {Array} arr
     * @param {function} func
     * @returns {AbstractParser}
     */
    function forM_(arr, func) {
        return mapM_(func, arr);
    }

    /**
     * @function module:monad.filterM
     * @static
     * @param {function} test
     * @param {Array} arr
     * @returns {AbstractParser}
     */
    function filterM(test, arr) {
        return new Parser(state => {
            const accum = [];
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;
            for (const elem of arr) {
                const parser = test(elem);
                const res = parser.run(currentState);
                if (res.success) {
                    if (res.consumed) {
                        consumed = true;
                        if (res.val) {
                            accum.push(elem);
                        }
                        currentState = res.state;
                        currentErr = res.err;
                    }
                    else {
                        if (res.val) {
                            accum.push(elem);
                        }
                        currentState = res.state;
                        currentErr = ParseError.merge(currentErr, res.err);
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
            return consumed
                ? Result.csuc(currentErr, accum, currentState)
                : Result.esuc(currentErr, accum, currentState);
        });
    }

    /**
     * @function module:monad.zipWith
     * @private
     * @static
     * @param {function} func
     * @param {Array} arrA
     * @param {Array} arrB
     * @returns {*}
     */
    function zipWith(func, arrA, arrB) {
        const res = [];
        const len = Math.min(arrA.length, arrB.length);
        for (let i = 0; i < len; i++) {
            res.push(func(arrA[i], arrB[i]));
        }
        return res;
    }

    /**
     * @function module:monad.zipWithM
     * @static
     * @param {function} func
     * @param {Array} arrA
     * @param {Array} arrB
     * @returns {AbstractParser}
     */
    function zipWithM(func, arrA, arrB) {
        return sequence(zipWith(func, arrA, arrB));
    }

    /**
     * @function module:monad.zipWithM_
     * @static
     * @param {function} func
     * @param {Array} arrA
     * @param {Array} arrB
     * @returns {AbstractParser}
     */
    function zipWithM_(func, arrA, arrB) {
        return sequence_(zipWith(func, arrA, arrB));
    }

    /**
     * @function module:monad.foldM
     * @static
     * @param {function} func
     * @param {*} initVal
     * @param {Array} arr
     * @returns {AbstractParser}
     */
    function foldM(func, initVal, arr) {
        return new Parser(state => {
            let accum = initVal;
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;
            for (const elem of arr) {
                const parser = func(accum, elem);
                const res = parser.run(currentState);
                if (res.success) {
                    if (res.consumed) {
                        consumed = true;
                        accum = res.val;
                        currentState = res.state;
                        currentErr = res.err;
                    }
                    else {
                        accum = res.val;
                        currentState = res.state;
                        currentErr = ParseError.merge(currentErr, res.err);
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
            return consumed
                ? Result.csuc(currentErr, accum, currentState)
                : Result.esuc(currentErr, accum, currentState);
        });
    }

    /**
     * @function module:monad.foldM_
     * @static
     * @param {function} func
     * @param {*} initVal
     * @param {Array} arr
     * @returns {AbstractParser}
     */
    function foldM_(func, initVal, arr) {
        return then(foldM(func, initVal, arr), pure(undefined));
    }

    /**
     * @function module:monad.replicateM
     * @static
     * @param {number} num
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function replicateM(num, parser) {
        return sequence(new Array(num).fill(parser));
    }

    /**
     * @function module:monad.replicateM_
     * @static
     * @param {number} num
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function replicateM_(num, parser) {
        return sequence_(new Array(num).fill(parser));
    }

    /**
     * @function module:monad.guard
     * @static
     * @param {boolean} cond
     * @returns {AbstractParser}
     */
    function guard(cond) {
        return cond ? pure(undefined) : mzero;
    }

    /**
     * @function module:monad.msum
     * @static
     * @param {Array.<AbstractParser>} parsers
     * @returns {AbstractParser}
     */
    function msum(parsers) {
        return parsers.reduceRight((accum, parser) => mplus(parser, accum), mzero);
    }

    /**
     * @function module:monad.mfilter
     * @static
     * @param {function} test
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function mfilter(test, parser) {
        return bind(parser, val => test(val) ? pure(val) : mzero);
    }

    return end();
};
