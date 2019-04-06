"use strict";

const chai = require("chai");

const _core        = require("@loquat/core")();
const _prim        = require("@loquat/prim")(_core);
const _char        = require("@loquat/char")(_core);
const _combinators = require("@loquat/combinators")(_core);

const _language = require("./lib/language.js")();
const _token    = require("./lib/token.js")(_core, { _prim, _char, _combinators });

const _test = require("@loquat/test")(_core);

Object.assign(global, { _core, _language, _token, _test });
chai.use(_test.plugin);

require("./test/language.js");
require("./test/token.js");
