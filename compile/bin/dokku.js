#!/usr/bin/env node
             
const fs = require('fs');
const child_process = require('child_process');
const stream = require('stream');
const os = require('os');             
const {spawn:m} = child_process;
const {Writable:n} = stream;
const p = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, r = (a, b = !1) => p(a, 2 + (b ? 1 : 0)), t = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:u} = os;
const v = /\s+at.*(?:\(|\s)(.*)\)?/, w = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, x = u(), y = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, e = new RegExp(w.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(v);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(v, (f, g) => f.replace(g, g.replace(x, "~"))) : d).join("\n");
};
function z(a, b, c = !1) {
  return function(e) {
    var d = t(arguments), {stack:f} = Error();
    const g = p(f, 2, !0), k = (f = e instanceof Error) ? e.message : e;
    d = [`Error: ${k}`, ...null !== d && a === d || c ? [b] : [g, b]].join("\n");
    d = y(d);
    return Object.assign(f ? e : Error(), {message:k, stack:d});
  };
}
;function A(a) {
  var {stack:b} = Error();
  const c = t(arguments);
  b = r(b, a);
  return z(c, b, a);
}
;const C = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class D extends n {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...e} = a || {}, {f:d = A(!0), proxyError:f} = a || {}, g = (k, l) => d(l);
    super(e);
    this.b = [];
    this.c = new Promise((k, l) => {
      this.on("finish", () => {
        let h;
        b ? h = Buffer.concat(this.b) : h = this.b.join("");
        k(h);
        this.b = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          g`${h}`;
        } else {
          const q = y(h.stack);
          h.stack = q;
          f && g`${h}`;
        }
        l(h);
      });
      c && C(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.b.push(a);
    c();
  }
  get promise() {
    return this.c;
  }
}
const E = async a => {
  ({promise:a} = new D({rs:a, f:A(!0)}));
  return await a;
};
const F = async a => {
  const [b, c, e] = await Promise.all([new Promise((d, f) => {
    a.on("error", f).on("exit", g => {
      d(g);
    });
  }), a.stdout ? E(a.stdout) : void 0, a.stderr ? E(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:e};
};
function G(a, b, c) {
  if (!a) {
    throw Error("Please specify a command to spawn.");
  }
  a = m(a, b, c);
  b = F(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}
;const {readFileSync:H} = fs;
const I = (a, b, c, e = !1, d = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (e) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  e = b + 1;
  c = a[e];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  d && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(e + 1)]};
}, J = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const e = a[c];
    if (e.startsWith("-")) {
      break;
    }
    b.push(e);
  }
  return b;
};
const K = function(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = J(b);
  b = b.slice(c.length);
  let e = !c.length;
  return Object.keys(a).reduce(({a:d, ...f}, g) => {
    if (0 == d.length && e) {
      return {a:d, ...f};
    }
    const k = a[g];
    let l;
    if ("string" == typeof k) {
      ({value:l, argv:d} = I(d, g, k));
    } else {
      try {
        const {short:h, boolean:q, number:P, command:B, multiple:Q} = k;
        B && Q && c.length ? (l = c, e = !0) : B && c.length ? (l = c[0], e = !0) : {value:l, argv:d} = I(d, g, h, q, P);
      } catch (h) {
        return {a:d, ...f};
      }
    }
    return void 0 === l ? {a:d, ...f} : {a:d, ...f, [g]:l};
  }, {a:b});
}({command:{description:"The command to execute.", command:!0, multiple:!0}, host:{description:"The host. If not given, reads executes `git remote` and uses `dokku` record."}, app:{description:"The app. If not given, reads executes `git remote` and uses `dokku` record.", short:"a"}, user:{description:"Dokku user, used to look the host from git remote, and to connect.", default:"dokku"}}), L = K.host, M = K.app, N = K.user || "dokku";
const O = K.command || [], [R, ...S] = O;
(async() => {
  let a, b;
  if (!L || !M) {
    var c = G("git", ["remote", "-v"]);
    ({stdout:c} = await c.promise);
    c = c.split("\n").filter(d => /\(push\)/.test(d)).reduce((d, f) => {
      [, f] = f.split("\t");
      if (!f.startsWith(N)) {
        return d;
      }
      const [g, k] = f.replace(" (push)", "").split(":");
      d[k] = g;
      return d;
    }, {});
    const e = Object.keys(c);
    e.length || (console.log("No dokku remotes found."), process.exit(1));
    1 < e.length && !M ? (console.log("More than one app found: %s", e.join(", ")), console.log("Use -a to specify which app to use."), process.exit()) : M ? (b = M, a = c[b], a || (console.log("Host not found for %s", b), console.log("Existing dokku apps: %s", e.join(", ")), process.exit())) : [[b, a]] = Object.entries(c);
  }
  console.log("Will connect to %s:%s", a, b);
  try {
    await T(a, b);
  } catch (e) {
    console.log(e.message);
  }
})();
const T = async(a, b) => {
  var c = O;
  if ("config" == R) {
    c = [R, b];
  } else {
    if ("config:env" == R) {
      c = H(".env").toString().split("\n").join(" "), c = ["config:set", b, c];
    } else {
      if ("config:get" == R) {
        if (!S.length) {
          throw Error("Usage: config:get <KEY>");
        }
        c = [R, b, ...S];
      } else {
        ["config:set", "config:unset"].includes(R) && (c = [R, b, ...S]);
      }
    }
  }
  b = c.join(" ");
  b.length && console.log(b);
  G("ssh", [a, b], {stdio:"inherit"});
};


//# sourceMappingURL=dokku.js.map