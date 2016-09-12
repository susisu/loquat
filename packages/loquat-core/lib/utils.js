/*
 * loquat-core / utils.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        show,
        _internal: {
            escapeChar
        }
    });
}

let escapeMap = new Map();
escapeMap.set("\\", "\\\\");
escapeMap.set("\"", "\\\"");
escapeMap.set("\b", "\\b");
escapeMap.set("\f", "\\f");
escapeMap.set("\n", "\\n");
escapeMap.set("\r", "\\r");
escapeMap.set("\t", "\\t");
escapeMap.set("\v", "\\v");

/**
 * Escapes the given character `char`.
 * @private
 * @param {string} char A character.
 * @returns {string} The escaped character.
 */
function escapeChar (char) {
    return escapeMap.has(char) ? escapeMap.get(char) : char;
}

/**
 * Pretty-printer for error messages.
 * Printing strategy is determined by the type of `value`.
 * - If `value` is a string,.
 * - If `value` is an string,.
 * - If `value` is an object but `value.toString` is not a function, call `Object.prototype.toString.call(value)`.
 * - Otherwise, call `String(value)`;
 * @param value Any value.
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

end();
