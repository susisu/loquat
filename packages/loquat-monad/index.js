/*
 * loquat-monad
 */

"use strict";

module.exports = (_core, opts) => {
    if (opts === undefined) {
        opts = {};
    }

    const _prim  = require("loquat-prim")(_core);
    const _monad = require("./lib/monad.js")(_core, _prim);

    if (opts.sugar) {
        const _sugar = require("./lib/sugar.js")(_core, _monad);
        _core.extendParser(_sugar);
    }

    return Object.freeze({
        forever    : _monad.forever,
        discard    : _monad.discard,
        void       : _monad.discard,
        join       : _monad.join,
        when       : _monad.when,
        unless     : _monad.unless,
        liftM      : _monad.liftM,
        liftM2     : _monad.liftM2,
        liftM3     : _monad.liftM3,
        liftM4     : _monad.liftM4,
        liftM5     : _monad.liftM5,
        ltor       : _monad.ltor,
        rtol       : _monad.rtol,
        sequence   : _monad.sequence,
        sequence_  : _monad.sequence_,
        mapM       : _monad.mapM,
        mapM_      : _monad.mapM_,
        forM       : _monad.forM,
        forM_      : _monad.forM_,
        filterM    : _monad.filterM,
        zipWithM   : _monad.zipWithM,
        zipWithM_  : _monad.zipWithM_,
        foldM      : _monad.foldM,
        foldM_     : _monad.foldM_,
        replicateM : _monad.replicateM,
        replicateM_: _monad.replicateM_,
        guard      : _monad.guard,
        msum       : _monad.msum,
        mfilter    : _monad.mfilter
    });
};
