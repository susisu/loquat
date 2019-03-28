"use strict";

const chai = require("chai");

const _core = require("loquat-core")();
const _prim = require("loquat-prim")(_core);
const _test = require("loquat-test")(_core);

const _combinators = require("./lib/combinators.js")(_core, { _prim });
const _sugar       = require("./lib/sugar.js")(_core, { _prim, _combinators });

Object.assign(global, { _core, _test, _combinators, _sugar });
chai.use(_test.plugin);

require("./test/combinators.js");
require("./test/sugar.js");
