/*
 * @loquat/monad
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

module.exports = ($core, opts = {}) => {
  const $prim = require("@loquat/prim")($core);

  const $monad = require("./lib/monad.js")($core, { $prim });

  if (opts.sugar) {
    const $sugar = require("./lib/sugar.js")($core, { $monad });
    $core.extendParser($sugar);
  }

  return Object.freeze({
    forever    : $monad.forever,
    discard    : $monad.discard,
    void       : $monad.discard,
    join       : $monad.join,
    when       : $monad.when,
    unless     : $monad.unless,
    liftM      : $monad.liftM,
    liftM2     : $monad.liftM2,
    liftM3     : $monad.liftM3,
    liftM4     : $monad.liftM4,
    liftM5     : $monad.liftM5,
    ltor       : $monad.ltor,
    rtol       : $monad.rtol,
    sequence   : $monad.sequence,
    sequence_  : $monad.sequence_,
    mapM       : $monad.mapM,
    mapM_      : $monad.mapM_,
    forM       : $monad.forM,
    forM_      : $monad.forM_,
    filterM    : $monad.filterM,
    zipWithM   : $monad.zipWithM,
    zipWithM_  : $monad.zipWithM_,
    foldM      : $monad.foldM,
    foldM_     : $monad.foldM_,
    replicateM : $monad.replicateM,
    replicateM_: $monad.replicateM_,
    guard      : $monad.guard,
    msum       : $monad.msum,
    mfilter    : $monad.mfilter,
  });
};
