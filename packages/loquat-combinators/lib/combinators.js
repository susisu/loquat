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
            skipMany1,
            sepBy,
            sepBy1,
            sepEndBy,
            sepEndBy1,
            endBy,
            endBy1
        });
    }

    const ParseError = _core.ParseError;
    const Result     = _core.Result;
    const Parser     = _core.Parser;

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
            map(pure(undefined), () => ({ empty: true }))
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
        return then(open,
            bind(parser, val =>
                then(close,
                    pure(val)
                )
            )
        );
    }

    /**
     * @function module:combinators.many1
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function many1(parser) {
        return bind(parser, head =>
            bind(many(parser), tail =>
                pure([head].concat(tail))
            )
        );
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

    /**
     * @function module:combinators.sepBy
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
    function sepBy(parser, sep) {
        return mplus(
            sepBy1(parser, sep),
            map(pure(undefined), () => [])
        );
    }

    /**
     * @function module:combinators.sepBy1
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
    function sepBy1(parser, sep) {
        return bind(parser, head =>
            bind(many(then(sep, parser)), tail =>
                pure([head].concat(tail))
            )
        );
    }

    /**
     * @function module:combinators.sepEndBy
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
    function sepEndBy(parser, sep) {
        return new Parser(state => {
            let accum = [];
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;
            while (true) {
                let res = parser.run(currentState);
                if (res.succeeded) {
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
                        return Result.cerr(res.err);
                    }
                    else {
                        return consumed
                            ? Result.csuc(ParseError.merge(currentErr, res.err), accum, currentState)
                            : Result.esuc(ParseError.merge(currentErr, res.err), accum, currentState);
                    }
                }
                let sepRes = sep.run(currentState);
                if (sepRes.succeeded) {
                    if (sepRes.consuemd) {
                        consumed = true;
                        currentState = sepRes.state;
                        currentErr = sepRes.err;
                    }
                    else {
                        currentState = sepRes.state;
                        currentErr = ParseError.merge(currentErr, sepRes.err);
                    }
                }
                else {
                    if (sepRes.consumed) {
                        return Result.cerr(sepRes.err);
                    }
                    else {
                        return consumed
                            ? Result.csuc(ParseError.merge(currentErr, sepRes.err), accum, currentState)
                            : Result.esuc(ParseError.merge(currentErr, sepRes.err), accum, currentState);
                    }
                }
            }
        });
    }

    /**
     * @function module:combinators.sepEndBy1
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
    function sepEndBy1(parser, sep) {
        return bind(parser, head =>
            mplus(
                then(sep,
                    bind(sepEndBy(parser, sep), tail =>
                        pure([head].concat(tail))
                    )
                ),
                pure([head])
            )
        );
    }

    /**
     * @function module:combinators.endBy
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
    function endBy(parser, sep) {
        return many(
            bind(parser, val =>
                then(sep, pure(val))
            )
        );
    }

    /**
     * @function module:combinators.endBy1
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} sep
     * @returns {AbstractParser}
     */
    function endBy1(parser, sep) {
        return many1(
            bind(parser, val =>
                then(sep, pure(val))
            )
        );
    }

    return end();
};
