/*
 * loquat-combinators / sugar.js
 */

/**
 * @module sugar
 */

"use strict";

module.exports = (_core, _prim, _combinators) => {
    const isParser = _core.isParser;

    const left     = _prim.left;
    const tryParse = _prim.tryParse;

    const option         = _combinators.option;
    const optionMaybe    = _combinators.optionMaybe;
    const optional       = _combinators.optional;
    const between        = _combinators.between;
    const many1          = _combinators.many1;
    const skipMany1      = _combinators.skipMany1;
    const sepBy          = _combinators.sepBy;
    const sepBy1         = _combinators.sepBy1;
    const sepEndBy       = _combinators.sepEndBy;
    const sepEndBy1      = _combinators.sepEndBy1;
    const endBy          = _combinators.endBy;
    const endBy1         = _combinators.endBy1;
    const count          = _combinators.count;
    const notFollowedBy  = _combinators.notFollowedBy;
    const reduceManyTill = _combinators.reduceManyTill;
    const manyTill       = _combinators.manyTill;
    const skipManyTill   = _combinators.skipManyTill;

    return Object.freeze({
        option: function (val) {
            return option(this, val);
        },
        optionMaybe: function () {
            return optionMaybe(this);
        },
        optional: function () {
            return optional(this);
        },
        between: function (open, close) {
            return between(open, close, this);
        },
        many1: function () {
            return many1(this);
        },
        skipMany1: function (parser) {
            return isParser(parser)
                ? left(this, skipMany1(parser))
                : skipMany1(this);
        },
        sepBy: function (sep) {
            return sepBy(this, sep);
        },
        sepBy1: function (sep) {
            return sepBy1(this, sep);
        },
        sepEndBy: function (sep) {
            return sepEndBy(this, sep);
        },
        sepEndBy1: function (sep) {
            return sepEndBy1(this, sep);
        },
        endBy: function (sep) {
            return endBy(this, sep);
        },
        endBy1: function (sep) {
            return endBy1(this, sep);
        },
        count: function (num) {
            return count(num, this);
        },
        notFollowedBy: function (parser) {
            return isParser(parser)
                ? tryParse(left(this, notFollowedBy(parser)))
                : notFollowedBy(this);
        },
        reduceManyTill: function (end, callback, initVal) {
            return reduceManyTill(this, end, callback, initVal);
        },
        manyTill: function (end) {
            return manyTill(this, end);
        },
        skipManyTill: function (parser, end) {
            return isParser(end)
                ? left(this, skipManyTill(parser, end))
                : skipManyTill(this, parser);
        }
    });
};
