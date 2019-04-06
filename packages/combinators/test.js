"use strict";

const chai = require("chai");

const _core = require("@loquat/core")();
const _prim = require("@loquat/prim")(_core);

const _combinators = require("./lib/combinators.js")(_core, { _prim });
const _sugar       = require("./lib/sugar.js")(_core, { _prim, _combinators });

const _test = require("@loquat/test")(_core);

Object.assign(global, { _core, _combinators, _sugar, _test });
chai.use(_test.plugin);

require("./test/combinators.js");
require("./test/sugar.js");
