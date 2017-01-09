/*
 * loquat-char / sugar.js
 */

/**
 * @module sugar
 */

"use strict";

module.exports = (_core, _char) => {
    const manyChars  = _char.manyChars;
    const manyChars1 = _char.manyChars1;

    return Object.freeze({
        manyChars: function () {
            return manyChars(this);
        },
        manyChars1: function () {
            return manyChars1(this);
        }
    });
};
