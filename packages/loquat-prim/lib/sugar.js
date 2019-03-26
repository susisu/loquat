"use strict";

module.exports = (_core, { _prim }) => {
  const { isParser } = _core;

  const {
    map,
    pure,
    ap,
    left,
    right,
    bind,
    then,
    fail,
    mplus,
    label,
    hidden,
    tryParse,
    lookAhead,
    reduceMany,
    many,
    skipMany,
  } = _prim;

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
