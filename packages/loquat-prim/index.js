/*
 * loquat-prim
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
  const _prim = require("./lib/prim.js")(_core);

  if (opts.sugar) {
    const _sugar = require("./lib/sugar.js")(_core, { _prim });
    _core.extendParser(_sugar);
  }

  return Object.freeze({
    map              : _prim.map,
    fmap             : _prim.fmap,
    pure             : _prim.pure,
    return           : _prim.pure,
    ap               : _prim.ap,
    left             : _prim.left,
    right            : _prim.right,
    bind             : _prim.bind,
    then             : _prim.then,
    and              : _prim.then,
    fail             : _prim.fail,
    tailRecM         : _prim.tailRecM,
    ftailRecM        : _prim.ftailRecM,
    cont             : _prim.cont,
    done             : _prim.done,
    mzero            : _prim.mzero,
    mplus            : _prim.mplus,
    or               : _prim.mplus,
    label            : _prim.label,
    labels           : _prim.labels,
    hidden           : _prim.hidden,
    unexpected       : _prim.unexpected,
    tryParse         : _prim.tryParse,
    try              : _prim.tryParse,
    lookAhead        : _prim.lookAhead,
    reduceMany       : _prim.reduceMany,
    many             : _prim.many,
    skipMany         : _prim.skipMany,
    tokens           : _prim.tokens,
    token            : _prim.token,
    tokenPrim        : _prim.tokenPrim,
    getParserState   : _prim.getParserState,
    setParserState   : _prim.setParserState,
    updateParserState: _prim.updateParserState,
    getConfig        : _prim.getConfig,
    setConfig        : _prim.setConfig,
    getInput         : _prim.getInput,
    setInput         : _prim.setInput,
    getPosition      : _prim.getPosition,
    setPosition      : _prim.setPosition,
    getState         : _prim.getState,
    setState         : _prim.setState,
  });
};
