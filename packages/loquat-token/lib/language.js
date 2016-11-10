/*
 * loquat-token / language.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module language
 */

"use strict";

module.exports = () => {
    function end() {
        return Object.freeze({
            LanguageDef
        });
    }

    /**
     * @static
     */
    class LanguageDef {
        /**
         * @param {Object} obj
         */
        constructor(obj) {
            this.commentStart    = obj.commentStart;
            this.commentEnd      = obj.commentEnd;
            this.commentLine     = obj.commentLine;
            this.nestedComments  = obj.nestedComments === undefined ? false : obj.nestedComments;
            this.identStart      = obj.identStart;
            this.identLetter     = obj.identLetter;
            this.opStart         = obj.opStart;
            this.opLetter        = obj.opLetter;
            this.reservedNames   = obj.reservedNames;
            this.reservedOpNames = obj.reservedOpNames;
            this.caseSensitive   = obj.caseSensitive === undefined ? true : obj.caseSensitive;
        }

        /**
         * @returns {module:language.LanguageDef}
         */
        clone() {
            return new LanguageDef({
                commentStart   : this.commentStart,
                commentEnd     : this.commentEnd,
                commentLine    : this.commentLine,
                nestedComments : this.nestedComments,
                identStart     : this.identStart,
                identLetter    : this.identLetter,
                opStart        : this.opStart,
                opLetter       : this.opLetter,
                reservedNames  : this.reservedNames,
                reservedOpNames: this.reservedOpNames,
                caseSensitive  : this.caseSensitive
            });
        }
    }

    return end();
};
