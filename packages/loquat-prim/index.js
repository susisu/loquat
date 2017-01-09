/*
 * loquat-prim
 */

"use strict";

module.exports = (_core, opts) => {
    if (opts === undefined) {
        opts = {};
    }

    const _prim = require("./lib/prim.js")(_core);

    if (opts.sugar) {
        const _sugar = require("./lib/sugar.js")(_core, _prim);
        _core.extendParser(_sugar);
    }

    return Object.freeze({
        map              : _prim.map,
        fmap             : _prim.fmap,
        pure             : _prim.pure,
        return           : _prim.pure,
        ap               : _prim.ap,
        left             : _prim.left,
        right            : _prim.right,
        bind             : _prim.bind,
        then             : _prim.then,
        and              : _prim.then,
        fail             : _prim.fail,
        tailRecM         : _prim.tailRecM,
        ftailRecM        : _prim.ftailRecM,
        mzero            : _prim.mzero,
        mplus            : _prim.mplus,
        or               : _prim.mplus,
        label            : _prim.label,
        labels           : _prim.labels,
        hidden           : _prim.hidden,
        unexpected       : _prim.unexpected,
        tryParse         : _prim.tryParse,
        try              : _prim.tryParse,
        lookAhead        : _prim.lookAhead,
        reduceMany       : _prim.reduceMany,
        many             : _prim.many,
        skipMany         : _prim.skipMany,
        tokens           : _prim.tokens,
        token            : _prim.token,
        tokenPrim        : _prim.tokenPrim,
        getParserState   : _prim.getParserState,
        setParserState   : _prim.setParserState,
        updateParserState: _prim.updateParserState,
        getConfig        : _prim.getConfig,
        setConfig        : _prim.setConfig,
        getInput         : _prim.getInput,
        setInput         : _prim.setInput,
        getPosition      : _prim.getPosition,
        setPosition      : _prim.setPosition,
        getState         : _prim.getState,
        setState         : _prim.setState
    });
};
