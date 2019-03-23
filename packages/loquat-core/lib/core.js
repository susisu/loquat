"use strict";

module.exports = ({ _utils, _pos, _error, _stream, _parser }) =>
  Object.freeze({
    show        : _utils.show,
    unconsString: _utils.unconsString,

    SourcePos: _pos.SourcePos,

    ErrorMessageType: _error.ErrorMessageType,
    ErrorMessage    : _error.ErrorMessage,
    ParseError      : _error.ParseError,
    StrictParseError: _error.StrictParseError,
    LazyParseError  : _error.LazyParseError,

    uncons     : _stream.uncons,
    ArrayStream: _stream.ArrayStream,

    Config      : _parser.Config,
    State       : _parser.State,
    Result      : _parser.Result,
    Parser      : _parser.Parser,
    StrictParser: _parser.StrictParser,
    LazyParser  : _parser.LazyParser,
    lazy        : _parser.lazy,
    parse       : _parser.parse,
    isParser    : _parser.isParser,
    assertParser: _parser.assertParser,
    extendParser: _parser.extendParser,
  });
