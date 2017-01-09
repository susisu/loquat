/*
 * loquat-token / language.js
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
         * @param {Object} [obj = {}]
         */
        constructor(obj) {
            if (obj === undefined) {
                obj = {};
            }
            this.commentStart    = obj.commentStart;
            this.commentEnd      = obj.commentEnd;
            this.commentLine     = obj.commentLine;
            this.nestedComments  = obj.nestedComments === undefined ? true : obj.nestedComments;
            this.idStart         = obj.idStart;
            this.idLetter        = obj.idLetter;
            this.opStart         = obj.opStart;
            this.opLetter        = obj.opLetter;
            this.reservedIds     = obj.reservedIds;
            this.reservedOps     = obj.reservedOps;
            this.caseSensitive   = obj.caseSensitive === undefined ? true : obj.caseSensitive;
        }

        /**
         * @returns {module:language.LanguageDef}
         */
        clone() {
            return new LanguageDef({
                commentStart  : this.commentStart,
                commentEnd    : this.commentEnd,
                commentLine   : this.commentLine,
                nestedComments: this.nestedComments,
                idStart       : this.idStart,
                idLetter      : this.idLetter,
                opStart       : this.opStart,
                opLetter      : this.opLetter,
                reservedIds   : this.reservedIds,
                reservedOps   : this.reservedOps,
                caseSensitive : this.caseSensitive
            });
        }
    }

    return end();
};
