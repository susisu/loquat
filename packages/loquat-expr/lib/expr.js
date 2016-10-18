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
            OperatorAssoc
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

    return end();
};
