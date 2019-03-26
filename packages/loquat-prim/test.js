"use strict";

const chai = require("chai");

const _core  = require("loquat-core")();
const _prim  = require("./lib/prim.js")(_core);
const _sugar = require("./lib/sugar.js")(_core, { _prim });

const _test = require("loquat-test")(_core);

Object.assign(global, { _core, _prim, _sugar, _test });
chai.use(_test.plugin);

require("./test/prim.js");
require("./test/sugar.js");
