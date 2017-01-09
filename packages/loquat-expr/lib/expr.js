/*
 * loquat-expr / expr.js
 */

/**
 * @module expr
 */

"use strict";

module.exports = (_core, _prim, _combinators) => {
    function end() {
        return Object.freeze({
            OperatorType,
            OperatorAssoc,
            Operator,
            buildExpressionParser
        });
    }

    const ParseError = _core.ParseError;
    const Result     = _core.Result;
    const Parser     = _core.Parser;

    const pure     = _prim.pure;
    const bind     = _prim.bind;
    const then     = _prim.then;
    const fail     = _prim.fail;
    const mplus    = _prim.mplus;
    const label    = _prim.label;
    const tryParse = _prim.tryParse;

    const choice = _combinators.choice;

    /**
     * @constant {Object} module:expr.OperatorType
     * @description The `OperatorType` object has string constants describing operator types:
     * - `OperatorType.INFIX = "infix"`
     * - `OperatorType.PREFIX = "prefix"`
     * - `OperatorType.POSTFIX = "postifx"`
     * @static
     */
    const OperatorType = Object.freeze({
        INFIX  : "infix",
        PREFIX : "prefix",
        POSTFIX: "postfix"
    });

    /**
     * @constant {Object} module:expr.OperatorAssoc
     * @description The `OperatorAssoc` object has string constants describing operator associativities:
     * - `OperatorAssoc.NONE = "none"`
     * - `OperatorAssoc.LEFT = "left"`
     * - `OperatorAssoc.RIGHT = "right"`
     * @static
     */
    const OperatorAssoc = Object.freeze({
        NONE : "none",
        LEFT : "left",
        RIGHT: "right"
    });

    /**
     * @static
     */
    class Operator {
        /**
         * @param {string} type
         * @param {AbstractParser} parser
         * @param {(string|undefined)} [assoc=undefined]
         */
        constructor(type, parser, assoc) {
            this._type   = type;
            this._parser = parser;
            this._assoc  = assoc;
        }

        /**
         * @readonly
         * @type {string}
         */
        get type() {
            return this._type;
        }

        /**
         * @readonly
         * @type {AbstractParser}
         */
        get parser() {
            return this._parser;
        }

        /**
         * @readonly
         * @type {(string|undefined)}
         */
        get assoc() {
            return this._assoc;
        }
    }

    /**
     * @private
     * @param {AbstractParser} term
     * @param {Array.<Operator>} ops
     * @returns {AbstractParser}
     */
    function makeParser(term, ops) {
        // collect operators
        const nonAssoc   = [];
        const leftAssoc  = [];
        const rightAssoc = [];
        const prefix     = [];
        const postfix    = [];
        for (const op of ops) {
            switch (op.type) {
            case OperatorType.INFIX:
                switch (op.assoc) {
                case OperatorAssoc.NONE:
                    nonAssoc.push(op.parser);
                    break;
                case OperatorAssoc.LEFT:
                    leftAssoc.push(op.parser);
                    break;
                case OperatorAssoc.RIGHT:
                    rightAssoc.push(op.parser);
                    break;
                default:
                    throw new Error(`unknown operator associativity: ${op.assoc}`);
                }
                break;
            case OperatorType.PREFIX:
                prefix.push(op.parser);
                break;
            case OperatorType.POSTFIX:
                postfix.push(op.parser);
                break;
            default:
                throw new Error(`unknown operator type: ${op.type}`);
            }
        }

        // create operator parsers
        const nassocOp  = choice(nonAssoc);
        const lassocOp  = choice(leftAssoc);
        const rassocOp  = choice(rightAssoc);
        const prefixOp  = label(choice(prefix), "");
        const postfixOp = label(choice(postfix), "");

        // warn ambiguity (always eerr)
        function ambiguous(assoc, parser) {
            return tryParse(
                then(parser, fail(`ambiguous use of a ${assoc} associative operator`))
            );
        }

        const ambiguousNon   = ambiguous("non", nassocOp);
        const ambiguousLeft  = ambiguous("left", lassocOp);
        const ambiguousRight = ambiguous("right", rassocOp);

        // identity
        function id(x) {
            return x;
        }

        // unary operators
        const prefixP  = mplus(prefixOp, pure(id));
        const postfixP = mplus(postfixOp, pure(id));

        // term parser
        const termP = bind(prefixP, pre =>
            bind(term, val =>
                bind(postfixP, post =>
                    pure(post(pre(val)))
                )
            )
        );

        // right assoc binary operator
        function rassocP(x) {
            return mplus(
                bind(rassocOp, f =>
                    bind(bind(termP, rassocP1), y =>
                        pure(f(x, y))
                    )
                ),
                mplus(ambiguousLeft, ambiguousNon)
            );
        }

        function rassocP1(x) {
            return new Parser(state => {
                const vals = [];
                const operations = [];
                let currentState = state;
                let currentErr = ParseError.unknown(state.pos);
                let consumed = false;
                while (true) {
                    const initState = currentState;

                    const opRes = rassocOp.run(currentState);
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
                            const ambRes = mplus(ambiguousLeft, ambiguousNon).run(initState); // always eerr
                            const err = ParseError.merge(ParseError.merge(currentErr, opRes.err), ambRes.err);
                            let resVal = x;
                            if (vals.length > 0) {
                                let currentVal = vals[vals.length - 1];
                                for (let i = vals.length - 2; i >= 0; i -= 1) {
                                    currentVal = operations[i + 1](vals[i], currentVal);
                                }
                                resVal = operations[0](resVal, currentVal);
                            }
                            return consumed
                                ? Result.csuc(err, resVal, initState)
                                : Result.esuc(err, resVal, initState);
                        }
                    }

                    const termRes = termP.run(currentState);
                    if (termRes.success) {
                        if (termRes.consumed) {
                            consumed = true;
                            vals.push(termRes.val);
                            currentState = termRes.state;
                            currentErr = termRes.err;
                        }
                        else {
                            vals.push(termRes.val);
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
                                const ambRes = mplus(ambiguousLeft, ambiguousNon).run(initState); // always eerr
                                const err = ParseError.merge(ParseError.merge(currentErr, termRes.err), ambRes.err);
                                let resVal = x;
                                if (vals.length > 0) {
                                    let currentVal = vals[vals.length - 1];
                                    for (let i = vals.length - 2; i >= 0; i -= 1) {
                                        currentVal = operations[i + 1](vals[i], currentVal);
                                    }
                                    resVal = operations[0](resVal, currentVal);
                                }
                                return consumed
                                    ? Result.csuc(err, resVal, initState)
                                    : Result.esuc(err, resVal, initState);
                            }
                        }
                    }
                }
            });
        }

        // left assoc binary operator
        function lassocP(x) {
            return mplus(
                bind(lassocOp, f =>
                    bind(termP, y =>
                        lassocP1(f(x, y))
                    )
                ),
                mplus(ambiguousRight, ambiguousNon)
            );
        }

        function lassocP1(x) {
            return new Parser(state => {
                let currentVal = x;
                let currentOperation;
                let currentState = state;
                let currentErr = ParseError.unknown(state.pos);
                let consumed = false;
                while (true) {
                    const initState = currentState;

                    const opRes = lassocOp.run(currentState);
                    if (opRes.success) {
                        if (opRes.consumed) {
                            consumed = true;
                            currentOperation = opRes.val;
                            currentState = opRes.state;
                            currentErr = opRes.err;
                        }
                        else {
                            currentOperation = opRes.val;
                            currentState = opRes.state;
                            currentErr = ParseError.merge(currentErr, opRes.err);
                        }
                    }
                    else {
                        if (opRes.consumed) {
                            return opRes;
                        }
                        else {
                            const ambRes = mplus(ambiguousRight, ambiguousNon).run(initState); // always eerr
                            const err = ParseError.merge(ParseError.merge(currentErr, opRes.err), ambRes.err);
                            return consumed
                                ? Result.csuc(err, currentVal, initState)
                                : Result.esuc(err, currentVal, initState);
                        }
                    }

                    const termRes = termP.run(currentState);
                    if (termRes.success) {
                        if (termRes.consumed) {
                            consumed = true;
                            currentVal = currentOperation(currentVal, termRes.val);
                            currentState = termRes.state;
                            currentErr = termRes.err;
                        }
                        else {
                            currentVal = currentOperation(currentVal, termRes.val);
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
                                const ambRes = mplus(ambiguousRight, ambiguousNon).run(initState); // always eerr
                                const err = ParseError.merge(ParseError.merge(currentErr, termRes.err), ambRes.err);
                                return consumed
                                    ? Result.csuc(err, currentVal, initState)
                                    : Result.esuc(err, currentVal, initState);
                            }
                        }
                    }
                }
            });
        }

        // non assoc binary operator
        function nassocP(x) {
            return bind(nassocOp, f =>
                bind(termP, y =>
                    mplus(
                        mplus(mplus(ambiguousRight, ambiguousLeft), ambiguousNon),
                        pure(f(x, y))
                    )
                )
            );
        }

        return bind(termP, x =>
            label(
                mplus(
                    mplus(mplus(rassocP(x), lassocP(x)), nassocP(x)),
                    pure(x)
                ),
                "operator"
            )
        );
    }

    /**
     * @function module:expr.buildExpressionParser
     * @static
     * @param {Array.<Array.<Operator>>} opTable
     * @param {AbstractParser} atom
     * @returns {AbstractParser}
     */
    function buildExpressionParser(opTable, atom) {
        return opTable.reduce(makeParser, atom);
    }

    return end();
};
