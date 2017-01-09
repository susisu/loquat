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
        forever: function () {
            return forever(this);
        },
        discard: function () {
            return discard(this);
        },
        void: function () {
            return discard(this);
        },
        join: function () {
            return join(this);
        },
        when: function (cond) {
            return when(cond, this);
        },
        unless: function (cond) {
            return unless(cond, this);
        },
        filter: function (test) {
            return mfilter(test, this);
        }
    });
};
