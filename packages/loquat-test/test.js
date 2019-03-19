"use strict";

const chai = require("chai");

const _core = require("loquat-core")();

Object.assign(global, { _core });
chai.use(require("./index")(_core));

require("./test/assert");
