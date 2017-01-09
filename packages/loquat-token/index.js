/*
 * loquat-token
 */

"use strict";

module.exports = _core => {
    const _prim        = require("loquat-prim")(_core);
    const _char        = require("loquat-char")(_core);
    const _combinators = require("loquat-combinators")(_core);
    const _language    = require("./lib/language.js")();
    const _token       = require("./lib/token.js")(_core, _prim, _char, _combinators);

    return Object.freeze({
        LanguageDef    : _language.LanguageDef,
        makeTokenParser: _token.makeTokenParser
    });
};
