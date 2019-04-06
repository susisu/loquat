/*
 * loquat
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

module.exports = (opts = {}) => {
  const _core = require("loquat-core")();

  const _loquat = Object.assign({}, _core);

  Object.defineProperties(_loquat, {
    "extensions": {
      writable    : false,
      configurable: false,
      enumerable  : true,
      value       : {},
    },
    "use": {
      writable    : false,
      configurable: false,
      enumerable  : true,
      value       : use,
    },
  });

  function use(ext, opts = {}) {
    const _ext = ext(_core, opts.options);
    if (!opts.qualified) {
      Object.assign(_loquat, _ext);
    }
    if (opts.name !== undefined) {
      _loquat.extensions[opts.name] = _ext;
    }
    return _ext;
  }

  if (!opts.noUsingDefaults) {
    use(require("loquat-prim"),        { name: "prim",        options: { sugar: true } });
    use(require("loquat-char"),        { name: "char",        options: { sugar: true } });
    use(require("loquat-combinators"), { name: "combinators", options: { sugar: true } });
    use(require("loquat-monad"),       { name: "monad",       options: { sugar: true } });
    use(require("loquat-expr"),        { name: "expr",        options: {} });
    use(require("loquat-qo"),          { name: "qo",          options: {} });
  }

  return _loquat;
};
