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

module.exports = ($core, opts = {}) => {
  const $prim = require("@loquat/prim")($core);

  const $combinators = require("./lib/combinators.js")($core, { $prim });

  if (opts.sugar) {
    const $sugar = require("./lib/sugar.js")($core, { $prim, $combinators });
    $core.extendParser($sugar);
  }

  return Object.freeze({
    choice        : $combinators.choice,
    option        : $combinators.option,
    optionMaybe   : $combinators.optionMaybe,
    optional      : $combinators.optional,
    between       : $combinators.between,
    many1         : $combinators.many1,
    skipMany1     : $combinators.skipMany1,
    sepBy         : $combinators.sepBy,
    sepBy1        : $combinators.sepBy1,
    sepEndBy      : $combinators.sepEndBy,
    sepEndBy1     : $combinators.sepEndBy1,
    endBy         : $combinators.endBy,
    endBy1        : $combinators.endBy1,
    count         : $combinators.count,
    chainl        : $combinators.chainl,
    chainl1       : $combinators.chainl1,
    chainr        : $combinators.chainr,
    chainr1       : $combinators.chainr1,
    anyToken      : $combinators.anyToken,
    notFollowedBy : $combinators.notFollowedBy,
    eof           : $combinators.eof,
    reduceManyTill: $combinators.reduceManyTill,
    manyTill      : $combinators.manyTill,
    skipManyTill  : $combinators.skipManyTill,
  });
};
