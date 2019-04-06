"use strict";

const chai = require("chai");

const $core = require("@loquat/core")();
const $prim = require("@loquat/prim")($core);

const $char  = require("./lib/char.js")($core, { $prim });
const $sugar = require("./lib/sugar.js")($core, { $char });

const $testutil = require("@loquat/testutil")($core);

Object.assign(global, { $core, $char, $sugar, $testutil });
chai.use($testutil.plugin);

require("./test/char.js");
require("./test/sugar.js");
