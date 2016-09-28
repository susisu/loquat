/*
 * loquat-core
 * copyright (c) 2016 Susisu
 */

"use strict";

const _utils = require("./lib/utils.js");
const show = _utils.show;

const _pos = require("./lib/pos.js");
const SourcePos = _pos.SourcePos;

const _error = require("./lib/error.js");
const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const AbstractParseError = _error.AbstractParseError;
const ParseError         = _error.ParseError;
const LazyParseError     = _error.LazyParseError;

const _stream = require("./lib/stream.js");
const uncons = _stream.uncons;

const _parser = require("./lib/parser.js");
const Config         = _parser.Config;
const State          = _parser.State;
const Result         = _parser.Result;
const AbstractParser = _parser.AbstractParser;
const Parser         = _parser.Parser;
const LazyParser     = _parser.LazyParser;
const lazy           = _parser.lazy;
const parse          = _parser.parse;
const isParser       = _parser.isParser;
const assertParser   = _parser.assertParser;
const extendParser   = _parser.extendParser;

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
