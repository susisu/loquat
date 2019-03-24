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
    map(func) {
      return map(this, func);
    },
    return(val) {
      return then(this, pure(val));
    },
    ap(parser) {
      return ap(this, parser);
    },
    left(parser) {
      return left(this, parser);
    },
    skip(parser) {
      return left(this, parser);
    },
    right(parser) {
      return right(this, parser);
    },
    bind(func) {
      return bind(this, func);
    },
    and(parser) {
      return then(this, parser);
    },
    fail(msgStr) {
      return then(this, fail(msgStr));
    },
    done() {
      return map(this, x => ({ done: true, value: x }));
    },
    cont() {
      return map(this, x => ({ done: false, value: x }));
    },
    or(parser) {
      return mplus(this, parser);
    },
    label(labelStr) {
      return label(this, labelStr);
    },
    hidden() {
      return hidden(this);
    },
    try() {
      return tryParse(this);
    },
    lookAhead() {
      return lookAhead(this);
    },
    reduceMany(callback, initVal) {
      return reduceMany(this, callback, initVal);
    },
    many() {
      return many(this);
    },
    skipMany(parser) {
      return isParser(parser)
        ? left(this, skipMany(parser))
        : skipMany(this);
    },
  });
};
