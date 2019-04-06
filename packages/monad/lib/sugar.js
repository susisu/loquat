"use strict";

module.exports = (_core, { _monad }) => {
  const {
    forever,
    discard,
    join,
    when,
    unless,
    mfilter,
  } = _monad;

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
