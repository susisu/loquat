"use strict";

const chai = require("chai");

const _core = require("loquat-core")();
const _prim = require("loquat-prim")(_core);

const _monad = require("./lib/monad.js")(_core, { _prim });
const _sugar = require("./lib/sugar.js")(_core, { _monad });

const _test = require("loquat-test")(_core);

Object.assign(global, { _core, _monad, _sugar, _test });
chai.use(_test.plugin);

require("./test/monad.js");
require("./test/sugar.js");
