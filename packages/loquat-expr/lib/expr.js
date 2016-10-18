/*
 * loquat-expr / expr.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module expr
 */

"use strict";

module.exports = _core => {
    function end() {
        return Object.freeze({
            OperatorType,
            OperatorAssoc,
            Operator
        });
    }

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

    return end();
};
