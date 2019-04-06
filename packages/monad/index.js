/*
 * loquat-monad
 *
 * Copyright 2019 Susisu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

module.exports = (_core, opts = {}) => {
  const _prim = require("@loquat/prim")(_core);

  const _monad = require("./lib/monad.js")(_core, { _prim });

  if (opts.sugar) {
    const _sugar = require("./lib/sugar.js")(_core, { _monad });
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
    mfilter    : _monad.mfilter,
  });
};
