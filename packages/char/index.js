/*
 * @loquat/char
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

  const $char = require("./lib/char.js")($core, { $prim });

  if (opts.sugar) {
    const $sugar = require("./lib/sugar.js")($core, { $char });
    $core.extendParser($sugar);
  }

  return Object.freeze({
    string    : $char.string,
    satisfy   : $char.satisfy,
    oneOf     : $char.oneOf,
    noneOf    : $char.noneOf,
    char      : $char.char,
    anyChar   : $char.anyChar,
    space     : $char.space,
    spaces    : $char.spaces,
    newline   : $char.newline,
    tab       : $char.tab,
    upper     : $char.upper,
    lower     : $char.lower,
    letter    : $char.letter,
    digit     : $char.digit,
    alphaNum  : $char.alphaNum,
    octDigit  : $char.octDigit,
    hexDigit  : $char.hexDigit,
    manyChars : $char.manyChars,
    manyChars1: $char.manyChars1,
    regexp    : $char.regexp,
    regexpPrim: $char.regexpPrim,
  });
};
