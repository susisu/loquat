"use strict";

const chai = require("chai");

const _core = require("@loquat/core")();

const _qo = require("./lib/qo.js")(_core);

const _test = require("@loquat/test")(_core);

Object.assign(global, { _core, _qo, _test });
chai.use(_test.plugin);

require("./test/qo.js");
