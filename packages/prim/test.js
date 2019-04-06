"use strict";

const chai = require("chai");

const $core = require("@loquat/core")();

const $prim  = require("./lib/prim.js")($core);
const $sugar = require("./lib/sugar.js")($core, { $prim });

const $testutil = require("@loquat/testutil")($core);

Object.assign(global, { $core, $prim, $sugar, $testutil });
chai.use($testutil.plugin);

require("./test/prim.js");
require("./test/sugar.js");
