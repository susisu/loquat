"use strict";

const chai = require("chai");

const _core = require("loquat-core")();

const _aux = require("./lib/aux")({ _core });
const _assert = require("./lib/assert")({ _core, _aux });

Object.assign(global, { _core, _aux });
chai.use(_assert);

require("./test/aux");
require("./test/assert");
