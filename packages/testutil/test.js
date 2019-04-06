"use strict";

const chai = require("chai");

const $core = require("@loquat/core")();

const $aux    = require("./lib/aux")({ $core });
const $assert = require("./lib/assert")({ $core, $aux });
const $helper = require("./lib/helper")({ $core });

Object.assign(global, { $core, $aux, $helper });
chai.use($assert);

require("./test/aux");
require("./test/assert");
require("./test/helper");
