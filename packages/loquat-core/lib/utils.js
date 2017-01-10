/*
 * loquat-core / utils.js
 */

/**
 * @module utils
 */

"use strict";

module.exports = () => {
    function end() {
        return Object.freeze({
            show,
            unconsString,
            _internal: {
                escapeChar
            }
        });
    }

    const escapeMap = new Map([
        ["\\", "\\\\"],
        ["\"", "\\\""],
        ["\b", "\\b"],
        ["\f", "\\f"],
        ["\n", "\\n"],
        ["\r", "\\r"],
        ["\t", "\\t"],
        ["\v", "\\v"]
    ]);

    /**
     * @function module:utils.escapeChar
     * @description Escapes the given character `char`.
     * @private
     * @static
     * @param {string} char A character.
     * @returns {string} The escaped character.
     */
    function escapeChar(char) {
        return escapeMap.has(char) ? escapeMap.get(char) : char;
    }

    /**
     * @function module:utils.show
     * @description Pretty-printer for error messages.
     * Printing strategy is determined by the type of `value`.
     * - If `value` is a string, the string is escaped and double-quoted.
     * - If `value` is an string, each element is printed by `show()`
     * then joined with commas `,` and wrapped by braces `[ ... ]`.
     * - If `value` is an object but `value.toString` is not a function,
     * it calls `Object.prototype.toString.call(value)`.
     * - Otherwise, it calls `String(value)`
     * @static
     * @param {*} value Any value.
     * @returns {string} The printed string.
     */
    function show(value) {
        if (typeof value === "string") {
            if (value.length === 1) {
                return `"${escapeChar(value)}"`;
            }
            else {
                return `"${value.replace(/[\u0000-\u001F\\\"]/g, escapeChar)}"`;
            }
        }
        else if (Array.isArray(value)) {
            return `[${value.map(show).join(", ")}]`;
        }
        else if (typeof value === "object" && value !== null && typeof value.toString !== "function") {
            return Object.prototype.toString.call(value);
        }
        else {
            return String(value);
        }
    }

    /**
     * @function module:utils.unconsString
     * @description Reads string.
     * This is a specialized version of {@module:stream.uncons} for string.
     * A result object contains the following properties.
     * <table>
     * <tr><th>Property</th><th>Type</th><th>Description</th></tr>
     * <tr><td>`empty`</td><td>boolean</td><td>Indicates the string is empty or not.
     * If not empty, the object have `head` and `tail` properties.</td></tr>
     * <tr><td>`head`</td><td></td><td>The head of the string.</td></tr>
     * <tr><td>`tail`</td><td>string</td>
     * <td>The tail (rest) of the string.</td></tr>
     * </table>
     * @static
     * @param {string} str A string.
     * @param {boolean} unicode If `true` specified characters are unconsed in code point unit.
     * @returns {Object} An object that have properties describes above.
     */
    function unconsString(str, unicode) {
        const len = str.length;
        if (unicode) {
            if (len === 0) {
                return { empty: true };
            }
            else if (len === 1) {
                return { empty: false, head: str[0], tail: str.substr(1) };
            }
            else {
                const first = str.charCodeAt(0);
                if (first < 0xD800 || 0xDBFF < first) {
                    return { empty: false, head: str[0], tail: str.substr(1) };
                }
                const second = str.charCodeAt(1);
                if (second < 0xDC00 || 0xDFFF < second) {
                    return { empty: false, head: str[0], tail: str.substr(1) };
                }
                return { empty: false, head: String.fromCharCode(first, second), tail: str.substr(2) };
            }
        }
        else {
            return len === 0
                ? { empty: true }
                : { empty: false, head: str[0], tail: str.substr(1) };
        }
    }

    return end();
};
