"use strict";

const { expect } = require("chai");

const _loquat = require("./index");

describe("loquat", () => {
  it("should yield a new loquat parsers", () => {
    const lq = _loquat();
    expect(lq).to.be.an("object");
    expect(lq.Parser).to.be.a("function");
    expect(lq.bind).to.be.a("function");
    expect(lq.Parser.prototype.bind).to.be.a("function");
  });

  it("should not use default plugins if `noUsingDefaults = true` is specified", () => {
    const lq = _loquat({ noUsingDefaults: true });
    expect(lq).to.be.an("object");
    expect(lq.Parser).to.be.a("function");
    expect(lq.bind).to.be.undefined;
    expect(lq.Parser.prototype.bind).to.be.undefined;
  });

  describe("use", () => {
    it("should use a plugin", () => {
      const lq = _loquat();
      const plugin = (_core, opts) => {
        expect(_core).to.be.an("object");
        expect(_core.Parser).to.be.a("function");
        expect(opts).to.be.undefined;
        return { foo: "bar" };
      };
      lq.use(plugin);
      expect(lq.foo).to.equal("bar");
    });

    it("should pass options to a plugin", () => {
      const lq = _loquat();
      const plugin = (_core, opts) => {
        expect(_core).to.be.an("object");
        expect(_core.Parser).to.be.a("function");
        expect(opts).to.deep.equal({ answer: 42 });
        return { foo: "bar" };
      };
      lq.use(plugin, { options: { answer: 42 } });
      expect(lq.foo).to.equal("bar");
    });

    it("should set the plugin to `extensions` property if name is specified", () => {
      const lq = _loquat();
      const plugin = (_core, opts) => {
        expect(_core).to.be.an("object");
        expect(_core.Parser).to.be.a("function");
        expect(opts).to.be.undefined;
        return { foo: "bar" };
      };
      lq.use(plugin, { name: "myplugin" });
      expect(lq.foo).to.equal("bar");
      expect(lq.extensions.myplugin).to.deep.equal({ foo: "bar" });
    });

    it("should not extract properties to the root if `qualified = true` is specified", () => {
      const lq = _loquat();
      const plugin = (_core, opts) => {
        expect(_core).to.be.an("object");
        expect(_core.Parser).to.be.a("function");
        expect(opts).to.be.undefined;
        return { foo: "bar" };
      };
      lq.use(plugin, { name: "myplugin", qualified: true });
      expect(lq.foo).to.be.undefined;
      expect(lq.extensions.myplugin).to.deep.equal({ foo: "bar" });
    });
  });
});
