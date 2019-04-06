"use strict";

module.exports = ($core, { $prim }) => {
  const { isParser } = $core;

  const {
    map,
    pure,
    ap,
    left,
    right,
    bind,
    then,
    fail,
    cont,
    done,
    mplus,
    label,
    hidden,
    tryParse,
    lookAhead,
    reduceMany,
    many,
    skipMany,
  } = $prim;

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
    fail(str) {
      return then(this, fail(str));
    },
    cont() {
      return cont(this);
    },
    done() {
      return done(this);
    },
    or(parser) {
      return mplus(this, parser);
    },
    label(str) {
      return label(this, str);
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
