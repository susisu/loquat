"use strict";

const chai = require("chai");

const _core = require("loquat-core")();
const _prim = require("loquat-prim")(_core);
const _test = require("loquat-test")(_core);

const _monad = require("./lib/monad.js")(_core, { _prim });
const _sugar = require("./lib/sugar.js")(_core, { _monad });

Object.assign(global, { _core, _test, _monad, _sugar });
chai.use(_test.plugin);

require("./test/monad.js");
require("./test/sugar.js");
