"use strict";

const chai = require("chai");

const $core        = require("@loquat/core")();
const $prim        = require("@loquat/prim")($core);
const $char        = require("@loquat/char")($core);
const $combinators = require("@loquat/combinators")($core);

const $language = require("./lib/language.js")();
const $token    = require("./lib/token.js")($core, { $prim, $char, $combinators });

const $testutil = require("@loquat/testutil")($core);

Object.assign(global, { $core, $language, $token, $testutil });
chai.use($testutil.plugin);

require("./test/language.js");
require("./test/token.js");
