/*
 * loquat-simple
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

const _core        = require("loquat-core")();
const _prim        = require("loquat-prim")(_core, { sugar: true });
const _char        = require("loquat-char")(_core, { sugar: true });
const _combinators = require("loquat-combinators")(_core, { sugar: true });
const _monad       = require("loquat-monad")(_core, { sugar: true });
const _expr        = require("loquat-expr")(_core);
const _qo          = require("loquat-qo")(_core);
const _token       = require("loquat-token")(_core);

const _loquat = Object.freeze(Object.assign({},
  _core,
  _prim,
  _char,
  _combinators,
  _monad,
  _expr,
  _qo,
  _token
));

module.exports = _loquat;
