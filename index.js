/*
 * loquat
 * copyright (c) 2016 Susisu
 */

"use strict";

const _core = require("loquat-core")();

const _loquat = Object.assign({}, _core);

Object.defineProperties(_loquat, {
    "exts": {
        writable    : false,
        configurable: false,
        enumerable  : true,
        value       : {}
    },
    "use": {
        writable    : false,
        configurable: false,
        enumerable  : true,
        value       : use
    }
});

/**
 * @param {Function} ext
 * @param {Object} [opts = {}]
 * @returns {undefined}
 */
function use(ext, opts) {
    if (opts === undefined) {
        opts = {};
    }
    const _ext = ext(_core, opts.opts);
    if (!opts.qualified) {
        Object.assign(_loquat, _ext);
    }
    if (opts.as !== undefined) {
        _loquat.exts[opts.as] = _ext;
    }
}

use(require("loquat-prim"),        { as: "prim",        opts: { sugar: true } });
use(require("loquat-char"),        { as: "char",        opts: { sugar: true } });
use(require("loquat-combinators"), { as: "combinators", opts: { sugar: true } });
use(require("loquat-monad"),       { as: "monad",       opts: { sugar: true } });
use(require("loquat-expr"),        { as: "expr",        opts: {} });
use(require("loquat-qo"),          { as: "qo",          opts: {} });

module.exports = _loquat;
