/*
 * @loquat/token
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

module.exports = ($core, _opts) => {
  const $prim        = require("@loquat/prim")($core);
  const $char        = require("@loquat/char")($core);
  const $combinators = require("@loquat/combinators")($core);

  const $language = require("./lib/language.js")();
  const $token    = require("./lib/token.js")($core, { $prim, $char, $combinators });

  return Object.freeze({
    LanguageDef    : $language.LanguageDef,
    makeTokenParser: $token.makeTokenParser,
  });
};
