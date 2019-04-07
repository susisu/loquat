/*
 * @loquat/prim
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
  const $prim = require("./lib/prim.js")($core);

  if (opts.sugar) {
    const $sugar = require("./lib/sugar.js")($core, { $prim });
    $core.extendParser($sugar);
  }

  return Object.freeze({
    map              : $prim.map,
    fmap             : $prim.fmap,
    pure             : $prim.pure,
    return           : $prim.pure,
    ap               : $prim.ap,
    left             : $prim.left,
    right            : $prim.right,
    bind             : $prim.bind,
    then             : $prim.then,
    and              : $prim.then,
    fail             : $prim.fail,
    tailRecM         : $prim.tailRecM,
    ftailRecM        : $prim.ftailRecM,
    cont             : $prim.cont,
    done             : $prim.done,
    mzero            : $prim.mzero,
    mplus            : $prim.mplus,
    or               : $prim.mplus,
    label            : $prim.label,
    labels           : $prim.labels,
    hidden           : $prim.hidden,
    unexpected       : $prim.unexpected,
    tryParse         : $prim.tryParse,
    try              : $prim.tryParse,
    lookAhead        : $prim.lookAhead,
    reduceMany       : $prim.reduceMany,
    many             : $prim.many,
    skipMany         : $prim.skipMany,
    tokens           : $prim.tokens,
    token            : $prim.token,
    tokenPrim        : $prim.tokenPrim,
    getParserState   : $prim.getParserState,
    setParserState   : $prim.setParserState,
    updateParserState: $prim.updateParserState,
    getConfig        : $prim.getConfig,
    setConfig        : $prim.setConfig,
    getInput         : $prim.getInput,
    setInput         : $prim.setInput,
    getPosition      : $prim.getPosition,
    setPosition      : $prim.setPosition,
    getState         : $prim.getState,
    setState         : $prim.setState,
  });
};
