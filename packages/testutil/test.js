"use strict";

const chai = require("chai");

const $core = require("@loquat/core")();

const $aux     = require("./lib/aux")({ $core });
const $assert  = require("./lib/assert")({ $core, $aux });
const $helpers = require("./lib/helpers")({ $core });

Object.assign(global, { $core, $aux, $helpers });
chai.use($assert);

require("./test/aux");
require("./test/assert");
require("./test/helpers");
