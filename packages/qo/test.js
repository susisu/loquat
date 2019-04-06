"use strict";

const chai = require("chai");

const $core = require("@loquat/core")();

const $qo = require("./lib/qo.js")($core);

const $testutil = require("@loquat/testutil")($core);

Object.assign(global, { $core, $qo, $testutil });
chai.use($testutil.plugin);

require("./test/qo.js");
