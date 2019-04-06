"use strict";

const chai = require("chai");

const $core = require("@loquat/core")();
const $prim = require("@loquat/prim")($core);

const $combinators = require("./lib/combinators.js")($core, { $prim });
const $sugar       = require("./lib/sugar.js")($core, { $prim, $combinators });

const $testutil = require("@loquat/testutil")($core);

Object.assign(global, { $core, $combinators, $sugar, $testutil });
chai.use($testutil.plugin);

require("./test/combinators.js");
require("./test/sugar.js");
