/*
 * loquat
 */

"use strict";

module.exports = opts => {
    if (opts === undefined) {
        opts = {};
    }

    const _core = require("loquat-core")();

    const _loquat = Object.assign({}, _core);

    Object.defineProperties(_loquat, {
        "extensions": {
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
     * @returns {*}
     */
    function use(ext, opts) {
        if (opts === undefined) {
            opts = {};
        }
        const _ext = ext(_core, opts.options);
        if (!opts.qualified) {
            Object.assign(_loquat, _ext);
        }
        if (opts.name !== undefined) {
            _loquat.extensions[opts.name] = _ext;
        }
        return _ext;
    }

    if (!opts.noUsingDefaults) {
        use(require("loquat-prim"),        { name: "prim",        options: { sugar: true } });
        use(require("loquat-char"),        { name: "char",        options: { sugar: true } });
        use(require("loquat-combinators"), { name: "combinators", options: { sugar: true } });
        use(require("loquat-monad"),       { name: "monad",       options: { sugar: true } });
        use(require("loquat-expr"),        { name: "expr",        options: {} });
        use(require("loquat-qo"),          { name: "qo",          options: {} });
    }

    return _loquat;
};
