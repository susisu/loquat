"use strict";

const chai = require("chai");

const _core = require("loquat-core")();
const _test = require("loquat-test")(_core);

const _prim  = require("./lib/prim.js")(_core);
const _sugar = require("./lib/sugar.js")(_core, { _prim });

Object.assign(global, { _core, _test, _prim, _sugar });
chai.use(_test.plugin);

require("./test/prim.js");
require("./test/sugar.js");
