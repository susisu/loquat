/*
 * loquat-combinators
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
  const _prim = require("loquat-prim")(_core);

  const _combinators = require("./lib/combinators.js")(_core, { _prim });

  if (opts.sugar) {
    const _sugar = require("./lib/sugar.js")(_core, { _prim, _combinators });
    _core.extendParser(_sugar);
  }

  return Object.freeze({
    choice        : _combinators.choice,
    option        : _combinators.option,
    optionMaybe   : _combinators.optionMaybe,
    optional      : _combinators.optional,
    between       : _combinators.between,
    many1         : _combinators.many1,
    skipMany1     : _combinators.skipMany1,
    sepBy         : _combinators.sepBy,
    sepBy1        : _combinators.sepBy1,
    sepEndBy      : _combinators.sepEndBy,
    sepEndBy1     : _combinators.sepEndBy1,
    endBy         : _combinators.endBy,
    endBy1        : _combinators.endBy1,
    count         : _combinators.count,
    chainl        : _combinators.chainl,
    chainl1       : _combinators.chainl1,
    chainr        : _combinators.chainr,
    chainr1       : _combinators.chainr1,
    anyToken      : _combinators.anyToken,
    notFollowedBy : _combinators.notFollowedBy,
    eof           : _combinators.eof,
    reduceManyTill: _combinators.reduceManyTill,
    manyTill      : _combinators.manyTill,
    skipManyTill  : _combinators.skipManyTill,
  });
};
