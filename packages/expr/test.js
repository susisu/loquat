"use strict";

const chai = require("chai");

const $core        = require("@loquat/core")();
const $prim        = require("@loquat/prim")($core);
const $combinators = require("@loquat/combinators")($core);

const $expr = require("./lib/expr.js")($core, { $prim, $combinators });

const $testutil = require("@loquat/testutil")($core);

Object.assign(global, { $core, $expr, $testutil });
chai.use($testutil.plugin);

require("./test/expr.js");
