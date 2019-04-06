"use strict";

module.exports = ({ $utils, $pos, $error, $stream, $parser }) =>
  Object.freeze({
    show        : $utils.show,
    unconsString: $utils.unconsString,

    SourcePos: $pos.SourcePos,

    ErrorMessageType: $error.ErrorMessageType,
    ErrorMessage    : $error.ErrorMessage,
    ParseError      : $error.ParseError,
    StrictParseError: $error.StrictParseError,
    LazyParseError  : $error.LazyParseError,

    Config      : $parser.Config,
    State       : $parser.State,
    Result      : $parser.Result,
    Parser      : $parser.Parser,
    StrictParser: $parser.StrictParser,
    LazyParser  : $parser.LazyParser,
    lazy        : $parser.lazy,
    parse       : $parser.parse,
    isParser    : $parser.isParser,
    extendParser: $parser.extendParser,

    uncons     : $stream.uncons,
    ArrayStream: $stream.ArrayStream,
  });
