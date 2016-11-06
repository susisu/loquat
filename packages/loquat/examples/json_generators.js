/*
 * JSON parser with generators
 */

"use strict";

const lq = require("../index.js"); // require("loquat");

// skip trailing whitespace
function lexeme(parser) {
    return parser.skip(lq.spaces);
}

// all JSON values
const value = lq.lazy(() => lq.choice([
    object,
    array,
    stringLiteral,
    numberLiteral,
    trueLiteral,
    falseLiteral,
    nullLiteral
]));

// string literal
const stringRegExp = /"((\\(u[0-9A-Fa-f]{4}|["\\\/bfnrt])|[^\\"\b\f\n\r\t])*?)"/;
const escapeMap = new Map([
    ["b", "\b"],
    ["f", "\f"],
    ["n", "\n"],
    ["r", "\r"],
    ["t", "\t"]
]);
function escape(str) {
    return str.replace(/\\(u[0-9A-Fa-f]{4}|[^u])/g, (_, e) => {
        const type = e[0];
        if (type === "u") {
            return String.fromCharCode(parseInt(e.substr(1), 16));
        }
        else if (escapeMap.has(type)) {
            return escapeMap.get(type);
        }
        else {
            return type;
        }
    });
}
const stringLiteral = lq.do(function* () {
    const str = yield lexeme(lq.regexp(stringRegExp, 1));
    return escape(str);
}).label("string");

// number literal
const numberRegExp = /\-?(0|[1-9]\d*)(\.\d*)?([Ee][+\-]?\d*)?/;
const numberLiteral = lq.do(function* () {
    const numStr = yield lexeme(lq.regexp(numberRegExp));
    return Number(numStr);
}).label("number");

// boolean literals
const trueLiteral = lq.do(function* () {
    yield lexeme(lq.string("true"));
    return true;
}).label("true");

const falseLiteral = lq.do(function* () {
    yield lexeme(lq.string("false"));
    return false;
}).label("false");

// null literal
const nullLiteral = lq.do(function* () {
    yield lexeme(lq.string("null"));
    return null;
}).label("null");

// object and array
const lbrace   = lexeme(lq.char("{"));
const rbrace   = lexeme(lq.char("}"));
const lbracket = lexeme(lq.char("["));
const rbracket = lexeme(lq.char("]"));
const colon    = lexeme(lq.char(":"));
const comma    = lexeme(lq.char(","));

const keyValue = lq.do(function* () {
    const key = yield stringLiteral;
    yield colon;
    const val = yield value;
    return [key, val];
});
const object = lq.do(function* () {
    yield lbrace;
    const kvs = yield keyValue.sepBy(comma);
    yield rbrace;
    const obj = {};
    for (const kv of kvs) {
        obj[kv[0]] = kv[1];
    }
    return obj;
}).label("object");

const array = lq.do(function* () {
    yield lbracket;
    const vs = yield value.sepBy(comma);
    yield rbracket;
    return vs;
}).label("array");

const json = lq.do(function* () {
    yield lq.spaces;
    const val = yield value;
    yield lq.eof;
    return val;
});

function parse(filename) {
    const fs = require("fs");
    const util = require("util");
    fs.readFile(filename, { encoding: "utf-8" }, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        const result = lq.parse(json, filename, data);
        if (result.succeeded) {
            console.log(util.inspect(
                result.value,
                { colors: true, depth: undefined }
            ));
        }
        else {
            throw result.error;
        }
    });
}

parse(process.argv[2]);
