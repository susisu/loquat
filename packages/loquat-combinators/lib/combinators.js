/*
 * loquat-combinators / combinators.js
 */

/**
 * @module combinators
 */

"use strict";

module.exports = (_core, _prim) => {
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
            endBy1,
            count,
            chainl,
            chainl1,
            chainr,
            chainr1,
            anyToken,
            notFollowedBy,
            eof,
            reduceManyTill,
            manyTill,
            skipManyTill
        });
    }

    const show       = _core.show;
    const ParseError = _core.ParseError;
    const Result     = _core.Result;
    const Parser     = _core.Parser;

    const map        = _prim.map;
    const pure       = _prim.pure;
    const bind       = _prim.bind;
    const then       = _prim.then;
    const mzero      = _prim.mzero;
    const mplus      = _prim.mplus;
    const label      = _prim.label;
    const unexpected = _prim.unexpected;
    const tryParse   = _prim.tryParse;
    const many       = _prim.many;
    const skipMany   = _prim.skipMany;
    const tokenPrim  = _prim.tokenPrim;

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
            const accum = [];
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;
            while (true) {
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
                            ? Result.csuc(ParseError.merge(currentErr, res.err), accum, currentState)
                            : Result.esuc(ParseError.merge(currentErr, res.err), accum, currentState);
                    }
                }
                const sepRes = sep.run(currentState);
                if (sepRes.success) {
                    if (sepRes.consumed) {
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
                        return sepRes;
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

    /**
     * @function module:combinators.count
     * @static
     * @param {number} num
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function count(num, parser) {
        if (num <= 0) {
            return map(pure(undefined), () => []);
        }
        else {
            return new Parser(state => {
                const accum = [];
                let currentState = state;
                let currentErr = ParseError.unknown(state.pos);
                let consumed = false;
                for (let i = 0; i < num; i++) {
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
    }

    /**
     * @function module:combinators.chainl
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @param {*} defaultVal
     * @returns {AbstractParser}
     */
    function chainl(term, op, defaultVal) {
        return mplus(
            chainl1(term, op),
            pure(defaultVal)
        );
    }

    /**
     * @function module:combinators.chainl1
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @returns {AbstractParser}
     */
    function chainl1(term, op) {
        return new Parser(state => {
            let currentVal;
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;

            const headRes = term.run(currentState);
            if (headRes.success) {
                if (headRes.consumed) {
                    consumed = true;
                    currentVal = headRes.val;
                    currentState = headRes.state;
                    currentErr = ParseError.merge(currentErr, headRes.err);
                }
                else {
                    currentVal = headRes.val;
                    currentState = headRes.state;
                    currentErr = ParseError.merge(currentErr, headRes.err);
                }
            }
            else {
                return headRes.consumed
                    ? headRes
                    : Result.eerr(ParseError.merge(currentErr, headRes.err));
            }

            while (true) {
                const initState = currentState;

                const opRes = op.run(currentState);
                let operation;
                if (opRes.success) {
                    if (opRes.consumed) {
                        consumed = true;
                        operation = opRes.val;
                        currentState = opRes.state;
                        currentErr = opRes.err;
                    }
                    else {
                        operation = opRes.val;
                        currentState = opRes.state;
                        currentErr = ParseError.merge(currentErr, opRes.err);
                    }
                }
                else {
                    if (opRes.consumed) {
                        return opRes;
                    }
                    else {
                        return consumed
                            ? Result.csuc(ParseError.merge(currentErr, opRes.err), currentVal, initState)
                            : Result.esuc(ParseError.merge(currentErr, opRes.err), currentVal, initState);
                    }
                }

                const termRes = term.run(currentState);
                if (termRes.success) {
                    if (termRes.consumed) {
                        consumed = true;
                        currentVal = operation(currentVal, termRes.val);
                        currentState = termRes.state;
                        currentErr = termRes.err;
                    }
                    else {
                        currentVal = operation(currentVal, termRes.val);
                        currentState = termRes.state;
                        currentErr = ParseError.merge(currentErr, termRes.err);
                    }
                }
                else {
                    if (termRes.consumed) {
                        return termRes;
                    }
                    else {
                        if (opRes.consumed) {
                            return Result.cerr(ParseError.merge(currentErr, termRes.err));
                        }
                        else {
                            return consumed
                                ? Result.csuc(ParseError.merge(currentErr, termRes.err), currentVal, initState)
                                : Result.esuc(ParseError.merge(currentErr, termRes.err), currentVal, initState);
                        }
                    }
                }
            }
        });
    }

    /**
     * @function module:combinators.chainr
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @param {*} defaultVal
     * @returns {AbstractParser}
     */
    function chainr(term, op, defaultVal) {
        return mplus(
            chainr1(term, op),
            pure(defaultVal)
        );
    }

    /**
     * @function module:combinators.chainr1
     * @static
     * @param {AbstractParser} term
     * @param {AbstractParser} op
     * @returns {AbstractParser}
     */
    function chainr1(term, op) {
        return new Parser(state => {
            let resultVal;
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;

            const headRes = term.run(currentState);
            if (headRes.success) {
                if (headRes.consumed) {
                    consumed = true;
                    resultVal = headRes.val;
                    currentState = headRes.state;
                    currentErr = headRes.err;
                }
                else {
                    resultVal = headRes.val;
                    currentState = headRes.state;
                    currentErr = ParseError.merge(currentErr, headRes.err);
                }
            }
            else {
                return headRes.consumed
                    ? headRes
                    : Result.eerr(ParseError.merge(currentErr, headRes.err));
            }

            const accum = [];
            const operations = [];
            while (true) {
                const initState = currentState;

                const opRes = op.run(currentState);
                if (opRes.success) {
                    if (opRes.consumed) {
                        consumed = true;
                        operations.push(opRes.val);
                        currentState = opRes.state;
                        currentErr = opRes.err;
                    }
                    else {
                        operations.push(opRes.val);
                        currentState = opRes.state;
                        currentErr = ParseError.merge(currentErr, opRes.err);
                    }
                }
                else {
                    if (opRes.consumed) {
                        return opRes;
                    }
                    else {
                        if (accum.length > 0) {
                            let currentVal = accum[accum.length - 1];
                            for (let i = accum.length - 2; i >= 0; i--) {
                                currentVal = operations[i + 1](accum[i], currentVal);
                            }
                            resultVal = operations[0](resultVal, currentVal);
                        }
                        return consumed
                            ? Result.csuc(ParseError.merge(currentErr, opRes.err), resultVal, initState)
                            : Result.esuc(ParseError.merge(currentErr, opRes.err), resultVal, initState);
                    }
                }

                const termRes = term.run(currentState);
                if (termRes.success) {
                    if (termRes.consumed) {
                        consumed = true;
                        accum.push(termRes.val);
                        currentState = termRes.state;
                        currentErr = termRes.err;
                    }
                    else {
                        accum.push(termRes.val);
                        currentState = termRes.state;
                        currentErr = ParseError.merge(currentErr, termRes.err);
                    }
                }
                else {
                    if (termRes.consumed) {
                        return termRes;
                    }
                    else {
                        if (opRes.consumed) {
                            return Result.cerr(ParseError.merge(currentErr, termRes.err));
                        }
                        else {
                            if (accum.length > 0) {
                                let currentVal = accum[accum.length - 1];
                                for (let i = accum.length - 2; i >= 0; i--) {
                                    currentVal = operations[i + 1](accum[i], currentVal);
                                }
                                resultVal = operations[0](resultVal, currentVal);
                            }
                            return consumed
                                ? Result.csuc(ParseError.merge(currentErr, termRes.err), resultVal, initState)
                                : Result.esuc(ParseError.merge(currentErr, termRes.err), resultVal, initState);
                        }
                    }
                }
            }
        });
    }

    /**
     * @constant module:combinators.anyToken
     * @static
     * @type {AbstractParser}
     */
    const anyToken = tokenPrim(
        token => ({ empty: false, value: token }),
        show,
        pos => pos
    );

    /**
     * @function module:combinators.notFollowedBy
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
    function notFollowedBy(parser) {
        const modParser = new Parser(state => {
            const res = parser.run(state);
            if (res.consumed && !res.success) {
                return Result.eerr(res.err);
            }
            else if (!res.consumed && res.success) {
                return Result.csuc(res.err, res.val, res.state);
            }
            else {
                return res;
            }
        });
        return tryParse(
            mplus(
                bind(modParser, val => unexpected(show(val))),
                pure(undefined)
            )
        );
    }

    /**
     * @constant module:combinators.eof
     * @static
     * @type {AbstractParser}
     */
    const eof = label(notFollowedBy(anyToken), "end of input");

    /**
     * @function module:combinators.reduceManyTill
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} end
     * @param {function} callback
     * @param {*} initVal
     * @returns {AbstractParser}
     */
    function reduceManyTill(parser, end, callback, initVal) {
        return new Parser(state => {
            let accum = initVal;
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;
            while (true) {
                const endRes = end.run(currentState);
                if (endRes.success) {
                    if (endRes.consumed) {
                        return Result.csuc(endRes.err, accum, endRes.state);
                    }
                    else {
                        return consumed
                            ? Result.csuc(ParseError.merge(currentErr, endRes.err), accum, endRes.state)
                            : Result.esuc(ParseError.merge(currentErr, endRes.err), accum, endRes.state);
                    }
                }
                else {
                    if (endRes.consumed) {
                        return endRes;
                    }
                    else {
                        currentErr = ParseError.merge(currentErr, endRes.err);
                    }
                }

                const res = parser.run(currentState);
                if (res.success) {
                    if (res.consumed) {
                        consumed = true;
                        accum = callback(accum, res.val);
                        currentState = res.state;
                        currentErr = res.err;
                    }
                    else {
                        accum = callback(accum, res.val);
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
        });
    }

    /**
     * @function module:combinators.manyTill
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} end
     * @returns {AbstractParser}
     */
    function manyTill(parser, end) {
        return new Parser(state => {
            const accum = [];
            let currentState = state;
            let currentErr = ParseError.unknown(state.pos);
            let consumed = false;
            while (true) {
                const endRes = end.run(currentState);
                if (endRes.success) {
                    if (endRes.consumed) {
                        return Result.csuc(endRes.err, accum, endRes.state);
                    }
                    else {
                        return consumed
                            ? Result.csuc(ParseError.merge(currentErr, endRes.err), accum, endRes.state)
                            : Result.esuc(ParseError.merge(currentErr, endRes.err), accum, endRes.state);
                    }
                }
                else {
                    if (endRes.consumed) {
                        return endRes;
                    }
                    else {
                        currentErr = ParseError.merge(currentErr, endRes.err);
                    }
                }

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
        });
    }

    /**
     * @function module:combinators.skipManyTill
     * @static
     * @param {AbstractParser} parser
     * @param {AbstractParser} end
     * @returns {AbstractParser}
     */
    function skipManyTill(parser, end) {
        return reduceManyTill(parser, end, accum => accum, undefined);
    }

    return end();
};
