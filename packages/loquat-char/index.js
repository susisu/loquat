/*
 * loquat-char
 * copyright (c) 2016 Susisu
 */

"use strict";

module.exports = (core, sugar) => {
    let _char = require("./lib/char.js")(core);
    const string     = _char.string;
    const satisfy    = _char.satisfy;
    const oneOf      = _char.oneOf;
    const noneOf     = _char.noneOf;
    const char       = _char.char;
    const anyChar    = _char.anyChar;
    const space      = _char.space;
    const spaces     = _char.spaces;
    const newline    = _char.newline;
    const tab        = _char.tab;
    const upper      = _char.upper;
    const lower      = _char.lower;
    const letter     = _char.letter;
    const digit      = _char.digit;
    const alphaNum   = _char.alphaNum;
    const octDigit   = _char.octDigit;
    const hexDigit   = _char.hexDigit;
    const manyChars  = _char.manyChars;
    const manyChars1 = _char.manyChars1;

    return Object.freeze({
        string,
        satisfy,
        oneOf,
        noneOf,
        char,
        anyChar,
        space,
        spaces,
        newline,
        tab,
        upper,
        lower,
        letter,
        digit,
        alphaNum,
        octDigit,
        hexDigit,
        manyChars,
        manyChars1
    });
};
