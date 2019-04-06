/*
 * loquat-test
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

module.exports = _core => {
  const _aux    = require("./lib/aux")({ _core });
  const _assert = require("./lib/assert")({ _core, _aux });
  const _helper = require("./lib/helper")({ _core });

  return {
    plugin: (chai, utils) => {
      _assert(chai, utils);
    },
    helper: _helper,
  };
};
