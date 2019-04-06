/*
 * loquat-char
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

  const _char = require("./lib/char.js")(_core, { _prim });

  if (opts.sugar) {
    const _sugar = require("./lib/sugar.js")(_core, { _char });
    _core.extendParser(_sugar);
  }

  return Object.freeze({
    string    : _char.string,
    satisfy   : _char.satisfy,
    oneOf     : _char.oneOf,
    noneOf    : _char.noneOf,
    char      : _char.char,
    anyChar   : _char.anyChar,
    space     : _char.space,
    spaces    : _char.spaces,
    newline   : _char.newline,
    tab       : _char.tab,
    upper     : _char.upper,
    lower     : _char.lower,
    letter    : _char.letter,
    digit     : _char.digit,
    alphaNum  : _char.alphaNum,
    octDigit  : _char.octDigit,
    hexDigit  : _char.hexDigit,
    manyChars : _char.manyChars,
    manyChars1: _char.manyChars1,
    regexp    : _char.regexp,
    regexpPrim: _char.regexpPrim,
  });
};
