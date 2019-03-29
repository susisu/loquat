"use strict";

module.exports = (_core, { _prim, _combinators }) => {
  const { isParser } = _core;

  const { left, tryParse } = _prim;

  const {
    option,
    optionMaybe,
    optional,
    between,
    many1,
    skipMany1,
    sepBy,
    sepBy1,
    sepEndBy,
    sepEndBy1,
    endBy,
    endBy1,
    count,
    notFollowedBy,
    reduceManyTill,
    manyTill,
    skipManyTill,
  } = _combinators;

  return Object.freeze({
    option(val) {
      return option(this, val);
    },
    optionMaybe() {
      return optionMaybe(this);
    },
    optional() {
      return optional(this);
    },
    between(open, close) {
      return between(open, close, this);
    },
    many1() {
      return many1(this);
    },
    skipMany1(parser) {
      return isParser(parser)
        ? left(this, skipMany1(parser))
        : skipMany1(this);
    },
    sepBy(sep) {
      return sepBy(this, sep);
    },
    sepBy1(sep) {
      return sepBy1(this, sep);
    },
    sepEndBy(sep) {
      return sepEndBy(this, sep);
    },
    sepEndBy1(sep) {
      return sepEndBy1(this, sep);
    },
    endBy(sep) {
      return endBy(this, sep);
    },
    endBy1(sep) {
      return endBy1(this, sep);
    },
    count(num) {
      return count(num, this);
    },
    notFollowedBy(parser) {
      return isParser(parser)
        ? tryParse(left(this, notFollowedBy(parser)))
        : notFollowedBy(this);
    },
    reduceManyTill(end, callback, initVal) {
      return reduceManyTill(this, end, callback, initVal);
    },
    manyTill(end) {
      return manyTill(this, end);
    },
    skipManyTill(parser, end) {
      return isParser(end)
        ? left(this, skipManyTill(parser, end))
        : skipManyTill(this, parser);
    },
  });
};
