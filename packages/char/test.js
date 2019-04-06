"use strict";

const chai = require("chai");

const _core = require("@loquat/core")();
const _prim = require("@loquat/prim")(_core);

const _char  = require("./lib/char.js")(_core, { _prim });
const _sugar = require("./lib/sugar.js")(_core, { _char });

const _test = require("@loquat/testutil")(_core);

Object.assign(global, { _core, _char, _sugar, _test });
chai.use(_test.plugin);

require("./test/char.js");
require("./test/sugar.js");
