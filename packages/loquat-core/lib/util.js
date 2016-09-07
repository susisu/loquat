/*
 * loquat-core / util.js
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
escapeMap.set("\t", "\\t");
escapeMap.set("\n", "\\n");
escapeMap.set("\r", "\\r");
escapeMap.set("\f", "\\f");
escapeMap.set("\v", "\\v");

function escapeChar (char) {
    return escapeMap.has(char) ? escapeMap.get(char) : char;
}

function show(value) {
    if (typeof value === "string") {
        if (value.length === 1) {
            return `"${escapeChar(value)}"`;
        }
        else {
            return `"${value.split("").map(escapeChar).join("")}"`;
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
