/*
 * loquat
 * copyright (c) 2016 Susisu
 */

"use strict";

const { show } = require("./lib/utils.js");
const { SourcePos } = require("./lib/pos.js");
const {
    ErrorMessageType,
    ErrorMessage,
    AbstractParseError,
    ParseError,
    LazyParseError
} = require("./lib/error.js");
const { uncons } = require("./lib/stream.js");
const {
    Config,
    State,
    Result,
    AbstractParser,
    Parser,
    LazyParser,
    lazy,
    parse,
    isParser,
    assertParser,
    extendParser
} = require("./lib/parser.js");

module.exports = Object.freeze({
    show,

    SourcePos,

    ErrorMessageType,
    ErrorMessage,
    AbstractParseError,
    ParseError,
    LazyParseError,

    uncons,

    Config,
    State,
    Result,
    AbstractParser,
    Parser,
    LazyParser,
    lazy,
    parse,
    isParser,
    assertParser,
    extendParser
});
