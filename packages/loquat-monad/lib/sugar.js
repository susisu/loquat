/*
 * loquat-monad / sugar.js
 */

/**
 * @module sugar
 */

"use strict";

module.exports = (_core, _monad) => {
  const forever = _monad.forever;
  const discard = _monad.discard;
  const join    = _monad.join;
  const when    = _monad.when;
  const unless  = _monad.unless;
  const mfilter = _monad.mfilter;

  return Object.freeze({
    forever() {
      return forever(this);
    },
    discard() {
      return discard(this);
    },
    void() {
      return discard(this);
    },
    join() {
      return join(this);
    },
    when(cond) {
      return when(cond, this);
    },
    unless(cond) {
      return unless(cond, this);
    },
    filter(test) {
      return mfilter(test, this);
    },
  });
};
