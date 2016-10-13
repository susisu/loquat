/*
 * loquat-core
 * copyright (c) 2016 Susisu
 */

"use strict";

module.exports = () => {
    const _utils  = require("./lib/utils.js")();
    const _pos    = require("./lib/pos.js")();
    const _error  = require("./lib/error.js")(_pos);
    const _stream = require("./lib/stream.js")();
    const _parser = require("./lib/parser.js")(_pos, _error);

    return Object.freeze({
        show: _utils.show,

        SourcePos: _pos.SourcePos,

        ErrorMessageType  : _error.ErrorMessageType,
        ErrorMessage      : _error.ErrorMessage,
        AbstractParseError: _error.AbstractParseError,
        ParseError        : _error.ParseError,
        LazyParseError    : _error.LazyParseError,

        uncons: _stream.uncons,

        Config        : _parser.Config,
        State         : _parser.State,
        Result        : _parser.Result,
        AbstractParser: _parser.AbstractParser,
        Parser        : _parser.Parser,
        LazyParser    : _parser.LazyParser,
        lazy          : _parser.lazy,
        parse         : _parser.parse,
        isParser      : _parser.isParser,
        assertParser  : _parser.assertParser,
        extendParser  : _parser.extendParser
    });
};
