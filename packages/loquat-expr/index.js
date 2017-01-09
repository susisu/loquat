/*
 * loquat-expr
 */

"use strict";

module.exports = _core => {
    const _prim        = require("loquat-prim")(_core);
    const _combinators = require("loquat-combinators")(_core);
    const _expr        = require("./lib/expr.js")(_core, _prim, _combinators);

    return Object.freeze({
        OperatorType         : _expr.OperatorType,
        OperatorAssoc        : _expr.OperatorAssoc,
        Operator             : _expr.Operator,
        buildExpressionParser: _expr.buildExpressionParser
    });
};
