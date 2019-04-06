/*
 * loquat-core
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

module.exports = () => {
  const _utils  = require("./lib/utils")();
  const _pos    = require("./lib/pos")();
  const _error  = require("./lib/error")({ _pos });
  const _parser = require("./lib/parser")({ _pos, _error });
  const _stream = require("./lib/stream")({ _utils });
  const _core   = require("./lib/core")({ _utils, _pos, _error, _parser, _stream });
  return _core;
};
