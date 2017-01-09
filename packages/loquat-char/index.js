/*
 * loquat-char
 */

"use strict";

module.exports = (_core, opts) => {
    if (opts === undefined) {
        opts = {};
    }

    const _prim = require("loquat-prim")(_core);
    const _char = require("./lib/char.js")(_core, _prim);

    if (opts.sugar) {
        const _sugar = require("./lib/sugar.js")(_core, _char);
        _core.extendParser(_sugar);
    }

    return Object.freeze({
        string    : _char.string,
        satisfy   : _char.satisfy,
        oneOf     : _char.oneOf,
        noneOf    : _char.noneOf,
        char      : _char.char,
        anyChar   : _char.anyChar,
        space     : _char.space,
        spaces    : _char.spaces,
        newline   : _char.newline,
        tab       : _char.tab,
        upper     : _char.upper,
        lower     : _char.lower,
        letter    : _char.letter,
        digit     : _char.digit,
        alphaNum  : _char.alphaNum,
        octDigit  : _char.octDigit,
        hexDigit  : _char.hexDigit,
        manyChars : _char.manyChars,
        manyChars1: _char.manyChars1,
        regexp    : _char.regexp
    });
};
