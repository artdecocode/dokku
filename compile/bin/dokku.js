#!/usr/bin/env node
             
const fs = require('fs');
const child_process = require('child_process');
const stream = require('stream');
const os = require('os');             
const m = child_process.spawn;
const p = stream.Writable;
const r = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, t = (a, b = !1) => r(a, 2 + (b ? 1 : 0)), u = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const v = os.homedir;
const w = /\s+at.*(?:\(|\s)(.*)\)?/, x = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, y = v(), z = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, e = new RegExp(x.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(w);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(w, (g, f) => g.replace(f, f.replace(y, "~"))) : d).join("\n");
};
function D(a, b, c = !1) {
  return function(e) {
    var d = u(arguments), {stack:g} = Error();
    const f = r(g, 2, !0), k = (g = e instanceof Error) ? e.message : e;
    d = [`Error: ${k}`, ...null !== d && a === d || c ? [b] : [f, b]].join("\n");
    d = z(d);
    return Object.assign(g ? e : Error(), {message:k, stack:d});
  };
}
;function E(a) {
  var {stack:b} = Error();
  const c = u(arguments);
  b = t(b, a);
  return D(c, b, a);
}
;const F = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class G extends p {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...e} = a || {}, {c:d = E(!0), proxyError:g} = a || {}, f = (k, l) => d(l);
    super(e);
    this.a = [];
    this.b = new Promise((k, l) => {
      this.on("finish", () => {
        let h;
        b ? h = Buffer.concat(this.a) : h = this.a.join("");
        k(h);
        this.a = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          f`${h}`;
        } else {
          const n = z(h.stack);
          h.stack = n;
          g && f`${h}`;
        }
        l(h);
      });
      c && F(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get promise() {
    return this.b;
  }
}
const H = async a => {
  ({promise:a} = new G({rs:a, c:E(!0)}));
  return await a;
};
const I = async a => {
  const [b, c, e] = await Promise.all([new Promise((d, g) => {
    a.on("error", g).on("exit", f => {
      d(f);
    });
  }), a.stdout ? H(a.stdout) : void 0, a.stderr ? H(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:e};
};
function J(a, b, c) {
  if (!a) {
    throw Error("Please specify a command to spawn.");
  }
  a = m(a, b, c);
  b = I(a);
  a.promise = b;
  a.spawnCommand = a.spawnargs.join(" ");
  return a;
}
;const K = fs.readFileSync;
const L = (a, b, c, e = !1, d = !1) => {
  const g = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(f => g.test(f));
  if (-1 == b) {
    return {argv:a};
  }
  if (e) {
    return {value:!0, index:b, length:1};
  }
  e = a[b + 1];
  if (!e || "string" == typeof e && e.startsWith("--")) {
    return {argv:a};
  }
  d && (e = parseInt(e, 10));
  return {value:e, index:b, length:2};
}, M = a => {
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
const N = function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const e = M(c);
  c = c.slice(e.length);
  a = Object.entries(a).reduce((f, [k, l]) => {
    f[k] = "string" == typeof l ? {short:l} : l;
    return f;
  }, {});
  const d = [];
  a = Object.entries(a).reduce((f, [k, l]) => {
    let h;
    try {
      const n = l.short, S = l.boolean, T = l.number, A = l.command, U = l.multiple;
      if (A && U && e.length) {
        h = e;
      } else {
        if (A && e.length) {
          h = e[0];
        } else {
          const q = L(c, k, n, S, T);
          ({value:h} = q);
          const B = q.index, C = q.length;
          void 0 !== B && C && d.push({index:B, length:C});
        }
      }
    } catch (n) {
      return f;
    }
    return void 0 === h ? f : {...f, [k]:h};
  }, {});
  let g = c;
  d.forEach(({index:f, length:k}) => {
    Array.from({length:k}).forEach((l, h) => {
      g[f + h] = null;
    });
  });
  g = g.filter(f => null !== f);
  Object.assign(a, {f:g});
  return a;
}({command:{description:"The command to execute.", command:!0, multiple:!0}, host:{description:"The host. If not given, reads executes `git remote` and uses `dokku` record."}, app:{description:"The app. If not given, reads executes `git remote` and uses `dokku` record.", short:"a"}, user:{description:"Dokku user, used to look the host from git remote, and to connect.", default:"dokku"}}), O = N.host, P = N.app, Q = N.user || "dokku";
const R = N.command || [], [V, ...W] = R, X = async(a, b) => {
  if ("config:env" == V) {
    const c = K(".env", "utf8").split("\n").join(" ");
    b = ["config:set", b, c];
  } else {
    if ("config:get" == V && !W.length) {
      throw Error("Usage: config:get <KEY>");
    }
    b = [V, b, ...W];
  }
  b = b.join(" ");
  b.length && console.log(b);
  J("ssh", [a, b], {stdio:"inherit"});
};
(async() => {
  let a = O, b = P;
  if (!O || !P) {
    var c = J("git", ["remote", "-v"]);
    ({stdout:c} = await c.promise);
    c = c.split("\n").filter(d => /\(push\)/.test(d)).reduce((d, g) => {
      [, g] = g.split("\t");
      if (!g.startsWith(Q)) {
        return d;
      }
      const [f, k] = g.replace(" (push)", "").split(":");
      d[k] = f;
      return d;
    }, {});
    const e = Object.keys(c);
    e.length || (console.log("No dokku remotes found."), process.exit(1));
    1 < e.length && !P ? (console.log("More than one app found: %s", e.join(", ")), console.log("Use -a to specify which app to use."), process.exit()) : P ? (b = P, a = c[b], a || (console.log("Host not found for %s", b), console.log("Existing dokku apps: %s", e.join(", ")), process.exit())) : [[b, a]] = Object.entries(c);
  }
  console.log("Will connect to %s:%s", a, b);
  try {
    await X(a, b);
  } catch (e) {
    console.log(e.message);
  }
})();


//# sourceMappingURL=dokku.js.map