"use strict";

const chai = require("chai");

const $core = require("@loquat/core")();
const $prim = require("@loquat/prim")($core);

const $monad = require("./lib/monad.js")($core, { $prim });
const $sugar = require("./lib/sugar.js")($core, { $monad });

const $testutil = require("@loquat/testutil")($core);

Object.assign(global, { $core, $monad, $sugar, $testutil });
chai.use($testutil.plugin);

require("./test/monad.js");
require("./test/sugar.js");
