"use strict";

const chai = require("chai");

const _core        = require("@loquat/core")();
const _prim        = require("@loquat/prim")(_core);
const _combinators = require("@loquat/combinators")(_core);

const _expr = require("./lib/expr.js")(_core, { _prim, _combinators });

const _test = require("@loquat/test")(_core);

Object.assign(global, { _core, _expr, _test });
chai.use(_test.plugin);

require("./test/expr.js");
