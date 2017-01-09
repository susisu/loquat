/*
 * loquat-prim / sugar.js
 */

/**
 * @module sugar
 */

"use strict";

module.exports = (_core, _prim) => {
    const isParser = _core.isParser;

    const map        = _prim.map;
    const pure       = _prim.pure;
    const ap         = _prim.ap;
    const left       = _prim.left;
    const right      = _prim.right;
    const bind       = _prim.bind;
    const then       = _prim.then;
    const fail       = _prim.fail;
    const mplus      = _prim.mplus;
    const label      = _prim.label;
    const hidden     = _prim.hidden;
    const tryParse   = _prim.tryParse;
    const lookAhead  = _prim.lookAhead;
    const reduceMany = _prim.reduceMany;
    const many       = _prim.many;
    const skipMany   = _prim.skipMany;

    return Object.freeze({
        map: function (func) {
            return map(this, func);
        },
        return: function (val) {
            return then(this, pure(val));
        },
        ap: function (parser) {
            return ap(this, parser);
        },
        left: function (parser) {
            return left(this, parser);
        },
        skip: function (parser) {
            return left(this, parser);
        },
        right: function (parser) {
            return right(this, parser);
        },
        bind: function (func) {
            return bind(this, func);
        },
        and: function (parser) {
            return then(this, parser);
        },
        fail: function (msgStr) {
            return then(this, fail(msgStr));
        },
        done: function () {
            return map(this, x => ({ done: true, value: x }));
        },
        cont: function () {
            return map(this, x => ({ done: false, value: x }));
        },
        or: function (parser) {
            return mplus(this, parser);
        },
        label: function (labelStr) {
            return label(this, labelStr);
        },
        hidden: function () {
            return hidden(this);
        },
        try: function () {
            return tryParse(this);
        },
        lookAhead: function () {
            return lookAhead(this);
        },
        reduceMany: function (callback, initVal) {
            return reduceMany(this, callback, initVal);
        },
        many: function () {
            return many(this);
        },
        skipMany: function (parser) {
            return isParser(parser)
                ? left(this, skipMany(parser))
                : skipMany(this);
        }
    });
};
