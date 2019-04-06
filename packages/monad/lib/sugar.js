"use strict";

module.exports = ($core, { $monad }) => {
  const {
    forever,
    discard,
    join,
    when,
    unless,
    mfilter,
  } = $monad;

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
