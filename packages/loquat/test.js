"use strict";

const { expect } = require("chai");
const core = require("@loquat/core");

const loquat = require("./index");

describe("loquat", () => {
  it("should yield a new loquat parsers", () => {
    const lq = loquat(core);
    expect(lq).to.be.an("object");
    expect(lq.Parser).to.be.a("function");
    expect(lq.exts).to.deep.equal({});
  });

  describe("use", () => {
    it("should use an extension", () => {
      const lq = loquat(core);
      const ext = ($core, opts) => {
        expect($core).to.be.an("object");
        expect($core.Parser).to.be.a("function");
        expect(opts).to.be.undefined;
        return { foo: "bar" };
      };
      lq.use(ext);
      expect(lq.foo).to.equal("bar");
    });

    it("should pass options to an extension", () => {
      const lq = loquat(core);
      const ext = ($core, opts) => {
        expect($core).to.be.an("object");
        expect($core.Parser).to.be.a("function");
        expect(opts).to.deep.equal({ answer: 42 });
        return { foo: "bar" };
      };
      lq.use(ext, { options: { answer: 42 } });
      expect(lq.foo).to.equal("bar");
    });

    it("should set the extension to `exts` property if name is specified", () => {
      const lq = loquat(core);
      const ext = ($core, opts) => {
        expect($core).to.be.an("object");
        expect($core.Parser).to.be.a("function");
        expect(opts).to.be.undefined;
        return { foo: "bar" };
      };
      lq.use(ext, { name: "myextension" });
      expect(lq.foo).to.equal("bar");
      expect(lq.exts.myextension).to.deep.equal({ foo: "bar" });
    });

    it("should not extract properties to the root if `qualified = true` is specified", () => {
      const lq = loquat(core);
      const ext = ($core, opts) => {
        expect($core).to.be.an("object");
        expect($core.Parser).to.be.a("function");
        expect(opts).to.be.undefined;
        return { foo: "bar" };
      };
      lq.use(ext, { name: "myextension", qualified: true });
      expect(lq.foo).to.be.undefined;
      expect(lq.exts.myextension).to.deep.equal({ foo: "bar" });
    });
  });
});
