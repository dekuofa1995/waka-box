module.exports = (function(e, t) {
  "use strict";
  var r = {};
  function __webpack_require__(t) {
    if (r[t]) {
      return r[t].exports;
    }
    var n = (r[t] = { i: t, l: false, exports: {} });
    e[t].call(n.exports, n, n.exports, __webpack_require__);
    n.l = true;
    return n.exports;
  }
  __webpack_require__.ab = __dirname + "/";
  function startup() {
    return __webpack_require__(104);
  }
  return startup();
})([
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(255);
    var o = (function(e) {
      n(AsapScheduler, e);
      function AsapScheduler() {
        return (e !== null && e.apply(this, arguments)) || this;
      }
      AsapScheduler.prototype.flush = function(e) {
        this.active = true;
        this.scheduled = undefined;
        var t = this.actions;
        var r;
        var n = -1;
        var i = t.length;
        e = e || t.shift();
        do {
          if ((r = e.execute(e.state, e.delay))) {
            break;
          }
        } while (++n < i && (e = t.shift()));
        this.active = false;
        if (r) {
          while (++n < i && (e = t.shift())) {
            e.unsubscribe();
          }
          throw r;
        }
      };
      return AsapScheduler;
    })(i.AsyncScheduler);
    t.AsapScheduler = o;
  },
  ,
  function(e, t, r) {
    "use strict";
    const n = r(87);
    const i = r(118);
    const o = r(49);
    const s = (e, t) => {
      if (!e && t) {
        throw new Error(
          "You can't specify a `release` without specifying `platform`"
        );
      }
      e = e || n.platform();
      let r;
      if (e === "darwin") {
        if (!t && n.platform() === "darwin") {
          t = n.release();
        }
        const e = t
          ? Number(t.split(".")[0]) > 15
            ? "macOS"
            : "OS X"
          : "macOS";
        r = t ? i(t).name : "";
        return e + (r ? " " + r : "");
      }
      if (e === "linux") {
        if (!t && n.platform() === "linux") {
          t = n.release();
        }
        r = t ? t.replace(/^(\d+\.\d+).*/, "$1") : "";
        return "Linux" + (r ? " " + r : "");
      }
      if (e === "win32") {
        if (!t && n.platform() === "win32") {
          t = n.release();
        }
        r = t ? o(t) : "";
        return "Windows" + (r ? " " + r : "");
      }
      return e;
    };
    e.exports = s;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function expand(e, t, r) {
      if (t === void 0) {
        t = Number.POSITIVE_INFINITY;
      }
      if (r === void 0) {
        r = undefined;
      }
      t = (t || 0) < 1 ? Number.POSITIVE_INFINITY : t;
      return function(n) {
        return n.lift(new s(e, t, r));
      };
    }
    t.expand = expand;
    var s = (function() {
      function ExpandOperator(e, t, r) {
        this.project = e;
        this.concurrent = t;
        this.scheduler = r;
      }
      ExpandOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new u(e, this.project, this.concurrent, this.scheduler)
        );
      };
      return ExpandOperator;
    })();
    t.ExpandOperator = s;
    var u = (function(e) {
      n(ExpandSubscriber, e);
      function ExpandSubscriber(t, r, n, i) {
        var o = e.call(this, t) || this;
        o.project = r;
        o.concurrent = n;
        o.scheduler = i;
        o.index = 0;
        o.active = 0;
        o.hasCompleted = false;
        if (n < Number.POSITIVE_INFINITY) {
          o.buffer = [];
        }
        return o;
      }
      ExpandSubscriber.dispatch = function(e) {
        var t = e.subscriber,
          r = e.result,
          n = e.value,
          i = e.index;
        t.subscribeToProjection(r, n, i);
      };
      ExpandSubscriber.prototype._next = function(e) {
        var t = this.destination;
        if (t.closed) {
          this._complete();
          return;
        }
        var r = this.index++;
        if (this.active < this.concurrent) {
          t.next(e);
          try {
            var n = this.project;
            var i = n(e, r);
            if (!this.scheduler) {
              this.subscribeToProjection(i, e, r);
            } else {
              var o = { subscriber: this, result: i, value: e, index: r };
              var s = this.destination;
              s.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, o));
            }
          } catch (e) {
            t.error(e);
          }
        } else {
          this.buffer.push(e);
        }
      };
      ExpandSubscriber.prototype.subscribeToProjection = function(e, t, r) {
        this.active++;
        var n = this.destination;
        n.add(o.subscribeToResult(this, e, t, r));
      };
      ExpandSubscriber.prototype._complete = function() {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
          this.destination.complete();
        }
        this.unsubscribe();
      };
      ExpandSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this._next(t);
      };
      ExpandSubscriber.prototype.notifyComplete = function(e) {
        var t = this.buffer;
        var r = this.destination;
        r.remove(e);
        this.active--;
        if (t && t.length > 0) {
          this._next(t.shift());
        }
        if (this.hasCompleted && this.active === 0) {
          this.destination.complete();
        }
      };
      return ExpandSubscriber;
    })(i.OuterSubscriber);
    t.ExpandSubscriber = u;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function mapTo(e) {
      return function(t) {
        return t.lift(new o(e));
      };
    }
    t.mapTo = mapTo;
    var o = (function() {
      function MapToOperator(e) {
        this.value = e;
      }
      MapToOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.value));
      };
      return MapToOperator;
    })();
    var s = (function(e) {
      n(MapToSubscriber, e);
      function MapToSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.value = r;
        return n;
      }
      MapToSubscriber.prototype._next = function(e) {
        this.destination.next(this.value);
      };
      return MapToSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    var n = r(969);
    var i = function() {};
    var o = function(e) {
      return e.setHeader && typeof e.abort === "function";
    };
    var s = function(e) {
      return e.stdio && Array.isArray(e.stdio) && e.stdio.length === 3;
    };
    var u = function(e, t, r) {
      if (typeof t === "function") return u(e, null, t);
      if (!t) t = {};
      r = n(r || i);
      var a = e._writableState;
      var c = e._readableState;
      var p = t.readable || (t.readable !== false && e.readable);
      var l = t.writable || (t.writable !== false && e.writable);
      var d = false;
      var f = function() {
        if (!e.writable) h();
      };
      var h = function() {
        l = false;
        if (!p) r.call(e);
      };
      var y = function() {
        p = false;
        if (!l) r.call(e);
      };
      var b = function(t) {
        r.call(e, t ? new Error("exited with error code: " + t) : null);
      };
      var g = function(t) {
        r.call(e, t);
      };
      var m = function() {
        process.nextTick(_);
      };
      var _ = function() {
        if (d) return;
        if (p && !(c && c.ended && !c.destroyed))
          return r.call(e, new Error("premature close"));
        if (l && !(a && a.ended && !a.destroyed))
          return r.call(e, new Error("premature close"));
      };
      var v = function() {
        e.req.on("finish", h);
      };
      if (o(e)) {
        e.on("complete", h);
        e.on("abort", m);
        if (e.req) v();
        else e.on("request", v);
      } else if (l && !a) {
        e.on("end", f);
        e.on("close", f);
      }
      if (s(e)) e.on("exit", b);
      e.on("end", y);
      e.on("finish", h);
      if (t.error !== false) e.on("error", g);
      e.on("close", m);
      return function() {
        d = true;
        e.removeListener("complete", h);
        e.removeListener("abort", m);
        e.removeListener("request", v);
        if (e.req) e.req.removeListener("finish", h);
        e.removeListener("end", f);
        e.removeListener("close", f);
        e.removeListener("finish", h);
        e.removeListener("exit", b);
        e.removeListener("end", y);
        e.removeListener("error", g);
        e.removeListener("close", m);
      };
    };
    e.exports = u;
  },
  ,
  function(e) {
    e.exports = wrappy;
    function wrappy(e, t) {
      if (e && t) return wrappy(e)(t);
      if (typeof e !== "function") throw new TypeError("need wrapper function");
      Object.keys(e).forEach(function(t) {
        wrapper[t] = e[t];
      });
      return wrapper;
      function wrapper() {
        var t = new Array(arguments.length);
        for (var r = 0; r < t.length; r++) {
          t[r] = arguments[r];
        }
        var n = e.apply(this, t);
        var i = t[t.length - 1];
        if (typeof n === "function" && n !== i) {
          Object.keys(i).forEach(function(e) {
            n[e] = i[e];
          });
        }
        return n;
      }
    }
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(53);
    var i = r(863);
    t.empty = {
      closed: true,
      next: function(e) {},
      error: function(e) {
        if (n.config.useDeprecatedSynchronousErrorHandling) {
          throw e;
        } else {
          i.hostReportError(e);
        }
      },
      complete: function() {}
    };
  },
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function noop() {}
    t.noop = noop;
  },
  function() {
    eval("require")("encoding");
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function exhaust() {
      return function(e) {
        return e.lift(new s());
      };
    }
    t.exhaust = exhaust;
    var s = (function() {
      function SwitchFirstOperator() {}
      SwitchFirstOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e));
      };
      return SwitchFirstOperator;
    })();
    var u = (function(e) {
      n(SwitchFirstSubscriber, e);
      function SwitchFirstSubscriber(t) {
        var r = e.call(this, t) || this;
        r.hasCompleted = false;
        r.hasSubscription = false;
        return r;
      }
      SwitchFirstSubscriber.prototype._next = function(e) {
        if (!this.hasSubscription) {
          this.hasSubscription = true;
          this.add(o.subscribeToResult(this, e));
        }
      };
      SwitchFirstSubscriber.prototype._complete = function() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
          this.destination.complete();
        }
      };
      SwitchFirstSubscriber.prototype.notifyComplete = function(e) {
        this.remove(e);
        this.hasSubscription = false;
        if (this.hasCompleted) {
          this.destination.complete();
        }
      };
      return SwitchFirstSubscriber;
    })(i.OuterSubscriber);
  },
  function(e, t, r) {
    "use strict";
    const n = r(129);
    const i = r(27);
    const o = r(478);
    function spawn(e, t, r) {
      const s = i(e, t, r);
      const u = n.spawn(s.command, s.args, s.options);
      o.hookChildProcess(u, s);
      return u;
    }
    function spawnSync(e, t, r) {
      const s = i(e, t, r);
      const u = n.spawnSync(s.command, s.args, s.options);
      u.error = u.error || o.verifyENOENTSync(u.status, s);
      return u;
    }
    e.exports = spawn;
    e.exports.spawn = spawn;
    e.exports.sync = spawnSync;
    e.exports._parse = i;
    e.exports._enoent = o;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    const n = r(622);
    const i = r(948);
    const o = r(71);
    const s = r(462);
    const u = r(389);
    const a = r(280);
    const c = process.platform === "win32";
    const p = /\.(?:com|exe)$/i;
    const l = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    const d =
      i(() =>
        a.satisfies(process.version, "^4.8.0 || ^5.7.0 || >= 6.0.0", true)
      ) || false;
    function detectShebang(e) {
      e.file = o(e);
      const t = e.file && u(e.file);
      if (t) {
        e.args.unshift(e.file);
        e.command = t;
        return o(e);
      }
      return e.file;
    }
    function parseNonShell(e) {
      if (!c) {
        return e;
      }
      const t = detectShebang(e);
      const r = !p.test(t);
      if (e.options.forceShell || r) {
        const r = l.test(t);
        e.command = n.normalize(e.command);
        e.command = s.command(e.command);
        e.args = e.args.map(e => s.argument(e, r));
        const i = [e.command].concat(e.args).join(" ");
        e.args = ["/d", "/s", "/c", `"${i}"`];
        e.command = process.env.comspec || "cmd.exe";
        e.options.windowsVerbatimArguments = true;
      }
      return e;
    }
    function parseShell(e) {
      if (d) {
        return e;
      }
      const t = [e.command].concat(e.args).join(" ");
      if (c) {
        e.command =
          typeof e.options.shell === "string"
            ? e.options.shell
            : process.env.comspec || "cmd.exe";
        e.args = ["/d", "/s", "/c", `"${t}"`];
        e.options.windowsVerbatimArguments = true;
      } else {
        if (typeof e.options.shell === "string") {
          e.command = e.options.shell;
        } else if (process.platform === "android") {
          e.command = "/system/bin/sh";
        } else {
          e.command = "/bin/sh";
        }
        e.args = ["-c", t];
      }
      return e;
    }
    function parse(e, t, r) {
      if (t && !Array.isArray(t)) {
        r = t;
        t = null;
      }
      t = t ? t.slice(0) : [];
      r = Object.assign({}, r);
      const n = {
        command: e,
        args: t,
        options: r,
        file: undefined,
        original: { command: e, args: t }
      };
      return r.shell ? parseShell(n) : parseNonShell(n);
    }
    e.exports = parse;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(719);
    var i = r(882);
    var o = r(522);
    var s = r(698);
    var u = r(53);
    var a = (function() {
      function Observable(e) {
        this._isScalar = false;
        if (e) {
          this._subscribe = e;
        }
      }
      Observable.prototype.lift = function(e) {
        var t = new Observable();
        t.source = this;
        t.operator = e;
        return t;
      };
      Observable.prototype.subscribe = function(e, t, r) {
        var n = this.operator;
        var o = i.toSubscriber(e, t, r);
        if (n) {
          o.add(n.call(o, this.source));
        } else {
          o.add(
            this.source ||
              (u.config.useDeprecatedSynchronousErrorHandling &&
                !o.syncErrorThrowable)
              ? this._subscribe(o)
              : this._trySubscribe(o)
          );
        }
        if (u.config.useDeprecatedSynchronousErrorHandling) {
          if (o.syncErrorThrowable) {
            o.syncErrorThrowable = false;
            if (o.syncErrorThrown) {
              throw o.syncErrorValue;
            }
          }
        }
        return o;
      };
      Observable.prototype._trySubscribe = function(e) {
        try {
          return this._subscribe(e);
        } catch (t) {
          if (u.config.useDeprecatedSynchronousErrorHandling) {
            e.syncErrorThrown = true;
            e.syncErrorValue = t;
          }
          if (n.canReportError(e)) {
            e.error(t);
          } else {
            console.warn(t);
          }
        }
      };
      Observable.prototype.forEach = function(e, t) {
        var r = this;
        t = getPromiseCtor(t);
        return new t(function(t, n) {
          var i;
          i = r.subscribe(
            function(t) {
              try {
                e(t);
              } catch (e) {
                n(e);
                if (i) {
                  i.unsubscribe();
                }
              }
            },
            n,
            t
          );
        });
      };
      Observable.prototype._subscribe = function(e) {
        var t = this.source;
        return t && t.subscribe(e);
      };
      Observable.prototype[o.observable] = function() {
        return this;
      };
      Observable.prototype.pipe = function() {
        var e = [];
        for (var t = 0; t < arguments.length; t++) {
          e[t] = arguments[t];
        }
        if (e.length === 0) {
          return this;
        }
        return s.pipeFromArray(e)(this);
      };
      Observable.prototype.toPromise = function(e) {
        var t = this;
        e = getPromiseCtor(e);
        return new e(function(e, r) {
          var n;
          t.subscribe(
            function(e) {
              return (n = e);
            },
            function(e) {
              return r(e);
            },
            function() {
              return e(n);
            }
          );
        });
      };
      Observable.create = function(e) {
        return new Observable(e);
      };
      return Observable;
    })();
    t.Observable = a;
    function getPromiseCtor(e) {
      if (!e) {
        e = u.config.Promise || Promise;
      }
      if (!e) {
        throw new Error("no Promise impl found");
      }
      return e;
    }
  },
  ,
  ,
  ,
  ,
  ,
  function(e) {
    "use strict";
    e.exports = e => {
      e = e || {};
      const t = e.env || process.env;
      const r = e.platform || process.platform;
      if (r !== "win32") {
        return "PATH";
      }
      return Object.keys(t).find(e => e.toUpperCase() === "PATH") || "Path";
    };
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(400);
    var i = r(634);
    var o = r(942);
    function of() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = e[e.length - 1];
      if (n.isScheduler(r)) {
        e.pop();
        return o.scheduleArray(e, r);
      } else {
        return i.fromArray(e);
      }
    }
    t.of = of;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(291);
    t.audit = n.audit;
    var i = r(293);
    t.auditTime = i.auditTime;
    var o = r(334);
    t.buffer = o.buffer;
    var s = r(452);
    t.bufferCount = s.bufferCount;
    var u = r(881);
    t.bufferTime = u.bufferTime;
    var a = r(712);
    t.bufferToggle = a.bufferToggle;
    var c = r(918);
    t.bufferWhen = c.bufferWhen;
    var p = r(582);
    t.catchError = p.catchError;
    var l = r(627);
    t.combineAll = l.combineAll;
    var d = r(335);
    t.combineLatest = d.combineLatest;
    var f = r(102);
    t.concat = f.concat;
    var h = r(919);
    t.concatAll = h.concatAll;
    var y = r(936);
    t.concatMap = y.concatMap;
    var b = r(441);
    t.concatMapTo = b.concatMapTo;
    var g = r(895);
    t.count = g.count;
    var m = r(489);
    t.debounce = m.debounce;
    var _ = r(850);
    t.debounceTime = _.debounceTime;
    var v = r(758);
    t.defaultIfEmpty = v.defaultIfEmpty;
    var w = r(551);
    t.delay = w.delay;
    var S = r(374);
    t.delayWhen = S.delayWhen;
    var q = r(986);
    t.dematerialize = q.dematerialize;
    var O = r(703);
    t.distinct = O.distinct;
    var E = r(59);
    t.distinctUntilChanged = E.distinctUntilChanged;
    var T = r(427);
    t.distinctUntilKeyChanged = T.distinctUntilKeyChanged;
    var j = r(961);
    t.elementAt = j.elementAt;
    var x = r(752);
    t.endWith = x.endWith;
    var P = r(139);
    t.every = P.every;
    var C = r(19);
    t.exhaust = C.exhaust;
    var A = r(866);
    t.exhaustMap = A.exhaustMap;
    var k = r(5);
    t.expand = k.expand;
    var R = r(981);
    t.filter = R.filter;
    var I = r(648);
    t.finalize = I.finalize;
    var G = r(199);
    t.find = G.find;
    var D = r(283);
    t.findIndex = D.findIndex;
    var F = r(60);
    t.first = F.first;
    var B = r(160);
    t.groupBy = B.groupBy;
    var N = r(387);
    t.ignoreElements = N.ignoreElements;
    var L = r(726);
    t.isEmpty = L.isEmpty;
    var M = r(823);
    t.last = M.last;
    var U = r(802);
    t.map = U.map;
    var W = r(8);
    t.mapTo = W.mapTo;
    var z = r(751);
    t.materialize = z.materialize;
    var H = r(153);
    t.max = H.max;
    var V = r(770);
    t.merge = V.merge;
    var $ = r(465);
    t.mergeAll = $.mergeAll;
    var X = r(246);
    t.mergeMap = X.mergeMap;
    var K = r(246);
    t.flatMap = K.mergeMap;
    var Y = r(196);
    t.mergeMapTo = Y.mergeMapTo;
    var Z = r(542);
    t.mergeScan = Z.mergeScan;
    var J = r(52);
    t.min = J.min;
    var Q = r(96);
    t.multicast = Q.multicast;
    var ee = r(745);
    t.observeOn = ee.observeOn;
    var te = r(155);
    t.onErrorResumeNext = te.onErrorResumeNext;
    var re = r(599);
    t.pairwise = re.pairwise;
    var ne = r(711);
    t.partition = ne.partition;
    var ie = r(957);
    t.pluck = ie.pluck;
    var oe = r(404);
    t.publish = oe.publish;
    var se = r(845);
    t.publishBehavior = se.publishBehavior;
    var ue = r(257);
    t.publishLast = ue.publishLast;
    var ae = r(538);
    t.publishReplay = ae.publishReplay;
    var ce = r(302);
    t.race = ce.race;
    var pe = r(707);
    t.reduce = pe.reduce;
    var le = r(541);
    t.repeat = le.repeat;
    var de = r(704);
    t.repeatWhen = de.repeatWhen;
    var fe = r(664);
    t.retry = fe.retry;
    var he = r(460);
    t.retryWhen = he.retryWhen;
    var ye = r(781);
    t.refCount = ye.refCount;
    var be = r(686);
    t.sample = be.sample;
    var ge = r(428);
    t.sampleTime = ge.sampleTime;
    var me = r(844);
    t.scan = me.scan;
    var _e = r(628);
    t.sequenceEqual = _e.sequenceEqual;
    var ve = r(620);
    t.share = ve.share;
    var we = r(688);
    t.shareReplay = we.shareReplay;
    var Se = r(66);
    t.single = Se.single;
    var qe = r(230);
    t.skip = qe.skip;
    var Oe = r(744);
    t.skipLast = Oe.skipLast;
    var Ee = r(497);
    t.skipUntil = Ee.skipUntil;
    var Te = r(101);
    t.skipWhile = Te.skipWhile;
    var je = r(563);
    t.startWith = je.startWith;
    var xe = r(220);
    t.subscribeOn = xe.subscribeOn;
    var Pe = r(504);
    t.switchAll = Pe.switchAll;
    var Ce = r(589);
    t.switchMap = Ce.switchMap;
    var Ae = r(240);
    t.switchMapTo = Ae.switchMapTo;
    var ke = r(949);
    t.take = ke.take;
    var Re = r(511);
    t.takeLast = Re.takeLast;
    var Ie = r(67);
    t.takeUntil = Ie.takeUntil;
    var Ge = r(775);
    t.takeWhile = Ge.takeWhile;
    var De = r(643);
    t.tap = De.tap;
    var Fe = r(316);
    t.throttle = Fe.throttle;
    var Be = r(331);
    t.throttleTime = Be.throttleTime;
    var Ne = r(559);
    t.throwIfEmpty = Ne.throwIfEmpty;
    var Le = r(516);
    t.timeInterval = Le.timeInterval;
    var Me = r(596);
    t.timeout = Me.timeout;
    var Ue = r(268);
    t.timeoutWith = Ue.timeoutWith;
    var We = r(107);
    t.timestamp = We.timestamp;
    var ze = r(203);
    t.toArray = ze.toArray;
    var He = r(611);
    t.window = He.window;
    var Ve = r(503);
    t.windowCount = Ve.windowCount;
    var $e = r(837);
    t.windowTime = $e.windowTime;
    var Xe = r(507);
    t.windowToggle = Xe.windowToggle;
    var Ke = r(177);
    t.windowWhen = Ke.windowWhen;
    var Ye = r(258);
    t.withLatestFrom = Ye.withLatestFrom;
    var Ze = r(608);
    t.zip = Ze.zip;
    var Je = r(324);
    t.zipAll = Je.zipAll;
  },
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = factory;
    const n = r(402);
    const i = r(855);
    function factory(e) {
      const t = n.bind(null, e || []);
      t.plugin = i.bind(null, e || []);
      return t;
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    const n = r(87);
    const i = r(84);
    const o = new Map([
      ["10.0", "10"],
      ["6.3", "8.1"],
      ["6.2", "8"],
      ["6.1", "7"],
      ["6.0", "Vista"],
      ["5.2", "Server 2003"],
      ["5.1", "XP"],
      ["5.0", "2000"],
      ["4.9", "ME"],
      ["4.1", "98"],
      ["4.0", "95"]
    ]);
    const s = e => {
      const t = /\d+\.\d/.exec(e || n.release());
      if (e && !t) {
        throw new Error("`release` argument doesn't match `n.n`");
      }
      const r = (t || [])[0];
      if (
        (!e || e === n.release()) &&
        ["6.1", "6.2", "6.3", "10.0"].includes(r)
      ) {
        const e = i.sync("wmic", ["os", "get", "Caption"]).stdout || "";
        const t = (e.match(/2008|2012|2016/) || [])[0];
        if (t) {
          return `Server ${t}`;
        }
      }
      return o.get(r);
    };
    e.exports = s;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(707);
    function min(e) {
      var t =
        typeof e === "function"
          ? function(t, r) {
              return e(t, r) < 0 ? t : r;
            }
          : function(e, t) {
              return e < t ? e : t;
            };
      return n.reduce(t);
    }
    t.min = min;
  },
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = false;
    t.config = {
      Promise: undefined,
      set useDeprecatedSynchronousErrorHandling(e) {
        if (e) {
          var t = new Error();
          console.warn(
            "DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" +
              t.stack
          );
        } else if (r) {
          console.log("RxJS: Back to a better error behavior. Thank you. <3");
        }
        r = e;
      },
      get useDeprecatedSynchronousErrorHandling() {
        return r;
      }
    };
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function distinctUntilChanged(e, t) {
      return function(r) {
        return r.lift(new o(e, t));
      };
    }
    t.distinctUntilChanged = distinctUntilChanged;
    var o = (function() {
      function DistinctUntilChangedOperator(e, t) {
        this.compare = e;
        this.keySelector = t;
      }
      DistinctUntilChangedOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.compare, this.keySelector));
      };
      return DistinctUntilChangedOperator;
    })();
    var s = (function(e) {
      n(DistinctUntilChangedSubscriber, e);
      function DistinctUntilChangedSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.keySelector = n;
        i.hasKey = false;
        if (typeof r === "function") {
          i.compare = r;
        }
        return i;
      }
      DistinctUntilChangedSubscriber.prototype.compare = function(e, t) {
        return e === t;
      };
      DistinctUntilChangedSubscriber.prototype._next = function(e) {
        var t;
        try {
          var r = this.keySelector;
          t = r ? r(e) : e;
        } catch (e) {
          return this.destination.error(e);
        }
        var n = false;
        if (this.hasKey) {
          try {
            var i = this.compare;
            n = i(this.key, t);
          } catch (e) {
            return this.destination.error(e);
          }
        } else {
          this.hasKey = true;
        }
        if (!n) {
          this.key = t;
          this.destination.next(e);
        }
      };
      return DistinctUntilChangedSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(618);
    var i = r(981);
    var o = r(949);
    var s = r(758);
    var u = r(559);
    var a = r(827);
    function first(e, t) {
      var r = arguments.length >= 2;
      return function(c) {
        return c.pipe(
          e
            ? i.filter(function(t, r) {
                return e(t, r, c);
              })
            : a.identity,
          o.take(1),
          r
            ? s.defaultIfEmpty(t)
            : u.throwIfEmpty(function() {
                return new n.EmptyError();
              })
        );
      };
    }
    t.first = first;
  },
  ,
  ,
  function(e, t, r) {
    const n = r(747);
    const i = r(622);
    function log(e) {
      console.log(`[dotenv][DEBUG] ${e}`);
    }
    const o = "\n";
    const s = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
    const u = /\\n/g;
    const a = /\n|\r|\r\n/;
    function parse(e, t) {
      const r = Boolean(t && t.debug);
      const n = {};
      e.toString()
        .split(a)
        .forEach(function(e, t) {
          const i = e.match(s);
          if (i != null) {
            const e = i[1];
            let t = i[2] || "";
            const r = t.length - 1;
            const s = t[0] === '"' && t[r] === '"';
            const a = t[0] === "'" && t[r] === "'";
            if (a || s) {
              t = t.substring(1, r);
              if (s) {
                t = t.replace(u, o);
              }
            } else {
              t = t.trim();
            }
            n[e] = t;
          } else if (r) {
            log(`did not match key and value when parsing line ${t + 1}: ${e}`);
          }
        });
      return n;
    }
    function config(e) {
      let t = i.resolve(process.cwd(), ".env");
      let r = "utf8";
      let o = false;
      if (e) {
        if (e.path != null) {
          t = e.path;
        }
        if (e.encoding != null) {
          r = e.encoding;
        }
        if (e.debug != null) {
          o = true;
        }
      }
      try {
        const e = parse(n.readFileSync(t, { encoding: r }), { debug: o });
        Object.keys(e).forEach(function(t) {
          if (!Object.prototype.hasOwnProperty.call(process.env, t)) {
            process.env[t] = e[t];
          } else if (o) {
            log(
              `"${t}" is already defined in \`process.env\` and will not be overwritten`
            );
          }
        });
        return { parsed: e };
      } catch (e) {
        return { error: e };
      }
    }
    e.exports.config = config;
    e.exports.parse = parse;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(618);
    function single(e) {
      return function(t) {
        return t.lift(new s(e, t));
      };
    }
    t.single = single;
    var s = (function() {
      function SingleOperator(e, t) {
        this.predicate = e;
        this.source = t;
      }
      SingleOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.predicate, this.source));
      };
      return SingleOperator;
    })();
    var u = (function(e) {
      n(SingleSubscriber, e);
      function SingleSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.predicate = r;
        i.source = n;
        i.seenValue = false;
        i.index = 0;
        return i;
      }
      SingleSubscriber.prototype.applySingleValue = function(e) {
        if (this.seenValue) {
          this.destination.error("Sequence contains more than one element");
        } else {
          this.seenValue = true;
          this.singleValue = e;
        }
      };
      SingleSubscriber.prototype._next = function(e) {
        var t = this.index++;
        if (this.predicate) {
          this.tryNext(e, t);
        } else {
          this.applySingleValue(e);
        }
      };
      SingleSubscriber.prototype.tryNext = function(e, t) {
        try {
          if (this.predicate(e, t, this.source)) {
            this.applySingleValue(e);
          }
        } catch (e) {
          this.destination.error(e);
        }
      };
      SingleSubscriber.prototype._complete = function() {
        var e = this.destination;
        if (this.index > 0) {
          e.next(this.seenValue ? this.singleValue : undefined);
          e.complete();
        } else {
          e.error(new o.EmptyError());
        }
      };
      return SingleSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function takeUntil(e) {
      return function(t) {
        return t.lift(new s(e));
      };
    }
    t.takeUntil = takeUntil;
    var s = (function() {
      function TakeUntilOperator(e) {
        this.notifier = e;
      }
      TakeUntilOperator.prototype.call = function(e, t) {
        var r = new u(e);
        var n = o.subscribeToResult(r, this.notifier);
        if (n && !r.seenValue) {
          r.add(n);
          return t.subscribe(r);
        }
        return r;
      };
      return TakeUntilOperator;
    })();
    var u = (function(e) {
      n(TakeUntilSubscriber, e);
      function TakeUntilSubscriber(t) {
        var r = e.call(this, t) || this;
        r.seenValue = false;
        return r;
      }
      TakeUntilSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.seenValue = true;
        this.complete();
      };
      TakeUntilSubscriber.prototype.notifyComplete = function() {};
      return TakeUntilSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    const n = r(622);
    const i = r(814);
    const o = r(39)();
    function resolveCommandAttempt(e, t) {
      const r = process.cwd();
      const s = e.options.cwd != null;
      if (s) {
        try {
          process.chdir(e.options.cwd);
        } catch (e) {}
      }
      let u;
      try {
        u = i.sync(e.command, {
          path: (e.options.env || process.env)[o],
          pathExt: t ? n.delimiter : undefined
        });
      } catch (e) {
      } finally {
        process.chdir(r);
      }
      if (u) {
        u = n.resolve(s ? e.options.cwd : "", u);
      }
      return u;
    }
    function resolveCommand(e) {
      return resolveCommandAttempt(e) || resolveCommandAttempt(e, true);
    }
    e.exports = resolveCommand;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    const n = r(622);
    const i = r(129);
    const o = r(20);
    const s = r(768);
    const u = r(621);
    const a = r(323);
    const c = r(145);
    const p = r(697);
    const l = r(800);
    const d = r(222);
    const f = r(168);
    const h = 1e3 * 1e3 * 10;
    function handleArgs(e, t, r) {
      let i;
      r = Object.assign({ extendEnv: true, env: {} }, r);
      if (r.extendEnv) {
        r.env = Object.assign({}, process.env, r.env);
      }
      if (r.__winShell === true) {
        delete r.__winShell;
        i = {
          command: e,
          args: t,
          options: r,
          file: e,
          original: { cmd: e, args: t }
        };
      } else {
        i = o._parse(e, t, r);
      }
      r = Object.assign(
        {
          maxBuffer: h,
          buffer: true,
          stripEof: true,
          preferLocal: true,
          localDir: i.options.cwd || process.cwd(),
          encoding: "utf8",
          reject: true,
          cleanup: true
        },
        i.options
      );
      r.stdio = f(r);
      if (r.preferLocal) {
        r.env = u.env(Object.assign({}, r, { cwd: r.localDir }));
      }
      if (r.detached) {
        r.cleanup = false;
      }
      if (process.platform === "win32" && n.basename(i.command) === "cmd.exe") {
        i.args.unshift("/q");
      }
      return { cmd: i.command, args: i.args, opts: r, parsed: i };
    }
    function handleInput(e, t) {
      if (t === null || t === undefined) {
        return;
      }
      if (a(t)) {
        t.pipe(e.stdin);
      } else {
        e.stdin.end(t);
      }
    }
    function handleOutput(e, t) {
      if (t && e.stripEof) {
        t = s(t);
      }
      return t;
    }
    function handleShell(e, t, r) {
      let n = "/bin/sh";
      let i = ["-c", t];
      r = Object.assign({}, r);
      if (process.platform === "win32") {
        r.__winShell = true;
        n = process.env.comspec || "cmd.exe";
        i = ["/s", "/c", `"${t}"`];
        r.windowsVerbatimArguments = true;
      }
      if (r.shell) {
        n = r.shell;
        delete r.shell;
      }
      return e(n, i, r);
    }
    function getStream(e, t, { encoding: r, buffer: n, maxBuffer: i }) {
      if (!e[t]) {
        return null;
      }
      let o;
      if (!n) {
        o = new Promise((r, n) => {
          e[t].once("end", r).once("error", n);
        });
      } else if (r) {
        o = c(e[t], { encoding: r, maxBuffer: i });
      } else {
        o = c.buffer(e[t], { maxBuffer: i });
      }
      return o.catch(e => {
        e.stream = t;
        e.message = `${t} ${e.message}`;
        throw e;
      });
    }
    function makeError(e, t) {
      const { stdout: r, stderr: n } = e;
      let i = e.error;
      const { code: o, signal: s } = e;
      const { parsed: u, joinedCmd: a } = t;
      const c = t.timedOut || false;
      if (!i) {
        let e = "";
        if (Array.isArray(u.opts.stdio)) {
          if (u.opts.stdio[2] !== "inherit") {
            e += e.length > 0 ? n : `\n${n}`;
          }
          if (u.opts.stdio[1] !== "inherit") {
            e += `\n${r}`;
          }
        } else if (u.opts.stdio !== "inherit") {
          e = `\n${n}${r}`;
        }
        i = new Error(`Command failed: ${a}${e}`);
        i.code = o < 0 ? d(o) : o;
      }
      i.stdout = r;
      i.stderr = n;
      i.failed = true;
      i.signal = s || null;
      i.cmd = a;
      i.timedOut = c;
      return i;
    }
    function joinCmd(e, t) {
      let r = e;
      if (Array.isArray(t) && t.length > 0) {
        r += " " + t.join(" ");
      }
      return r;
    }
    e.exports = (e, t, r) => {
      const n = handleArgs(e, t, r);
      const { encoding: s, buffer: u, maxBuffer: a } = n.opts;
      const c = joinCmd(e, t);
      let d;
      try {
        d = i.spawn(n.cmd, n.args, n.opts);
      } catch (e) {
        return Promise.reject(e);
      }
      let f;
      if (n.opts.cleanup) {
        f = l(() => {
          d.kill();
        });
      }
      let h = null;
      let y = false;
      const b = () => {
        if (h) {
          clearTimeout(h);
          h = null;
        }
        if (f) {
          f();
        }
      };
      if (n.opts.timeout > 0) {
        h = setTimeout(() => {
          h = null;
          y = true;
          d.kill(n.opts.killSignal);
        }, n.opts.timeout);
      }
      const g = new Promise(e => {
        d.on("exit", (t, r) => {
          b();
          e({ code: t, signal: r });
        });
        d.on("error", t => {
          b();
          e({ error: t });
        });
        if (d.stdin) {
          d.stdin.on("error", t => {
            b();
            e({ error: t });
          });
        }
      });
      function destroy() {
        if (d.stdout) {
          d.stdout.destroy();
        }
        if (d.stderr) {
          d.stderr.destroy();
        }
      }
      const m = () =>
        p(
          Promise.all([
            g,
            getStream(d, "stdout", { encoding: s, buffer: u, maxBuffer: a }),
            getStream(d, "stderr", { encoding: s, buffer: u, maxBuffer: a })
          ]).then(e => {
            const t = e[0];
            t.stdout = e[1];
            t.stderr = e[2];
            if (t.error || t.code !== 0 || t.signal !== null) {
              const e = makeError(t, { joinedCmd: c, parsed: n, timedOut: y });
              e.killed = e.killed || d.killed;
              if (!n.opts.reject) {
                return e;
              }
              throw e;
            }
            return {
              stdout: handleOutput(n.opts, t.stdout),
              stderr: handleOutput(n.opts, t.stderr),
              code: 0,
              failed: false,
              killed: false,
              signal: null,
              cmd: c,
              timedOut: false
            };
          }),
          destroy
        );
      o._enoent.hookChildProcess(d, n.parsed);
      handleInput(d, n.opts.input);
      d.then = (e, t) => m().then(e, t);
      d.catch = e => m().catch(e);
      return d;
    };
    e.exports.stdout = (...t) => e.exports(...t).then(e => e.stdout);
    e.exports.stderr = (...t) => e.exports(...t).then(e => e.stderr);
    e.exports.shell = (t, r) => handleShell(e.exports, t, r);
    e.exports.sync = (e, t, r) => {
      const n = handleArgs(e, t, r);
      const o = joinCmd(e, t);
      if (a(n.opts.input)) {
        throw new TypeError(
          "The `input` option cannot be a stream in sync mode"
        );
      }
      const s = i.spawnSync(n.cmd, n.args, n.opts);
      s.code = s.status;
      if (s.error || s.status !== 0 || s.signal !== null) {
        const e = makeError(s, { joinedCmd: o, parsed: n });
        if (!n.opts.reject) {
          return e;
        }
        throw e;
      }
      return {
        stdout: handleOutput(n.opts, s.stdout),
        stderr: handleOutput(n.opts, s.stderr),
        code: 0,
        failed: false,
        signal: null,
        cmd: o,
        timedOut: false
      };
    };
    e.exports.shellSync = (t, r) => handleShell(e.exports.sync, t, r);
  },
  ,
  ,
  function(e) {
    e.exports = require("os");
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(297);
    var i = r(391);
    var o = r(942);
    var s = r(105);
    var u = r(424);
    var a = r(550);
    var c = r(388);
    var p = r(743);
    function scheduled(e, t) {
      if (e != null) {
        if (u.isInteropObservable(e)) {
          return n.scheduleObservable(e, t);
        } else if (a.isPromise(e)) {
          return i.schedulePromise(e, t);
        } else if (c.isArrayLike(e)) {
          return o.scheduleArray(e, t);
        } else if (p.isIterable(e) || typeof e === "string") {
          return s.scheduleIterable(e, t);
        }
      }
      throw new TypeError(
        ((e !== null && typeof e) || e) + " is not observable"
      );
    }
    t.scheduled = scheduled;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(100);
    function multicast(e, t) {
      return function multicastOperatorFunction(r) {
        var o;
        if (typeof e === "function") {
          o = e;
        } else {
          o = function subjectFactory() {
            return e;
          };
        }
        if (typeof t === "function") {
          return r.lift(new i(o, t));
        }
        var s = Object.create(r, n.connectableObservableDescriptor);
        s.source = r;
        s.subjectFactory = o;
        return s;
      };
    }
    t.multicast = multicast;
    var i = (function() {
      function MulticastOperator(e, t) {
        this.subjectFactory = e;
        this.selector = t;
      }
      MulticastOperator.prototype.call = function(e, t) {
        var r = this.selector;
        var n = this.subjectFactory();
        var i = r(n).subscribe(e);
        i.add(t.subscribe(n));
        return i;
      };
      return MulticastOperator;
    })();
    t.MulticastOperator = i;
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(33);
    var s = r(114);
    var u = r(312);
    var a = r(781);
    var c = (function(e) {
      n(ConnectableObservable, e);
      function ConnectableObservable(t, r) {
        var n = e.call(this) || this;
        n.source = t;
        n.subjectFactory = r;
        n._refCount = 0;
        n._isComplete = false;
        return n;
      }
      ConnectableObservable.prototype._subscribe = function(e) {
        return this.getSubject().subscribe(e);
      };
      ConnectableObservable.prototype.getSubject = function() {
        var e = this._subject;
        if (!e || e.isStopped) {
          this._subject = this.subjectFactory();
        }
        return this._subject;
      };
      ConnectableObservable.prototype.connect = function() {
        var e = this._connection;
        if (!e) {
          this._isComplete = false;
          e = this._connection = new u.Subscription();
          e.add(this.source.subscribe(new p(this.getSubject(), this)));
          if (e.closed) {
            this._connection = null;
            e = u.Subscription.EMPTY;
          }
        }
        return e;
      };
      ConnectableObservable.prototype.refCount = function() {
        return a.refCount()(this);
      };
      return ConnectableObservable;
    })(o.Observable);
    t.ConnectableObservable = c;
    t.connectableObservableDescriptor = (function() {
      var e = c.prototype;
      return {
        operator: { value: null },
        _refCount: { value: 0, writable: true },
        _subject: { value: null, writable: true },
        _connection: { value: null, writable: true },
        _subscribe: { value: e._subscribe },
        _isComplete: { value: e._isComplete, writable: true },
        getSubject: { value: e.getSubject },
        connect: { value: e.connect },
        refCount: { value: e.refCount }
      };
    })();
    var p = (function(e) {
      n(ConnectableSubscriber, e);
      function ConnectableSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.connectable = r;
        return n;
      }
      ConnectableSubscriber.prototype._error = function(t) {
        this._unsubscribe();
        e.prototype._error.call(this, t);
      };
      ConnectableSubscriber.prototype._complete = function() {
        this.connectable._isComplete = true;
        this._unsubscribe();
        e.prototype._complete.call(this);
      };
      ConnectableSubscriber.prototype._unsubscribe = function() {
        var e = this.connectable;
        if (e) {
          this.connectable = null;
          var t = e._connection;
          e._refCount = 0;
          e._subject = null;
          e._connection = null;
          if (t) {
            t.unsubscribe();
          }
        }
      };
      return ConnectableSubscriber;
    })(i.SubjectSubscriber);
    var l = (function() {
      function RefCountOperator(e) {
        this.connectable = e;
      }
      RefCountOperator.prototype.call = function(e, t) {
        var r = this.connectable;
        r._refCount++;
        var n = new d(e, r);
        var i = t.subscribe(n);
        if (!n.closed) {
          n.connection = r.connect();
        }
        return i;
      };
      return RefCountOperator;
    })();
    var d = (function(e) {
      n(RefCountSubscriber, e);
      function RefCountSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.connectable = r;
        return n;
      }
      RefCountSubscriber.prototype._unsubscribe = function() {
        var e = this.connectable;
        if (!e) {
          this.connection = null;
          return;
        }
        this.connectable = null;
        var t = e._refCount;
        if (t <= 0) {
          this.connection = null;
          return;
        }
        e._refCount = t - 1;
        if (t > 1) {
          this.connection = null;
          return;
        }
        var r = this.connection;
        var n = e._connection;
        this.connection = null;
        if (n && (!r || n === r)) {
          n.unsubscribe();
        }
      };
      return RefCountSubscriber;
    })(s.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function skipWhile(e) {
      return function(t) {
        return t.lift(new o(e));
      };
    }
    t.skipWhile = skipWhile;
    var o = (function() {
      function SkipWhileOperator(e) {
        this.predicate = e;
      }
      SkipWhileOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.predicate));
      };
      return SkipWhileOperator;
    })();
    var s = (function(e) {
      n(SkipWhileSubscriber, e);
      function SkipWhileSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.predicate = r;
        n.skipping = true;
        n.index = 0;
        return n;
      }
      SkipWhileSubscriber.prototype._next = function(e) {
        var t = this.destination;
        if (this.skipping) {
          this.tryCallPredicate(e);
        }
        if (!this.skipping) {
          t.next(e);
        }
      };
      SkipWhileSubscriber.prototype.tryCallPredicate = function(e) {
        try {
          var t = this.predicate(e, this.index++);
          this.skipping = Boolean(t);
        } catch (e) {
          this.destination.error(e);
        }
      };
      return SkipWhileSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(406);
    function concat() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return function(t) {
        return t.lift.call(n.concat.apply(void 0, [t].concat(e)));
      };
    }
    t.concat = concat;
  },
  ,
  function(e, t, r) {
    r(63).config();
    const { XMLHttpRequest: n } = r(308);
    const { ajax: i } = r(351);
    const { tap: o } = r(43);
    const s = r(613);
    const { GIST_ID: u, GH_TOKEN: a, WAKATIME_API_KEY: c } = process.env;
    const p = "https://wakatime.com";
    console.log("gistId: ", u);
    const l = new s({ auth: `token ${a}` });
    function weekBefore() {
      const e = new Date();
      e.setDate(e.getDate() - 7);
      return e;
    }
    function dateFormat(e) {
      return `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
    }
    function btoa(e) {
      return Buffer.from(e).toString("base64");
    }
    function createXHR() {
      return new n();
    }
    async function main() {
      console.log("start main: ");
      const e = dateFormat(weekBefore());
      const t = dateFormat(new Date());
      const r = i({
        createXHR: createXHR,
        url: `${p}/api/v1/users/current/summaries?start=${e}&end=${t}`,
        method: "GET",
        crossDomain: true,
        withCredentials: false,
        headers: { authorization: `Basic ${btoa(c)}` }
      }).pipe(o(console.log));
      r.subscribe(
        e => updateGist(e.response),
        e => console.error(e)
      );
    }
    function formatSeconds(e) {
      return new Date(e * 1e3).toISOString().substr(11, 8);
    }
    async function updateGist(e) {
      let t;
      try {
        t = await l.gists.get({ gist_id: u });
      } catch (e) {
        console.error(`Unable to get gist\n${e}`);
      }
      const r = e.data.map(({ languages: e }) => e).flat();
      const n = r.reduce((e, t) => e + t.total_seconds, 0);
      const i = Array.from(
        r
          .reduce((e, t) => {
            const r = e.get(t.name);
            if (r) {
              const i = r.total_seconds + t.total_seconds;
              e.set(t.name, { ...r, total_seconds: i, percent: (i / n) * 100 });
            } else {
              e.set(t.name, t);
            }
            return e;
          }, new Map())
          .values()
      ).sort((e, t) => t.percent - e.percent);
      const o = i.map(({ name: e, percent: t, total_seconds: r }) =>
        [
          e.padEnd(11),
          generateBarChart(t, 21),
          String(t.toFixed(1)).padStart(5) + "%",
          formatSeconds(r).padEnd(14)
        ].join(" ")
      );
      if (o.length == 0) {
        console.warn("no data to update");
        return;
      }
      const s = o.join("\n");
      try {
        const e = Object.keys(t.data.files)[0];
        await l.gists.update({
          gist_id: u,
          files: {
            [e]: { filename: `📊 Weekly development breakdown`, content: s }
          }
        });
        console.log("update content: \n", s);
      } catch (e) {
        console.error(`Unable to update gist\n${e}`);
      }
    }
    function generateBarChart(e, t) {
      const r = "░▏▎▍▌▋▊▉█";
      const n = Math.floor((t * 8 * e) / 100);
      const i = Math.floor(n / 8);
      if (i >= t) {
        return r.substring(8, 9).repeat(t);
      }
      const o = n % 8;
      return [r.substring(8, 9).repeat(i), r.substring(o, o + 1)]
        .join("")
        .padEnd(t, r.substring(0, 1));
    }
    (async () => {
      await main();
    })();
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(312);
    var o = r(974);
    function scheduleIterable(e, t) {
      if (!e) {
        throw new Error("Iterable cannot be null");
      }
      return new n.Observable(function(r) {
        var n = new i.Subscription();
        var s;
        n.add(function() {
          if (s && typeof s.return === "function") {
            s.return();
          }
        });
        n.add(
          t.schedule(function() {
            s = e[o.iterator]();
            n.add(
              t.schedule(function() {
                if (r.closed) {
                  return;
                }
                var e;
                var t;
                try {
                  var n = s.next();
                  e = n.value;
                  t = n.done;
                } catch (e) {
                  r.error(e);
                  return;
                }
                if (t) {
                  r.complete();
                } else {
                  r.next(e);
                  this.schedule();
                }
              })
            );
          })
        );
        return n;
      });
    }
    t.scheduleIterable = scheduleIterable;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(411);
    var i = r(802);
    function timestamp(e) {
      if (e === void 0) {
        e = n.async;
      }
      return i.map(function(t) {
        return new o(t, e.now());
      });
    }
    t.timestamp = timestamp;
    var o = (function() {
      function Timestamp(e, t) {
        this.value = e;
        this.timestamp = t;
      }
      return Timestamp;
    })();
    t.Timestamp = o;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(658);
    var o = r(16);
    var s = r(312);
    var u = r(754);
    var a = r(53);
    var c = r(863);
    var p = (function(e) {
      n(Subscriber, e);
      function Subscriber(t, r, n) {
        var i = e.call(this) || this;
        i.syncErrorValue = null;
        i.syncErrorThrown = false;
        i.syncErrorThrowable = false;
        i.isStopped = false;
        switch (arguments.length) {
          case 0:
            i.destination = o.empty;
            break;
          case 1:
            if (!t) {
              i.destination = o.empty;
              break;
            }
            if (typeof t === "object") {
              if (t instanceof Subscriber) {
                i.syncErrorThrowable = t.syncErrorThrowable;
                i.destination = t;
                t.add(i);
              } else {
                i.syncErrorThrowable = true;
                i.destination = new l(i, t);
              }
              break;
            }
          default:
            i.syncErrorThrowable = true;
            i.destination = new l(i, t, r, n);
            break;
        }
        return i;
      }
      Subscriber.prototype[u.rxSubscriber] = function() {
        return this;
      };
      Subscriber.create = function(e, t, r) {
        var n = new Subscriber(e, t, r);
        n.syncErrorThrowable = false;
        return n;
      };
      Subscriber.prototype.next = function(e) {
        if (!this.isStopped) {
          this._next(e);
        }
      };
      Subscriber.prototype.error = function(e) {
        if (!this.isStopped) {
          this.isStopped = true;
          this._error(e);
        }
      };
      Subscriber.prototype.complete = function() {
        if (!this.isStopped) {
          this.isStopped = true;
          this._complete();
        }
      };
      Subscriber.prototype.unsubscribe = function() {
        if (this.closed) {
          return;
        }
        this.isStopped = true;
        e.prototype.unsubscribe.call(this);
      };
      Subscriber.prototype._next = function(e) {
        this.destination.next(e);
      };
      Subscriber.prototype._error = function(e) {
        this.destination.error(e);
        this.unsubscribe();
      };
      Subscriber.prototype._complete = function() {
        this.destination.complete();
        this.unsubscribe();
      };
      Subscriber.prototype._unsubscribeAndRecycle = function() {
        var e = this._parentOrParents;
        this._parentOrParents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parentOrParents = e;
        return this;
      };
      return Subscriber;
    })(s.Subscription);
    t.Subscriber = p;
    var l = (function(e) {
      n(SafeSubscriber, e);
      function SafeSubscriber(t, r, n, s) {
        var u = e.call(this) || this;
        u._parentSubscriber = t;
        var a;
        var c = u;
        if (i.isFunction(r)) {
          a = r;
        } else if (r) {
          a = r.next;
          n = r.error;
          s = r.complete;
          if (r !== o.empty) {
            c = Object.create(r);
            if (i.isFunction(c.unsubscribe)) {
              u.add(c.unsubscribe.bind(c));
            }
            c.unsubscribe = u.unsubscribe.bind(u);
          }
        }
        u._context = c;
        u._next = a;
        u._error = n;
        u._complete = s;
        return u;
      }
      SafeSubscriber.prototype.next = function(e) {
        if (!this.isStopped && this._next) {
          var t = this._parentSubscriber;
          if (
            !a.config.useDeprecatedSynchronousErrorHandling ||
            !t.syncErrorThrowable
          ) {
            this.__tryOrUnsub(this._next, e);
          } else if (this.__tryOrSetError(t, this._next, e)) {
            this.unsubscribe();
          }
        }
      };
      SafeSubscriber.prototype.error = function(e) {
        if (!this.isStopped) {
          var t = this._parentSubscriber;
          var r = a.config.useDeprecatedSynchronousErrorHandling;
          if (this._error) {
            if (!r || !t.syncErrorThrowable) {
              this.__tryOrUnsub(this._error, e);
              this.unsubscribe();
            } else {
              this.__tryOrSetError(t, this._error, e);
              this.unsubscribe();
            }
          } else if (!t.syncErrorThrowable) {
            this.unsubscribe();
            if (r) {
              throw e;
            }
            c.hostReportError(e);
          } else {
            if (r) {
              t.syncErrorValue = e;
              t.syncErrorThrown = true;
            } else {
              c.hostReportError(e);
            }
            this.unsubscribe();
          }
        }
      };
      SafeSubscriber.prototype.complete = function() {
        var e = this;
        if (!this.isStopped) {
          var t = this._parentSubscriber;
          if (this._complete) {
            var r = function() {
              return e._complete.call(e._context);
            };
            if (
              !a.config.useDeprecatedSynchronousErrorHandling ||
              !t.syncErrorThrowable
            ) {
              this.__tryOrUnsub(r);
              this.unsubscribe();
            } else {
              this.__tryOrSetError(t, r);
              this.unsubscribe();
            }
          } else {
            this.unsubscribe();
          }
        }
      };
      SafeSubscriber.prototype.__tryOrUnsub = function(e, t) {
        try {
          e.call(this._context, t);
        } catch (e) {
          this.unsubscribe();
          if (a.config.useDeprecatedSynchronousErrorHandling) {
            throw e;
          } else {
            c.hostReportError(e);
          }
        }
      };
      SafeSubscriber.prototype.__tryOrSetError = function(e, t, r) {
        if (!a.config.useDeprecatedSynchronousErrorHandling) {
          throw new Error("bad call");
        }
        try {
          t.call(this._context, r);
        } catch (t) {
          if (a.config.useDeprecatedSynchronousErrorHandling) {
            e.syncErrorValue = t;
            e.syncErrorThrown = true;
            return true;
          } else {
            c.hostReportError(t);
            return true;
          }
        }
        return false;
      };
      SafeSubscriber.prototype._unsubscribe = function() {
        var e = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        e.unsubscribe();
      };
      return SafeSubscriber;
    })(p);
    t.SafeSubscriber = l;
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    const n = r(87);
    const i = new Map([
      [19, "Catalina"],
      [18, "Mojave"],
      [17, "High Sierra"],
      [16, "Sierra"],
      [15, "El Capitan"],
      [14, "Yosemite"],
      [13, "Mavericks"],
      [12, "Mountain Lion"],
      [11, "Lion"],
      [10, "Snow Leopard"],
      [9, "Leopard"],
      [8, "Tiger"],
      [7, "Panther"],
      [6, "Jaguar"],
      [5, "Puma"]
    ]);
    const o = e => {
      e = Number((e || n.release()).split(".")[0]);
      return { name: i.get(e), version: "10." + (e - 4) };
    };
    e.exports = o;
    e.exports.default = o;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e) {
    var t = 200;
    var r = "__lodash_hash_undefined__";
    var n = 1 / 0;
    var i = "[object Function]",
      o = "[object GeneratorFunction]";
    var s = /[\\^$.*+?()[\]{}|]/g;
    var u = /^\[object .+?Constructor\]$/;
    var a =
      typeof global == "object" && global && global.Object === Object && global;
    var c = typeof self == "object" && self && self.Object === Object && self;
    var p = a || c || Function("return this")();
    function arrayIncludes(e, t) {
      var r = e ? e.length : 0;
      return !!r && baseIndexOf(e, t, 0) > -1;
    }
    function arrayIncludesWith(e, t, r) {
      var n = -1,
        i = e ? e.length : 0;
      while (++n < i) {
        if (r(t, e[n])) {
          return true;
        }
      }
      return false;
    }
    function baseFindIndex(e, t, r, n) {
      var i = e.length,
        o = r + (n ? 1 : -1);
      while (n ? o-- : ++o < i) {
        if (t(e[o], o, e)) {
          return o;
        }
      }
      return -1;
    }
    function baseIndexOf(e, t, r) {
      if (t !== t) {
        return baseFindIndex(e, baseIsNaN, r);
      }
      var n = r - 1,
        i = e.length;
      while (++n < i) {
        if (e[n] === t) {
          return n;
        }
      }
      return -1;
    }
    function baseIsNaN(e) {
      return e !== e;
    }
    function cacheHas(e, t) {
      return e.has(t);
    }
    function getValue(e, t) {
      return e == null ? undefined : e[t];
    }
    function isHostObject(e) {
      var t = false;
      if (e != null && typeof e.toString != "function") {
        try {
          t = !!(e + "");
        } catch (e) {}
      }
      return t;
    }
    function setToArray(e) {
      var t = -1,
        r = Array(e.size);
      e.forEach(function(e) {
        r[++t] = e;
      });
      return r;
    }
    var l = Array.prototype,
      d = Function.prototype,
      f = Object.prototype;
    var h = p["__core-js_shared__"];
    var y = (function() {
      var e = /[^.]+$/.exec((h && h.keys && h.keys.IE_PROTO) || "");
      return e ? "Symbol(src)_1." + e : "";
    })();
    var b = d.toString;
    var g = f.hasOwnProperty;
    var m = f.toString;
    var _ = RegExp(
      "^" +
        b
          .call(g)
          .replace(s, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?"
          ) +
        "$"
    );
    var v = l.splice;
    var w = getNative(p, "Map"),
      S = getNative(p, "Set"),
      q = getNative(Object, "create");
    function Hash(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function hashClear() {
      this.__data__ = q ? q(null) : {};
    }
    function hashDelete(e) {
      return this.has(e) && delete this.__data__[e];
    }
    function hashGet(e) {
      var t = this.__data__;
      if (q) {
        var n = t[e];
        return n === r ? undefined : n;
      }
      return g.call(t, e) ? t[e] : undefined;
    }
    function hashHas(e) {
      var t = this.__data__;
      return q ? t[e] !== undefined : g.call(t, e);
    }
    function hashSet(e, t) {
      var n = this.__data__;
      n[e] = q && t === undefined ? r : t;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(e) {
      var t = this.__data__,
        r = assocIndexOf(t, e);
      if (r < 0) {
        return false;
      }
      var n = t.length - 1;
      if (r == n) {
        t.pop();
      } else {
        v.call(t, r, 1);
      }
      return true;
    }
    function listCacheGet(e) {
      var t = this.__data__,
        r = assocIndexOf(t, e);
      return r < 0 ? undefined : t[r][1];
    }
    function listCacheHas(e) {
      return assocIndexOf(this.__data__, e) > -1;
    }
    function listCacheSet(e, t) {
      var r = this.__data__,
        n = assocIndexOf(r, e);
      if (n < 0) {
        r.push([e, t]);
      } else {
        r[n][1] = t;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        hash: new Hash(),
        map: new (w || ListCache)(),
        string: new Hash()
      };
    }
    function mapCacheDelete(e) {
      return getMapData(this, e)["delete"](e);
    }
    function mapCacheGet(e) {
      return getMapData(this, e).get(e);
    }
    function mapCacheHas(e) {
      return getMapData(this, e).has(e);
    }
    function mapCacheSet(e, t) {
      getMapData(this, e).set(e, t);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.__data__ = new MapCache();
      while (++t < r) {
        this.add(e[t]);
      }
    }
    function setCacheAdd(e) {
      this.__data__.set(e, r);
      return this;
    }
    function setCacheHas(e) {
      return this.__data__.has(e);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function assocIndexOf(e, t) {
      var r = e.length;
      while (r--) {
        if (eq(e[r][0], t)) {
          return r;
        }
      }
      return -1;
    }
    function baseIsNative(e) {
      if (!isObject(e) || isMasked(e)) {
        return false;
      }
      var t = isFunction(e) || isHostObject(e) ? _ : u;
      return t.test(toSource(e));
    }
    function baseUniq(e, r, n) {
      var i = -1,
        o = arrayIncludes,
        s = e.length,
        u = true,
        a = [],
        c = a;
      if (n) {
        u = false;
        o = arrayIncludesWith;
      } else if (s >= t) {
        var p = r ? null : O(e);
        if (p) {
          return setToArray(p);
        }
        u = false;
        o = cacheHas;
        c = new SetCache();
      } else {
        c = r ? [] : a;
      }
      e: while (++i < s) {
        var l = e[i],
          d = r ? r(l) : l;
        l = n || l !== 0 ? l : 0;
        if (u && d === d) {
          var f = c.length;
          while (f--) {
            if (c[f] === d) {
              continue e;
            }
          }
          if (r) {
            c.push(d);
          }
          a.push(l);
        } else if (!o(c, d, n)) {
          if (c !== a) {
            c.push(d);
          }
          a.push(l);
        }
      }
      return a;
    }
    var O = !(S && 1 / setToArray(new S([, -0]))[1] == n)
      ? noop
      : function(e) {
          return new S(e);
        };
    function getMapData(e, t) {
      var r = e.__data__;
      return isKeyable(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
    }
    function getNative(e, t) {
      var r = getValue(e, t);
      return baseIsNative(r) ? r : undefined;
    }
    function isKeyable(e) {
      var t = typeof e;
      return t == "string" || t == "number" || t == "symbol" || t == "boolean"
        ? e !== "__proto__"
        : e === null;
    }
    function isMasked(e) {
      return !!y && y in e;
    }
    function toSource(e) {
      if (e != null) {
        try {
          return b.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    function uniq(e) {
      return e && e.length ? baseUniq(e) : [];
    }
    function eq(e, t) {
      return e === t || (e !== e && t !== t);
    }
    function isFunction(e) {
      var t = isObject(e) ? m.call(e) : "";
      return t == i || t == o;
    }
    function isObject(e) {
      var t = typeof e;
      return !!e && (t == "object" || t == "function");
    }
    function noop() {}
    e.exports = uniq;
  },
  ,
  ,
  function(e) {
    e.exports = require("child_process");
  },
  function(e, t, r) {
    e.exports = authenticationPlugin;
    const { Deprecation: n } = r(692);
    const i = r(969);
    const o = i((e, t) => e.warn(t));
    const s = r(674);
    const u = r(471);
    const a = r(349);
    function authenticationPlugin(e, t) {
      if (t.auth) {
        e.authenticate = () => {
          o(
            e.log,
            new n(
              '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
            )
          );
        };
        return;
      }
      const r = { octokit: e, auth: false };
      e.authenticate = s.bind(null, r);
      e.hook.before("request", u.bind(null, r));
      e.hook.error("request", a.bind(null, r));
    }
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    function throwError(e, t) {
      if (!t) {
        return new n.Observable(function(t) {
          return t.error(e);
        });
      } else {
        return new n.Observable(function(r) {
          return t.schedule(dispatch, 0, { error: e, subscriber: r });
        });
      }
    }
    t.throwError = throwError;
    function dispatch(e) {
      var t = e.error,
        r = e.subscriber;
      r.error(t);
    }
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function every(e, t) {
      return function(r) {
        return r.lift(new o(e, t, r));
      };
    }
    t.every = every;
    var o = (function() {
      function EveryOperator(e, t, r) {
        this.predicate = e;
        this.thisArg = t;
        this.source = r;
      }
      EveryOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.predicate, this.thisArg, this.source));
      };
      return EveryOperator;
    })();
    var s = (function(e) {
      n(EverySubscriber, e);
      function EverySubscriber(t, r, n, i) {
        var o = e.call(this, t) || this;
        o.predicate = r;
        o.thisArg = n;
        o.source = i;
        o.index = 0;
        o.thisArg = n || o;
        return o;
      }
      EverySubscriber.prototype.notifyComplete = function(e) {
        this.destination.next(e);
        this.destination.complete();
      };
      EverySubscriber.prototype._next = function(e) {
        var t = false;
        try {
          t = this.predicate.call(this.thisArg, e, this.index++, this.source);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        if (!t) {
          this.notifyComplete(false);
        }
      };
      EverySubscriber.prototype._complete = function() {
        this.notifyComplete(true);
      };
      return EverySubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = withAuthorizationPrefix;
    const n = r(368);
    const i = /^[\w-]+:/;
    function withAuthorizationPrefix(e) {
      if (/^(basic|bearer|token) /i.test(e)) {
        return e;
      }
      try {
        if (i.test(n(e))) {
          return `basic ${e}`;
        }
      } catch (e) {}
      if (e.split(/\./).length === 3) {
        return `bearer ${e}`;
      }
      return `token ${e}`;
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    const n = r(453);
    const i = r(966);
    class MaxBufferError extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    }
    function getStream(e, t) {
      if (!e) {
        return Promise.reject(new Error("Expected a stream"));
      }
      t = Object.assign({ maxBuffer: Infinity }, t);
      const { maxBuffer: r } = t;
      let o;
      return new Promise((s, u) => {
        const a = e => {
          if (e) {
            e.bufferedData = o.getBufferedValue();
          }
          u(e);
        };
        o = n(e, i(t), e => {
          if (e) {
            a(e);
            return;
          }
          s();
        });
        o.on("data", () => {
          if (o.getBufferedLength() > r) {
            a(new MaxBufferError());
          }
        });
      }).then(() => o.getBufferedValue());
    }
    e.exports = getStream;
    e.exports.buffer = (e, t) =>
      getStream(e, Object.assign({}, t, { encoding: "buffer" }));
    e.exports.array = (e, t) =>
      getStream(e, Object.assign({}, t, { array: true }));
    e.exports.MaxBufferError = MaxBufferError;
  },
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = (function() {
      function ObjectUnsubscribedErrorImpl() {
        Error.call(this);
        this.message = "object unsubscribed";
        this.name = "ObjectUnsubscribedError";
        return this;
      }
      ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
      return ObjectUnsubscribedErrorImpl;
    })();
    t.ObjectUnsubscribedError = r;
  },
  ,
  function(e, t, r) {
    e.exports = paginatePlugin;
    const n = r(193);
    const i = r(807);
    function paginatePlugin(e) {
      e.paginate = i.bind(null, e);
      e.paginate.iterator = n.bind(null, e);
    }
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(232);
    var i = r(0);
    t.asap = new i.AsapScheduler(n.AsapAction);
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(707);
    function max(e) {
      var t =
        typeof e === "function"
          ? function(t, r) {
              return e(t, r) > 0 ? t : r;
            }
          : function(e, t) {
              return e > t ? e : t;
            };
      return n.reduce(t);
    }
    t.max = max;
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(260);
    function isNumeric(e) {
      return !n.isArray(e) && e - parseFloat(e) + 1 >= 0;
    }
    t.isNumeric = isNumeric;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(997);
    var o = r(260);
    var s = r(565);
    var u = r(668);
    var a = r(591);
    function onErrorResumeNext() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      if (e.length === 1 && o.isArray(e[0])) {
        e = e[0];
      }
      return function(t) {
        return t.lift(new c(e));
      };
    }
    t.onErrorResumeNext = onErrorResumeNext;
    function onErrorResumeNextStatic() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = null;
      if (e.length === 1 && o.isArray(e[0])) {
        e = e[0];
      }
      r = e.shift();
      return i.from(r, null).lift(new c(e));
    }
    t.onErrorResumeNextStatic = onErrorResumeNextStatic;
    var c = (function() {
      function OnErrorResumeNextOperator(e) {
        this.nextSources = e;
      }
      OnErrorResumeNextOperator.prototype.call = function(e, t) {
        return t.subscribe(new p(e, this.nextSources));
      };
      return OnErrorResumeNextOperator;
    })();
    var p = (function(e) {
      n(OnErrorResumeNextSubscriber, e);
      function OnErrorResumeNextSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.destination = t;
        n.nextSources = r;
        return n;
      }
      OnErrorResumeNextSubscriber.prototype.notifyError = function(e, t) {
        this.subscribeToNextSource();
      };
      OnErrorResumeNextSubscriber.prototype.notifyComplete = function(e) {
        this.subscribeToNextSource();
      };
      OnErrorResumeNextSubscriber.prototype._error = function(e) {
        this.subscribeToNextSource();
        this.unsubscribe();
      };
      OnErrorResumeNextSubscriber.prototype._complete = function() {
        this.subscribeToNextSource();
        this.unsubscribe();
      };
      OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function() {
        var e = this.nextSources.shift();
        if (!!e) {
          var t = new u.InnerSubscriber(this, undefined, undefined);
          var r = this.destination;
          r.add(t);
          var n = a.subscribeToResult(this, e, undefined, undefined, t);
          if (n !== t) {
            r.add(n);
          }
        } else {
          this.destination.complete();
        }
      };
      return OnErrorResumeNextSubscriber;
    })(s.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(312);
    var s = r(33);
    var u = r(564);
    function groupBy(e, t, r, n) {
      return function(i) {
        return i.lift(new a(e, t, r, n));
      };
    }
    t.groupBy = groupBy;
    var a = (function() {
      function GroupByOperator(e, t, r, n) {
        this.keySelector = e;
        this.elementSelector = t;
        this.durationSelector = r;
        this.subjectSelector = n;
      }
      GroupByOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new c(
            e,
            this.keySelector,
            this.elementSelector,
            this.durationSelector,
            this.subjectSelector
          )
        );
      };
      return GroupByOperator;
    })();
    var c = (function(e) {
      n(GroupBySubscriber, e);
      function GroupBySubscriber(t, r, n, i, o) {
        var s = e.call(this, t) || this;
        s.keySelector = r;
        s.elementSelector = n;
        s.durationSelector = i;
        s.subjectSelector = o;
        s.groups = null;
        s.attemptedToUnsubscribe = false;
        s.count = 0;
        return s;
      }
      GroupBySubscriber.prototype._next = function(e) {
        var t;
        try {
          t = this.keySelector(e);
        } catch (e) {
          this.error(e);
          return;
        }
        this._group(e, t);
      };
      GroupBySubscriber.prototype._group = function(e, t) {
        var r = this.groups;
        if (!r) {
          r = this.groups = new Map();
        }
        var n = r.get(t);
        var i;
        if (this.elementSelector) {
          try {
            i = this.elementSelector(e);
          } catch (e) {
            this.error(e);
          }
        } else {
          i = e;
        }
        if (!n) {
          n = this.subjectSelector ? this.subjectSelector() : new u.Subject();
          r.set(t, n);
          var o = new l(t, n, this);
          this.destination.next(o);
          if (this.durationSelector) {
            var s = void 0;
            try {
              s = this.durationSelector(new l(t, n));
            } catch (e) {
              this.error(e);
              return;
            }
            this.add(s.subscribe(new p(t, n, this)));
          }
        }
        if (!n.closed) {
          n.next(i);
        }
      };
      GroupBySubscriber.prototype._error = function(e) {
        var t = this.groups;
        if (t) {
          t.forEach(function(t, r) {
            t.error(e);
          });
          t.clear();
        }
        this.destination.error(e);
      };
      GroupBySubscriber.prototype._complete = function() {
        var e = this.groups;
        if (e) {
          e.forEach(function(e, t) {
            e.complete();
          });
          e.clear();
        }
        this.destination.complete();
      };
      GroupBySubscriber.prototype.removeGroup = function(e) {
        this.groups.delete(e);
      };
      GroupBySubscriber.prototype.unsubscribe = function() {
        if (!this.closed) {
          this.attemptedToUnsubscribe = true;
          if (this.count === 0) {
            e.prototype.unsubscribe.call(this);
          }
        }
      };
      return GroupBySubscriber;
    })(i.Subscriber);
    var p = (function(e) {
      n(GroupDurationSubscriber, e);
      function GroupDurationSubscriber(t, r, n) {
        var i = e.call(this, r) || this;
        i.key = t;
        i.group = r;
        i.parent = n;
        return i;
      }
      GroupDurationSubscriber.prototype._next = function(e) {
        this.complete();
      };
      GroupDurationSubscriber.prototype._unsubscribe = function() {
        var e = this,
          t = e.parent,
          r = e.key;
        this.key = this.parent = null;
        if (t) {
          t.removeGroup(r);
        }
      };
      return GroupDurationSubscriber;
    })(i.Subscriber);
    var l = (function(e) {
      n(GroupedObservable, e);
      function GroupedObservable(t, r, n) {
        var i = e.call(this) || this;
        i.key = t;
        i.groupSubject = r;
        i.refCountSubscription = n;
        return i;
      }
      GroupedObservable.prototype._subscribe = function(e) {
        var t = new o.Subscription();
        var r = this,
          n = r.refCountSubscription,
          i = r.groupSubject;
        if (n && !n.closed) {
          t.add(new d(n));
        }
        t.add(i.subscribe(e));
        return t;
      };
      return GroupedObservable;
    })(s.Observable);
    t.GroupedObservable = l;
    var d = (function(e) {
      n(InnerRefCountSubscription, e);
      function InnerRefCountSubscription(t) {
        var r = e.call(this) || this;
        r.parent = t;
        t.count++;
        return r;
      }
      InnerRefCountSubscription.prototype.unsubscribe = function() {
        var t = this.parent;
        if (!t.closed && !this.closed) {
          e.prototype.unsubscribe.call(this);
          t.count -= 1;
          if (t.count === 0 && t.attemptedToUnsubscribe) {
            t.unsubscribe();
          }
        }
      };
      return InnerRefCountSubscription;
    })(o.Subscription);
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(486);
    var o = (function(e) {
      n(AsyncAction, e);
      function AsyncAction(t, r) {
        var n = e.call(this, t, r) || this;
        n.scheduler = t;
        n.work = r;
        n.pending = false;
        return n;
      }
      AsyncAction.prototype.schedule = function(e, t) {
        if (t === void 0) {
          t = 0;
        }
        if (this.closed) {
          return this;
        }
        this.state = e;
        var r = this.id;
        var n = this.scheduler;
        if (r != null) {
          this.id = this.recycleAsyncId(n, r, t);
        }
        this.pending = true;
        this.delay = t;
        this.id = this.id || this.requestAsyncId(n, this.id, t);
        return this;
      };
      AsyncAction.prototype.requestAsyncId = function(e, t, r) {
        if (r === void 0) {
          r = 0;
        }
        return setInterval(e.flush.bind(e, this), r);
      };
      AsyncAction.prototype.recycleAsyncId = function(e, t, r) {
        if (r === void 0) {
          r = 0;
        }
        if (r !== null && this.delay === r && this.pending === false) {
          return t;
        }
        clearInterval(t);
        return undefined;
      };
      AsyncAction.prototype.execute = function(e, t) {
        if (this.closed) {
          return new Error("executing a cancelled action");
        }
        this.pending = false;
        var r = this._execute(e, t);
        if (r) {
          return r;
        } else if (this.pending === false && this.id != null) {
          this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
      };
      AsyncAction.prototype._execute = function(e, t) {
        var r = false;
        var n = undefined;
        try {
          this.work(e);
        } catch (e) {
          r = true;
          n = (!!e && e) || new Error(e);
        }
        if (r) {
          this.unsubscribe();
          return n;
        }
      };
      AsyncAction.prototype._unsubscribe = function() {
        var e = this.id;
        var t = this.scheduler;
        var r = t.actions;
        var n = r.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (n !== -1) {
          r.splice(n, 1);
        }
        if (e != null) {
          this.id = this.recycleAsyncId(t, e, null);
        }
        this.delay = null;
      };
      return AsyncAction;
    })(i.Action);
    t.AsyncAction = o;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(312);
    var o = (function(e) {
      n(SubjectSubscription, e);
      function SubjectSubscription(t, r) {
        var n = e.call(this) || this;
        n.subject = t;
        n.subscriber = r;
        n.closed = false;
        return n;
      }
      SubjectSubscription.prototype.unsubscribe = function() {
        if (this.closed) {
          return;
        }
        this.closed = true;
        var e = this.subject;
        var t = e.observers;
        this.subject = null;
        if (!t || t.length === 0 || e.isStopped || e.closed) {
          return;
        }
        var r = t.indexOf(this.subscriber);
        if (r !== -1) {
          t.splice(r, 1);
        }
      };
      return SubjectSubscription;
    })(i.Subscription);
    t.SubjectSubscription = o;
  },
  ,
  ,
  function(e) {
    "use strict";
    const t = ["stdin", "stdout", "stderr"];
    const r = e => t.some(t => Boolean(e[t]));
    e.exports = e => {
      if (!e) {
        return null;
      }
      if (e.stdio && r(e)) {
        throw new Error(
          `It's not possible to provide \`stdio\` in combination with one of ${t
            .map(e => `\`${e}\``)
            .join(", ")}`
        );
      }
      if (typeof e.stdio === "string") {
        return e.stdio;
      }
      const n = e.stdio || [];
      if (!Array.isArray(n)) {
        throw new TypeError(
          `Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof n}\``
        );
      }
      const i = [];
      const o = Math.max(n.length, t.length);
      for (let r = 0; r < o; r++) {
        let o = null;
        if (n[r] !== undefined) {
          o = n[r];
        } else if (e[t[r]] !== undefined) {
          o = e[t[r]];
        }
        i[r] = o;
      }
      return i;
    };
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(565);
    var s = r(591);
    function windowWhen(e) {
      return function windowWhenOperatorFunction(t) {
        return t.lift(new u(e));
      };
    }
    t.windowWhen = windowWhen;
    var u = (function() {
      function WindowOperator(e) {
        this.closingSelector = e;
      }
      WindowOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.closingSelector));
      };
      return WindowOperator;
    })();
    var a = (function(e) {
      n(WindowSubscriber, e);
      function WindowSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.destination = t;
        n.closingSelector = r;
        n.openWindow();
        return n;
      }
      WindowSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.openWindow(i);
      };
      WindowSubscriber.prototype.notifyError = function(e, t) {
        this._error(e);
      };
      WindowSubscriber.prototype.notifyComplete = function(e) {
        this.openWindow(e);
      };
      WindowSubscriber.prototype._next = function(e) {
        this.window.next(e);
      };
      WindowSubscriber.prototype._error = function(e) {
        this.window.error(e);
        this.destination.error(e);
        this.unsubscribeClosingNotification();
      };
      WindowSubscriber.prototype._complete = function() {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
      };
      WindowSubscriber.prototype.unsubscribeClosingNotification = function() {
        if (this.closingNotification) {
          this.closingNotification.unsubscribe();
        }
      };
      WindowSubscriber.prototype.openWindow = function(e) {
        if (e === void 0) {
          e = null;
        }
        if (e) {
          this.remove(e);
          e.unsubscribe();
        }
        var t = this.window;
        if (t) {
          t.complete();
        }
        var r = (this.window = new i.Subject());
        this.destination.next(r);
        var n;
        try {
          var o = this.closingSelector;
          n = o();
        } catch (e) {
          this.destination.error(e);
          this.window.error(e);
          return;
        }
        this.add((this.closingNotification = s.subscribeToResult(this, n)));
      };
      return WindowSubscriber;
    })(o.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(903);
    var o = r(33);
    var s = r(114);
    var u = r(802);
    function getCORSRequest() {
      if (i.root.XMLHttpRequest) {
        return new i.root.XMLHttpRequest();
      } else if (!!i.root.XDomainRequest) {
        return new i.root.XDomainRequest();
      } else {
        throw new Error("CORS is not supported by your browser");
      }
    }
    function getXMLHttpRequest() {
      if (i.root.XMLHttpRequest) {
        return new i.root.XMLHttpRequest();
      } else {
        var e = void 0;
        try {
          var t = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"];
          for (var r = 0; r < 3; r++) {
            try {
              e = t[r];
              if (new i.root.ActiveXObject(e)) {
                break;
              }
            } catch (e) {}
          }
          return new i.root.ActiveXObject(e);
        } catch (e) {
          throw new Error("XMLHttpRequest is not supported by your browser");
        }
      }
    }
    function ajaxGet(e, t) {
      if (t === void 0) {
        t = null;
      }
      return new c({ method: "GET", url: e, headers: t });
    }
    t.ajaxGet = ajaxGet;
    function ajaxPost(e, t, r) {
      return new c({ method: "POST", url: e, body: t, headers: r });
    }
    t.ajaxPost = ajaxPost;
    function ajaxDelete(e, t) {
      return new c({ method: "DELETE", url: e, headers: t });
    }
    t.ajaxDelete = ajaxDelete;
    function ajaxPut(e, t, r) {
      return new c({ method: "PUT", url: e, body: t, headers: r });
    }
    t.ajaxPut = ajaxPut;
    function ajaxPatch(e, t, r) {
      return new c({ method: "PATCH", url: e, body: t, headers: r });
    }
    t.ajaxPatch = ajaxPatch;
    var a = u.map(function(e, t) {
      return e.response;
    });
    function ajaxGetJSON(e, t) {
      return a(
        new c({ method: "GET", url: e, responseType: "json", headers: t })
      );
    }
    t.ajaxGetJSON = ajaxGetJSON;
    var c = (function(e) {
      n(AjaxObservable, e);
      function AjaxObservable(t) {
        var r = e.call(this) || this;
        var n = {
          async: true,
          createXHR: function() {
            return this.crossDomain ? getCORSRequest() : getXMLHttpRequest();
          },
          crossDomain: true,
          withCredentials: false,
          headers: {},
          method: "GET",
          responseType: "json",
          timeout: 0
        };
        if (typeof t === "string") {
          n.url = t;
        } else {
          for (var i in t) {
            if (t.hasOwnProperty(i)) {
              n[i] = t[i];
            }
          }
        }
        r.request = n;
        return r;
      }
      AjaxObservable.prototype._subscribe = function(e) {
        return new p(e, this.request);
      };
      AjaxObservable.create = (function() {
        var e = function(e) {
          return new AjaxObservable(e);
        };
        e.get = ajaxGet;
        e.post = ajaxPost;
        e.delete = ajaxDelete;
        e.put = ajaxPut;
        e.patch = ajaxPatch;
        e.getJSON = ajaxGetJSON;
        return e;
      })();
      return AjaxObservable;
    })(o.Observable);
    t.AjaxObservable = c;
    var p = (function(e) {
      n(AjaxSubscriber, e);
      function AjaxSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.request = r;
        n.done = false;
        var o = (r.headers = r.headers || {});
        if (!r.crossDomain && !n.getHeader(o, "X-Requested-With")) {
          o["X-Requested-With"] = "XMLHttpRequest";
        }
        var s = n.getHeader(o, "Content-Type");
        if (
          !s &&
          !(i.root.FormData && r.body instanceof i.root.FormData) &&
          typeof r.body !== "undefined"
        ) {
          o["Content-Type"] =
            "application/x-www-form-urlencoded; charset=UTF-8";
        }
        r.body = n.serializeBody(
          r.body,
          n.getHeader(r.headers, "Content-Type")
        );
        n.send();
        return n;
      }
      AjaxSubscriber.prototype.next = function(e) {
        this.done = true;
        var t = this,
          r = t.xhr,
          n = t.request,
          i = t.destination;
        var o;
        try {
          o = new l(e, r, n);
        } catch (e) {
          return i.error(e);
        }
        i.next(o);
      };
      AjaxSubscriber.prototype.send = function() {
        var e = this,
          t = e.request,
          r = e.request,
          n = r.user,
          i = r.method,
          o = r.url,
          s = r.async,
          u = r.password,
          a = r.headers,
          c = r.body;
        try {
          var p = (this.xhr = t.createXHR());
          this.setupEvents(p, t);
          if (n) {
            p.open(i, o, s, n, u);
          } else {
            p.open(i, o, s);
          }
          if (s) {
            p.timeout = t.timeout;
            p.responseType = t.responseType;
          }
          if ("withCredentials" in p) {
            p.withCredentials = !!t.withCredentials;
          }
          this.setHeaders(p, a);
          if (c) {
            p.send(c);
          } else {
            p.send();
          }
        } catch (e) {
          this.error(e);
        }
      };
      AjaxSubscriber.prototype.serializeBody = function(e, t) {
        if (!e || typeof e === "string") {
          return e;
        } else if (i.root.FormData && e instanceof i.root.FormData) {
          return e;
        }
        if (t) {
          var r = t.indexOf(";");
          if (r !== -1) {
            t = t.substring(0, r);
          }
        }
        switch (t) {
          case "application/x-www-form-urlencoded":
            return Object.keys(e)
              .map(function(t) {
                return encodeURIComponent(t) + "=" + encodeURIComponent(e[t]);
              })
              .join("&");
          case "application/json":
            return JSON.stringify(e);
          default:
            return e;
        }
      };
      AjaxSubscriber.prototype.setHeaders = function(e, t) {
        for (var r in t) {
          if (t.hasOwnProperty(r)) {
            e.setRequestHeader(r, t[r]);
          }
        }
      };
      AjaxSubscriber.prototype.getHeader = function(e, t) {
        for (var r in e) {
          if (r.toLowerCase() === t.toLowerCase()) {
            return e[r];
          }
        }
        return undefined;
      };
      AjaxSubscriber.prototype.setupEvents = function(e, r) {
        var n = r.progressSubscriber;
        function xhrTimeout(e) {
          var r = xhrTimeout,
            n = r.subscriber,
            i = r.progressSubscriber,
            o = r.request;
          if (i) {
            i.error(e);
          }
          var s;
          try {
            s = new t.AjaxTimeoutError(this, o);
          } catch (e) {
            s = e;
          }
          n.error(s);
        }
        e.ontimeout = xhrTimeout;
        xhrTimeout.request = r;
        xhrTimeout.subscriber = this;
        xhrTimeout.progressSubscriber = n;
        if (e.upload && "withCredentials" in e) {
          if (n) {
            var o;
            o = function(e) {
              var t = o.progressSubscriber;
              t.next(e);
            };
            if (i.root.XDomainRequest) {
              e.onprogress = o;
            } else {
              e.upload.onprogress = o;
            }
            o.progressSubscriber = n;
          }
          var s;
          s = function(e) {
            var r = s,
              n = r.progressSubscriber,
              i = r.subscriber,
              o = r.request;
            if (n) {
              n.error(e);
            }
            var u;
            try {
              u = new t.AjaxError("ajax error", this, o);
            } catch (e) {
              u = e;
            }
            i.error(u);
          };
          e.onerror = s;
          s.request = r;
          s.subscriber = this;
          s.progressSubscriber = n;
        }
        function xhrReadyStateChange(e) {
          return;
        }
        e.onreadystatechange = xhrReadyStateChange;
        xhrReadyStateChange.subscriber = this;
        xhrReadyStateChange.progressSubscriber = n;
        xhrReadyStateChange.request = r;
        function xhrLoad(e) {
          var r = xhrLoad,
            n = r.subscriber,
            i = r.progressSubscriber,
            o = r.request;
          if (this.readyState === 4) {
            var s = this.status === 1223 ? 204 : this.status;
            var u =
              this.responseType === "text"
                ? this.response || this.responseText
                : this.response;
            if (s === 0) {
              s = u ? 200 : 0;
            }
            if (s < 400) {
              if (i) {
                i.complete();
              }
              n.next(e);
              n.complete();
            } else {
              if (i) {
                i.error(e);
              }
              var a = void 0;
              try {
                a = new t.AjaxError("ajax error " + s, this, o);
              } catch (e) {
                a = e;
              }
              n.error(a);
            }
          }
        }
        e.onload = xhrLoad;
        xhrLoad.subscriber = this;
        xhrLoad.progressSubscriber = n;
        xhrLoad.request = r;
      };
      AjaxSubscriber.prototype.unsubscribe = function() {
        var t = this,
          r = t.done,
          n = t.xhr;
        if (!r && n && n.readyState !== 4 && typeof n.abort === "function") {
          n.abort();
        }
        e.prototype.unsubscribe.call(this);
      };
      return AjaxSubscriber;
    })(s.Subscriber);
    t.AjaxSubscriber = p;
    var l = (function() {
      function AjaxResponse(e, t, r) {
        this.originalEvent = e;
        this.xhr = t;
        this.request = r;
        this.status = t.status;
        this.responseType = t.responseType || r.responseType;
        this.response = parseXhrResponse(this.responseType, t);
      }
      return AjaxResponse;
    })();
    t.AjaxResponse = l;
    var d = (function() {
      function AjaxErrorImpl(e, t, r) {
        Error.call(this);
        this.message = e;
        this.name = "AjaxError";
        this.xhr = t;
        this.request = r;
        this.status = t.status;
        this.responseType = t.responseType || r.responseType;
        this.response = parseXhrResponse(this.responseType, t);
        return this;
      }
      AjaxErrorImpl.prototype = Object.create(Error.prototype);
      return AjaxErrorImpl;
    })();
    t.AjaxError = d;
    function parseJson(e) {
      if ("response" in e) {
        return e.responseType
          ? e.response
          : JSON.parse(e.response || e.responseText || "null");
      } else {
        return JSON.parse(e.responseText || "null");
      }
    }
    function parseXhrResponse(e, t) {
      switch (e) {
        case "json":
          return parseJson(t);
        case "xml":
          return t.responseXML;
        case "text":
        default:
          return "response" in t ? t.response : t.responseText;
      }
    }
    function AjaxTimeoutErrorImpl(e, r) {
      t.AjaxError.call(this, "ajax timeout", e, r);
      this.name = "AjaxTimeoutError";
      return this;
    }
    t.AjaxTimeoutError = AjaxTimeoutErrorImpl;
  },
  function(e, t, r) {
    e.exports = authenticationPlugin;
    const n = r(278);
    const i = r(991);
    const o = r(954);
    function authenticationPlugin(e, t) {
      if (!t.auth) {
        return;
      }
      o(t.auth);
      const r = { octokit: e, auth: t.auth };
      e.hook.before("request", n.bind(null, r));
      e.hook.error("request", i.bind(null, r));
    }
  },
  ,
  ,
  function(e, t, r) {
    e.exports = iterator;
    const n = r(301);
    function iterator(e, t) {
      const r = t.headers;
      let i = e.request.endpoint(t).url;
      return {
        [Symbol.asyncIterator]: () => ({
          next() {
            if (!i) {
              return Promise.resolve({ done: true });
            }
            return e.request({ url: i, headers: r }).then(t => {
              n(e, i, t);
              i = ((t.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) ||
                [])[1];
              return { value: t };
            });
          }
        })
      };
    }
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(246);
    function mergeMapTo(e, t, r) {
      if (r === void 0) {
        r = Number.POSITIVE_INFINITY;
      }
      if (typeof t === "function") {
        return n.mergeMap(
          function() {
            return e;
          },
          t,
          r
        );
      }
      if (typeof t === "number") {
        r = t;
      }
      return n.mergeMap(function() {
        return e;
      }, r);
    }
    t.mergeMapTo = mergeMapTo;
  },
  function(e, t, r) {
    e.exports = isexe;
    isexe.sync = sync;
    var n = r(747);
    function isexe(e, t, r) {
      n.stat(e, function(e, n) {
        r(e, e ? false : checkStat(n, t));
      });
    }
    function sync(e, t) {
      return checkStat(n.statSync(e), t);
    }
    function checkStat(e, t) {
      return e.isFile() && checkMode(e, t);
    }
    function checkMode(e, t) {
      var r = e.mode;
      var n = e.uid;
      var i = e.gid;
      var o = t.uid !== undefined ? t.uid : process.getuid && process.getuid();
      var s = t.gid !== undefined ? t.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var a = parseInt("010", 8);
      var c = parseInt("001", 8);
      var p = u | a;
      var l =
        r & c || (r & a && i === s) || (r & u && n === o) || (r & p && o === 0);
      return l;
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function find(e, t) {
      if (typeof e !== "function") {
        throw new TypeError("predicate is not a function");
      }
      return function(r) {
        return r.lift(new o(e, r, false, t));
      };
    }
    t.find = find;
    var o = (function() {
      function FindValueOperator(e, t, r, n) {
        this.predicate = e;
        this.source = t;
        this.yieldIndex = r;
        this.thisArg = n;
      }
      FindValueOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new s(e, this.predicate, this.source, this.yieldIndex, this.thisArg)
        );
      };
      return FindValueOperator;
    })();
    t.FindValueOperator = o;
    var s = (function(e) {
      n(FindValueSubscriber, e);
      function FindValueSubscriber(t, r, n, i, o) {
        var s = e.call(this, t) || this;
        s.predicate = r;
        s.source = n;
        s.yieldIndex = i;
        s.thisArg = o;
        s.index = 0;
        return s;
      }
      FindValueSubscriber.prototype.notifyComplete = function(e) {
        var t = this.destination;
        t.next(e);
        t.complete();
        this.unsubscribe();
      };
      FindValueSubscriber.prototype._next = function(e) {
        var t = this,
          r = t.predicate,
          n = t.thisArg;
        var i = this.index++;
        try {
          var o = r.call(n || this, e, i, this.source);
          if (o) {
            this.notifyComplete(this.yieldIndex ? i : e);
          }
        } catch (e) {
          this.destination.error(e);
        }
      };
      FindValueSubscriber.prototype._complete = function() {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
      };
      return FindValueSubscriber;
    })(i.Subscriber);
    t.FindValueSubscriber = s;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(997);
    var o = r(553);
    function defer(e) {
      return new n.Observable(function(t) {
        var r;
        try {
          r = e();
        } catch (e) {
          t.error(e);
          return undefined;
        }
        var n = r ? i.from(r) : o.empty();
        return n.subscribe(t);
      });
    }
    t.defer = defer;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(707);
    function toArrayReducer(e, t, r) {
      if (r === 0) {
        return [t];
      }
      e.push(t);
      return e;
    }
    function toArray() {
      return n.reduce(toArrayReducer, []);
    }
    t.toArray = toArray;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e) {
    e.exports = require("https");
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(146);
    var s = (function(e) {
      n(BehaviorSubject, e);
      function BehaviorSubject(t) {
        var r = e.call(this) || this;
        r._value = t;
        return r;
      }
      Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function() {
          return this.getValue();
        },
        enumerable: true,
        configurable: true
      });
      BehaviorSubject.prototype._subscribe = function(t) {
        var r = e.prototype._subscribe.call(this, t);
        if (r && !r.closed) {
          t.next(this._value);
        }
        return r;
      };
      BehaviorSubject.prototype.getValue = function() {
        if (this.hasError) {
          throw this.thrownError;
        } else if (this.closed) {
          throw new o.ObjectUnsubscribedError();
        } else {
          return this._value;
        }
      };
      BehaviorSubject.prototype.next = function(t) {
        e.prototype.next.call(this, (this._value = t));
      };
      return BehaviorSubject;
    })(i.Subject);
    t.BehaviorSubject = s;
  },
  ,
  function(e) {
    e.exports = {
      _args: [["@octokit/rest@16.36.0", "/Users/gx/git/tools/waka-box"]],
      _from: "@octokit/rest@16.36.0",
      _id: "@octokit/rest@16.36.0",
      _inBundle: false,
      _integrity:
        "sha512-zoZj7Ya4vWBK4fjTwK2Cnmu7XBB1p9ygSvTk2TthN6DVJXM4hQZQoAiknWFLJWSTix4dnA3vuHtjPZbExYoCZA==",
      _location: "/@octokit/rest",
      _phantomChildren: {},
      _requested: {
        type: "version",
        registry: true,
        raw: "@octokit/rest@16.36.0",
        name: "@octokit/rest",
        escapedName: "@octokit%2frest",
        scope: "@octokit",
        rawSpec: "16.36.0",
        saveSpec: null,
        fetchSpec: "16.36.0"
      },
      _requiredBy: ["/"],
      _resolved: "https://registry.npmjs.org/@octokit/rest/-/rest-16.36.0.tgz",
      _spec: "16.36.0",
      _where: "/Users/gx/git/tools/waka-box",
      author: { name: "Gregor Martynus", url: "https://github.com/gr2m" },
      bugs: { url: "https://github.com/octokit/rest.js/issues" },
      bundlesize: [{ path: "./dist/octokit-rest.min.js.gz", maxSize: "33 kB" }],
      contributors: [
        { name: "Mike de Boer", email: "info@mikedeboer.nl" },
        { name: "Fabian Jakobs", email: "fabian@c9.io" },
        { name: "Joe Gallo", email: "joe@brassafrax.com" },
        { name: "Gregor Martynus", url: "https://github.com/gr2m" }
      ],
      dependencies: {
        "@octokit/request": "^5.2.0",
        "@octokit/request-error": "^1.0.2",
        "atob-lite": "^2.0.0",
        "before-after-hook": "^2.0.0",
        "btoa-lite": "^1.0.0",
        deprecation: "^2.0.0",
        "lodash.get": "^4.4.2",
        "lodash.set": "^4.3.2",
        "lodash.uniq": "^4.5.0",
        "octokit-pagination-methods": "^1.1.0",
        once: "^1.4.0",
        "universal-user-agent": "^4.0.0"
      },
      description: "GitHub REST API client for Node.js",
      devDependencies: {
        "@gimenete/type-writer": "^0.1.3",
        "@octokit/fixtures-server": "^5.0.6",
        "@octokit/graphql": "^4.2.0",
        "@types/node": "^13.1.0",
        bundlesize: "^0.18.0",
        chai: "^4.1.2",
        "compression-webpack-plugin": "^3.0.0",
        cypress: "^3.0.0",
        glob: "^7.1.2",
        "http-proxy-agent": "^3.0.0",
        "lodash.camelcase": "^4.3.0",
        "lodash.merge": "^4.6.1",
        "lodash.upperfirst": "^4.3.1",
        mkdirp: "^0.5.1",
        mocha: "^6.0.0",
        mustache: "^3.0.0",
        nock: "^11.3.3",
        "npm-run-all": "^4.1.2",
        nyc: "^15.0.0",
        prettier: "^1.14.2",
        proxy: "^1.0.0",
        "semantic-release": "^15.0.0",
        sinon: "^8.0.0",
        "sinon-chai": "^3.0.0",
        "sort-keys": "^4.0.0",
        "string-to-arraybuffer": "^1.0.0",
        "string-to-jsdoc-comment": "^1.0.0",
        typescript: "^3.3.1",
        webpack: "^4.0.0",
        "webpack-bundle-analyzer": "^3.0.0",
        "webpack-cli": "^3.0.0"
      },
      files: ["index.js", "index.d.ts", "lib", "plugins"],
      homepage: "https://github.com/octokit/rest.js#readme",
      keywords: ["octokit", "github", "rest", "api-client"],
      license: "MIT",
      name: "@octokit/rest",
      nyc: { ignore: ["test"] },
      publishConfig: { access: "public" },
      release: {
        publish: [
          "@semantic-release/npm",
          {
            path: "@semantic-release/github",
            assets: ["dist/*", "!dist/*.map.gz"]
          }
        ]
      },
      repository: {
        type: "git",
        url: "git+https://github.com/octokit/rest.js.git"
      },
      scripts: {
        build: "npm-run-all build:*",
        "build:browser": "npm-run-all build:browser:*",
        "build:browser:development":
          "webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json",
        "build:browser:production":
          "webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map",
        "build:ts": "npm run -s update-endpoints:typescript",
        coverage: "nyc report --reporter=html && open coverage/index.html",
        "generate-bundle-report":
          "webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html",
        lint:
          "prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
        "lint:fix":
          "prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json",
        "postvalidate:ts":
          "tsc --noEmit --target es6 test/typescript-validate.ts",
        "prebuild:browser": "mkdirp dist/",
        pretest: "npm run -s lint",
        "prevalidate:ts": "npm run -s build:ts",
        "start-fixtures-server": "octokit-fixtures-server",
        test: 'nyc mocha test/mocha-node-setup.js "test/*/**/*-test.js"',
        "test:browser": "cypress run --browser chrome",
        "update-endpoints": "npm-run-all update-endpoints:*",
        "update-endpoints:code": "node scripts/update-endpoints/code",
        "update-endpoints:fetch-json":
          "node scripts/update-endpoints/fetch-json",
        "update-endpoints:typescript":
          "node scripts/update-endpoints/typescript",
        "validate:ts": "tsc --target es6 --noImplicitAny index.d.ts"
      },
      types: "index.d.ts",
      version: "16.36.0"
    };
  },
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    t.subscribeToArray = function(e) {
      return function(t) {
        for (var r = 0, n = e.length; r < n && !t.closed; r++) {
          t.next(e[r]);
        }
        t.complete();
      };
    };
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(935);
    function subscribeOn(e, t) {
      if (t === void 0) {
        t = 0;
      }
      return function subscribeOnOperatorFunction(r) {
        return r.lift(new i(e, t));
      };
    }
    t.subscribeOn = subscribeOn;
    var i = (function() {
      function SubscribeOnOperator(e, t) {
        this.scheduler = e;
        this.delay = t;
      }
      SubscribeOnOperator.prototype.call = function(e, t) {
        return new n.SubscribeOnObservable(
          t,
          this.delay,
          this.scheduler
        ).subscribe(e);
      };
      return SubscribeOnOperator;
    })();
  },
  ,
  function(e, t, r) {
    "use strict";
    const n = r(669);
    let i;
    if (typeof n.getSystemErrorName === "function") {
      e.exports = n.getSystemErrorName;
    } else {
      try {
        i = process.binding("uv");
        if (typeof i.errname !== "function") {
          throw new TypeError("uv.errname is not a function");
        }
      } catch (e) {
        console.error(
          "execa/lib/errname: unable to establish process.binding('uv')",
          e
        );
        i = null;
      }
      e.exports = e => errname(i, e);
    }
    e.exports.__test__ = errname;
    function errname(e, t) {
      if (e) {
        return e.errname(t);
      }
      if (!(t < 0)) {
        throw new Error("err >= 0");
      }
      return `Unknown system error ${t}`;
    }
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(162);
    var o = (function(e) {
      n(QueueAction, e);
      function QueueAction(t, r) {
        var n = e.call(this, t, r) || this;
        n.scheduler = t;
        n.work = r;
        return n;
      }
      QueueAction.prototype.schedule = function(t, r) {
        if (r === void 0) {
          r = 0;
        }
        if (r > 0) {
          return e.prototype.schedule.call(this, t, r);
        }
        this.delay = r;
        this.state = t;
        this.scheduler.flush(this);
        return this;
      };
      QueueAction.prototype.execute = function(t, r) {
        return r > 0 || this.closed
          ? e.prototype.execute.call(this, t, r)
          : this._execute(t, r);
      };
      QueueAction.prototype.requestAsyncId = function(t, r, n) {
        if (n === void 0) {
          n = 0;
        }
        if ((n !== null && n > 0) || (n === null && this.delay > 0)) {
          return e.prototype.requestAsyncId.call(this, t, r, n);
        }
        return t.flush(this);
      };
      return QueueAction;
    })(i.AsyncAction);
    t.QueueAction = o;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function skip(e) {
      return function(t) {
        return t.lift(new o(e));
      };
    }
    t.skip = skip;
    var o = (function() {
      function SkipOperator(e) {
        this.total = e;
      }
      SkipOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.total));
      };
      return SkipOperator;
    })();
    var s = (function(e) {
      n(SkipSubscriber, e);
      function SkipSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.total = r;
        n.count = 0;
        return n;
      }
      SkipSubscriber.prototype._next = function(e) {
        if (++this.count > this.total) {
          this.destination.next(e);
        }
      };
      return SkipSubscriber;
    })(i.Subscriber);
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(262);
    var o = r(162);
    var s = (function(e) {
      n(AsapAction, e);
      function AsapAction(t, r) {
        var n = e.call(this, t, r) || this;
        n.scheduler = t;
        n.work = r;
        return n;
      }
      AsapAction.prototype.requestAsyncId = function(t, r, n) {
        if (n === void 0) {
          n = 0;
        }
        if (n !== null && n > 0) {
          return e.prototype.requestAsyncId.call(this, t, r, n);
        }
        t.actions.push(this);
        return (
          t.scheduled ||
          (t.scheduled = i.Immediate.setImmediate(t.flush.bind(t, null)))
        );
      };
      AsapAction.prototype.recycleAsyncId = function(t, r, n) {
        if (n === void 0) {
          n = 0;
        }
        if ((n !== null && n > 0) || (n === null && this.delay > 0)) {
          return e.prototype.recycleAsyncId.call(this, t, r, n);
        }
        if (t.actions.length === 0) {
          i.Immediate.clearImmediate(r);
          t.scheduled = undefined;
        }
        return undefined;
      };
      return AsapAction;
    })(o.AsyncAction);
    t.AsapAction = s;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(589);
    function switchMapTo(e, t) {
      return t
        ? n.switchMap(function() {
            return e;
          }, t)
        : n.switchMap(function() {
            return e;
          });
    }
    t.switchMapTo = switchMapTo;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(591);
    var o = r(565);
    var s = r(668);
    var u = r(802);
    var a = r(997);
    function mergeMap(e, t, r) {
      if (r === void 0) {
        r = Number.POSITIVE_INFINITY;
      }
      if (typeof t === "function") {
        return function(n) {
          return n.pipe(
            mergeMap(function(r, n) {
              return a.from(e(r, n)).pipe(
                u.map(function(e, i) {
                  return t(r, e, n, i);
                })
              );
            }, r)
          );
        };
      } else if (typeof t === "number") {
        r = t;
      }
      return function(t) {
        return t.lift(new c(e, r));
      };
    }
    t.mergeMap = mergeMap;
    var c = (function() {
      function MergeMapOperator(e, t) {
        if (t === void 0) {
          t = Number.POSITIVE_INFINITY;
        }
        this.project = e;
        this.concurrent = t;
      }
      MergeMapOperator.prototype.call = function(e, t) {
        return t.subscribe(new p(e, this.project, this.concurrent));
      };
      return MergeMapOperator;
    })();
    t.MergeMapOperator = c;
    var p = (function(e) {
      n(MergeMapSubscriber, e);
      function MergeMapSubscriber(t, r, n) {
        if (n === void 0) {
          n = Number.POSITIVE_INFINITY;
        }
        var i = e.call(this, t) || this;
        i.project = r;
        i.concurrent = n;
        i.hasCompleted = false;
        i.buffer = [];
        i.active = 0;
        i.index = 0;
        return i;
      }
      MergeMapSubscriber.prototype._next = function(e) {
        if (this.active < this.concurrent) {
          this._tryNext(e);
        } else {
          this.buffer.push(e);
        }
      };
      MergeMapSubscriber.prototype._tryNext = function(e) {
        var t;
        var r = this.index++;
        try {
          t = this.project(e, r);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.active++;
        this._innerSub(t, e, r);
      };
      MergeMapSubscriber.prototype._innerSub = function(e, t, r) {
        var n = new s.InnerSubscriber(this, t, r);
        var o = this.destination;
        o.add(n);
        var u = i.subscribeToResult(this, e, undefined, undefined, n);
        if (u !== n) {
          o.add(u);
        }
      };
      MergeMapSubscriber.prototype._complete = function() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
          this.destination.complete();
        }
        this.unsubscribe();
      };
      MergeMapSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.destination.next(t);
      };
      MergeMapSubscriber.prototype.notifyComplete = function(e) {
        var t = this.buffer;
        this.remove(e);
        this.active--;
        if (t.length > 0) {
          this._next(t.shift());
        } else if (this.active === 0 && this.hasCompleted) {
          this.destination.complete();
        }
      };
      return MergeMapSubscriber;
    })(o.OuterSubscriber);
    t.MergeMapSubscriber = p;
  },
  ,
  function(e, t, r) {
    e.exports = octokitRegisterEndpoints;
    const n = r(899);
    function octokitRegisterEndpoints(e) {
      e.registerEndpoints = n.bind(null, e);
    }
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(788);
    var o = (function(e) {
      n(AsyncScheduler, e);
      function AsyncScheduler(t, r) {
        if (r === void 0) {
          r = i.Scheduler.now;
        }
        var n =
          e.call(this, t, function() {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== n) {
              return AsyncScheduler.delegate.now();
            } else {
              return r();
            }
          }) || this;
        n.actions = [];
        n.active = false;
        n.scheduled = undefined;
        return n;
      }
      AsyncScheduler.prototype.schedule = function(t, r, n) {
        if (r === void 0) {
          r = 0;
        }
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
          return AsyncScheduler.delegate.schedule(t, r, n);
        } else {
          return e.prototype.schedule.call(this, t, r, n);
        }
      };
      AsyncScheduler.prototype.flush = function(e) {
        var t = this.actions;
        if (this.active) {
          t.push(e);
          return;
        }
        var r;
        this.active = true;
        do {
          if ((r = e.execute(e.state, e.delay))) {
            break;
          }
        } while ((e = t.shift()));
        this.active = false;
        if (r) {
          while ((e = t.shift())) {
            e.unsubscribe();
          }
          throw r;
        }
      };
      return AsyncScheduler;
    })(i.Scheduler);
    t.AsyncScheduler = o;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(955);
    var i = r(96);
    function publishLast() {
      return function(e) {
        return i.multicast(new n.AsyncSubject())(e);
      };
    }
    t.publishLast = publishLast;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function withLatestFrom() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return function(t) {
        var r;
        if (typeof e[e.length - 1] === "function") {
          r = e.pop();
        }
        var n = e;
        return t.lift(new s(n, r));
      };
    }
    t.withLatestFrom = withLatestFrom;
    var s = (function() {
      function WithLatestFromOperator(e, t) {
        this.observables = e;
        this.project = t;
      }
      WithLatestFromOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.observables, this.project));
      };
      return WithLatestFromOperator;
    })();
    var u = (function(e) {
      n(WithLatestFromSubscriber, e);
      function WithLatestFromSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.observables = r;
        i.project = n;
        i.toRespond = [];
        var s = r.length;
        i.values = new Array(s);
        for (var u = 0; u < s; u++) {
          i.toRespond.push(u);
        }
        for (var u = 0; u < s; u++) {
          var a = r[u];
          i.add(o.subscribeToResult(i, a, a, u));
        }
        return i;
      }
      WithLatestFromSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.values[r] = t;
        var o = this.toRespond;
        if (o.length > 0) {
          var s = o.indexOf(r);
          if (s !== -1) {
            o.splice(s, 1);
          }
        }
      };
      WithLatestFromSubscriber.prototype.notifyComplete = function() {};
      WithLatestFromSubscriber.prototype._next = function(e) {
        if (this.toRespond.length === 0) {
          var t = [e].concat(this.values);
          if (this.project) {
            this._tryProject(t);
          } else {
            this.destination.next(t);
          }
        }
      };
      WithLatestFromSubscriber.prototype._tryProject = function(e) {
        var t;
        try {
          t = this.project.apply(this, e);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.destination.next(t);
      };
      return WithLatestFromSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    t.isArray = (function() {
      return (
        Array.isArray ||
        function(e) {
          return e && typeof e.length === "number";
        }
      );
    })();
  },
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = 1;
    var n = (function() {
      return Promise.resolve();
    })();
    var i = {};
    function findAndClearHandle(e) {
      if (e in i) {
        delete i[e];
        return true;
      }
      return false;
    }
    t.Immediate = {
      setImmediate: function(e) {
        var t = r++;
        i[t] = true;
        n.then(function() {
          return findAndClearHandle(t) && e();
        });
        return t;
      },
      clearImmediate: function(e) {
        findAndClearHandle(e);
      }
    };
    t.TestTools = {
      pending: function() {
        return Object.keys(i).length;
      }
    };
  },
  ,
  ,
  function(e, t, r) {
    e.exports = getPage;
    const n = r(370);
    const i = r(577);
    const o = r(973);
    function getPage(e, t, r, s) {
      n(
        `octokit.get${r.charAt(0).toUpperCase() +
          r.slice(
            1
          )}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`
      );
      const u = i(t)[r];
      if (!u) {
        const e = new o(`No ${r} page found`, 404);
        return Promise.reject(e);
      }
      const a = { url: u, headers: applyAcceptHeader(t, s) };
      const c = e.request(a);
      return c;
    }
    function applyAcceptHeader(e, t) {
      const r = e.headers && e.headers["x-github-media-type"];
      if (!r || (t && t.accept)) {
        return t;
      }
      t = t || {};
      t.accept =
        "application/vnd." +
        r.replace("; param=", ".").replace("; format=", "+");
      return t;
    }
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(411);
    var o = r(917);
    var s = r(565);
    var u = r(591);
    function timeoutWith(e, t, r) {
      if (r === void 0) {
        r = i.async;
      }
      return function(n) {
        var i = o.isDate(e);
        var s = i ? +e - r.now() : Math.abs(e);
        return n.lift(new a(s, i, t, r));
      };
    }
    t.timeoutWith = timeoutWith;
    var a = (function() {
      function TimeoutWithOperator(e, t, r, n) {
        this.waitFor = e;
        this.absoluteTimeout = t;
        this.withObservable = r;
        this.scheduler = n;
      }
      TimeoutWithOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new c(
            e,
            this.absoluteTimeout,
            this.waitFor,
            this.withObservable,
            this.scheduler
          )
        );
      };
      return TimeoutWithOperator;
    })();
    var c = (function(e) {
      n(TimeoutWithSubscriber, e);
      function TimeoutWithSubscriber(t, r, n, i, o) {
        var s = e.call(this, t) || this;
        s.absoluteTimeout = r;
        s.waitFor = n;
        s.withObservable = i;
        s.scheduler = o;
        s.action = null;
        s.scheduleTimeout();
        return s;
      }
      TimeoutWithSubscriber.dispatchTimeout = function(e) {
        var t = e.withObservable;
        e._unsubscribeAndRecycle();
        e.add(u.subscribeToResult(e, t));
      };
      TimeoutWithSubscriber.prototype.scheduleTimeout = function() {
        var e = this.action;
        if (e) {
          this.action = e.schedule(this, this.waitFor);
        } else {
          this.add(
            (this.action = this.scheduler.schedule(
              TimeoutWithSubscriber.dispatchTimeout,
              this.waitFor,
              this
            ))
          );
        }
      };
      TimeoutWithSubscriber.prototype._next = function(t) {
        if (!this.absoluteTimeout) {
          this.scheduleTimeout();
        }
        e.prototype._next.call(this, t);
      };
      TimeoutWithSubscriber.prototype._unsubscribe = function() {
        this.action = null;
        this.scheduler = null;
        this.withObservable = null;
      };
      return TimeoutWithSubscriber;
    })(s.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = authenticationBeforeRequest;
    const n = r(675);
    const i = r(143);
    function authenticationBeforeRequest(e, t) {
      if (typeof e.auth === "string") {
        t.headers.authorization = i(e.auth);
        if (/^bearer /i.test(e.auth) && !/machine-man/.test(t.headers.accept)) {
          const e = t.headers.accept
            .split(",")
            .concat("application/vnd.github.machine-man-preview+json");
          t.headers.accept = e.filter(Boolean).join(",");
        }
        return;
      }
      if (e.auth.username) {
        const r = n(`${e.auth.username}:${e.auth.password}`);
        t.headers.authorization = `Basic ${r}`;
        if (e.otp) {
          t.headers["x-github-otp"] = e.otp;
        }
        return;
      }
      if (e.auth.clientId) {
        if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(t.url)) {
          const r = n(`${e.auth.clientId}:${e.auth.clientSecret}`);
          t.headers.authorization = `Basic ${r}`;
          return;
        }
        t.url += t.url.indexOf("?") === -1 ? "?" : "&";
        t.url += `client_id=${e.auth.clientId}&client_secret=${e.auth.clientSecret}`;
        return;
      }
      return Promise.resolve()
        .then(() => {
          return e.auth();
        })
        .then(e => {
          t.headers.authorization = i(e);
        });
    }
  },
  ,
  function(e, t) {
    t = e.exports = SemVer;
    var r;
    if (
      typeof process === "object" &&
      process.env &&
      process.env.NODE_DEBUG &&
      /\bsemver\b/i.test(process.env.NODE_DEBUG)
    ) {
      r = function() {
        var e = Array.prototype.slice.call(arguments, 0);
        e.unshift("SEMVER");
        console.log.apply(console, e);
      };
    } else {
      r = function() {};
    }
    t.SEMVER_SPEC_VERSION = "2.0.0";
    var n = 256;
    var i = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var o = 16;
    var s = (t.re = []);
    var u = (t.src = []);
    var a = 0;
    var c = a++;
    u[c] = "0|[1-9]\\d*";
    var p = a++;
    u[p] = "[0-9]+";
    var l = a++;
    u[l] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
    var d = a++;
    u[d] = "(" + u[c] + ")\\." + "(" + u[c] + ")\\." + "(" + u[c] + ")";
    var f = a++;
    u[f] = "(" + u[p] + ")\\." + "(" + u[p] + ")\\." + "(" + u[p] + ")";
    var h = a++;
    u[h] = "(?:" + u[c] + "|" + u[l] + ")";
    var y = a++;
    u[y] = "(?:" + u[p] + "|" + u[l] + ")";
    var b = a++;
    u[b] = "(?:-(" + u[h] + "(?:\\." + u[h] + ")*))";
    var g = a++;
    u[g] = "(?:-?(" + u[y] + "(?:\\." + u[y] + ")*))";
    var m = a++;
    u[m] = "[0-9A-Za-z-]+";
    var _ = a++;
    u[_] = "(?:\\+(" + u[m] + "(?:\\." + u[m] + ")*))";
    var v = a++;
    var w = "v?" + u[d] + u[b] + "?" + u[_] + "?";
    u[v] = "^" + w + "$";
    var S = "[v=\\s]*" + u[f] + u[g] + "?" + u[_] + "?";
    var q = a++;
    u[q] = "^" + S + "$";
    var O = a++;
    u[O] = "((?:<|>)?=?)";
    var E = a++;
    u[E] = u[p] + "|x|X|\\*";
    var T = a++;
    u[T] = u[c] + "|x|X|\\*";
    var j = a++;
    u[j] =
      "[v=\\s]*(" +
      u[T] +
      ")" +
      "(?:\\.(" +
      u[T] +
      ")" +
      "(?:\\.(" +
      u[T] +
      ")" +
      "(?:" +
      u[b] +
      ")?" +
      u[_] +
      "?" +
      ")?)?";
    var x = a++;
    u[x] =
      "[v=\\s]*(" +
      u[E] +
      ")" +
      "(?:\\.(" +
      u[E] +
      ")" +
      "(?:\\.(" +
      u[E] +
      ")" +
      "(?:" +
      u[g] +
      ")?" +
      u[_] +
      "?" +
      ")?)?";
    var P = a++;
    u[P] = "^" + u[O] + "\\s*" + u[j] + "$";
    var C = a++;
    u[C] = "^" + u[O] + "\\s*" + u[x] + "$";
    var A = a++;
    u[A] =
      "(?:^|[^\\d])" +
      "(\\d{1," +
      o +
      "})" +
      "(?:\\.(\\d{1," +
      o +
      "}))?" +
      "(?:\\.(\\d{1," +
      o +
      "}))?" +
      "(?:$|[^\\d])";
    var k = a++;
    u[k] = "(?:~>?)";
    var R = a++;
    u[R] = "(\\s*)" + u[k] + "\\s+";
    s[R] = new RegExp(u[R], "g");
    var I = "$1~";
    var G = a++;
    u[G] = "^" + u[k] + u[j] + "$";
    var D = a++;
    u[D] = "^" + u[k] + u[x] + "$";
    var F = a++;
    u[F] = "(?:\\^)";
    var B = a++;
    u[B] = "(\\s*)" + u[F] + "\\s+";
    s[B] = new RegExp(u[B], "g");
    var N = "$1^";
    var L = a++;
    u[L] = "^" + u[F] + u[j] + "$";
    var M = a++;
    u[M] = "^" + u[F] + u[x] + "$";
    var U = a++;
    u[U] = "^" + u[O] + "\\s*(" + S + ")$|^$";
    var W = a++;
    u[W] = "^" + u[O] + "\\s*(" + w + ")$|^$";
    var z = a++;
    u[z] = "(\\s*)" + u[O] + "\\s*(" + S + "|" + u[j] + ")";
    s[z] = new RegExp(u[z], "g");
    var H = "$1$2$3";
    var V = a++;
    u[V] = "^\\s*(" + u[j] + ")" + "\\s+-\\s+" + "(" + u[j] + ")" + "\\s*$";
    var $ = a++;
    u[$] = "^\\s*(" + u[x] + ")" + "\\s+-\\s+" + "(" + u[x] + ")" + "\\s*$";
    var X = a++;
    u[X] = "(<|>)?=?\\s*\\*";
    for (var K = 0; K < a; K++) {
      r(K, u[K]);
      if (!s[K]) {
        s[K] = new RegExp(u[K]);
      }
    }
    t.parse = parse;
    function parse(e, t) {
      if (!t || typeof t !== "object") {
        t = { loose: !!t, includePrerelease: false };
      }
      if (e instanceof SemVer) {
        return e;
      }
      if (typeof e !== "string") {
        return null;
      }
      if (e.length > n) {
        return null;
      }
      var r = t.loose ? s[q] : s[v];
      if (!r.test(e)) {
        return null;
      }
      try {
        return new SemVer(e, t);
      } catch (e) {
        return null;
      }
    }
    t.valid = valid;
    function valid(e, t) {
      var r = parse(e, t);
      return r ? r.version : null;
    }
    t.clean = clean;
    function clean(e, t) {
      var r = parse(e.trim().replace(/^[=v]+/, ""), t);
      return r ? r.version : null;
    }
    t.SemVer = SemVer;
    function SemVer(e, t) {
      if (!t || typeof t !== "object") {
        t = { loose: !!t, includePrerelease: false };
      }
      if (e instanceof SemVer) {
        if (e.loose === t.loose) {
          return e;
        } else {
          e = e.version;
        }
      } else if (typeof e !== "string") {
        throw new TypeError("Invalid Version: " + e);
      }
      if (e.length > n) {
        throw new TypeError("version is longer than " + n + " characters");
      }
      if (!(this instanceof SemVer)) {
        return new SemVer(e, t);
      }
      r("SemVer", e, t);
      this.options = t;
      this.loose = !!t.loose;
      var o = e.trim().match(t.loose ? s[q] : s[v]);
      if (!o) {
        throw new TypeError("Invalid Version: " + e);
      }
      this.raw = e;
      this.major = +o[1];
      this.minor = +o[2];
      this.patch = +o[3];
      if (this.major > i || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > i || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > i || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!o[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = o[4].split(".").map(function(e) {
          if (/^[0-9]+$/.test(e)) {
            var t = +e;
            if (t >= 0 && t < i) {
              return t;
            }
          }
          return e;
        });
      }
      this.build = o[5] ? o[5].split(".") : [];
      this.format();
    }
    SemVer.prototype.format = function() {
      this.version = this.major + "." + this.minor + "." + this.patch;
      if (this.prerelease.length) {
        this.version += "-" + this.prerelease.join(".");
      }
      return this.version;
    };
    SemVer.prototype.toString = function() {
      return this.version;
    };
    SemVer.prototype.compare = function(e) {
      r("SemVer.compare", this.version, this.options, e);
      if (!(e instanceof SemVer)) {
        e = new SemVer(e, this.options);
      }
      return this.compareMain(e) || this.comparePre(e);
    };
    SemVer.prototype.compareMain = function(e) {
      if (!(e instanceof SemVer)) {
        e = new SemVer(e, this.options);
      }
      return (
        compareIdentifiers(this.major, e.major) ||
        compareIdentifiers(this.minor, e.minor) ||
        compareIdentifiers(this.patch, e.patch)
      );
    };
    SemVer.prototype.comparePre = function(e) {
      if (!(e instanceof SemVer)) {
        e = new SemVer(e, this.options);
      }
      if (this.prerelease.length && !e.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && e.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !e.prerelease.length) {
        return 0;
      }
      var t = 0;
      do {
        var n = this.prerelease[t];
        var i = e.prerelease[t];
        r("prerelease compare", t, n, i);
        if (n === undefined && i === undefined) {
          return 0;
        } else if (i === undefined) {
          return 1;
        } else if (n === undefined) {
          return -1;
        } else if (n === i) {
          continue;
        } else {
          return compareIdentifiers(n, i);
        }
      } while (++t);
    };
    SemVer.prototype.inc = function(e, t) {
      switch (e) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", t);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", t);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", t);
          this.inc("pre", t);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", t);
          }
          this.inc("pre", t);
          break;
        case "major":
          if (
            this.minor !== 0 ||
            this.patch !== 0 ||
            this.prerelease.length === 0
          ) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [0];
          } else {
            var r = this.prerelease.length;
            while (--r >= 0) {
              if (typeof this.prerelease[r] === "number") {
                this.prerelease[r]++;
                r = -2;
              }
            }
            if (r === -1) {
              this.prerelease.push(0);
            }
          }
          if (t) {
            if (this.prerelease[0] === t) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [t, 0];
              }
            } else {
              this.prerelease = [t, 0];
            }
          }
          break;
        default:
          throw new Error("invalid increment argument: " + e);
      }
      this.format();
      this.raw = this.version;
      return this;
    };
    t.inc = inc;
    function inc(e, t, r, n) {
      if (typeof r === "string") {
        n = r;
        r = undefined;
      }
      try {
        return new SemVer(e, r).inc(t, n).version;
      } catch (e) {
        return null;
      }
    }
    t.diff = diff;
    function diff(e, t) {
      if (eq(e, t)) {
        return null;
      } else {
        var r = parse(e);
        var n = parse(t);
        var i = "";
        if (r.prerelease.length || n.prerelease.length) {
          i = "pre";
          var o = "prerelease";
        }
        for (var s in r) {
          if (s === "major" || s === "minor" || s === "patch") {
            if (r[s] !== n[s]) {
              return i + s;
            }
          }
        }
        return o;
      }
    }
    t.compareIdentifiers = compareIdentifiers;
    var Y = /^[0-9]+$/;
    function compareIdentifiers(e, t) {
      var r = Y.test(e);
      var n = Y.test(t);
      if (r && n) {
        e = +e;
        t = +t;
      }
      return e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
    }
    t.rcompareIdentifiers = rcompareIdentifiers;
    function rcompareIdentifiers(e, t) {
      return compareIdentifiers(t, e);
    }
    t.major = major;
    function major(e, t) {
      return new SemVer(e, t).major;
    }
    t.minor = minor;
    function minor(e, t) {
      return new SemVer(e, t).minor;
    }
    t.patch = patch;
    function patch(e, t) {
      return new SemVer(e, t).patch;
    }
    t.compare = compare;
    function compare(e, t, r) {
      return new SemVer(e, r).compare(new SemVer(t, r));
    }
    t.compareLoose = compareLoose;
    function compareLoose(e, t) {
      return compare(e, t, true);
    }
    t.rcompare = rcompare;
    function rcompare(e, t, r) {
      return compare(t, e, r);
    }
    t.sort = sort;
    function sort(e, r) {
      return e.sort(function(e, n) {
        return t.compare(e, n, r);
      });
    }
    t.rsort = rsort;
    function rsort(e, r) {
      return e.sort(function(e, n) {
        return t.rcompare(e, n, r);
      });
    }
    t.gt = gt;
    function gt(e, t, r) {
      return compare(e, t, r) > 0;
    }
    t.lt = lt;
    function lt(e, t, r) {
      return compare(e, t, r) < 0;
    }
    t.eq = eq;
    function eq(e, t, r) {
      return compare(e, t, r) === 0;
    }
    t.neq = neq;
    function neq(e, t, r) {
      return compare(e, t, r) !== 0;
    }
    t.gte = gte;
    function gte(e, t, r) {
      return compare(e, t, r) >= 0;
    }
    t.lte = lte;
    function lte(e, t, r) {
      return compare(e, t, r) <= 0;
    }
    t.cmp = cmp;
    function cmp(e, t, r, n) {
      switch (t) {
        case "===":
          if (typeof e === "object") e = e.version;
          if (typeof r === "object") r = r.version;
          return e === r;
        case "!==":
          if (typeof e === "object") e = e.version;
          if (typeof r === "object") r = r.version;
          return e !== r;
        case "":
        case "=":
        case "==":
          return eq(e, r, n);
        case "!=":
          return neq(e, r, n);
        case ">":
          return gt(e, r, n);
        case ">=":
          return gte(e, r, n);
        case "<":
          return lt(e, r, n);
        case "<=":
          return lte(e, r, n);
        default:
          throw new TypeError("Invalid operator: " + t);
      }
    }
    t.Comparator = Comparator;
    function Comparator(e, t) {
      if (!t || typeof t !== "object") {
        t = { loose: !!t, includePrerelease: false };
      }
      if (e instanceof Comparator) {
        if (e.loose === !!t.loose) {
          return e;
        } else {
          e = e.value;
        }
      }
      if (!(this instanceof Comparator)) {
        return new Comparator(e, t);
      }
      r("comparator", e, t);
      this.options = t;
      this.loose = !!t.loose;
      this.parse(e);
      if (this.semver === Z) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      r("comp", this);
    }
    var Z = {};
    Comparator.prototype.parse = function(e) {
      var t = this.options.loose ? s[U] : s[W];
      var r = e.match(t);
      if (!r) {
        throw new TypeError("Invalid comparator: " + e);
      }
      this.operator = r[1];
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!r[2]) {
        this.semver = Z;
      } else {
        this.semver = new SemVer(r[2], this.options.loose);
      }
    };
    Comparator.prototype.toString = function() {
      return this.value;
    };
    Comparator.prototype.test = function(e) {
      r("Comparator.test", e, this.options.loose);
      if (this.semver === Z) {
        return true;
      }
      if (typeof e === "string") {
        e = new SemVer(e, this.options);
      }
      return cmp(e, this.operator, this.semver, this.options);
    };
    Comparator.prototype.intersects = function(e, t) {
      if (!(e instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (!t || typeof t !== "object") {
        t = { loose: !!t, includePrerelease: false };
      }
      var r;
      if (this.operator === "") {
        r = new Range(e.value, t);
        return satisfies(this.value, r, t);
      } else if (e.operator === "") {
        r = new Range(this.value, t);
        return satisfies(e.semver, r, t);
      }
      var n =
        (this.operator === ">=" || this.operator === ">") &&
        (e.operator === ">=" || e.operator === ">");
      var i =
        (this.operator === "<=" || this.operator === "<") &&
        (e.operator === "<=" || e.operator === "<");
      var o = this.semver.version === e.semver.version;
      var s =
        (this.operator === ">=" || this.operator === "<=") &&
        (e.operator === ">=" || e.operator === "<=");
      var u =
        cmp(this.semver, "<", e.semver, t) &&
        (this.operator === ">=" || this.operator === ">") &&
          (e.operator === "<=" || e.operator === "<");
      var a =
        cmp(this.semver, ">", e.semver, t) &&
        (this.operator === "<=" || this.operator === "<") &&
          (e.operator === ">=" || e.operator === ">");
      return n || i || (o && s) || u || a;
    };
    t.Range = Range;
    function Range(e, t) {
      if (!t || typeof t !== "object") {
        t = { loose: !!t, includePrerelease: false };
      }
      if (e instanceof Range) {
        if (
          e.loose === !!t.loose &&
          e.includePrerelease === !!t.includePrerelease
        ) {
          return e;
        } else {
          return new Range(e.raw, t);
        }
      }
      if (e instanceof Comparator) {
        return new Range(e.value, t);
      }
      if (!(this instanceof Range)) {
        return new Range(e, t);
      }
      this.options = t;
      this.loose = !!t.loose;
      this.includePrerelease = !!t.includePrerelease;
      this.raw = e;
      this.set = e
        .split(/\s*\|\|\s*/)
        .map(function(e) {
          return this.parseRange(e.trim());
        }, this)
        .filter(function(e) {
          return e.length;
        });
      if (!this.set.length) {
        throw new TypeError("Invalid SemVer Range: " + e);
      }
      this.format();
    }
    Range.prototype.format = function() {
      this.range = this.set
        .map(function(e) {
          return e.join(" ").trim();
        })
        .join("||")
        .trim();
      return this.range;
    };
    Range.prototype.toString = function() {
      return this.range;
    };
    Range.prototype.parseRange = function(e) {
      var t = this.options.loose;
      e = e.trim();
      var n = t ? s[$] : s[V];
      e = e.replace(n, hyphenReplace);
      r("hyphen replace", e);
      e = e.replace(s[z], H);
      r("comparator trim", e, s[z]);
      e = e.replace(s[R], I);
      e = e.replace(s[B], N);
      e = e.split(/\s+/).join(" ");
      var i = t ? s[U] : s[W];
      var o = e
        .split(" ")
        .map(function(e) {
          return parseComparator(e, this.options);
        }, this)
        .join(" ")
        .split(/\s+/);
      if (this.options.loose) {
        o = o.filter(function(e) {
          return !!e.match(i);
        });
      }
      o = o.map(function(e) {
        return new Comparator(e, this.options);
      }, this);
      return o;
    };
    Range.prototype.intersects = function(e, t) {
      if (!(e instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(function(r) {
        return r.every(function(r) {
          return e.set.some(function(e) {
            return e.every(function(e) {
              return r.intersects(e, t);
            });
          });
        });
      });
    };
    t.toComparators = toComparators;
    function toComparators(e, t) {
      return new Range(e, t).set.map(function(e) {
        return e
          .map(function(e) {
            return e.value;
          })
          .join(" ")
          .trim()
          .split(" ");
      });
    }
    function parseComparator(e, t) {
      r("comp", e, t);
      e = replaceCarets(e, t);
      r("caret", e);
      e = replaceTildes(e, t);
      r("tildes", e);
      e = replaceXRanges(e, t);
      r("xrange", e);
      e = replaceStars(e, t);
      r("stars", e);
      return e;
    }
    function isX(e) {
      return !e || e.toLowerCase() === "x" || e === "*";
    }
    function replaceTildes(e, t) {
      return e
        .trim()
        .split(/\s+/)
        .map(function(e) {
          return replaceTilde(e, t);
        })
        .join(" ");
    }
    function replaceTilde(e, t) {
      var n = t.loose ? s[D] : s[G];
      return e.replace(n, function(t, n, i, o, s) {
        r("tilde", e, t, n, i, o, s);
        var u;
        if (isX(n)) {
          u = "";
        } else if (isX(i)) {
          u = ">=" + n + ".0.0 <" + (+n + 1) + ".0.0";
        } else if (isX(o)) {
          u = ">=" + n + "." + i + ".0 <" + n + "." + (+i + 1) + ".0";
        } else if (s) {
          r("replaceTilde pr", s);
          u =
            ">=" +
            n +
            "." +
            i +
            "." +
            o +
            "-" +
            s +
            " <" +
            n +
            "." +
            (+i + 1) +
            ".0";
        } else {
          u = ">=" + n + "." + i + "." + o + " <" + n + "." + (+i + 1) + ".0";
        }
        r("tilde return", u);
        return u;
      });
    }
    function replaceCarets(e, t) {
      return e
        .trim()
        .split(/\s+/)
        .map(function(e) {
          return replaceCaret(e, t);
        })
        .join(" ");
    }
    function replaceCaret(e, t) {
      r("caret", e, t);
      var n = t.loose ? s[M] : s[L];
      return e.replace(n, function(t, n, i, o, s) {
        r("caret", e, t, n, i, o, s);
        var u;
        if (isX(n)) {
          u = "";
        } else if (isX(i)) {
          u = ">=" + n + ".0.0 <" + (+n + 1) + ".0.0";
        } else if (isX(o)) {
          if (n === "0") {
            u = ">=" + n + "." + i + ".0 <" + n + "." + (+i + 1) + ".0";
          } else {
            u = ">=" + n + "." + i + ".0 <" + (+n + 1) + ".0.0";
          }
        } else if (s) {
          r("replaceCaret pr", s);
          if (n === "0") {
            if (i === "0") {
              u =
                ">=" +
                n +
                "." +
                i +
                "." +
                o +
                "-" +
                s +
                " <" +
                n +
                "." +
                i +
                "." +
                (+o + 1);
            } else {
              u =
                ">=" +
                n +
                "." +
                i +
                "." +
                o +
                "-" +
                s +
                " <" +
                n +
                "." +
                (+i + 1) +
                ".0";
            }
          } else {
            u =
              ">=" + n + "." + i + "." + o + "-" + s + " <" + (+n + 1) + ".0.0";
          }
        } else {
          r("no pr");
          if (n === "0") {
            if (i === "0") {
              u =
                ">=" +
                n +
                "." +
                i +
                "." +
                o +
                " <" +
                n +
                "." +
                i +
                "." +
                (+o + 1);
            } else {
              u =
                ">=" + n + "." + i + "." + o + " <" + n + "." + (+i + 1) + ".0";
            }
          } else {
            u = ">=" + n + "." + i + "." + o + " <" + (+n + 1) + ".0.0";
          }
        }
        r("caret return", u);
        return u;
      });
    }
    function replaceXRanges(e, t) {
      r("replaceXRanges", e, t);
      return e
        .split(/\s+/)
        .map(function(e) {
          return replaceXRange(e, t);
        })
        .join(" ");
    }
    function replaceXRange(e, t) {
      e = e.trim();
      var n = t.loose ? s[C] : s[P];
      return e.replace(n, function(t, n, i, o, s, u) {
        r("xRange", e, t, n, i, o, s, u);
        var a = isX(i);
        var c = a || isX(o);
        var p = c || isX(s);
        var l = p;
        if (n === "=" && l) {
          n = "";
        }
        if (a) {
          if (n === ">" || n === "<") {
            t = "<0.0.0";
          } else {
            t = "*";
          }
        } else if (n && l) {
          if (c) {
            o = 0;
          }
          s = 0;
          if (n === ">") {
            n = ">=";
            if (c) {
              i = +i + 1;
              o = 0;
              s = 0;
            } else {
              o = +o + 1;
              s = 0;
            }
          } else if (n === "<=") {
            n = "<";
            if (c) {
              i = +i + 1;
            } else {
              o = +o + 1;
            }
          }
          t = n + i + "." + o + "." + s;
        } else if (c) {
          t = ">=" + i + ".0.0 <" + (+i + 1) + ".0.0";
        } else if (p) {
          t = ">=" + i + "." + o + ".0 <" + i + "." + (+o + 1) + ".0";
        }
        r("xRange return", t);
        return t;
      });
    }
    function replaceStars(e, t) {
      r("replaceStars", e, t);
      return e.trim().replace(s[X], "");
    }
    function hyphenReplace(e, t, r, n, i, o, s, u, a, c, p, l, d) {
      if (isX(r)) {
        t = "";
      } else if (isX(n)) {
        t = ">=" + r + ".0.0";
      } else if (isX(i)) {
        t = ">=" + r + "." + n + ".0";
      } else {
        t = ">=" + t;
      }
      if (isX(a)) {
        u = "";
      } else if (isX(c)) {
        u = "<" + (+a + 1) + ".0.0";
      } else if (isX(p)) {
        u = "<" + a + "." + (+c + 1) + ".0";
      } else if (l) {
        u = "<=" + a + "." + c + "." + p + "-" + l;
      } else {
        u = "<=" + u;
      }
      return (t + " " + u).trim();
    }
    Range.prototype.test = function(e) {
      if (!e) {
        return false;
      }
      if (typeof e === "string") {
        e = new SemVer(e, this.options);
      }
      for (var t = 0; t < this.set.length; t++) {
        if (testSet(this.set[t], e, this.options)) {
          return true;
        }
      }
      return false;
    };
    function testSet(e, t, n) {
      for (var i = 0; i < e.length; i++) {
        if (!e[i].test(t)) {
          return false;
        }
      }
      if (t.prerelease.length && !n.includePrerelease) {
        for (i = 0; i < e.length; i++) {
          r(e[i].semver);
          if (e[i].semver === Z) {
            continue;
          }
          if (e[i].semver.prerelease.length > 0) {
            var o = e[i].semver;
            if (
              o.major === t.major &&
              o.minor === t.minor &&
              o.patch === t.patch
            ) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }
    t.satisfies = satisfies;
    function satisfies(e, t, r) {
      try {
        t = new Range(t, r);
      } catch (e) {
        return false;
      }
      return t.test(e);
    }
    t.maxSatisfying = maxSatisfying;
    function maxSatisfying(e, t, r) {
      var n = null;
      var i = null;
      try {
        var o = new Range(t, r);
      } catch (e) {
        return null;
      }
      e.forEach(function(e) {
        if (o.test(e)) {
          if (!n || i.compare(e) === -1) {
            n = e;
            i = new SemVer(n, r);
          }
        }
      });
      return n;
    }
    t.minSatisfying = minSatisfying;
    function minSatisfying(e, t, r) {
      var n = null;
      var i = null;
      try {
        var o = new Range(t, r);
      } catch (e) {
        return null;
      }
      e.forEach(function(e) {
        if (o.test(e)) {
          if (!n || i.compare(e) === 1) {
            n = e;
            i = new SemVer(n, r);
          }
        }
      });
      return n;
    }
    t.minVersion = minVersion;
    function minVersion(e, t) {
      e = new Range(e, t);
      var r = new SemVer("0.0.0");
      if (e.test(r)) {
        return r;
      }
      r = new SemVer("0.0.0-0");
      if (e.test(r)) {
        return r;
      }
      r = null;
      for (var n = 0; n < e.set.length; ++n) {
        var i = e.set[n];
        i.forEach(function(e) {
          var t = new SemVer(e.semver.version);
          switch (e.operator) {
            case ">":
              if (t.prerelease.length === 0) {
                t.patch++;
              } else {
                t.prerelease.push(0);
              }
              t.raw = t.format();
            case "":
            case ">=":
              if (!r || gt(r, t)) {
                r = t;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error("Unexpected operation: " + e.operator);
          }
        });
      }
      if (r && e.test(r)) {
        return r;
      }
      return null;
    }
    t.validRange = validRange;
    function validRange(e, t) {
      try {
        return new Range(e, t).range || "*";
      } catch (e) {
        return null;
      }
    }
    t.ltr = ltr;
    function ltr(e, t, r) {
      return outside(e, t, "<", r);
    }
    t.gtr = gtr;
    function gtr(e, t, r) {
      return outside(e, t, ">", r);
    }
    t.outside = outside;
    function outside(e, t, r, n) {
      e = new SemVer(e, n);
      t = new Range(t, n);
      var i, o, s, u, a;
      switch (r) {
        case ">":
          i = gt;
          o = lte;
          s = lt;
          u = ">";
          a = ">=";
          break;
        case "<":
          i = lt;
          o = gte;
          s = gt;
          u = "<";
          a = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(e, t, n)) {
        return false;
      }
      for (var c = 0; c < t.set.length; ++c) {
        var p = t.set[c];
        var l = null;
        var d = null;
        p.forEach(function(e) {
          if (e.semver === Z) {
            e = new Comparator(">=0.0.0");
          }
          l = l || e;
          d = d || e;
          if (i(e.semver, l.semver, n)) {
            l = e;
          } else if (s(e.semver, d.semver, n)) {
            d = e;
          }
        });
        if (l.operator === u || l.operator === a) {
          return false;
        }
        if ((!d.operator || d.operator === u) && o(e, d.semver)) {
          return false;
        } else if (d.operator === a && s(e, d.semver)) {
          return false;
        }
      }
      return true;
    }
    t.prerelease = prerelease;
    function prerelease(e, t) {
      var r = parse(e, t);
      return r && r.prerelease.length ? r.prerelease : null;
    }
    t.intersects = intersects;
    function intersects(e, t, r) {
      e = new Range(e, r);
      t = new Range(t, r);
      return e.intersects(t);
    }
    t.coerce = coerce;
    function coerce(e) {
      if (e instanceof SemVer) {
        return e;
      }
      if (typeof e !== "string") {
        return null;
      }
      var t = e.match(s[A]);
      if (t == null) {
        return null;
      }
      return parse(t[1] + "." + (t[2] || "0") + "." + (t[3] || "0"));
    }
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(199);
    function findIndex(e, t) {
      return function(r) {
        return r.lift(new n.FindValueOperator(e, r, true, t));
      };
    }
    t.findIndex = findIndex;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function audit(e) {
      return function auditOperatorFunction(t) {
        return t.lift(new s(e));
      };
    }
    t.audit = audit;
    var s = (function() {
      function AuditOperator(e) {
        this.durationSelector = e;
      }
      AuditOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.durationSelector));
      };
      return AuditOperator;
    })();
    var u = (function(e) {
      n(AuditSubscriber, e);
      function AuditSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.durationSelector = r;
        n.hasValue = false;
        return n;
      }
      AuditSubscriber.prototype._next = function(e) {
        this.value = e;
        this.hasValue = true;
        if (!this.throttled) {
          var t = void 0;
          try {
            var r = this.durationSelector;
            t = r(e);
          } catch (e) {
            return this.destination.error(e);
          }
          var n = o.subscribeToResult(this, t);
          if (!n || n.closed) {
            this.clearThrottle();
          } else {
            this.add((this.throttled = n));
          }
        }
      };
      AuditSubscriber.prototype.clearThrottle = function() {
        var e = this,
          t = e.value,
          r = e.hasValue,
          n = e.throttled;
        if (n) {
          this.remove(n);
          this.throttled = null;
          n.unsubscribe();
        }
        if (r) {
          this.value = null;
          this.hasValue = false;
          this.destination.next(t);
        }
      };
      AuditSubscriber.prototype.notifyNext = function(e, t, r, n) {
        this.clearThrottle();
      };
      AuditSubscriber.prototype.notifyComplete = function() {
        this.clearThrottle();
      };
      return AuditSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(411);
    var i = r(291);
    var o = r(819);
    function auditTime(e, t) {
      if (t === void 0) {
        t = n.async;
      }
      return i.audit(function() {
        return o.timer(e, t);
      });
    }
    t.auditTime = auditTime;
  },
  function(e, t, r) {
    e.exports = parseOptions;
    const { Deprecation: n } = r(692);
    const { getUserAgent: i } = r(796);
    const o = r(969);
    const s = r(215);
    const u = o((e, t) => e.warn(t));
    const a = o((e, t) => e.warn(t));
    const c = o((e, t) => e.warn(t));
    function parseOptions(e, t, r) {
      if (e.headers) {
        e.headers = Object.keys(e.headers).reduce((t, r) => {
          t[r.toLowerCase()] = e.headers[r];
          return t;
        }, {});
      }
      const o = {
        headers: e.headers || {},
        request: e.request || {},
        mediaType: { previews: [], format: "" }
      };
      if (e.baseUrl) {
        o.baseUrl = e.baseUrl;
      }
      if (e.userAgent) {
        o.headers["user-agent"] = e.userAgent;
      }
      if (e.previews) {
        o.mediaType.previews = e.previews;
      }
      if (e.timeZone) {
        o.headers["time-zone"] = e.timeZone;
      }
      if (e.timeout) {
        u(
          t,
          new n(
            "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
          )
        );
        o.request.timeout = e.timeout;
      }
      if (e.agent) {
        a(
          t,
          new n(
            "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
          )
        );
        o.request.agent = e.agent;
      }
      if (e.headers) {
        c(
          t,
          new n(
            "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
          )
        );
      }
      const p = o.headers["user-agent"];
      const l = `octokit.js/${s.version} ${i()}`;
      o.headers["user-agent"] = [p, l].filter(Boolean).join(" ");
      o.request.hook = r.bind(null, "request");
      return o;
    }
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(312);
    var o = r(522);
    function scheduleObservable(e, t) {
      return new n.Observable(function(r) {
        var n = new i.Subscription();
        n.add(
          t.schedule(function() {
            var i = e[o.observable]();
            n.add(
              i.subscribe({
                next: function(e) {
                  n.add(
                    t.schedule(function() {
                      return r.next(e);
                    })
                  );
                },
                error: function(e) {
                  n.add(
                    t.schedule(function() {
                      return r.error(e);
                    })
                  );
                },
                complete: function() {
                  n.add(
                    t.schedule(function() {
                      return r.complete();
                    })
                  );
                }
              })
            );
          })
        );
        return n;
      });
    }
    t.scheduleObservable = scheduleObservable;
  },
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = normalizePaginatedListResponse;
    const { Deprecation: n } = r(692);
    const i = r(969);
    const o = i((e, t) => e.warn(t));
    const s = i((e, t) => e.warn(t));
    const u = i((e, t) => e.warn(t));
    const a = /^\/search\//;
    const c = /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)/;
    const p = /^\/installation\/repositories/;
    const l = /^\/user\/installations/;
    const d = /^\/orgs\/[^/]+\/installations/;
    function normalizePaginatedListResponse(e, t, r) {
      const i = t.replace(e.request.endpoint.DEFAULTS.baseUrl, "");
      if (!a.test(i) && !c.test(i) && !p.test(i) && !l.test(i) && !d.test(i)) {
        return;
      }
      const f = r.data.incomplete_results;
      const h = r.data.repository_selection;
      const y = r.data.total_count;
      delete r.data.incomplete_results;
      delete r.data.repository_selection;
      delete r.data.total_count;
      const b = Object.keys(r.data)[0];
      r.data = r.data[b];
      Object.defineProperty(r.data, b, {
        get() {
          u(
            e.log,
            new n(
              `[@octokit/rest] "result.data.${b}" is deprecated. Use "result.data" instead`
            )
          );
          return r.data;
        }
      });
      if (typeof f !== "undefined") {
        Object.defineProperty(r.data, "incomplete_results", {
          get() {
            o(
              e.log,
              new n(
                '[@octokit/rest] "result.data.incomplete_results" is deprecated.'
              )
            );
            return f;
          }
        });
      }
      if (typeof h !== "undefined") {
        Object.defineProperty(r.data, "repository_selection", {
          get() {
            s(
              e.log,
              new n(
                '[@octokit/rest] "result.data.repository_selection" is deprecated.'
              )
            );
            return h;
          }
        });
      }
      Object.defineProperty(r.data, "total_count", {
        get() {
          s(
            e.log,
            new n('[@octokit/rest] "result.data.total_count" is deprecated.')
          );
          return y;
        }
      });
    }
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(260);
    var i = r(572);
    function race() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return function raceOperatorFunction(t) {
        if (e.length === 1 && n.isArray(e[0])) {
          e = e[0];
        }
        return t.lift.call(i.race.apply(void 0, [t].concat(e)));
      };
    }
    t.race = race;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    var n = r(835);
    var i = r(129).spawn;
    var o = r(747);
    t.XMLHttpRequest = function() {
      "use strict";
      var e = this;
      var t = r(605);
      var s = r(211);
      var u;
      var a;
      var c = {};
      var p = false;
      var l = { "User-Agent": "node-XMLHttpRequest", Accept: "*/*" };
      var d = {};
      var f = {};
      var h = [
        "accept-charset",
        "accept-encoding",
        "access-control-request-headers",
        "access-control-request-method",
        "connection",
        "content-length",
        "content-transfer-encoding",
        "cookie",
        "cookie2",
        "date",
        "expect",
        "host",
        "keep-alive",
        "origin",
        "referer",
        "te",
        "trailer",
        "transfer-encoding",
        "upgrade",
        "via"
      ];
      var y = ["TRACE", "TRACK", "CONNECT"];
      var b = false;
      var g = false;
      var m = {};
      this.UNSENT = 0;
      this.OPENED = 1;
      this.HEADERS_RECEIVED = 2;
      this.LOADING = 3;
      this.DONE = 4;
      this.readyState = this.UNSENT;
      this.onreadystatechange = null;
      this.responseText = "";
      this.responseXML = "";
      this.status = null;
      this.statusText = null;
      this.withCredentials = false;
      var _ = function(e) {
        return p || (e && h.indexOf(e.toLowerCase()) === -1);
      };
      var v = function(e) {
        return e && y.indexOf(e) === -1;
      };
      this.open = function(e, t, r, n, i) {
        this.abort();
        g = false;
        if (!v(e)) {
          throw new Error("SecurityError: Request method not allowed");
        }
        c = {
          method: e,
          url: t.toString(),
          async: typeof r !== "boolean" ? true : r,
          user: n || null,
          password: i || null
        };
        w(this.OPENED);
      };
      this.setDisableHeaderCheck = function(e) {
        p = e;
      };
      this.setRequestHeader = function(e, t) {
        if (this.readyState !== this.OPENED) {
          throw new Error(
            "INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN"
          );
        }
        if (!_(e)) {
          console.warn('Refused to set unsafe header "' + e + '"');
          return;
        }
        if (b) {
          throw new Error("INVALID_STATE_ERR: send flag is true");
        }
        e = f[e.toLowerCase()] || e;
        f[e.toLowerCase()] = e;
        d[e] = d[e] ? d[e] + ", " + t : t;
      };
      this.getResponseHeader = function(e) {
        if (
          typeof e === "string" &&
          this.readyState > this.OPENED &&
          a &&
          a.headers &&
          a.headers[e.toLowerCase()] &&
          !g
        ) {
          return a.headers[e.toLowerCase()];
        }
        return null;
      };
      this.getAllResponseHeaders = function() {
        if (this.readyState < this.HEADERS_RECEIVED || g) {
          return "";
        }
        var e = "";
        for (var t in a.headers) {
          if (t !== "set-cookie" && t !== "set-cookie2") {
            e += t + ": " + a.headers[t] + "\r\n";
          }
        }
        return e.substr(0, e.length - 2);
      };
      this.getRequestHeader = function(e) {
        if (typeof e === "string" && f[e.toLowerCase()]) {
          return d[f[e.toLowerCase()]];
        }
        return "";
      };
      this.send = function(r) {
        if (this.readyState !== this.OPENED) {
          throw new Error(
            "INVALID_STATE_ERR: connection must be opened before send() is called"
          );
        }
        if (b) {
          throw new Error("INVALID_STATE_ERR: send has already been called");
        }
        var p = false,
          h = false;
        var y = n.parse(c.url);
        var m;
        switch (y.protocol) {
          case "https:":
            p = true;
          case "http:":
            m = y.hostname;
            break;
          case "file:":
            h = true;
            break;
          case undefined:
          case null:
          case "":
            m = "localhost";
            break;
          default:
            throw new Error("Protocol not supported.");
        }
        if (h) {
          if (c.method !== "GET") {
            throw new Error("XMLHttpRequest: Only GET method is supported");
          }
          if (c.async) {
            o.readFile(y.pathname, "utf8", function(t, r) {
              if (t) {
                e.handleError(t);
              } else {
                e.status = 200;
                e.responseText = r;
                w(e.DONE);
              }
            });
          } else {
            try {
              this.responseText = o.readFileSync(y.pathname, "utf8");
              this.status = 200;
              w(e.DONE);
            } catch (e) {
              this.handleError(e);
            }
          }
          return;
        }
        var _ = y.port || (p ? 443 : 80);
        var v = y.pathname + (y.search ? y.search : "");
        for (var S in l) {
          if (!f[S.toLowerCase()]) {
            d[S] = l[S];
          }
        }
        d.Host = m;
        if (!((p && _ === 443) || _ === 80)) {
          d.Host += ":" + y.port;
        }
        if (c.user) {
          if (typeof c.password === "undefined") {
            c.password = "";
          }
          var q = new Buffer(c.user + ":" + c.password);
          d.Authorization = "Basic " + q.toString("base64");
        }
        if (c.method === "GET" || c.method === "HEAD") {
          r = null;
        } else if (r) {
          d["Content-Length"] = Buffer.isBuffer(r)
            ? r.length
            : Buffer.byteLength(r);
          if (!d["Content-Type"]) {
            d["Content-Type"] = "text/plain;charset=UTF-8";
          }
        } else if (c.method === "POST") {
          d["Content-Length"] = 0;
        }
        var O = {
          host: m,
          port: _,
          path: v,
          method: c.method,
          headers: d,
          agent: false,
          withCredentials: e.withCredentials
        };
        g = false;
        if (c.async) {
          var E = p ? s.request : t.request;
          b = true;
          e.dispatchEvent("readystatechange");
          var T = function responseHandler(t) {
            a = t;
            if (
              a.statusCode === 301 ||
              a.statusCode === 302 ||
              a.statusCode === 303 ||
              a.statusCode === 307
            ) {
              c.url = a.headers.location;
              var r = n.parse(c.url);
              m = r.hostname;
              var i = {
                hostname: r.hostname,
                port: r.port,
                path: r.path,
                method: a.statusCode === 303 ? "GET" : c.method,
                headers: d,
                withCredentials: e.withCredentials
              };
              u = E(i, responseHandler).on("error", j);
              u.end();
              return;
            }
            a.setEncoding("utf8");
            w(e.HEADERS_RECEIVED);
            e.status = a.statusCode;
            a.on("data", function(t) {
              if (t) {
                e.responseText += t;
              }
              if (b) {
                w(e.LOADING);
              }
            });
            a.on("end", function() {
              if (b) {
                w(e.DONE);
                b = false;
              }
            });
            a.on("error", function(t) {
              e.handleError(t);
            });
          };
          var j = function errorHandler(t) {
            e.handleError(t);
          };
          u = E(O, T).on("error", j);
          if (r) {
            u.write(r);
          }
          u.end();
          e.dispatchEvent("loadstart");
        } else {
          var x = ".node-xmlhttprequest-content-" + process.pid;
          var P = ".node-xmlhttprequest-sync-" + process.pid;
          o.writeFileSync(P, "", "utf8");
          var C =
            "var http = require('http'), https = require('https'), fs = require('fs');" +
            "var doRequest = http" +
            (p ? "s" : "") +
            ".request;" +
            "var options = " +
            JSON.stringify(O) +
            ";" +
            "var responseText = '';" +
            "var req = doRequest(options, function(response) {" +
            "response.setEncoding('utf8');" +
            "response.on('data', function(chunk) {" +
            "  responseText += chunk;" +
            "});" +
            "response.on('end', function() {" +
            "fs.writeFileSync('" +
            x +
            "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');" +
            "fs.unlinkSync('" +
            P +
            "');" +
            "});" +
            "response.on('error', function(error) {" +
            "fs.writeFileSync('" +
            x +
            "', JSON.stringify({err: error}), 'utf8');" +
            "fs.unlinkSync('" +
            P +
            "');" +
            "});" +
            "}).on('error', function(error) {" +
            "fs.writeFileSync('" +
            x +
            "', JSON.stringify({err: error}), 'utf8');" +
            "fs.unlinkSync('" +
            P +
            "');" +
            "});" +
            (r
              ? "req.write('" +
                JSON.stringify(r)
                  .slice(1, -1)
                  .replace(/'/g, "\\'") +
                "');"
              : "") +
            "req.end();";
          var A = i(process.argv[0], ["-e", C]);
          while (o.existsSync(P)) {}
          var k = JSON.parse(o.readFileSync(x, "utf8"));
          A.stdin.end();
          o.unlinkSync(x);
          if (k.err) {
            e.handleError(k.err);
          } else {
            a = k.data;
            e.status = k.data.statusCode;
            e.responseText = k.data.text;
            w(e.DONE);
          }
        }
      };
      this.handleError = function(e) {
        this.status = 0;
        this.statusText = e;
        this.responseText = e.stack;
        g = true;
        w(this.DONE);
        this.dispatchEvent("error");
      };
      this.abort = function() {
        if (u) {
          u.abort();
          u = null;
        }
        d = l;
        this.status = 0;
        this.responseText = "";
        this.responseXML = "";
        g = true;
        if (
          this.readyState !== this.UNSENT &&
          (this.readyState !== this.OPENED || b) &&
          this.readyState !== this.DONE
        ) {
          b = false;
          w(this.DONE);
        }
        this.readyState = this.UNSENT;
        this.dispatchEvent("abort");
      };
      this.addEventListener = function(e, t) {
        if (!(e in m)) {
          m[e] = [];
        }
        m[e].push(t);
      };
      this.removeEventListener = function(e, t) {
        if (e in m) {
          m[e] = m[e].filter(function(e) {
            return e !== t;
          });
        }
      };
      this.dispatchEvent = function(t) {
        if (typeof e["on" + t] === "function") {
          e["on" + t]();
        }
        if (t in m) {
          for (var r = 0, n = m[t].length; r < n; r++) {
            m[t][r].call(e);
          }
        }
      };
      var w = function(t) {
        if (t == e.LOADING || e.readyState !== t) {
          e.readyState = t;
          if (c.async || e.readyState < e.OPENED || e.readyState === e.DONE) {
            e.dispatchEvent("readystatechange");
          }
          if (e.readyState === e.DONE && !g) {
            e.dispatchEvent("load");
            e.dispatchEvent("loadend");
          }
        }
      };
    };
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(260);
    var i = r(994);
    var o = r(658);
    var s = r(886);
    var u = (function() {
      function Subscription(e) {
        this.closed = false;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (e) {
          this._unsubscribe = e;
        }
      }
      Subscription.prototype.unsubscribe = function() {
        var e;
        if (this.closed) {
          return;
        }
        var t = this,
          r = t._parentOrParents,
          u = t._unsubscribe,
          a = t._subscriptions;
        this.closed = true;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (r instanceof Subscription) {
          r.remove(this);
        } else if (r !== null) {
          for (var c = 0; c < r.length; ++c) {
            var p = r[c];
            p.remove(this);
          }
        }
        if (o.isFunction(u)) {
          try {
            u.call(this);
          } catch (t) {
            e =
              t instanceof s.UnsubscriptionError
                ? flattenUnsubscriptionErrors(t.errors)
                : [t];
          }
        }
        if (n.isArray(a)) {
          var c = -1;
          var l = a.length;
          while (++c < l) {
            var d = a[c];
            if (i.isObject(d)) {
              try {
                d.unsubscribe();
              } catch (t) {
                e = e || [];
                if (t instanceof s.UnsubscriptionError) {
                  e = e.concat(flattenUnsubscriptionErrors(t.errors));
                } else {
                  e.push(t);
                }
              }
            }
          }
        }
        if (e) {
          throw new s.UnsubscriptionError(e);
        }
      };
      Subscription.prototype.add = function(e) {
        var t = e;
        if (!e) {
          return Subscription.EMPTY;
        }
        switch (typeof e) {
          case "function":
            t = new Subscription(e);
          case "object":
            if (t === this || t.closed || typeof t.unsubscribe !== "function") {
              return t;
            } else if (this.closed) {
              t.unsubscribe();
              return t;
            } else if (!(t instanceof Subscription)) {
              var r = t;
              t = new Subscription();
              t._subscriptions = [r];
            }
            break;
          default: {
            throw new Error(
              "unrecognized teardown " + e + " added to Subscription."
            );
          }
        }
        var n = t._parentOrParents;
        if (n === null) {
          t._parentOrParents = this;
        } else if (n instanceof Subscription) {
          if (n === this) {
            return t;
          }
          t._parentOrParents = [n, this];
        } else if (n.indexOf(this) === -1) {
          n.push(this);
        } else {
          return t;
        }
        var i = this._subscriptions;
        if (i === null) {
          this._subscriptions = [t];
        } else {
          i.push(t);
        }
        return t;
      };
      Subscription.prototype.remove = function(e) {
        var t = this._subscriptions;
        if (t) {
          var r = t.indexOf(e);
          if (r !== -1) {
            t.splice(r, 1);
          }
        }
      };
      Subscription.EMPTY = (function(e) {
        e.closed = true;
        return e;
      })(new Subscription());
      return Subscription;
    })();
    t.Subscription = u;
    function flattenUnsubscriptionErrors(e) {
      return e.reduce(function(e, t) {
        return e.concat(t instanceof s.UnsubscriptionError ? t.errors : t);
      }, []);
    }
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    t.defaultThrottleConfig = { leading: true, trailing: false };
    function throttle(e, r) {
      if (r === void 0) {
        r = t.defaultThrottleConfig;
      }
      return function(t) {
        return t.lift(new s(e, r.leading, r.trailing));
      };
    }
    t.throttle = throttle;
    var s = (function() {
      function ThrottleOperator(e, t, r) {
        this.durationSelector = e;
        this.leading = t;
        this.trailing = r;
      }
      ThrottleOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new u(e, this.durationSelector, this.leading, this.trailing)
        );
      };
      return ThrottleOperator;
    })();
    var u = (function(e) {
      n(ThrottleSubscriber, e);
      function ThrottleSubscriber(t, r, n, i) {
        var o = e.call(this, t) || this;
        o.destination = t;
        o.durationSelector = r;
        o._leading = n;
        o._trailing = i;
        o._hasValue = false;
        return o;
      }
      ThrottleSubscriber.prototype._next = function(e) {
        this._hasValue = true;
        this._sendValue = e;
        if (!this._throttled) {
          if (this._leading) {
            this.send();
          } else {
            this.throttle(e);
          }
        }
      };
      ThrottleSubscriber.prototype.send = function() {
        var e = this,
          t = e._hasValue,
          r = e._sendValue;
        if (t) {
          this.destination.next(r);
          this.throttle(r);
        }
        this._hasValue = false;
        this._sendValue = null;
      };
      ThrottleSubscriber.prototype.throttle = function(e) {
        var t = this.tryDurationSelector(e);
        if (!!t) {
          this.add((this._throttled = o.subscribeToResult(this, t)));
        }
      };
      ThrottleSubscriber.prototype.tryDurationSelector = function(e) {
        try {
          return this.durationSelector(e);
        } catch (e) {
          this.destination.error(e);
          return null;
        }
      };
      ThrottleSubscriber.prototype.throttlingDone = function() {
        var e = this,
          t = e._throttled,
          r = e._trailing;
        if (t) {
          t.unsubscribe();
        }
        this._throttled = null;
        if (r) {
          this.send();
        }
      };
      ThrottleSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.throttlingDone();
      };
      ThrottleSubscriber.prototype.notifyComplete = function() {
        this.throttlingDone();
      };
      return ThrottleSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e) {
    "use strict";
    var t = (e.exports = function(e) {
      return (
        e !== null && typeof e === "object" && typeof e.pipe === "function"
      );
    });
    t.writable = function(e) {
      return (
        t(e) &&
        e.writable !== false &&
        typeof e._write === "function" &&
        typeof e._writableState === "object"
      );
    };
    t.readable = function(e) {
      return (
        t(e) &&
        e.readable !== false &&
        typeof e._read === "function" &&
        typeof e._readableState === "object"
      );
    };
    t.duplex = function(e) {
      return t.writable(e) && t.readable(e);
    };
    t.transform = function(e) {
      return (
        t.duplex(e) &&
        typeof e._transform === "function" &&
        typeof e._transformState === "object"
      );
    };
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(419);
    function zipAll(e) {
      return function(t) {
        return t.lift(new n.ZipOperator(e));
      };
    }
    t.zipAll = zipAll;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function not(e, t) {
      function notPred() {
        return !notPred.pred.apply(notPred.thisArg, arguments);
      }
      notPred.pred = e;
      notPred.thisArg = t;
      return notPred;
    }
    t.not = not;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(411);
    var s = r(316);
    function throttleTime(e, t, r) {
      if (t === void 0) {
        t = o.async;
      }
      if (r === void 0) {
        r = s.defaultThrottleConfig;
      }
      return function(n) {
        return n.lift(new u(e, t, r.leading, r.trailing));
      };
    }
    t.throttleTime = throttleTime;
    var u = (function() {
      function ThrottleTimeOperator(e, t, r, n) {
        this.duration = e;
        this.scheduler = t;
        this.leading = r;
        this.trailing = n;
      }
      ThrottleTimeOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new a(e, this.duration, this.scheduler, this.leading, this.trailing)
        );
      };
      return ThrottleTimeOperator;
    })();
    var a = (function(e) {
      n(ThrottleTimeSubscriber, e);
      function ThrottleTimeSubscriber(t, r, n, i, o) {
        var s = e.call(this, t) || this;
        s.duration = r;
        s.scheduler = n;
        s.leading = i;
        s.trailing = o;
        s._hasTrailingValue = false;
        s._trailingValue = null;
        return s;
      }
      ThrottleTimeSubscriber.prototype._next = function(e) {
        if (this.throttled) {
          if (this.trailing) {
            this._trailingValue = e;
            this._hasTrailingValue = true;
          }
        } else {
          this.add(
            (this.throttled = this.scheduler.schedule(
              dispatchNext,
              this.duration,
              { subscriber: this }
            ))
          );
          if (this.leading) {
            this.destination.next(e);
          } else if (this.trailing) {
            this._trailingValue = e;
            this._hasTrailingValue = true;
          }
        }
      };
      ThrottleTimeSubscriber.prototype._complete = function() {
        if (this._hasTrailingValue) {
          this.destination.next(this._trailingValue);
          this.destination.complete();
        } else {
          this.destination.complete();
        }
      };
      ThrottleTimeSubscriber.prototype.clearThrottle = function() {
        var e = this.throttled;
        if (e) {
          if (this.trailing && this._hasTrailingValue) {
            this.destination.next(this._trailingValue);
            this._trailingValue = null;
            this._hasTrailingValue = false;
          }
          e.unsubscribe();
          this.remove(e);
          this.throttled = null;
        }
      };
      return ThrottleTimeSubscriber;
    })(i.Subscriber);
    function dispatchNext(e) {
      var t = e.subscriber;
      t.clearThrottle();
    }
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function buffer(e) {
      return function bufferOperatorFunction(t) {
        return t.lift(new s(e));
      };
    }
    t.buffer = buffer;
    var s = (function() {
      function BufferOperator(e) {
        this.closingNotifier = e;
      }
      BufferOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.closingNotifier));
      };
      return BufferOperator;
    })();
    var u = (function(e) {
      n(BufferSubscriber, e);
      function BufferSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.buffer = [];
        n.add(o.subscribeToResult(n, r));
        return n;
      }
      BufferSubscriber.prototype._next = function(e) {
        this.buffer.push(e);
      };
      BufferSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        var o = this.buffer;
        this.buffer = [];
        this.destination.next(o);
      };
      return BufferSubscriber;
    })(i.OuterSubscriber);
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(260);
    var i = r(860);
    var o = r(997);
    var s = {};
    function combineLatest() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = null;
      if (typeof e[e.length - 1] === "function") {
        r = e.pop();
      }
      if (e.length === 1 && n.isArray(e[0])) {
        e = e[0].slice();
      }
      return function(t) {
        return t.lift.call(
          o.from([t].concat(e)),
          new i.CombineLatestOperator(r)
        );
      };
    }
    t.combineLatest = combineLatest;
  },
  function(e, t, r) {
    e.exports = hasLastPage;
    const n = r(370);
    const i = r(577);
    function hasLastPage(e) {
      n(
        `octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`
      );
      return i(e).last;
    }
  },
  function(e, t, r) {
    e.exports = getPreviousPage;
    const n = r(265);
    function getPreviousPage(e, t, r) {
      return n(e, t, "prev", r);
    }
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(553);
    var i = r(40);
    var o = r(134);
    var s;
    (function(e) {
      e["NEXT"] = "N";
      e["ERROR"] = "E";
      e["COMPLETE"] = "C";
    })((s = t.NotificationKind || (t.NotificationKind = {})));
    var u = (function() {
      function Notification(e, t, r) {
        this.kind = e;
        this.value = t;
        this.error = r;
        this.hasValue = e === "N";
      }
      Notification.prototype.observe = function(e) {
        switch (this.kind) {
          case "N":
            return e.next && e.next(this.value);
          case "E":
            return e.error && e.error(this.error);
          case "C":
            return e.complete && e.complete();
        }
      };
      Notification.prototype.do = function(e, t, r) {
        var n = this.kind;
        switch (n) {
          case "N":
            return e && e(this.value);
          case "E":
            return t && t(this.error);
          case "C":
            return r && r();
        }
      };
      Notification.prototype.accept = function(e, t, r) {
        if (e && typeof e.next === "function") {
          return this.observe(e);
        } else {
          return this.do(e, t, r);
        }
      };
      Notification.prototype.toObservable = function() {
        var e = this.kind;
        switch (e) {
          case "N":
            return i.of(this.value);
          case "E":
            return o.throwError(this.error);
          case "C":
            return n.empty();
        }
        throw new Error("unexpected notification kind value");
      };
      Notification.createNext = function(e) {
        if (typeof e !== "undefined") {
          return new Notification("N", e);
        }
        return Notification.undefinedValueNotification;
      };
      Notification.createError = function(e) {
        return new Notification("E", undefined, e);
      };
      Notification.createComplete = function() {
        return Notification.completeNotification;
      };
      Notification.completeNotification = new Notification("C");
      Notification.undefinedValueNotification = new Notification(
        "N",
        undefined
      );
      return Notification;
    })();
    t.Notification = u;
  },
  function(e, t, r) {
    "use strict";
    e.exports = validate;
    const { RequestError: n } = r(463);
    const i = r(854);
    const o = r(883);
    function validate(e, t) {
      if (!t.request.validate) {
        return;
      }
      const { validate: r } = t.request;
      Object.keys(r).forEach(e => {
        const s = i(r, e);
        const u = s.type;
        let a;
        let c;
        let p = true;
        let l = false;
        if (/\./.test(e)) {
          a = e.replace(/\.[^.]+$/, "");
          l = a.slice(-2) === "[]";
          if (l) {
            a = a.slice(0, -2);
          }
          c = i(t, a);
          p = a === "headers" || (typeof c === "object" && c !== null);
        }
        const d = l
          ? (i(t, a) || []).map(t => t[e.split(/\./).pop()])
          : [i(t, e)];
        d.forEach((r, i) => {
          const a = typeof r !== "undefined";
          const c = r === null;
          const d = l ? e.replace(/\[\]/, `[${i}]`) : e;
          if (!s.required && !a) {
            return;
          }
          if (!p) {
            return;
          }
          if (s.allowNull && c) {
            return;
          }
          if (!s.allowNull && c) {
            throw new n(`'${d}' cannot be null`, 400, { request: t });
          }
          if (s.required && !a) {
            throw new n(
              `Empty value for parameter '${d}': ${JSON.stringify(r)}`,
              400,
              { request: t }
            );
          }
          if (u === "integer") {
            const e = r;
            r = parseInt(r, 10);
            if (isNaN(r)) {
              throw new n(
                `Invalid value for parameter '${d}': ${JSON.stringify(
                  e
                )} is NaN`,
                400,
                { request: t }
              );
            }
          }
          if (s.enum && s.enum.indexOf(String(r)) === -1) {
            throw new n(
              `Invalid value for parameter '${d}': ${JSON.stringify(r)}`,
              400,
              { request: t }
            );
          }
          if (s.validation) {
            const e = new RegExp(s.validation);
            if (!e.test(r)) {
              throw new n(
                `Invalid value for parameter '${d}': ${JSON.stringify(r)}`,
                400,
                { request: t }
              );
            }
          }
          if (u === "object" && typeof r === "string") {
            try {
              r = JSON.parse(r);
            } catch (e) {
              throw new n(
                `JSON parse error of value for parameter '${d}': ${JSON.stringify(
                  r
                )}`,
                400,
                { request: t }
              );
            }
          }
          o(t, s.mapTo || d, r);
        });
      });
      return t;
    }
  },
  function(e, t, r) {
    e.exports = authenticationRequestError;
    const { RequestError: n } = r(463);
    function authenticationRequestError(e, t, r) {
      if (!t.headers) throw t;
      const i = /required/.test(t.headers["x-github-otp"] || "");
      if (t.status !== 401 || !i) {
        throw t;
      }
      if (
        t.status === 401 &&
        i &&
        t.request &&
        t.request.headers["x-github-otp"]
      ) {
        throw new n(
          "Invalid one-time password for two-factor authentication",
          401,
          { headers: t.headers, request: r }
        );
      }
      if (typeof e.auth.on2fa !== "function") {
        throw new n(
          "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
          401,
          { headers: t.headers, request: r }
        );
      }
      return Promise.resolve()
        .then(() => {
          return e.auth.on2fa();
        })
        .then(t => {
          const n = Object.assign(r, {
            headers: Object.assign({ "x-github-otp": t }, r.headers)
          });
          return e.octokit.request(n);
        });
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(901);
    t.ajax = n.ajax;
    var i = r(189);
    t.AjaxResponse = i.AjaxResponse;
    t.AjaxError = i.AjaxError;
    t.AjaxTimeoutError = i.AjaxTimeoutError;
  },
  ,
  ,
  ,
  ,
  ,
  function(e) {
    e.exports = require("assert");
  },
  ,
  ,
  ,
  ,
  ,
  function(e) {
    e.exports = register;
    function register(e, t, r, n) {
      if (typeof r !== "function") {
        throw new Error("method for before hook must be a function");
      }
      if (!n) {
        n = {};
      }
      if (Array.isArray(t)) {
        return t.reverse().reduce(function(t, r) {
          return register.bind(null, e, r, t, n);
        }, r)();
      }
      return Promise.resolve().then(function() {
        if (!e.registry[t]) {
          return r(n);
        }
        return e.registry[t].reduce(function(e, t) {
          return t.hook.bind(null, e, n);
        }, r)();
      });
    }
  },
  ,
  ,
  ,
  ,
  function(e) {
    e.exports = function atob(e) {
      return Buffer.from(e, "base64").toString("binary");
    };
  },
  ,
  function(e) {
    e.exports = deprecate;
    const t = {};
    function deprecate(e) {
      if (t[e]) {
        return;
      }
      console.warn(`DEPRECATED (@octokit/rest): ${e}`);
      t[e] = 1;
    }
  },
  ,
  function(e) {
    e.exports = octokitDebug;
    function octokitDebug(e) {
      e.hook.wrap("request", (t, r) => {
        e.log.debug("request", r);
        const n = Date.now();
        const i = e.request.endpoint.parse(r);
        const o = i.url.replace(r.baseUrl, "");
        return t(r)
          .then(t => {
            e.log.info(`${i.method} ${o} - ${t.status} in ${Date.now() - n}ms`);
            return t;
          })
          .catch(t => {
            e.log.info(`${i.method} ${o} - ${t.status} in ${Date.now() - n}ms`);
            throw t;
          });
      });
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(33);
    var s = r(565);
    var u = r(591);
    function delayWhen(e, t) {
      if (t) {
        return function(r) {
          return new p(r, t).lift(new a(e));
        };
      }
      return function(t) {
        return t.lift(new a(e));
      };
    }
    t.delayWhen = delayWhen;
    var a = (function() {
      function DelayWhenOperator(e) {
        this.delayDurationSelector = e;
      }
      DelayWhenOperator.prototype.call = function(e, t) {
        return t.subscribe(new c(e, this.delayDurationSelector));
      };
      return DelayWhenOperator;
    })();
    var c = (function(e) {
      n(DelayWhenSubscriber, e);
      function DelayWhenSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.delayDurationSelector = r;
        n.completed = false;
        n.delayNotifierSubscriptions = [];
        n.index = 0;
        return n;
      }
      DelayWhenSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.destination.next(e);
        this.removeSubscription(i);
        this.tryComplete();
      };
      DelayWhenSubscriber.prototype.notifyError = function(e, t) {
        this._error(e);
      };
      DelayWhenSubscriber.prototype.notifyComplete = function(e) {
        var t = this.removeSubscription(e);
        if (t) {
          this.destination.next(t);
        }
        this.tryComplete();
      };
      DelayWhenSubscriber.prototype._next = function(e) {
        var t = this.index++;
        try {
          var r = this.delayDurationSelector(e, t);
          if (r) {
            this.tryDelay(r, e);
          }
        } catch (e) {
          this.destination.error(e);
        }
      };
      DelayWhenSubscriber.prototype._complete = function() {
        this.completed = true;
        this.tryComplete();
        this.unsubscribe();
      };
      DelayWhenSubscriber.prototype.removeSubscription = function(e) {
        e.unsubscribe();
        var t = this.delayNotifierSubscriptions.indexOf(e);
        if (t !== -1) {
          this.delayNotifierSubscriptions.splice(t, 1);
        }
        return e.outerValue;
      };
      DelayWhenSubscriber.prototype.tryDelay = function(e, t) {
        var r = u.subscribeToResult(this, e, t);
        if (r && !r.closed) {
          var n = this.destination;
          n.add(r);
          this.delayNotifierSubscriptions.push(r);
        }
      };
      DelayWhenSubscriber.prototype.tryComplete = function() {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
          this.destination.complete();
        }
      };
      return DelayWhenSubscriber;
    })(s.OuterSubscriber);
    var p = (function(e) {
      n(SubscriptionDelayObservable, e);
      function SubscriptionDelayObservable(t, r) {
        var n = e.call(this) || this;
        n.source = t;
        n.subscriptionDelay = r;
        return n;
      }
      SubscriptionDelayObservable.prototype._subscribe = function(e) {
        this.subscriptionDelay.subscribe(new l(e, this.source));
      };
      return SubscriptionDelayObservable;
    })(o.Observable);
    var l = (function(e) {
      n(SubscriptionDelaySubscriber, e);
      function SubscriptionDelaySubscriber(t, r) {
        var n = e.call(this) || this;
        n.parent = t;
        n.source = r;
        n.sourceSubscribed = false;
        return n;
      }
      SubscriptionDelaySubscriber.prototype._next = function(e) {
        this.subscribeToSource();
      };
      SubscriptionDelaySubscriber.prototype._error = function(e) {
        this.unsubscribe();
        this.parent.error(e);
      };
      SubscriptionDelaySubscriber.prototype._complete = function() {
        this.unsubscribe();
        this.subscribeToSource();
      };
      SubscriptionDelaySubscriber.prototype.subscribeToSource = function() {
        if (!this.sourceSubscribed) {
          this.sourceSubscribed = true;
          this.unsubscribe();
          this.source.subscribe(this.parent);
        }
      };
      return SubscriptionDelaySubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(863);
    t.subscribeToPromise = function(e) {
      return function(t) {
        e.then(
          function(e) {
            if (!t.closed) {
              t.next(e);
              t.complete();
            }
          },
          function(e) {
            return t.error(e);
          }
        ).then(null, n.hostReportError);
        return t;
      };
    };
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function _interopDefault(e) {
      return e && typeof e === "object" && "default" in e ? e["default"] : e;
    }
    var n = _interopDefault(r(696));
    var i = r(796);
    function lowercaseKeys(e) {
      if (!e) {
        return {};
      }
      return Object.keys(e).reduce((t, r) => {
        t[r.toLowerCase()] = e[r];
        return t;
      }, {});
    }
    function mergeDeep(e, t) {
      const r = Object.assign({}, e);
      Object.keys(t).forEach(i => {
        if (n(t[i])) {
          if (!(i in e)) Object.assign(r, { [i]: t[i] });
          else r[i] = mergeDeep(e[i], t[i]);
        } else {
          Object.assign(r, { [i]: t[i] });
        }
      });
      return r;
    }
    function merge(e, t, r) {
      if (typeof t === "string") {
        let [e, n] = t.split(" ");
        r = Object.assign(n ? { method: e, url: n } : { url: e }, r);
      } else {
        r = Object.assign({}, t);
      }
      r.headers = lowercaseKeys(r.headers);
      const n = mergeDeep(e || {}, r);
      if (e && e.mediaType.previews.length) {
        n.mediaType.previews = e.mediaType.previews
          .filter(e => !n.mediaType.previews.includes(e))
          .concat(n.mediaType.previews);
      }
      n.mediaType.previews = n.mediaType.previews.map(e =>
        e.replace(/-preview/, "")
      );
      return n;
    }
    function addQueryParameters(e, t) {
      const r = /\?/.test(e) ? "&" : "?";
      const n = Object.keys(t);
      if (n.length === 0) {
        return e;
      }
      return (
        e +
        r +
        n
          .map(e => {
            if (e === "q") {
              return (
                "q=" +
                t.q
                  .split("+")
                  .map(encodeURIComponent)
                  .join("+")
              );
            }
            return `${e}=${encodeURIComponent(t[e])}`;
          })
          .join("&")
      );
    }
    const o = /\{[^}]+\}/g;
    function removeNonChars(e) {
      return e.replace(/^\W+|\W+$/g, "").split(/,/);
    }
    function extractUrlVariableNames(e) {
      const t = e.match(o);
      if (!t) {
        return [];
      }
      return t.map(removeNonChars).reduce((e, t) => e.concat(t), []);
    }
    function omit(e, t) {
      return Object.keys(e)
        .filter(e => !t.includes(e))
        .reduce((t, r) => {
          t[r] = e[r];
          return t;
        }, {});
    }
    function encodeReserved(e) {
      return e
        .split(/(%[0-9A-Fa-f]{2})/g)
        .map(function(e) {
          if (!/%[0-9A-Fa-f]/.test(e)) {
            e = encodeURI(e)
              .replace(/%5B/g, "[")
              .replace(/%5D/g, "]");
          }
          return e;
        })
        .join("");
    }
    function encodeUnreserved(e) {
      return encodeURIComponent(e).replace(/[!'()*]/g, function(e) {
        return (
          "%" +
          e
            .charCodeAt(0)
            .toString(16)
            .toUpperCase()
        );
      });
    }
    function encodeValue(e, t, r) {
      t = e === "+" || e === "#" ? encodeReserved(t) : encodeUnreserved(t);
      if (r) {
        return encodeUnreserved(r) + "=" + t;
      } else {
        return t;
      }
    }
    function isDefined(e) {
      return e !== undefined && e !== null;
    }
    function isKeyOperator(e) {
      return e === ";" || e === "&" || e === "?";
    }
    function getValues(e, t, r, n) {
      var i = e[r],
        o = [];
      if (isDefined(i) && i !== "") {
        if (
          typeof i === "string" ||
          typeof i === "number" ||
          typeof i === "boolean"
        ) {
          i = i.toString();
          if (n && n !== "*") {
            i = i.substring(0, parseInt(n, 10));
          }
          o.push(encodeValue(t, i, isKeyOperator(t) ? r : ""));
        } else {
          if (n === "*") {
            if (Array.isArray(i)) {
              i.filter(isDefined).forEach(function(e) {
                o.push(encodeValue(t, e, isKeyOperator(t) ? r : ""));
              });
            } else {
              Object.keys(i).forEach(function(e) {
                if (isDefined(i[e])) {
                  o.push(encodeValue(t, i[e], e));
                }
              });
            }
          } else {
            const e = [];
            if (Array.isArray(i)) {
              i.filter(isDefined).forEach(function(r) {
                e.push(encodeValue(t, r));
              });
            } else {
              Object.keys(i).forEach(function(r) {
                if (isDefined(i[r])) {
                  e.push(encodeUnreserved(r));
                  e.push(encodeValue(t, i[r].toString()));
                }
              });
            }
            if (isKeyOperator(t)) {
              o.push(encodeUnreserved(r) + "=" + e.join(","));
            } else if (e.length !== 0) {
              o.push(e.join(","));
            }
          }
        }
      } else {
        if (t === ";") {
          if (isDefined(i)) {
            o.push(encodeUnreserved(r));
          }
        } else if (i === "" && (t === "&" || t === "?")) {
          o.push(encodeUnreserved(r) + "=");
        } else if (i === "") {
          o.push("");
        }
      }
      return o;
    }
    function parseUrl(e) {
      return { expand: expand.bind(null, e) };
    }
    function expand(e, t) {
      var r = ["+", "#", ".", "/", ";", "?", "&"];
      return e.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(e, n, i) {
        if (n) {
          let e = "";
          const i = [];
          if (r.indexOf(n.charAt(0)) !== -1) {
            e = n.charAt(0);
            n = n.substr(1);
          }
          n.split(/,/g).forEach(function(r) {
            var n = /([^:\*]*)(?::(\d+)|(\*))?/.exec(r);
            i.push(getValues(t, e, n[1], n[2] || n[3]));
          });
          if (e && e !== "+") {
            var o = ",";
            if (e === "?") {
              o = "&";
            } else if (e !== "#") {
              o = e;
            }
            return (i.length !== 0 ? e : "") + i.join(o);
          } else {
            return i.join(",");
          }
        } else {
          return encodeReserved(i);
        }
      });
    }
    function parse(e) {
      let t = e.method.toUpperCase();
      let r = (e.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
      let n = Object.assign({}, e.headers);
      let i;
      let o = omit(e, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType"
      ]);
      const s = extractUrlVariableNames(r);
      r = parseUrl(r).expand(o);
      if (!/^http/.test(r)) {
        r = e.baseUrl + r;
      }
      const u = Object.keys(e)
        .filter(e => s.includes(e))
        .concat("baseUrl");
      const a = omit(o, u);
      const c = /application\/octet-stream/i.test(n.accept);
      if (!c) {
        if (e.mediaType.format) {
          n.accept = n.accept
            .split(/,/)
            .map(t =>
              t.replace(
                /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
                `application/vnd$1$2.${e.mediaType.format}`
              )
            )
            .join(",");
        }
        if (e.mediaType.previews.length) {
          const t = n.accept.match(/[\w-]+(?=-preview)/g) || [];
          n.accept = t
            .concat(e.mediaType.previews)
            .map(t => {
              const r = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
              return `application/vnd.github.${t}-preview${r}`;
            })
            .join(",");
        }
      }
      if (["GET", "HEAD"].includes(t)) {
        r = addQueryParameters(r, a);
      } else {
        if ("data" in a) {
          i = a.data;
        } else {
          if (Object.keys(a).length) {
            i = a;
          } else {
            n["content-length"] = 0;
          }
        }
      }
      if (!n["content-type"] && typeof i !== "undefined") {
        n["content-type"] = "application/json; charset=utf-8";
      }
      if (["PATCH", "PUT"].includes(t) && typeof i === "undefined") {
        i = "";
      }
      return Object.assign(
        { method: t, url: r, headers: n },
        typeof i !== "undefined" ? { body: i } : null,
        e.request ? { request: e.request } : null
      );
    }
    function endpointWithDefaults(e, t, r) {
      return parse(merge(e, t, r));
    }
    function withDefaults(e, t) {
      const r = merge(e, t);
      const n = endpointWithDefaults.bind(null, r);
      return Object.assign(n, {
        DEFAULTS: r,
        defaults: withDefaults.bind(null, r),
        merge: merge.bind(null, r),
        parse: parse
      });
    }
    const s = "5.5.1";
    const u = `octokit-endpoint.js/${s} ${i.getUserAgent()}`;
    const a = {
      method: "GET",
      baseUrl: "https://api.github.com",
      headers: { accept: "application/vnd.github.v3+json", "user-agent": u },
      mediaType: { format: "", previews: [] }
    };
    const c = withDefaults(null, a);
    t.endpoint = c;
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function ignoreElements() {
      return function ignoreElementsOperatorFunction(e) {
        return e.lift(new o());
      };
    }
    t.ignoreElements = ignoreElements;
    var o = (function() {
      function IgnoreElementsOperator() {}
      IgnoreElementsOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e));
      };
      return IgnoreElementsOperator;
    })();
    var s = (function(e) {
      n(IgnoreElementsSubscriber, e);
      function IgnoreElementsSubscriber() {
        return (e !== null && e.apply(this, arguments)) || this;
      }
      IgnoreElementsSubscriber.prototype._next = function(e) {};
      return IgnoreElementsSubscriber;
    })(i.Subscriber);
  },
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    t.isArrayLike = function(e) {
      return e && typeof e.length === "number" && typeof e !== "function";
    };
  },
  function(e, t, r) {
    "use strict";
    const n = r(747);
    const i = r(727);
    function readShebang(e) {
      const t = 150;
      let r;
      if (Buffer.alloc) {
        r = Buffer.alloc(t);
      } else {
        r = new Buffer(t);
        r.fill(0);
      }
      let o;
      try {
        o = n.openSync(e, "r");
        n.readSync(o, r, 0, t, 0);
        n.closeSync(o);
      } catch (e) {}
      return i(r.toString());
    }
    e.exports = readShebang;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(312);
    function schedulePromise(e, t) {
      return new n.Observable(function(r) {
        var n = new i.Subscription();
        n.add(
          t.schedule(function() {
            return e.then(
              function(e) {
                n.add(
                  t.schedule(function() {
                    r.next(e);
                    n.add(
                      t.schedule(function() {
                        return r.complete();
                      })
                    );
                  })
                );
              },
              function(e) {
                n.add(
                  t.schedule(function() {
                    return r.error(e);
                  })
                );
              }
            );
          })
        );
        return n;
      });
    }
    t.schedulePromise = schedulePromise;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = getNextPage;
    const n = r(265);
    function getNextPage(e, t, r) {
      return n(e, t, "next", r);
    }
  },
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function isScheduler(e) {
      return e && typeof e.schedule === "function";
    }
    t.isScheduler = isScheduler;
  },
  ,
  function(e, t, r) {
    e.exports = Octokit;
    const { request: n } = r(753);
    const i = r(523);
    const o = r(294);
    function Octokit(e, t) {
      t = t || {};
      const r = new i.Collection();
      const s = Object.assign(
        {
          debug: () => {},
          info: () => {},
          warn: console.warn,
          error: console.error
        },
        t && t.log
      );
      const u = { hook: r, log: s, request: n.defaults(o(t, s, r)) };
      e.forEach(e => e(u, t));
      return u;
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(564);
    var i = r(96);
    function publish(e) {
      return e
        ? i.multicast(function() {
            return new n.Subject();
          }, e)
        : i.multicast(new n.Subject());
    }
    t.publish = publish;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(40);
    var i = r(919);
    function concat() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return i.concatAll()(n.of.apply(void 0, e));
    }
    t.concat = concat;
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(162);
    var i = r(255);
    t.async = new i.AsyncScheduler(n.AsyncAction);
  },
  ,
  function(e) {
    e.exports = require("stream");
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(634);
    var o = r(260);
    var s = r(114);
    var u = r(565);
    var a = r(591);
    var c = r(974);
    function zip() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = e[e.length - 1];
      if (typeof r === "function") {
        e.pop();
      }
      return i.fromArray(e, undefined).lift(new p(r));
    }
    t.zip = zip;
    var p = (function() {
      function ZipOperator(e) {
        this.resultSelector = e;
      }
      ZipOperator.prototype.call = function(e, t) {
        return t.subscribe(new l(e, this.resultSelector));
      };
      return ZipOperator;
    })();
    t.ZipOperator = p;
    var l = (function(e) {
      n(ZipSubscriber, e);
      function ZipSubscriber(t, r, n) {
        if (n === void 0) {
          n = Object.create(null);
        }
        var i = e.call(this, t) || this;
        i.iterators = [];
        i.active = 0;
        i.resultSelector = typeof r === "function" ? r : null;
        i.values = n;
        return i;
      }
      ZipSubscriber.prototype._next = function(e) {
        var t = this.iterators;
        if (o.isArray(e)) {
          t.push(new f(e));
        } else if (typeof e[c.iterator] === "function") {
          t.push(new d(e[c.iterator]()));
        } else {
          t.push(new h(this.destination, this, e));
        }
      };
      ZipSubscriber.prototype._complete = function() {
        var e = this.iterators;
        var t = e.length;
        this.unsubscribe();
        if (t === 0) {
          this.destination.complete();
          return;
        }
        this.active = t;
        for (var r = 0; r < t; r++) {
          var n = e[r];
          if (n.stillUnsubscribed) {
            var i = this.destination;
            i.add(n.subscribe(n, r));
          } else {
            this.active--;
          }
        }
      };
      ZipSubscriber.prototype.notifyInactive = function() {
        this.active--;
        if (this.active === 0) {
          this.destination.complete();
        }
      };
      ZipSubscriber.prototype.checkIterators = function() {
        var e = this.iterators;
        var t = e.length;
        var r = this.destination;
        for (var n = 0; n < t; n++) {
          var i = e[n];
          if (typeof i.hasValue === "function" && !i.hasValue()) {
            return;
          }
        }
        var o = false;
        var s = [];
        for (var n = 0; n < t; n++) {
          var i = e[n];
          var u = i.next();
          if (i.hasCompleted()) {
            o = true;
          }
          if (u.done) {
            r.complete();
            return;
          }
          s.push(u.value);
        }
        if (this.resultSelector) {
          this._tryresultSelector(s);
        } else {
          r.next(s);
        }
        if (o) {
          r.complete();
        }
      };
      ZipSubscriber.prototype._tryresultSelector = function(e) {
        var t;
        try {
          t = this.resultSelector.apply(this, e);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.destination.next(t);
      };
      return ZipSubscriber;
    })(s.Subscriber);
    t.ZipSubscriber = l;
    var d = (function() {
      function StaticIterator(e) {
        this.iterator = e;
        this.nextResult = e.next();
      }
      StaticIterator.prototype.hasValue = function() {
        return true;
      };
      StaticIterator.prototype.next = function() {
        var e = this.nextResult;
        this.nextResult = this.iterator.next();
        return e;
      };
      StaticIterator.prototype.hasCompleted = function() {
        var e = this.nextResult;
        return e && e.done;
      };
      return StaticIterator;
    })();
    var f = (function() {
      function StaticArrayIterator(e) {
        this.array = e;
        this.index = 0;
        this.length = 0;
        this.length = e.length;
      }
      StaticArrayIterator.prototype[c.iterator] = function() {
        return this;
      };
      StaticArrayIterator.prototype.next = function(e) {
        var t = this.index++;
        var r = this.array;
        return t < this.length
          ? { value: r[t], done: false }
          : { value: null, done: true };
      };
      StaticArrayIterator.prototype.hasValue = function() {
        return this.array.length > this.index;
      };
      StaticArrayIterator.prototype.hasCompleted = function() {
        return this.array.length === this.index;
      };
      return StaticArrayIterator;
    })();
    var h = (function(e) {
      n(ZipBufferIterator, e);
      function ZipBufferIterator(t, r, n) {
        var i = e.call(this, t) || this;
        i.parent = r;
        i.observable = n;
        i.stillUnsubscribed = true;
        i.buffer = [];
        i.isComplete = false;
        return i;
      }
      ZipBufferIterator.prototype[c.iterator] = function() {
        return this;
      };
      ZipBufferIterator.prototype.next = function() {
        var e = this.buffer;
        if (e.length === 0 && this.isComplete) {
          return { value: null, done: true };
        } else {
          return { value: e.shift(), done: false };
        }
      };
      ZipBufferIterator.prototype.hasValue = function() {
        return this.buffer.length > 0;
      };
      ZipBufferIterator.prototype.hasCompleted = function() {
        return this.buffer.length === 0 && this.isComplete;
      };
      ZipBufferIterator.prototype.notifyComplete = function() {
        if (this.buffer.length > 0) {
          this.isComplete = true;
          this.parent.notifyInactive();
        } else {
          this.destination.complete();
        }
      };
      ZipBufferIterator.prototype.notifyNext = function(e, t, r, n, i) {
        this.buffer.push(t);
        this.parent.checkIterators();
      };
      ZipBufferIterator.prototype.subscribe = function(e, t) {
        return a.subscribeToResult(this, this.observable, this, t);
      };
      return ZipBufferIterator;
    })(u.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(522);
    function isInteropObservable(e) {
      return e && typeof e[n.observable] === "function";
    }
    t.isInteropObservable = isInteropObservable;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(59);
    function distinctUntilKeyChanged(e, t) {
      return n.distinctUntilChanged(function(r, n) {
        return t ? t(r[e], n[e]) : r[e] === n[e];
      });
    }
    t.distinctUntilKeyChanged = distinctUntilKeyChanged;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(411);
    function sampleTime(e, t) {
      if (t === void 0) {
        t = o.async;
      }
      return function(r) {
        return r.lift(new s(e, t));
      };
    }
    t.sampleTime = sampleTime;
    var s = (function() {
      function SampleTimeOperator(e, t) {
        this.period = e;
        this.scheduler = t;
      }
      SampleTimeOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.period, this.scheduler));
      };
      return SampleTimeOperator;
    })();
    var u = (function(e) {
      n(SampleTimeSubscriber, e);
      function SampleTimeSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.period = r;
        i.scheduler = n;
        i.hasValue = false;
        i.add(
          n.schedule(dispatchNotification, r, { subscriber: i, period: r })
        );
        return i;
      }
      SampleTimeSubscriber.prototype._next = function(e) {
        this.lastValue = e;
        this.hasValue = true;
      };
      SampleTimeSubscriber.prototype.notifyNext = function() {
        if (this.hasValue) {
          this.hasValue = false;
          this.destination.next(this.lastValue);
        }
      };
      return SampleTimeSubscriber;
    })(i.Subscriber);
    function dispatchNotification(e) {
      var t = e.subscriber,
        r = e.period;
      t.notifyNext();
      this.schedule(e, r);
    }
  },
  ,
  function(e, t, r) {
    e.exports = octokitValidate;
    const n = r(348);
    function octokitValidate(e) {
      e.hook.before("request", n.bind(null, e));
    }
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(974);
    t.subscribeToIterable = function(e) {
      return function(t) {
        var r = e[n.iterator]();
        do {
          var i = r.next();
          if (i.done) {
            t.complete();
            break;
          }
          t.next(i.value);
          if (t.closed) {
            break;
          }
        } while (true);
        if (typeof r.return === "function") {
          t.add(function() {
            if (r.return) {
              r.return();
            }
          });
        }
        return t;
      };
    };
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(936);
    function concatMapTo(e, t) {
      return n.concatMap(function() {
        return e;
      }, t);
    }
    t.concatMapTo = concatMapTo;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function bufferCount(e, t) {
      if (t === void 0) {
        t = null;
      }
      return function bufferCountOperatorFunction(r) {
        return r.lift(new o(e, t));
      };
    }
    t.bufferCount = bufferCount;
    var o = (function() {
      function BufferCountOperator(e, t) {
        this.bufferSize = e;
        this.startBufferEvery = t;
        if (!t || e === t) {
          this.subscriberClass = s;
        } else {
          this.subscriberClass = u;
        }
      }
      BufferCountOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new this.subscriberClass(e, this.bufferSize, this.startBufferEvery)
        );
      };
      return BufferCountOperator;
    })();
    var s = (function(e) {
      n(BufferCountSubscriber, e);
      function BufferCountSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.bufferSize = r;
        n.buffer = [];
        return n;
      }
      BufferCountSubscriber.prototype._next = function(e) {
        var t = this.buffer;
        t.push(e);
        if (t.length == this.bufferSize) {
          this.destination.next(t);
          this.buffer = [];
        }
      };
      BufferCountSubscriber.prototype._complete = function() {
        var t = this.buffer;
        if (t.length > 0) {
          this.destination.next(t);
        }
        e.prototype._complete.call(this);
      };
      return BufferCountSubscriber;
    })(i.Subscriber);
    var u = (function(e) {
      n(BufferSkipCountSubscriber, e);
      function BufferSkipCountSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.bufferSize = r;
        i.startBufferEvery = n;
        i.buffers = [];
        i.count = 0;
        return i;
      }
      BufferSkipCountSubscriber.prototype._next = function(e) {
        var t = this,
          r = t.bufferSize,
          n = t.startBufferEvery,
          i = t.buffers,
          o = t.count;
        this.count++;
        if (o % n === 0) {
          i.push([]);
        }
        for (var s = i.length; s--; ) {
          var u = i[s];
          u.push(e);
          if (u.length === r) {
            i.splice(s, 1);
            this.destination.next(u);
          }
        }
      };
      BufferSkipCountSubscriber.prototype._complete = function() {
        var t = this,
          r = t.buffers,
          n = t.destination;
        while (r.length > 0) {
          var i = r.shift();
          if (i.length > 0) {
            n.next(i);
          }
        }
        e.prototype._complete.call(this);
      };
      return BufferSkipCountSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    var n = r(969);
    var i = r(9);
    var o = r(747);
    var s = function() {};
    var u = /^v?\.0/.test(process.version);
    var a = function(e) {
      return typeof e === "function";
    };
    var c = function(e) {
      if (!u) return false;
      if (!o) return false;
      return (
        (e instanceof (o.ReadStream || s) ||
          e instanceof (o.WriteStream || s)) &&
        a(e.close)
      );
    };
    var p = function(e) {
      return e.setHeader && a(e.abort);
    };
    var l = function(e, t, r, o) {
      o = n(o);
      var u = false;
      e.on("close", function() {
        u = true;
      });
      i(e, { readable: t, writable: r }, function(e) {
        if (e) return o(e);
        u = true;
        o();
      });
      var l = false;
      return function(t) {
        if (u) return;
        if (l) return;
        l = true;
        if (c(e)) return e.close(s);
        if (p(e)) return e.abort();
        if (a(e.destroy)) return e.destroy();
        o(t || new Error("stream was destroyed"));
      };
    };
    var d = function(e) {
      e();
    };
    var f = function(e, t) {
      return e.pipe(t);
    };
    var h = function() {
      var e = Array.prototype.slice.call(arguments);
      var t = (a(e[e.length - 1] || s) && e.pop()) || s;
      if (Array.isArray(e[0])) e = e[0];
      if (e.length < 2)
        throw new Error("pump requires two streams per minimum");
      var r;
      var n = e.map(function(i, o) {
        var s = o < e.length - 1;
        var u = o > 0;
        return l(i, s, u, function(e) {
          if (!r) r = e;
          if (e) n.forEach(d);
          if (s) return;
          n.forEach(d);
          t(r);
        });
      });
      return e.reduce(f);
    };
    e.exports = h;
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function _interopDefault(e) {
      return e && typeof e === "object" && "default" in e ? e["default"] : e;
    }
    var n = _interopDefault(r(413));
    var i = _interopDefault(r(605));
    var o = _interopDefault(r(835));
    var s = _interopDefault(r(211));
    var u = _interopDefault(r(761));
    const a = n.Readable;
    const c = Symbol("buffer");
    const p = Symbol("type");
    class Blob {
      constructor() {
        this[p] = "";
        const e = arguments[0];
        const t = arguments[1];
        const r = [];
        let n = 0;
        if (e) {
          const t = e;
          const i = Number(t.length);
          for (let e = 0; e < i; e++) {
            const i = t[e];
            let o;
            if (i instanceof Buffer) {
              o = i;
            } else if (ArrayBuffer.isView(i)) {
              o = Buffer.from(i.buffer, i.byteOffset, i.byteLength);
            } else if (i instanceof ArrayBuffer) {
              o = Buffer.from(i);
            } else if (i instanceof Blob) {
              o = i[c];
            } else {
              o = Buffer.from(typeof i === "string" ? i : String(i));
            }
            n += o.length;
            r.push(o);
          }
        }
        this[c] = Buffer.concat(r);
        let i = t && t.type !== undefined && String(t.type).toLowerCase();
        if (i && !/[^\u0020-\u007E]/.test(i)) {
          this[p] = i;
        }
      }
      get size() {
        return this[c].length;
      }
      get type() {
        return this[p];
      }
      text() {
        return Promise.resolve(this[c].toString());
      }
      arrayBuffer() {
        const e = this[c];
        const t = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
        return Promise.resolve(t);
      }
      stream() {
        const e = new a();
        e._read = function() {};
        e.push(this[c]);
        e.push(null);
        return e;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const e = this.size;
        const t = arguments[0];
        const r = arguments[1];
        let n, i;
        if (t === undefined) {
          n = 0;
        } else if (t < 0) {
          n = Math.max(e + t, 0);
        } else {
          n = Math.min(t, e);
        }
        if (r === undefined) {
          i = e;
        } else if (r < 0) {
          i = Math.max(e + r, 0);
        } else {
          i = Math.min(r, e);
        }
        const o = Math.max(i - n, 0);
        const s = this[c];
        const u = s.slice(n, n + o);
        const a = new Blob([], { type: arguments[2] });
        a[c] = u;
        return a;
      }
    }
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError(e, t, r) {
      Error.call(this, e);
      this.message = e;
      this.type = t;
      if (r) {
        this.code = this.errno = r.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError.prototype = Object.create(Error.prototype);
    FetchError.prototype.constructor = FetchError;
    FetchError.prototype.name = "FetchError";
    let l;
    try {
      l = r(18).convert;
    } catch (e) {}
    const d = Symbol("Body internals");
    const f = n.PassThrough;
    function Body(e) {
      var t = this;
      var r =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {},
        i = r.size;
      let o = i === undefined ? 0 : i;
      var s = r.timeout;
      let u = s === undefined ? 0 : s;
      if (e == null) {
        e = null;
      } else if (isURLSearchParams(e)) {
        e = Buffer.from(e.toString());
      } else if (isBlob(e));
      else if (Buffer.isBuffer(e));
      else if (Object.prototype.toString.call(e) === "[object ArrayBuffer]") {
        e = Buffer.from(e);
      } else if (ArrayBuffer.isView(e)) {
        e = Buffer.from(e.buffer, e.byteOffset, e.byteLength);
      } else if (e instanceof n);
      else {
        e = Buffer.from(String(e));
      }
      this[d] = { body: e, disturbed: false, error: null };
      this.size = o;
      this.timeout = u;
      if (e instanceof n) {
        e.on("error", function(e) {
          const r =
            e.name === "AbortError"
              ? e
              : new FetchError(
                  `Invalid response body while trying to fetch ${t.url}: ${e.message}`,
                  "system",
                  e
                );
          t[d].error = r;
        });
      }
    }
    Body.prototype = {
      get body() {
        return this[d].body;
      },
      get bodyUsed() {
        return this[d].disturbed;
      },
      arrayBuffer() {
        return consumeBody.call(this).then(function(e) {
          return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
        });
      },
      blob() {
        let e = (this.headers && this.headers.get("content-type")) || "";
        return consumeBody.call(this).then(function(t) {
          return Object.assign(new Blob([], { type: e.toLowerCase() }), {
            [c]: t
          });
        });
      },
      json() {
        var e = this;
        return consumeBody.call(this).then(function(t) {
          try {
            return JSON.parse(t.toString());
          } catch (t) {
            return Body.Promise.reject(
              new FetchError(
                `invalid json response body at ${e.url} reason: ${t.message}`,
                "invalid-json"
              )
            );
          }
        });
      },
      text() {
        return consumeBody.call(this).then(function(e) {
          return e.toString();
        });
      },
      buffer() {
        return consumeBody.call(this);
      },
      textConverted() {
        var e = this;
        return consumeBody.call(this).then(function(t) {
          return convertBody(t, e.headers);
        });
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body.mixIn = function(e) {
      for (const t of Object.getOwnPropertyNames(Body.prototype)) {
        if (!(t in e)) {
          const r = Object.getOwnPropertyDescriptor(Body.prototype, t);
          Object.defineProperty(e, t, r);
        }
      }
    };
    function consumeBody() {
      var e = this;
      if (this[d].disturbed) {
        return Body.Promise.reject(
          new TypeError(`body used already for: ${this.url}`)
        );
      }
      this[d].disturbed = true;
      if (this[d].error) {
        return Body.Promise.reject(this[d].error);
      }
      let t = this.body;
      if (t === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob(t)) {
        t = t.stream();
      }
      if (Buffer.isBuffer(t)) {
        return Body.Promise.resolve(t);
      }
      if (!(t instanceof n)) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      let r = [];
      let i = 0;
      let o = false;
      return new Body.Promise(function(n, s) {
        let u;
        if (e.timeout) {
          u = setTimeout(function() {
            o = true;
            s(
              new FetchError(
                `Response timeout while trying to fetch ${e.url} (over ${e.timeout}ms)`,
                "body-timeout"
              )
            );
          }, e.timeout);
        }
        t.on("error", function(t) {
          if (t.name === "AbortError") {
            o = true;
            s(t);
          } else {
            s(
              new FetchError(
                `Invalid response body while trying to fetch ${e.url}: ${t.message}`,
                "system",
                t
              )
            );
          }
        });
        t.on("data", function(t) {
          if (o || t === null) {
            return;
          }
          if (e.size && i + t.length > e.size) {
            o = true;
            s(
              new FetchError(
                `content size at ${e.url} over limit: ${e.size}`,
                "max-size"
              )
            );
            return;
          }
          i += t.length;
          r.push(t);
        });
        t.on("end", function() {
          if (o) {
            return;
          }
          clearTimeout(u);
          try {
            n(Buffer.concat(r, i));
          } catch (t) {
            s(
              new FetchError(
                `Could not create Buffer from response body for ${e.url}: ${t.message}`,
                "system",
                t
              )
            );
          }
        });
      });
    }
    function convertBody(e, t) {
      if (typeof l !== "function") {
        throw new Error(
          "The package `encoding` must be installed to use the textConverted() function"
        );
      }
      const r = t.get("content-type");
      let n = "utf-8";
      let i, o;
      if (r) {
        i = /charset=([^;]*)/i.exec(r);
      }
      o = e.slice(0, 1024).toString();
      if (!i && o) {
        i = /<meta.+?charset=(['"])(.+?)\1/i.exec(o);
      }
      if (!i && o) {
        i = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(
          o
        );
        if (i) {
          i = /charset=(.*)/i.exec(i.pop());
        }
      }
      if (!i && o) {
        i = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(o);
      }
      if (i) {
        n = i.pop();
        if (n === "gb2312" || n === "gbk") {
          n = "gb18030";
        }
      }
      return l(e, "UTF-8", n).toString();
    }
    function isURLSearchParams(e) {
      if (
        typeof e !== "object" ||
        typeof e.append !== "function" ||
        typeof e.delete !== "function" ||
        typeof e.get !== "function" ||
        typeof e.getAll !== "function" ||
        typeof e.has !== "function" ||
        typeof e.set !== "function"
      ) {
        return false;
      }
      return (
        e.constructor.name === "URLSearchParams" ||
        Object.prototype.toString.call(e) === "[object URLSearchParams]" ||
        typeof e.sort === "function"
      );
    }
    function isBlob(e) {
      return (
        typeof e === "object" &&
        typeof e.arrayBuffer === "function" &&
        typeof e.type === "string" &&
        typeof e.stream === "function" &&
        typeof e.constructor === "function" &&
        typeof e.constructor.name === "string" &&
        /^(Blob|File)$/.test(e.constructor.name) &&
        /^(Blob|File)$/.test(e[Symbol.toStringTag])
      );
    }
    function clone(e) {
      let t, r;
      let i = e.body;
      if (e.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (i instanceof n && typeof i.getBoundary !== "function") {
        t = new f();
        r = new f();
        i.pipe(t);
        i.pipe(r);
        e[d].body = t;
        i = r;
      }
      return i;
    }
    function extractContentType(e) {
      if (e === null) {
        return null;
      } else if (typeof e === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(e)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob(e)) {
        return e.type || null;
      } else if (Buffer.isBuffer(e)) {
        return null;
      } else if (Object.prototype.toString.call(e) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(e)) {
        return null;
      } else if (typeof e.getBoundary === "function") {
        return `multipart/form-data;boundary=${e.getBoundary()}`;
      } else if (e instanceof n) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes(e) {
      const t = e.body;
      if (t === null) {
        return 0;
      } else if (isBlob(t)) {
        return t.size;
      } else if (Buffer.isBuffer(t)) {
        return t.length;
      } else if (t && typeof t.getLengthSync === "function") {
        if (
          (t._lengthRetrievers && t._lengthRetrievers.length == 0) ||
          (t.hasKnownLength && t.hasKnownLength())
        ) {
          return t.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream(e, t) {
      const r = t.body;
      if (r === null) {
        e.end();
      } else if (isBlob(r)) {
        r.stream().pipe(e);
      } else if (Buffer.isBuffer(r)) {
        e.write(r);
        e.end();
      } else {
        r.pipe(e);
      }
    }
    Body.Promise = global.Promise;
    const h = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    const y = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(e) {
      e = `${e}`;
      if (h.test(e) || e === "") {
        throw new TypeError(`${e} is not a legal HTTP header name`);
      }
    }
    function validateValue(e) {
      e = `${e}`;
      if (y.test(e)) {
        throw new TypeError(`${e} is not a legal HTTP header value`);
      }
    }
    function find(e, t) {
      t = t.toLowerCase();
      for (const r in e) {
        if (r.toLowerCase() === t) {
          return r;
        }
      }
      return undefined;
    }
    const b = Symbol("map");
    class Headers {
      constructor() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : undefined;
        this[b] = Object.create(null);
        if (e instanceof Headers) {
          const t = e.raw();
          const r = Object.keys(t);
          for (const e of r) {
            for (const r of t[e]) {
              this.append(e, r);
            }
          }
          return;
        }
        if (e == null);
        else if (typeof e === "object") {
          const t = e[Symbol.iterator];
          if (t != null) {
            if (typeof t !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const r = [];
            for (const t of e) {
              if (
                typeof t !== "object" ||
                typeof t[Symbol.iterator] !== "function"
              ) {
                throw new TypeError("Each header pair must be iterable");
              }
              r.push(Array.from(t));
            }
            for (const e of r) {
              if (e.length !== 2) {
                throw new TypeError(
                  "Each header pair must be a name/value tuple"
                );
              }
              this.append(e[0], e[1]);
            }
          } else {
            for (const t of Object.keys(e)) {
              const r = e[t];
              this.append(t, r);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(e) {
        e = `${e}`;
        validateName(e);
        const t = find(this[b], e);
        if (t === undefined) {
          return null;
        }
        return this[b][t].join(", ");
      }
      forEach(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : undefined;
        let r = getHeaders(this);
        let n = 0;
        while (n < r.length) {
          var i = r[n];
          const o = i[0],
            s = i[1];
          e.call(t, s, o, this);
          r = getHeaders(this);
          n++;
        }
      }
      set(e, t) {
        e = `${e}`;
        t = `${t}`;
        validateName(e);
        validateValue(t);
        const r = find(this[b], e);
        this[b][r !== undefined ? r : e] = [t];
      }
      append(e, t) {
        e = `${e}`;
        t = `${t}`;
        validateName(e);
        validateValue(t);
        const r = find(this[b], e);
        if (r !== undefined) {
          this[b][r].push(t);
        } else {
          this[b][e] = [t];
        }
      }
      has(e) {
        e = `${e}`;
        validateName(e);
        return find(this[b], e) !== undefined;
      }
      delete(e) {
        e = `${e}`;
        validateName(e);
        const t = find(this[b], e);
        if (t !== undefined) {
          delete this[b][t];
        }
      }
      raw() {
        return this[b];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    }
    Headers.prototype.entries = Headers.prototype[Symbol.iterator];
    Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(e) {
      let t =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : "key+value";
      const r = Object.keys(e[b]).sort();
      return r.map(
        t === "key"
          ? function(e) {
              return e.toLowerCase();
            }
          : t === "value"
          ? function(t) {
              return e[b][t].join(", ");
            }
          : function(t) {
              return [t.toLowerCase(), e[b][t].join(", ")];
            }
      );
    }
    const g = Symbol("internal");
    function createHeadersIterator(e, t) {
      const r = Object.create(m);
      r[g] = { target: e, kind: t, index: 0 };
      return r;
    }
    const m = Object.setPrototypeOf(
      {
        next() {
          if (!this || Object.getPrototypeOf(this) !== m) {
            throw new TypeError("Value of `this` is not a HeadersIterator");
          }
          var e = this[g];
          const t = e.target,
            r = e.kind,
            n = e.index;
          const i = getHeaders(t, r);
          const o = i.length;
          if (n >= o) {
            return { value: undefined, done: true };
          }
          this[g].index = n + 1;
          return { value: i[n], done: false };
        }
      },
      Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))
    );
    Object.defineProperty(m, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(e) {
      const t = Object.assign({ __proto__: null }, e[b]);
      const r = find(e[b], "Host");
      if (r !== undefined) {
        t[r] = t[r][0];
      }
      return t;
    }
    function createHeadersLenient(e) {
      const t = new Headers();
      for (const r of Object.keys(e)) {
        if (h.test(r)) {
          continue;
        }
        if (Array.isArray(e[r])) {
          for (const n of e[r]) {
            if (y.test(n)) {
              continue;
            }
            if (t[b][r] === undefined) {
              t[b][r] = [n];
            } else {
              t[b][r].push(n);
            }
          }
        } else if (!y.test(e[r])) {
          t[b][r] = [e[r]];
        }
      }
      return t;
    }
    const _ = Symbol("Response internals");
    const v = i.STATUS_CODES;
    class Response {
      constructor() {
        let e =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : null;
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        Body.call(this, e, t);
        const r = t.status || 200;
        const n = new Headers(t.headers);
        if (e != null && !n.has("Content-Type")) {
          const t = extractContentType(e);
          if (t) {
            n.append("Content-Type", t);
          }
        }
        this[_] = {
          url: t.url,
          status: r,
          statusText: t.statusText || v[r],
          headers: n,
          counter: t.counter
        };
      }
      get url() {
        return this[_].url || "";
      }
      get status() {
        return this[_].status;
      }
      get ok() {
        return this[_].status >= 200 && this[_].status < 300;
      }
      get redirected() {
        return this[_].counter > 0;
      }
      get statusText() {
        return this[_].statusText;
      }
      get headers() {
        return this[_].headers;
      }
      clone() {
        return new Response(clone(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    }
    Body.mixIn(Response.prototype);
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    const w = Symbol("Request internals");
    const S = o.parse;
    const q = o.format;
    const O = "destroy" in n.Readable.prototype;
    function isRequest(e) {
      return typeof e === "object" && typeof e[w] === "object";
    }
    function isAbortSignal(e) {
      const t = e && typeof e === "object" && Object.getPrototypeOf(e);
      return !!(t && t.constructor.name === "AbortSignal");
    }
    class Request {
      constructor(e) {
        let t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        let r;
        if (!isRequest(e)) {
          if (e && e.href) {
            r = S(e.href);
          } else {
            r = S(`${e}`);
          }
          e = {};
        } else {
          r = S(e.url);
        }
        let n = t.method || e.method || "GET";
        n = n.toUpperCase();
        if (
          (t.body != null || (isRequest(e) && e.body !== null)) &&
          (n === "GET" || n === "HEAD")
        ) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let i =
          t.body != null
            ? t.body
            : isRequest(e) && e.body !== null
            ? clone(e)
            : null;
        Body.call(this, i, {
          timeout: t.timeout || e.timeout || 0,
          size: t.size || e.size || 0
        });
        const o = new Headers(t.headers || e.headers || {});
        if (i != null && !o.has("Content-Type")) {
          const e = extractContentType(i);
          if (e) {
            o.append("Content-Type", e);
          }
        }
        let s = isRequest(e) ? e.signal : null;
        if ("signal" in t) s = t.signal;
        if (s != null && !isAbortSignal(s)) {
          throw new TypeError(
            "Expected signal to be an instanceof AbortSignal"
          );
        }
        this[w] = {
          method: n,
          redirect: t.redirect || e.redirect || "follow",
          headers: o,
          parsedURL: r,
          signal: s
        };
        this.follow =
          t.follow !== undefined
            ? t.follow
            : e.follow !== undefined
            ? e.follow
            : 20;
        this.compress =
          t.compress !== undefined
            ? t.compress
            : e.compress !== undefined
            ? e.compress
            : true;
        this.counter = t.counter || e.counter || 0;
        this.agent = t.agent || e.agent;
      }
      get method() {
        return this[w].method;
      }
      get url() {
        return q(this[w].parsedURL);
      }
      get headers() {
        return this[w].headers;
      }
      get redirect() {
        return this[w].redirect;
      }
      get signal() {
        return this[w].signal;
      }
      clone() {
        return new Request(this);
      }
    }
    Body.mixIn(Request.prototype);
    Object.defineProperty(Request.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions(e) {
      const t = e[w].parsedURL;
      const r = new Headers(e[w].headers);
      if (!r.has("Accept")) {
        r.set("Accept", "*/*");
      }
      if (!t.protocol || !t.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(t.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (e.signal && e.body instanceof n.Readable && !O) {
        throw new Error(
          "Cancellation of streamed requests with AbortSignal is not supported in node < 8"
        );
      }
      let i = null;
      if (e.body == null && /^(POST|PUT)$/i.test(e.method)) {
        i = "0";
      }
      if (e.body != null) {
        const t = getTotalBytes(e);
        if (typeof t === "number") {
          i = String(t);
        }
      }
      if (i) {
        r.set("Content-Length", i);
      }
      if (!r.has("User-Agent")) {
        r.set(
          "User-Agent",
          "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"
        );
      }
      if (e.compress && !r.has("Accept-Encoding")) {
        r.set("Accept-Encoding", "gzip,deflate");
      }
      let o = e.agent;
      if (typeof o === "function") {
        o = o(t);
      }
      if (!r.has("Connection") && !o) {
        r.set("Connection", "close");
      }
      return Object.assign({}, t, {
        method: e.method,
        headers: exportNodeCompatibleHeaders(r),
        agent: o
      });
    }
    function AbortError(e) {
      Error.call(this, e);
      this.type = "aborted";
      this.message = e;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError.prototype = Object.create(Error.prototype);
    AbortError.prototype.constructor = AbortError;
    AbortError.prototype.name = "AbortError";
    const E = n.PassThrough;
    const T = o.resolve;
    function fetch(e, t) {
      if (!fetch.Promise) {
        throw new Error(
          "native promise missing, set fetch.Promise to your favorite alternative"
        );
      }
      Body.Promise = fetch.Promise;
      return new fetch.Promise(function(r, o) {
        const a = new Request(e, t);
        const c = getNodeRequestOptions(a);
        const p = (c.protocol === "https:" ? s : i).request;
        const l = a.signal;
        let d = null;
        const f = function abort() {
          let e = new AbortError("The user aborted a request.");
          o(e);
          if (a.body && a.body instanceof n.Readable) {
            a.body.destroy(e);
          }
          if (!d || !d.body) return;
          d.body.emit("error", e);
        };
        if (l && l.aborted) {
          f();
          return;
        }
        const h = function abortAndFinalize() {
          f();
          finalize();
        };
        const y = p(c);
        let b;
        if (l) {
          l.addEventListener("abort", h);
        }
        function finalize() {
          y.abort();
          if (l) l.removeEventListener("abort", h);
          clearTimeout(b);
        }
        if (a.timeout) {
          y.once("socket", function(e) {
            b = setTimeout(function() {
              o(
                new FetchError(
                  `network timeout at: ${a.url}`,
                  "request-timeout"
                )
              );
              finalize();
            }, a.timeout);
          });
        }
        y.on("error", function(e) {
          o(
            new FetchError(
              `request to ${a.url} failed, reason: ${e.message}`,
              "system",
              e
            )
          );
          finalize();
        });
        y.on("response", function(e) {
          clearTimeout(b);
          const t = createHeadersLenient(e.headers);
          if (fetch.isRedirect(e.statusCode)) {
            const n = t.get("Location");
            const i = n === null ? null : T(a.url, n);
            switch (a.redirect) {
              case "error":
                o(
                  new FetchError(
                    `redirect mode is set to error: ${a.url}`,
                    "no-redirect"
                  )
                );
                finalize();
                return;
              case "manual":
                if (i !== null) {
                  try {
                    t.set("Location", i);
                  } catch (e) {
                    o(e);
                  }
                }
                break;
              case "follow":
                if (i === null) {
                  break;
                }
                if (a.counter >= a.follow) {
                  o(
                    new FetchError(
                      `maximum redirect reached at: ${a.url}`,
                      "max-redirect"
                    )
                  );
                  finalize();
                  return;
                }
                const n = {
                  headers: new Headers(a.headers),
                  follow: a.follow,
                  counter: a.counter + 1,
                  agent: a.agent,
                  compress: a.compress,
                  method: a.method,
                  body: a.body,
                  signal: a.signal,
                  timeout: a.timeout
                };
                if (
                  e.statusCode !== 303 &&
                  a.body &&
                  getTotalBytes(a) === null
                ) {
                  o(
                    new FetchError(
                      "Cannot follow redirect with body being a readable stream",
                      "unsupported-redirect"
                    )
                  );
                  finalize();
                  return;
                }
                if (
                  e.statusCode === 303 ||
                  ((e.statusCode === 301 || e.statusCode === 302) &&
                    a.method === "POST")
                ) {
                  n.method = "GET";
                  n.body = undefined;
                  n.headers.delete("content-length");
                }
                r(fetch(new Request(i, n)));
                finalize();
                return;
            }
          }
          e.once("end", function() {
            if (l) l.removeEventListener("abort", h);
          });
          let n = e.pipe(new E());
          const i = {
            url: a.url,
            status: e.statusCode,
            statusText: e.statusMessage,
            headers: t,
            size: a.size,
            timeout: a.timeout,
            counter: a.counter
          };
          const s = t.get("Content-Encoding");
          if (
            !a.compress ||
            a.method === "HEAD" ||
            s === null ||
            e.statusCode === 204 ||
            e.statusCode === 304
          ) {
            d = new Response(n, i);
            r(d);
            return;
          }
          const c = { flush: u.Z_SYNC_FLUSH, finishFlush: u.Z_SYNC_FLUSH };
          if (s == "gzip" || s == "x-gzip") {
            n = n.pipe(u.createGunzip(c));
            d = new Response(n, i);
            r(d);
            return;
          }
          if (s == "deflate" || s == "x-deflate") {
            const t = e.pipe(new E());
            t.once("data", function(e) {
              if ((e[0] & 15) === 8) {
                n = n.pipe(u.createInflate());
              } else {
                n = n.pipe(u.createInflateRaw());
              }
              d = new Response(n, i);
              r(d);
            });
            return;
          }
          if (s == "br" && typeof u.createBrotliDecompress === "function") {
            n = n.pipe(u.createBrotliDecompress());
            d = new Response(n, i);
            r(d);
            return;
          }
          d = new Response(n, i);
          r(d);
        });
        writeToStream(y, a);
      });
    }
    fetch.isRedirect = function(e) {
      return e === 301 || e === 302 || e === 303 || e === 307 || e === 308;
    };
    fetch.Promise = global.Promise;
    e.exports = t = fetch;
    Object.defineProperty(t, "__esModule", { value: true });
    t.default = t;
    t.Headers = Headers;
    t.Request = Request;
    t.Response = Response;
    t.FetchError = FetchError;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(565);
    var s = r(591);
    function retryWhen(e) {
      return function(t) {
        return t.lift(new u(e, t));
      };
    }
    t.retryWhen = retryWhen;
    var u = (function() {
      function RetryWhenOperator(e, t) {
        this.notifier = e;
        this.source = t;
      }
      RetryWhenOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.notifier, this.source));
      };
      return RetryWhenOperator;
    })();
    var a = (function(e) {
      n(RetryWhenSubscriber, e);
      function RetryWhenSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.notifier = r;
        i.source = n;
        return i;
      }
      RetryWhenSubscriber.prototype.error = function(t) {
        if (!this.isStopped) {
          var r = this.errors;
          var n = this.retries;
          var o = this.retriesSubscription;
          if (!n) {
            r = new i.Subject();
            try {
              var u = this.notifier;
              n = u(r);
            } catch (t) {
              return e.prototype.error.call(this, t);
            }
            o = s.subscribeToResult(this, n);
          } else {
            this.errors = null;
            this.retriesSubscription = null;
          }
          this._unsubscribeAndRecycle();
          this.errors = r;
          this.retries = n;
          this.retriesSubscription = o;
          r.next(t);
        }
      };
      RetryWhenSubscriber.prototype._unsubscribe = function() {
        var e = this,
          t = e.errors,
          r = e.retriesSubscription;
        if (t) {
          t.unsubscribe();
          this.errors = null;
        }
        if (r) {
          r.unsubscribe();
          this.retriesSubscription = null;
        }
        this.retries = null;
      };
      RetryWhenSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        var o = this._unsubscribe;
        this._unsubscribe = null;
        this._unsubscribeAndRecycle();
        this._unsubscribe = o;
        this.source.subscribe(this);
      };
      return RetryWhenSubscriber;
    })(o.OuterSubscriber);
  },
  ,
  function(e) {
    "use strict";
    const t = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(e) {
      e = e.replace(t, "^$1");
      return e;
    }
    function escapeArgument(e, r) {
      e = `${e}`;
      e = e.replace(/(\\*)"/g, '$1$1\\"');
      e = e.replace(/(\\*)$/, "$1$1");
      e = `"${e}"`;
      e = e.replace(t, "^$1");
      if (r) {
        e = e.replace(t, "^$1");
      }
      return e;
    }
    e.exports.command = escapeCommand;
    e.exports.argument = escapeArgument;
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function _interopDefault(e) {
      return e && typeof e === "object" && "default" in e ? e["default"] : e;
    }
    var n = r(692);
    var i = _interopDefault(r(969));
    const o = i(e => console.warn(e));
    class RequestError extends Error {
      constructor(e, t, r) {
        super(e);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = t;
        Object.defineProperty(this, "code", {
          get() {
            o(
              new n.Deprecation(
                "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
              )
            );
            return t;
          }
        });
        this.headers = r.headers || {};
        const i = Object.assign({}, r.request);
        if (r.request.headers.authorization) {
          i.headers = Object.assign({}, r.request.headers, {
            authorization: r.request.headers.authorization.replace(
              / .*$/,
              " [REDACTED]"
            )
          });
        }
        i.url = i.url
          .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]")
          .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = i;
      }
    }
    t.RequestError = RequestError;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(246);
    var i = r(827);
    function mergeAll(e) {
      if (e === void 0) {
        e = Number.POSITIVE_INFINITY;
      }
      return n.mergeMap(i.identity, e);
    }
    t.mergeAll = mergeAll;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = authenticationBeforeRequest;
    const n = r(675);
    const i = r(126);
    function authenticationBeforeRequest(e, t) {
      if (!e.auth.type) {
        return;
      }
      if (e.auth.type === "basic") {
        const r = n(`${e.auth.username}:${e.auth.password}`);
        t.headers.authorization = `Basic ${r}`;
        return;
      }
      if (e.auth.type === "token") {
        t.headers.authorization = `token ${e.auth.token}`;
        return;
      }
      if (e.auth.type === "app") {
        t.headers.authorization = `Bearer ${e.auth.token}`;
        const r = t.headers.accept
          .split(",")
          .concat("application/vnd.github.machine-man-preview+json");
        t.headers.accept = i(r)
          .filter(Boolean)
          .join(",");
        return;
      }
      t.url += t.url.indexOf("?") === -1 ? "?" : "&";
      if (e.auth.token) {
        t.url += `access_token=${encodeURIComponent(e.auth.token)}`;
        return;
      }
      const r = encodeURIComponent(e.auth.key);
      const o = encodeURIComponent(e.auth.secret);
      t.url += `client_id=${r}&client_secret=${o}`;
    }
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e) {
    "use strict";
    const t = process.platform === "win32";
    function notFoundError(e, t) {
      return Object.assign(new Error(`${t} ${e.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${t} ${e.command}`,
        path: e.command,
        spawnargs: e.args
      });
    }
    function hookChildProcess(e, r) {
      if (!t) {
        return;
      }
      const n = e.emit;
      e.emit = function(t, i) {
        if (t === "exit") {
          const t = verifyENOENT(i, r, "spawn");
          if (t) {
            return n.call(e, "error", t);
          }
        }
        return n.apply(e, arguments);
      };
    }
    function verifyENOENT(e, r) {
      if (t && e === 1 && !r.file) {
        return notFoundError(r.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(e, r) {
      if (t && e === 1 && !r.file) {
        return notFoundError(r.original, "spawnSync");
      }
      return null;
    }
    e.exports = {
      hookChildProcess: hookChildProcess,
      verifyENOENT: verifyENOENT,
      verifyENOENTSync: verifyENOENTSync,
      notFoundError: notFoundError
    };
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(312);
    var o = (function(e) {
      n(Action, e);
      function Action(t, r) {
        return e.call(this) || this;
      }
      Action.prototype.schedule = function(e, t) {
        if (t === void 0) {
          t = 0;
        }
        return this;
      };
      return Action;
    })(i.Subscription);
    t.Action = o;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function debounce(e) {
      return function(t) {
        return t.lift(new s(e));
      };
    }
    t.debounce = debounce;
    var s = (function() {
      function DebounceOperator(e) {
        this.durationSelector = e;
      }
      DebounceOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.durationSelector));
      };
      return DebounceOperator;
    })();
    var u = (function(e) {
      n(DebounceSubscriber, e);
      function DebounceSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.durationSelector = r;
        n.hasValue = false;
        n.durationSubscription = null;
        return n;
      }
      DebounceSubscriber.prototype._next = function(e) {
        try {
          var t = this.durationSelector.call(this, e);
          if (t) {
            this._tryNext(e, t);
          }
        } catch (e) {
          this.destination.error(e);
        }
      };
      DebounceSubscriber.prototype._complete = function() {
        this.emitValue();
        this.destination.complete();
      };
      DebounceSubscriber.prototype._tryNext = function(e, t) {
        var r = this.durationSubscription;
        this.value = e;
        this.hasValue = true;
        if (r) {
          r.unsubscribe();
          this.remove(r);
        }
        r = o.subscribeToResult(this, t);
        if (r && !r.closed) {
          this.add((this.durationSubscription = r));
        }
      };
      DebounceSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.emitValue();
      };
      DebounceSubscriber.prototype.notifyComplete = function() {
        this.emitValue();
      };
      DebounceSubscriber.prototype.emitValue = function() {
        if (this.hasValue) {
          var t = this.value;
          var r = this.durationSubscription;
          if (r) {
            this.durationSubscription = null;
            r.unsubscribe();
            this.remove(r);
          }
          this.value = null;
          this.hasValue = false;
          e.prototype._next.call(this, t);
        }
      };
      return DebounceSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(831);
    var s = r(312);
    var u = r(745);
    var a = r(146);
    var c = r(165);
    var p = (function(e) {
      n(ReplaySubject, e);
      function ReplaySubject(t, r, n) {
        if (t === void 0) {
          t = Number.POSITIVE_INFINITY;
        }
        if (r === void 0) {
          r = Number.POSITIVE_INFINITY;
        }
        var i = e.call(this) || this;
        i.scheduler = n;
        i._events = [];
        i._infiniteTimeWindow = false;
        i._bufferSize = t < 1 ? 1 : t;
        i._windowTime = r < 1 ? 1 : r;
        if (r === Number.POSITIVE_INFINITY) {
          i._infiniteTimeWindow = true;
          i.next = i.nextInfiniteTimeWindow;
        } else {
          i.next = i.nextTimeWindow;
        }
        return i;
      }
      ReplaySubject.prototype.nextInfiniteTimeWindow = function(t) {
        var r = this._events;
        r.push(t);
        if (r.length > this._bufferSize) {
          r.shift();
        }
        e.prototype.next.call(this, t);
      };
      ReplaySubject.prototype.nextTimeWindow = function(t) {
        this._events.push(new l(this._getNow(), t));
        this._trimBufferThenGetEvents();
        e.prototype.next.call(this, t);
      };
      ReplaySubject.prototype._subscribe = function(e) {
        var t = this._infiniteTimeWindow;
        var r = t ? this._events : this._trimBufferThenGetEvents();
        var n = this.scheduler;
        var i = r.length;
        var o;
        if (this.closed) {
          throw new a.ObjectUnsubscribedError();
        } else if (this.isStopped || this.hasError) {
          o = s.Subscription.EMPTY;
        } else {
          this.observers.push(e);
          o = new c.SubjectSubscription(this, e);
        }
        if (n) {
          e.add((e = new u.ObserveOnSubscriber(e, n)));
        }
        if (t) {
          for (var p = 0; p < i && !e.closed; p++) {
            e.next(r[p]);
          }
        } else {
          for (var p = 0; p < i && !e.closed; p++) {
            e.next(r[p].value);
          }
        }
        if (this.hasError) {
          e.error(this.thrownError);
        } else if (this.isStopped) {
          e.complete();
        }
        return o;
      };
      ReplaySubject.prototype._getNow = function() {
        return (this.scheduler || o.queue).now();
      };
      ReplaySubject.prototype._trimBufferThenGetEvents = function() {
        var e = this._getNow();
        var t = this._bufferSize;
        var r = this._windowTime;
        var n = this._events;
        var i = n.length;
        var o = 0;
        while (o < i) {
          if (e - n[o].time < r) {
            break;
          }
          o++;
        }
        if (i > t) {
          o = Math.max(o, i - t);
        }
        if (o > 0) {
          n.splice(0, o);
        }
        return n;
      };
      return ReplaySubject;
    })(i.Subject);
    t.ReplaySubject = p;
    var l = (function() {
      function ReplayEvent(e, t) {
        this.time = e;
        this.value = t;
      }
      return ReplayEvent;
    })();
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(668);
    var s = r(591);
    function skipUntil(e) {
      return function(t) {
        return t.lift(new u(e));
      };
    }
    t.skipUntil = skipUntil;
    var u = (function() {
      function SkipUntilOperator(e) {
        this.notifier = e;
      }
      SkipUntilOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.notifier));
      };
      return SkipUntilOperator;
    })();
    var a = (function(e) {
      n(SkipUntilSubscriber, e);
      function SkipUntilSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.hasValue = false;
        var i = new o.InnerSubscriber(n, undefined, undefined);
        n.add(i);
        n.innerSubscription = i;
        var u = s.subscribeToResult(n, r, undefined, undefined, i);
        if (u !== i) {
          n.add(u);
          n.innerSubscription = u;
        }
        return n;
      }
      SkipUntilSubscriber.prototype._next = function(t) {
        if (this.hasValue) {
          e.prototype._next.call(this, t);
        }
      };
      SkipUntilSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.hasValue = true;
        if (this.innerSubscription) {
          this.innerSubscription.unsubscribe();
        }
      };
      SkipUntilSubscriber.prototype.notifyComplete = function() {};
      return SkipUntilSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(564);
    function windowCount(e, t) {
      if (t === void 0) {
        t = 0;
      }
      return function windowCountOperatorFunction(r) {
        return r.lift(new s(e, t));
      };
    }
    t.windowCount = windowCount;
    var s = (function() {
      function WindowCountOperator(e, t) {
        this.windowSize = e;
        this.startWindowEvery = t;
      }
      WindowCountOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.windowSize, this.startWindowEvery));
      };
      return WindowCountOperator;
    })();
    var u = (function(e) {
      n(WindowCountSubscriber, e);
      function WindowCountSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.destination = t;
        i.windowSize = r;
        i.startWindowEvery = n;
        i.windows = [new o.Subject()];
        i.count = 0;
        t.next(i.windows[0]);
        return i;
      }
      WindowCountSubscriber.prototype._next = function(e) {
        var t =
          this.startWindowEvery > 0 ? this.startWindowEvery : this.windowSize;
        var r = this.destination;
        var n = this.windowSize;
        var i = this.windows;
        var s = i.length;
        for (var u = 0; u < s && !this.closed; u++) {
          i[u].next(e);
        }
        var a = this.count - n + 1;
        if (a >= 0 && a % t === 0 && !this.closed) {
          i.shift().complete();
        }
        if (++this.count % t === 0 && !this.closed) {
          var c = new o.Subject();
          i.push(c);
          r.next(c);
        }
      };
      WindowCountSubscriber.prototype._error = function(e) {
        var t = this.windows;
        if (t) {
          while (t.length > 0 && !this.closed) {
            t.shift().error(e);
          }
        }
        this.destination.error(e);
      };
      WindowCountSubscriber.prototype._complete = function() {
        var e = this.windows;
        if (e) {
          while (e.length > 0 && !this.closed) {
            e.shift().complete();
          }
        }
        this.destination.complete();
      };
      WindowCountSubscriber.prototype._unsubscribe = function() {
        this.count = 0;
        this.windows = null;
      };
      return WindowCountSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(589);
    var i = r(827);
    function switchAll() {
      return n.switchMap(i.identity);
    }
    t.switchAll = switchAll;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(312);
    var s = r(565);
    var u = r(591);
    function windowToggle(e, t) {
      return function(r) {
        return r.lift(new a(e, t));
      };
    }
    t.windowToggle = windowToggle;
    var a = (function() {
      function WindowToggleOperator(e, t) {
        this.openings = e;
        this.closingSelector = t;
      }
      WindowToggleOperator.prototype.call = function(e, t) {
        return t.subscribe(new c(e, this.openings, this.closingSelector));
      };
      return WindowToggleOperator;
    })();
    var c = (function(e) {
      n(WindowToggleSubscriber, e);
      function WindowToggleSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.openings = r;
        i.closingSelector = n;
        i.contexts = [];
        i.add((i.openSubscription = u.subscribeToResult(i, r, r)));
        return i;
      }
      WindowToggleSubscriber.prototype._next = function(e) {
        var t = this.contexts;
        if (t) {
          var r = t.length;
          for (var n = 0; n < r; n++) {
            t[n].window.next(e);
          }
        }
      };
      WindowToggleSubscriber.prototype._error = function(t) {
        var r = this.contexts;
        this.contexts = null;
        if (r) {
          var n = r.length;
          var i = -1;
          while (++i < n) {
            var o = r[i];
            o.window.error(t);
            o.subscription.unsubscribe();
          }
        }
        e.prototype._error.call(this, t);
      };
      WindowToggleSubscriber.prototype._complete = function() {
        var t = this.contexts;
        this.contexts = null;
        if (t) {
          var r = t.length;
          var n = -1;
          while (++n < r) {
            var i = t[n];
            i.window.complete();
            i.subscription.unsubscribe();
          }
        }
        e.prototype._complete.call(this);
      };
      WindowToggleSubscriber.prototype._unsubscribe = function() {
        var e = this.contexts;
        this.contexts = null;
        if (e) {
          var t = e.length;
          var r = -1;
          while (++r < t) {
            var n = e[r];
            n.window.unsubscribe();
            n.subscription.unsubscribe();
          }
        }
      };
      WindowToggleSubscriber.prototype.notifyNext = function(e, t, r, n, s) {
        if (e === this.openings) {
          var a = void 0;
          try {
            var c = this.closingSelector;
            a = c(t);
          } catch (e) {
            return this.error(e);
          }
          var p = new i.Subject();
          var l = new o.Subscription();
          var d = { window: p, subscription: l };
          this.contexts.push(d);
          var f = u.subscribeToResult(this, a, d);
          if (f.closed) {
            this.closeWindow(this.contexts.length - 1);
          } else {
            f.context = d;
            l.add(f);
          }
          this.destination.next(p);
        } else {
          this.closeWindow(this.contexts.indexOf(e));
        }
      };
      WindowToggleSubscriber.prototype.notifyError = function(e) {
        this.error(e);
      };
      WindowToggleSubscriber.prototype.notifyComplete = function(e) {
        if (e !== this.openSubscription) {
          this.closeWindow(this.contexts.indexOf(e.context));
        }
      };
      WindowToggleSubscriber.prototype.closeWindow = function(e) {
        if (e === -1) {
          return;
        }
        var t = this.contexts;
        var r = t[e];
        var n = r.window,
          i = r.subscription;
        t.splice(e, 1);
        n.complete();
        i.unsubscribe();
      };
      return WindowToggleSubscriber;
    })(s.OuterSubscriber);
  },
  ,
  ,
  function(e) {
    e.exports = addHook;
    function addHook(e, t, r, n) {
      var i = n;
      if (!e.registry[r]) {
        e.registry[r] = [];
      }
      if (t === "before") {
        n = function(e, t) {
          return Promise.resolve()
            .then(i.bind(null, t))
            .then(e.bind(null, t));
        };
      }
      if (t === "after") {
        n = function(e, t) {
          var r;
          return Promise.resolve()
            .then(e.bind(null, t))
            .then(function(e) {
              r = e;
              return i(r, t);
            })
            .then(function() {
              return r;
            });
        };
      }
      if (t === "error") {
        n = function(e, t) {
          return Promise.resolve()
            .then(e.bind(null, t))
            .catch(function(e) {
              return i(e, t);
            });
        };
      }
      e.registry[r].push({ hook: n, orig: i });
    }
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(594);
    var s = r(553);
    function takeLast(e) {
      return function takeLastOperatorFunction(t) {
        if (e === 0) {
          return s.empty();
        } else {
          return t.lift(new u(e));
        }
      };
    }
    t.takeLast = takeLast;
    var u = (function() {
      function TakeLastOperator(e) {
        this.total = e;
        if (this.total < 0) {
          throw new o.ArgumentOutOfRangeError();
        }
      }
      TakeLastOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.total));
      };
      return TakeLastOperator;
    })();
    var a = (function(e) {
      n(TakeLastSubscriber, e);
      function TakeLastSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.total = r;
        n.ring = new Array();
        n.count = 0;
        return n;
      }
      TakeLastSubscriber.prototype._next = function(e) {
        var t = this.ring;
        var r = this.total;
        var n = this.count++;
        if (t.length < r) {
          t.push(e);
        } else {
          var i = n % r;
          t[i] = e;
        }
      };
      TakeLastSubscriber.prototype._complete = function() {
        var e = this.destination;
        var t = this.count;
        if (t > 0) {
          var r = this.count >= this.total ? this.total : this.count;
          var n = this.ring;
          for (var i = 0; i < r; i++) {
            var o = t++ % r;
            e.next(n[o]);
          }
        }
        e.complete();
      };
      return TakeLastSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(411);
    var i = r(844);
    var o = r(201);
    var s = r(802);
    function timeInterval(e) {
      if (e === void 0) {
        e = n.async;
      }
      return function(t) {
        return o.defer(function() {
          return t.pipe(
            i.scan(
              function(t, r) {
                var n = t.current;
                return { value: r, current: e.now(), last: n };
              },
              { current: e.now(), value: undefined, last: undefined }
            ),
            s.map(function(e) {
              var t = e.current,
                r = e.last,
                n = e.value;
              return new u(n, t - r);
            })
          );
        });
      };
    }
    t.timeInterval = timeInterval;
    var u = (function() {
      function TimeInterval(e, t) {
        this.value = e;
        this.interval = t;
      }
      return TimeInterval;
    })();
    t.TimeInterval = u;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    t.observable = (function() {
      return (
        (typeof Symbol === "function" && Symbol.observable) || "@@observable"
      );
    })();
  },
  function(e, t, r) {
    var n = r(363);
    var i = r(510);
    var o = r(763);
    var s = Function.bind;
    var u = s.bind(s);
    function bindApi(e, t, r) {
      var n = u(o, null).apply(null, r ? [t, r] : [t]);
      e.api = { remove: n };
      e.remove = n;
      ["before", "error", "after", "wrap"].forEach(function(n) {
        var o = r ? [t, n, r] : [t, n];
        e[n] = e.api[n] = u(i, null).apply(null, o);
      });
    }
    function HookSingular() {
      var e = "h";
      var t = { registry: {} };
      var r = n.bind(null, t, e);
      bindApi(r, t, e);
      return r;
    }
    function HookCollection() {
      var e = { registry: {} };
      var t = n.bind(null, e);
      bindApi(t, e);
      return t;
    }
    var a = false;
    function Hook() {
      if (!a) {
        console.warn(
          '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
        );
        a = true;
      }
      return HookCollection();
    }
    Hook.Singular = HookSingular.bind();
    Hook.Collection = HookCollection.bind();
    e.exports = Hook;
    e.exports.Hook = Hook;
    e.exports.Singular = Hook.Singular;
    e.exports.Collection = Hook.Collection;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    const n = r(47);
    e.exports = n();
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = hasFirstPage;
    const n = r(370);
    const i = r(577);
    function hasFirstPage(e) {
      n(
        `octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`
      );
      return i(e).first;
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(494);
    var i = r(96);
    function publishReplay(e, t, r, o) {
      if (r && typeof r !== "function") {
        o = r;
      }
      var s = typeof r === "function" ? r : undefined;
      var u = new n.ReplaySubject(e, t, o);
      return function(e) {
        return i.multicast(function() {
          return u;
        }, s)(e);
      };
    }
    t.publishReplay = publishReplay;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(553);
    function repeat(e) {
      if (e === void 0) {
        e = -1;
      }
      return function(t) {
        if (e === 0) {
          return o.empty();
        } else if (e < 0) {
          return t.lift(new s(-1, t));
        } else {
          return t.lift(new s(e - 1, t));
        }
      };
    }
    t.repeat = repeat;
    var s = (function() {
      function RepeatOperator(e, t) {
        this.count = e;
        this.source = t;
      }
      RepeatOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.count, this.source));
      };
      return RepeatOperator;
    })();
    var u = (function(e) {
      n(RepeatSubscriber, e);
      function RepeatSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.count = r;
        i.source = n;
        return i;
      }
      RepeatSubscriber.prototype.complete = function() {
        if (!this.isStopped) {
          var t = this,
            r = t.source,
            n = t.count;
          if (n === 0) {
            return e.prototype.complete.call(this);
          } else if (n > -1) {
            this.count = n - 1;
          }
          r.subscribe(this._unsubscribeAndRecycle());
        }
      };
      return RepeatSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(591);
    var o = r(565);
    var s = r(668);
    function mergeScan(e, t, r) {
      if (r === void 0) {
        r = Number.POSITIVE_INFINITY;
      }
      return function(n) {
        return n.lift(new u(e, t, r));
      };
    }
    t.mergeScan = mergeScan;
    var u = (function() {
      function MergeScanOperator(e, t, r) {
        this.accumulator = e;
        this.seed = t;
        this.concurrent = r;
      }
      MergeScanOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new a(e, this.accumulator, this.seed, this.concurrent)
        );
      };
      return MergeScanOperator;
    })();
    t.MergeScanOperator = u;
    var a = (function(e) {
      n(MergeScanSubscriber, e);
      function MergeScanSubscriber(t, r, n, i) {
        var o = e.call(this, t) || this;
        o.accumulator = r;
        o.acc = n;
        o.concurrent = i;
        o.hasValue = false;
        o.hasCompleted = false;
        o.buffer = [];
        o.active = 0;
        o.index = 0;
        return o;
      }
      MergeScanSubscriber.prototype._next = function(e) {
        if (this.active < this.concurrent) {
          var t = this.index++;
          var r = this.destination;
          var n = void 0;
          try {
            var i = this.accumulator;
            n = i(this.acc, e, t);
          } catch (e) {
            return r.error(e);
          }
          this.active++;
          this._innerSub(n, e, t);
        } else {
          this.buffer.push(e);
        }
      };
      MergeScanSubscriber.prototype._innerSub = function(e, t, r) {
        var n = new s.InnerSubscriber(this, t, r);
        var o = this.destination;
        o.add(n);
        var u = i.subscribeToResult(this, e, undefined, undefined, n);
        if (u !== n) {
          o.add(u);
        }
      };
      MergeScanSubscriber.prototype._complete = function() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
          if (this.hasValue === false) {
            this.destination.next(this.acc);
          }
          this.destination.complete();
        }
        this.unsubscribe();
      };
      MergeScanSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        var o = this.destination;
        this.acc = t;
        this.hasValue = true;
        o.next(t);
      };
      MergeScanSubscriber.prototype.notifyComplete = function(e) {
        var t = this.buffer;
        var r = this.destination;
        r.remove(e);
        this.active--;
        if (t.length > 0) {
          this._next(t.shift());
        } else if (this.active === 0 && this.hasCompleted) {
          if (this.hasValue === false) {
            this.destination.next(this.acc);
          }
          this.destination.complete();
        }
      };
      return MergeScanSubscriber;
    })(o.OuterSubscriber);
    t.MergeScanSubscriber = a;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function isPromise(e) {
      return (
        !!e && typeof e.subscribe !== "function" && typeof e.then === "function"
      );
    }
    t.isPromise = isPromise;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(411);
    var o = r(917);
    var s = r(114);
    var u = r(347);
    function delay(e, t) {
      if (t === void 0) {
        t = i.async;
      }
      var r = o.isDate(e);
      var n = r ? +e - t.now() : Math.abs(e);
      return function(e) {
        return e.lift(new a(n, t));
      };
    }
    t.delay = delay;
    var a = (function() {
      function DelayOperator(e, t) {
        this.delay = e;
        this.scheduler = t;
      }
      DelayOperator.prototype.call = function(e, t) {
        return t.subscribe(new c(e, this.delay, this.scheduler));
      };
      return DelayOperator;
    })();
    var c = (function(e) {
      n(DelaySubscriber, e);
      function DelaySubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.delay = r;
        i.scheduler = n;
        i.queue = [];
        i.active = false;
        i.errored = false;
        return i;
      }
      DelaySubscriber.dispatch = function(e) {
        var t = e.source;
        var r = t.queue;
        var n = e.scheduler;
        var i = e.destination;
        while (r.length > 0 && r[0].time - n.now() <= 0) {
          r.shift().notification.observe(i);
        }
        if (r.length > 0) {
          var o = Math.max(0, r[0].time - n.now());
          this.schedule(e, o);
        } else {
          this.unsubscribe();
          t.active = false;
        }
      };
      DelaySubscriber.prototype._schedule = function(e) {
        this.active = true;
        var t = this.destination;
        t.add(
          e.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this,
            destination: this.destination,
            scheduler: e
          })
        );
      };
      DelaySubscriber.prototype.scheduleNotification = function(e) {
        if (this.errored === true) {
          return;
        }
        var t = this.scheduler;
        var r = new p(t.now() + this.delay, e);
        this.queue.push(r);
        if (this.active === false) {
          this._schedule(t);
        }
      };
      DelaySubscriber.prototype._next = function(e) {
        this.scheduleNotification(u.Notification.createNext(e));
      };
      DelaySubscriber.prototype._error = function(e) {
        this.errored = true;
        this.queue = [];
        this.destination.error(e);
        this.unsubscribe();
      };
      DelaySubscriber.prototype._complete = function() {
        this.scheduleNotification(u.Notification.createComplete());
        this.unsubscribe();
      };
      return DelaySubscriber;
    })(s.Subscriber);
    var p = (function() {
      function DelayMessage(e, t) {
        this.time = e;
        this.notification = t;
      }
      return DelayMessage;
    })();
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    t.EMPTY = new n.Observable(function(e) {
      return e.complete();
    });
    function empty(e) {
      return e ? emptyScheduled(e) : t.EMPTY;
    }
    t.empty = empty;
    function emptyScheduled(e) {
      return new n.Observable(function(t) {
        return e.schedule(function() {
          return t.complete();
        });
      });
    }
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = hasPreviousPage;
    const n = r(370);
    const i = r(577);
    function hasPreviousPage(e) {
      n(
        `octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`
      );
      return i(e).prev;
    }
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(618);
    var o = r(114);
    function throwIfEmpty(e) {
      if (e === void 0) {
        e = defaultErrorFactory;
      }
      return function(t) {
        return t.lift(new s(e));
      };
    }
    t.throwIfEmpty = throwIfEmpty;
    var s = (function() {
      function ThrowIfEmptyOperator(e) {
        this.errorFactory = e;
      }
      ThrowIfEmptyOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.errorFactory));
      };
      return ThrowIfEmptyOperator;
    })();
    var u = (function(e) {
      n(ThrowIfEmptySubscriber, e);
      function ThrowIfEmptySubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.errorFactory = r;
        n.hasValue = false;
        return n;
      }
      ThrowIfEmptySubscriber.prototype._next = function(e) {
        this.hasValue = true;
        this.destination.next(e);
      };
      ThrowIfEmptySubscriber.prototype._complete = function() {
        if (!this.hasValue) {
          var e = void 0;
          try {
            e = this.errorFactory();
          } catch (t) {
            e = t;
          }
          this.destination.error(e);
        } else {
          return this.destination.complete();
        }
      };
      return ThrowIfEmptySubscriber;
    })(o.Subscriber);
    function defaultErrorFactory() {
      return new i.EmptyError();
    }
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(406);
    var i = r(400);
    function startWith() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = e[e.length - 1];
      if (i.isScheduler(r)) {
        e.pop();
        return function(t) {
          return n.concat(e, t, r);
        };
      } else {
        return function(t) {
          return n.concat(e, t);
        };
      }
    }
    t.startWith = startWith;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(33);
    var o = r(114);
    var s = r(312);
    var u = r(146);
    var a = r(165);
    var c = r(754);
    var p = (function(e) {
      n(SubjectSubscriber, e);
      function SubjectSubscriber(t) {
        var r = e.call(this, t) || this;
        r.destination = t;
        return r;
      }
      return SubjectSubscriber;
    })(o.Subscriber);
    t.SubjectSubscriber = p;
    var l = (function(e) {
      n(Subject, e);
      function Subject() {
        var t = e.call(this) || this;
        t.observers = [];
        t.closed = false;
        t.isStopped = false;
        t.hasError = false;
        t.thrownError = null;
        return t;
      }
      Subject.prototype[c.rxSubscriber] = function() {
        return new p(this);
      };
      Subject.prototype.lift = function(e) {
        var t = new d(this, this);
        t.operator = e;
        return t;
      };
      Subject.prototype.next = function(e) {
        if (this.closed) {
          throw new u.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
          var t = this.observers;
          var r = t.length;
          var n = t.slice();
          for (var i = 0; i < r; i++) {
            n[i].next(e);
          }
        }
      };
      Subject.prototype.error = function(e) {
        if (this.closed) {
          throw new u.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = e;
        this.isStopped = true;
        var t = this.observers;
        var r = t.length;
        var n = t.slice();
        for (var i = 0; i < r; i++) {
          n[i].error(e);
        }
        this.observers.length = 0;
      };
      Subject.prototype.complete = function() {
        if (this.closed) {
          throw new u.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var e = this.observers;
        var t = e.length;
        var r = e.slice();
        for (var n = 0; n < t; n++) {
          r[n].complete();
        }
        this.observers.length = 0;
      };
      Subject.prototype.unsubscribe = function() {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
      };
      Subject.prototype._trySubscribe = function(t) {
        if (this.closed) {
          throw new u.ObjectUnsubscribedError();
        } else {
          return e.prototype._trySubscribe.call(this, t);
        }
      };
      Subject.prototype._subscribe = function(e) {
        if (this.closed) {
          throw new u.ObjectUnsubscribedError();
        } else if (this.hasError) {
          e.error(this.thrownError);
          return s.Subscription.EMPTY;
        } else if (this.isStopped) {
          e.complete();
          return s.Subscription.EMPTY;
        } else {
          this.observers.push(e);
          return new a.SubjectSubscription(this, e);
        }
      };
      Subject.prototype.asObservable = function() {
        var e = new i.Observable();
        e.source = this;
        return e;
      };
      Subject.create = function(e, t) {
        return new d(e, t);
      };
      return Subject;
    })(i.Observable);
    t.Subject = l;
    var d = (function(e) {
      n(AnonymousSubject, e);
      function AnonymousSubject(t, r) {
        var n = e.call(this) || this;
        n.destination = t;
        n.source = r;
        return n;
      }
      AnonymousSubject.prototype.next = function(e) {
        var t = this.destination;
        if (t && t.next) {
          t.next(e);
        }
      };
      AnonymousSubject.prototype.error = function(e) {
        var t = this.destination;
        if (t && t.error) {
          this.destination.error(e);
        }
      };
      AnonymousSubject.prototype.complete = function() {
        var e = this.destination;
        if (e && e.complete) {
          this.destination.complete();
        }
      };
      AnonymousSubject.prototype._subscribe = function(e) {
        var t = this.source;
        if (t) {
          return this.source.subscribe(e);
        } else {
          return s.Subscription.EMPTY;
        }
      };
      return AnonymousSubject;
    })(l);
    t.AnonymousSubject = d;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = (function(e) {
      n(OuterSubscriber, e);
      function OuterSubscriber() {
        return (e !== null && e.apply(this, arguments)) || this;
      }
      OuterSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.destination.next(t);
      };
      OuterSubscriber.prototype.notifyError = function(e, t) {
        this.destination.error(e);
      };
      OuterSubscriber.prototype.notifyComplete = function(e) {
        this.destination.complete();
      };
      return OuterSubscriber;
    })(i.Subscriber);
    t.OuterSubscriber = o;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(216);
    var i = r(381);
    var o = r(435);
    var s = r(980);
    var u = r(388);
    var a = r(550);
    var c = r(994);
    var p = r(974);
    var l = r(522);
    t.subscribeTo = function(e) {
      if (!!e && typeof e[l.observable] === "function") {
        return s.subscribeToObservable(e);
      } else if (u.isArrayLike(e)) {
        return n.subscribeToArray(e);
      } else if (a.isPromise(e)) {
        return i.subscribeToPromise(e);
      } else if (!!e && typeof e[p.iterator] === "function") {
        return o.subscribeToIterable(e);
      } else {
        var t = c.isObject(e) ? "an invalid object" : "'" + e + "'";
        var r =
          "You provided " +
          t +
          " where a stream was expected." +
          " You can provide an Observable, Promise, Array, or Iterable.";
        throw new TypeError(r);
      }
    };
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(260);
    var o = r(634);
    var s = r(565);
    var u = r(591);
    function race() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      if (e.length === 1) {
        if (i.isArray(e[0])) {
          e = e[0];
        } else {
          return e[0];
        }
      }
      return o.fromArray(e, undefined).lift(new a());
    }
    t.race = race;
    var a = (function() {
      function RaceOperator() {}
      RaceOperator.prototype.call = function(e, t) {
        return t.subscribe(new c(e));
      };
      return RaceOperator;
    })();
    t.RaceOperator = a;
    var c = (function(e) {
      n(RaceSubscriber, e);
      function RaceSubscriber(t) {
        var r = e.call(this, t) || this;
        r.hasFirst = false;
        r.observables = [];
        r.subscriptions = [];
        return r;
      }
      RaceSubscriber.prototype._next = function(e) {
        this.observables.push(e);
      };
      RaceSubscriber.prototype._complete = function() {
        var e = this.observables;
        var t = e.length;
        if (t === 0) {
          this.destination.complete();
        } else {
          for (var r = 0; r < t && !this.hasFirst; r++) {
            var n = e[r];
            var i = u.subscribeToResult(this, n, n, r);
            if (this.subscriptions) {
              this.subscriptions.push(i);
            }
            this.add(i);
          }
          this.observables = null;
        }
      };
      RaceSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        if (!this.hasFirst) {
          this.hasFirst = true;
          for (var o = 0; o < this.subscriptions.length; o++) {
            if (o !== r) {
              var s = this.subscriptions[o];
              s.unsubscribe();
              this.remove(s);
            }
          }
          this.subscriptions = null;
        }
        this.destination.next(t);
      };
      return RaceSubscriber;
    })(s.OuterSubscriber);
    t.RaceSubscriber = c;
  },
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = (function() {
      function TimeoutErrorImpl() {
        Error.call(this);
        this.message = "Timeout has occurred";
        this.name = "TimeoutError";
        return this;
      }
      TimeoutErrorImpl.prototype = Object.create(Error.prototype);
      return TimeoutErrorImpl;
    })();
    t.TimeoutError = r;
  },
  ,
  ,
  function(e) {
    e.exports = getPageLinks;
    function getPageLinks(e) {
      e = e.link || e.headers.link || "";
      const t = {};
      e.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (e, r, n) => {
        t[n] = r;
      });
      return t;
    }
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(668);
    var s = r(591);
    function catchError(e) {
      return function catchErrorOperatorFunction(t) {
        var r = new u(e);
        var n = t.lift(r);
        return (r.caught = n);
      };
    }
    t.catchError = catchError;
    var u = (function() {
      function CatchOperator(e) {
        this.selector = e;
      }
      CatchOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.selector, this.caught));
      };
      return CatchOperator;
    })();
    var a = (function(e) {
      n(CatchSubscriber, e);
      function CatchSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.selector = r;
        i.caught = n;
        return i;
      }
      CatchSubscriber.prototype.error = function(t) {
        if (!this.isStopped) {
          var r = void 0;
          try {
            r = this.selector(t, this.caught);
          } catch (t) {
            e.prototype.error.call(this, t);
            return;
          }
          this._unsubscribeAndRecycle();
          var n = new o.InnerSubscriber(this, undefined, undefined);
          this.add(n);
          var i = s.subscribeToResult(this, r, undefined, undefined, n);
          if (i !== n) {
            this.add(i);
          }
        }
      };
      return CatchSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = octokitRestApiEndpoints;
    const n = r(705);
    function octokitRestApiEndpoints(e) {
      n.gitdata = n.git;
      n.authorization = n.oauthAuthorizations;
      n.pullRequests = n.pulls;
      e.registerEndpoints(n);
    }
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(668);
    var s = r(591);
    var u = r(802);
    var a = r(997);
    function switchMap(e, t) {
      if (typeof t === "function") {
        return function(r) {
          return r.pipe(
            switchMap(function(r, n) {
              return a.from(e(r, n)).pipe(
                u.map(function(e, i) {
                  return t(r, e, n, i);
                })
              );
            })
          );
        };
      }
      return function(t) {
        return t.lift(new c(e));
      };
    }
    t.switchMap = switchMap;
    var c = (function() {
      function SwitchMapOperator(e) {
        this.project = e;
      }
      SwitchMapOperator.prototype.call = function(e, t) {
        return t.subscribe(new p(e, this.project));
      };
      return SwitchMapOperator;
    })();
    var p = (function(e) {
      n(SwitchMapSubscriber, e);
      function SwitchMapSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.project = r;
        n.index = 0;
        return n;
      }
      SwitchMapSubscriber.prototype._next = function(e) {
        var t;
        var r = this.index++;
        try {
          t = this.project(e, r);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this._innerSub(t, e, r);
      };
      SwitchMapSubscriber.prototype._innerSub = function(e, t, r) {
        var n = this.innerSubscription;
        if (n) {
          n.unsubscribe();
        }
        var i = new o.InnerSubscriber(this, t, r);
        var u = this.destination;
        u.add(i);
        this.innerSubscription = s.subscribeToResult(
          this,
          e,
          undefined,
          undefined,
          i
        );
        if (this.innerSubscription !== i) {
          u.add(this.innerSubscription);
        }
      };
      SwitchMapSubscriber.prototype._complete = function() {
        var t = this.innerSubscription;
        if (!t || t.closed) {
          e.prototype._complete.call(this);
        }
        this.unsubscribe();
      };
      SwitchMapSubscriber.prototype._unsubscribe = function() {
        this.innerSubscription = null;
      };
      SwitchMapSubscriber.prototype.notifyComplete = function(t) {
        var r = this.destination;
        r.remove(t);
        this.innerSubscription = null;
        if (this.isStopped) {
          e.prototype._complete.call(this);
        }
      };
      SwitchMapSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.destination.next(t);
      };
      return SwitchMapSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(668);
    var i = r(568);
    var o = r(33);
    function subscribeToResult(e, t, r, s, u) {
      if (u === void 0) {
        u = new n.InnerSubscriber(e, r, s);
      }
      if (u.closed) {
        return undefined;
      }
      if (t instanceof o.Observable) {
        return t.subscribe(u);
      }
      return i.subscribeTo(t)(u);
    }
    t.subscribeToResult = subscribeToResult;
  },
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = (function() {
      function ArgumentOutOfRangeErrorImpl() {
        Error.call(this);
        this.message = "argument out of range";
        this.name = "ArgumentOutOfRangeError";
        return this;
      }
      ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
      return ArgumentOutOfRangeErrorImpl;
    })();
    t.ArgumentOutOfRangeError = r;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(411);
    var i = r(574);
    var o = r(268);
    var s = r(134);
    function timeout(e, t) {
      if (t === void 0) {
        t = n.async;
      }
      return o.timeoutWith(e, s.throwError(new i.TimeoutError()), t);
    }
    t.timeout = timeout;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function pairwise() {
      return function(e) {
        return e.lift(new o());
      };
    }
    t.pairwise = pairwise;
    var o = (function() {
      function PairwiseOperator() {}
      PairwiseOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e));
      };
      return PairwiseOperator;
    })();
    var s = (function(e) {
      n(PairwiseSubscriber, e);
      function PairwiseSubscriber(t) {
        var r = e.call(this, t) || this;
        r.hasPrev = false;
        return r;
      }
      PairwiseSubscriber.prototype._next = function(e) {
        var t;
        if (this.hasPrev) {
          t = [this.prev, e];
        } else {
          this.hasPrev = true;
        }
        this.prev = e;
        if (t) {
          this.destination.next(t);
        }
      };
      return PairwiseSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  ,
  function(e) {
    e.exports = require("http");
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(419);
    function zip() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return function zipOperatorFunction(t) {
        return t.lift.call(n.zip.apply(void 0, [t].concat(e)));
      };
    }
    t.zip = zip;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(565);
    var s = r(591);
    function window(e) {
      return function windowOperatorFunction(t) {
        return t.lift(new u(e));
      };
    }
    t.window = window;
    var u = (function() {
      function WindowOperator(e) {
        this.windowBoundaries = e;
      }
      WindowOperator.prototype.call = function(e, t) {
        var r = new a(e);
        var n = t.subscribe(r);
        if (!n.closed) {
          r.add(s.subscribeToResult(r, this.windowBoundaries));
        }
        return n;
      };
      return WindowOperator;
    })();
    var a = (function(e) {
      n(WindowSubscriber, e);
      function WindowSubscriber(t) {
        var r = e.call(this, t) || this;
        r.window = new i.Subject();
        t.next(r.window);
        return r;
      }
      WindowSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.openWindow();
      };
      WindowSubscriber.prototype.notifyError = function(e, t) {
        this._error(e);
      };
      WindowSubscriber.prototype.notifyComplete = function(e) {
        this._complete();
      };
      WindowSubscriber.prototype._next = function(e) {
        this.window.next(e);
      };
      WindowSubscriber.prototype._error = function(e) {
        this.window.error(e);
        this.destination.error(e);
      };
      WindowSubscriber.prototype._complete = function() {
        this.window.complete();
        this.destination.complete();
      };
      WindowSubscriber.prototype._unsubscribe = function() {
        this.window = null;
      };
      WindowSubscriber.prototype.openWindow = function() {
        var e = this.window;
        if (e) {
          e.complete();
        }
        var t = this.destination;
        var r = (this.window = new i.Subject());
        t.next(r);
      };
      return WindowSubscriber;
    })(o.OuterSubscriber);
  },
  ,
  function(e, t, r) {
    const n = r(529);
    const i = [r(372), r(130), r(190), r(148), r(248), r(586), r(430), r(956)];
    e.exports = n.plugin(i);
  },
  function(e) {
    e.exports = require("events");
  },
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = (function() {
      function EmptyErrorImpl() {
        Error.call(this);
        this.message = "no elements in sequence";
        this.name = "EmptyError";
        return this;
      }
      EmptyErrorImpl.prototype = Object.create(Error.prototype);
      return EmptyErrorImpl;
    })();
    t.EmptyError = r;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(96);
    var i = r(781);
    var o = r(564);
    function shareSubjectFactory() {
      return new o.Subject();
    }
    function share() {
      return function(e) {
        return i.refCount()(n.multicast(shareSubjectFactory)(e));
      };
    }
    t.share = share;
  },
  function(e, t, r) {
    "use strict";
    const n = r(622);
    const i = r(39);
    e.exports = e => {
      e = Object.assign({ cwd: process.cwd(), path: process.env[i()] }, e);
      let t;
      let r = n.resolve(e.cwd);
      const o = [];
      while (t !== r) {
        o.push(n.join(r, "node_modules/.bin"));
        t = r;
        r = n.resolve(r, "..");
      }
      o.push(n.dirname(process.execPath));
      return o.concat(e.path).join(n.delimiter);
    };
    e.exports.env = t => {
      t = Object.assign({ env: process.env }, t);
      const r = Object.assign({}, t.env);
      const n = i({ env: r });
      t.path = r[n];
      r[n] = e.exports(t);
      return r;
    };
  },
  function(e) {
    e.exports = require("path");
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(860);
    function combineAll(e) {
      return function(t) {
        return t.lift(new n.CombineLatestOperator(e));
      };
    }
    t.combineAll = combineAll;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function sequenceEqual(e, t) {
      return function(r) {
        return r.lift(new o(e, t));
      };
    }
    t.sequenceEqual = sequenceEqual;
    var o = (function() {
      function SequenceEqualOperator(e, t) {
        this.compareTo = e;
        this.comparator = t;
      }
      SequenceEqualOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.compareTo, this.comparator));
      };
      return SequenceEqualOperator;
    })();
    t.SequenceEqualOperator = o;
    var s = (function(e) {
      n(SequenceEqualSubscriber, e);
      function SequenceEqualSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.compareTo = r;
        i.comparator = n;
        i._a = [];
        i._b = [];
        i._oneComplete = false;
        i.destination.add(r.subscribe(new u(t, i)));
        return i;
      }
      SequenceEqualSubscriber.prototype._next = function(e) {
        if (this._oneComplete && this._b.length === 0) {
          this.emit(false);
        } else {
          this._a.push(e);
          this.checkValues();
        }
      };
      SequenceEqualSubscriber.prototype._complete = function() {
        if (this._oneComplete) {
          this.emit(this._a.length === 0 && this._b.length === 0);
        } else {
          this._oneComplete = true;
        }
        this.unsubscribe();
      };
      SequenceEqualSubscriber.prototype.checkValues = function() {
        var e = this,
          t = e._a,
          r = e._b,
          n = e.comparator;
        while (t.length > 0 && r.length > 0) {
          var i = t.shift();
          var o = r.shift();
          var s = false;
          try {
            s = n ? n(i, o) : i === o;
          } catch (e) {
            this.destination.error(e);
          }
          if (!s) {
            this.emit(false);
          }
        }
      };
      SequenceEqualSubscriber.prototype.emit = function(e) {
        var t = this.destination;
        t.next(e);
        t.complete();
      };
      SequenceEqualSubscriber.prototype.nextB = function(e) {
        if (this._oneComplete && this._a.length === 0) {
          this.emit(false);
        } else {
          this._b.push(e);
          this.checkValues();
        }
      };
      SequenceEqualSubscriber.prototype.completeB = function() {
        if (this._oneComplete) {
          this.emit(this._a.length === 0 && this._b.length === 0);
        } else {
          this._oneComplete = true;
        }
      };
      return SequenceEqualSubscriber;
    })(i.Subscriber);
    t.SequenceEqualSubscriber = s;
    var u = (function(e) {
      n(SequenceEqualCompareToSubscriber, e);
      function SequenceEqualCompareToSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.parent = r;
        return n;
      }
      SequenceEqualCompareToSubscriber.prototype._next = function(e) {
        this.parent.nextB(e);
      };
      SequenceEqualCompareToSubscriber.prototype._error = function(e) {
        this.parent.error(e);
        this.unsubscribe();
      };
      SequenceEqualCompareToSubscriber.prototype._complete = function() {
        this.parent.completeB();
        this.unsubscribe();
      };
      return SequenceEqualCompareToSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(216);
    var o = r(942);
    function fromArray(e, t) {
      if (!t) {
        return new n.Observable(i.subscribeToArray(e));
      } else {
        return o.scheduleArray(e, t);
      }
    }
    t.fromArray = fromArray;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(17);
    var s = r(658);
    function tap(e, t, r) {
      return function tapOperatorFunction(n) {
        return n.lift(new u(e, t, r));
      };
    }
    t.tap = tap;
    var u = (function() {
      function DoOperator(e, t, r) {
        this.nextOrObserver = e;
        this.error = t;
        this.complete = r;
      }
      DoOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new a(e, this.nextOrObserver, this.error, this.complete)
        );
      };
      return DoOperator;
    })();
    var a = (function(e) {
      n(TapSubscriber, e);
      function TapSubscriber(t, r, n, i) {
        var u = e.call(this, t) || this;
        u._tapNext = o.noop;
        u._tapError = o.noop;
        u._tapComplete = o.noop;
        u._tapError = n || o.noop;
        u._tapComplete = i || o.noop;
        if (s.isFunction(r)) {
          u._context = u;
          u._tapNext = r;
        } else if (r) {
          u._context = r;
          u._tapNext = r.next || o.noop;
          u._tapError = r.error || o.noop;
          u._tapComplete = r.complete || o.noop;
        }
        return u;
      }
      TapSubscriber.prototype._next = function(e) {
        try {
          this._tapNext.call(this._context, e);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.destination.next(e);
      };
      TapSubscriber.prototype._error = function(e) {
        try {
          this._tapError.call(this._context, e);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.destination.error(e);
      };
      TapSubscriber.prototype._complete = function() {
        try {
          this._tapComplete.call(this._context);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        return this.destination.complete();
      };
      return TapSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(312);
    function finalize(e) {
      return function(t) {
        return t.lift(new s(e));
      };
    }
    t.finalize = finalize;
    var s = (function() {
      function FinallyOperator(e) {
        this.callback = e;
      }
      FinallyOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.callback));
      };
      return FinallyOperator;
    })();
    var u = (function(e) {
      n(FinallySubscriber, e);
      function FinallySubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.add(new o.Subscription(r));
        return n;
      }
      return FinallySubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    e.exports = getLastPage;
    const n = r(265);
    function getLastPage(e, t, r) {
      return n(e, t, "last", r);
    }
  },
  ,
  ,
  ,
  ,
  function(e) {
    e.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
    if (process.platform !== "win32") {
      e.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
      );
    }
    if (process.platform === "linux") {
      e.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
    }
  },
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function isFunction(e) {
      return typeof e === "function";
    }
    t.isFunction = isFunction;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function retry(e) {
      if (e === void 0) {
        e = -1;
      }
      return function(t) {
        return t.lift(new o(e, t));
      };
    }
    t.retry = retry;
    var o = (function() {
      function RetryOperator(e, t) {
        this.count = e;
        this.source = t;
      }
      RetryOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.count, this.source));
      };
      return RetryOperator;
    })();
    var s = (function(e) {
      n(RetrySubscriber, e);
      function RetrySubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.count = r;
        i.source = n;
        return i;
      }
      RetrySubscriber.prototype.error = function(t) {
        if (!this.isStopped) {
          var r = this,
            n = r.source,
            i = r.count;
          if (i === 0) {
            return e.prototype.error.call(this, t);
          } else if (i > -1) {
            this.count = i - 1;
          }
          n.subscribe(this._unsubscribeAndRecycle());
        }
      };
      return RetrySubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = (function(e) {
      n(InnerSubscriber, e);
      function InnerSubscriber(t, r, n) {
        var i = e.call(this) || this;
        i.parent = t;
        i.outerValue = r;
        i.outerIndex = n;
        i.index = 0;
        return i;
      }
      InnerSubscriber.prototype._next = function(e) {
        this.parent.notifyNext(
          this.outerValue,
          e,
          this.outerIndex,
          this.index++,
          this
        );
      };
      InnerSubscriber.prototype._error = function(e) {
        this.parent.notifyError(e, this);
        this.unsubscribe();
      };
      InnerSubscriber.prototype._complete = function() {
        this.parent.notifyComplete(this);
        this.unsubscribe();
      };
      return InnerSubscriber;
    })(i.Subscriber);
    t.InnerSubscriber = o;
  },
  function(e) {
    e.exports = require("util");
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = authenticate;
    const { Deprecation: n } = r(692);
    const i = r(969);
    const o = i((e, t) => e.warn(t));
    function authenticate(e, t) {
      o(
        e.octokit.log,
        new n(
          '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
        )
      );
      if (!t) {
        e.auth = false;
        return;
      }
      switch (t.type) {
        case "basic":
          if (!t.username || !t.password) {
            throw new Error(
              "Basic authentication requires both a username and password to be set"
            );
          }
          break;
        case "oauth":
          if (!t.token && !(t.key && t.secret)) {
            throw new Error(
              "OAuth2 authentication requires a token or key & secret to be set"
            );
          }
          break;
        case "token":
        case "app":
          if (!t.token) {
            throw new Error("Token authentication requires a token to be set");
          }
          break;
        default:
          throw new Error(
            "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
          );
      }
      e.auth = t;
    }
  },
  function(e) {
    e.exports = function btoa(e) {
      return new Buffer(e).toString("base64");
    };
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function sample(e) {
      return function(t) {
        return t.lift(new s(e));
      };
    }
    t.sample = sample;
    var s = (function() {
      function SampleOperator(e) {
        this.notifier = e;
      }
      SampleOperator.prototype.call = function(e, t) {
        var r = new u(e);
        var n = t.subscribe(r);
        n.add(o.subscribeToResult(r, this.notifier));
        return n;
      };
      return SampleOperator;
    })();
    var u = (function(e) {
      n(SampleSubscriber, e);
      function SampleSubscriber() {
        var t = (e !== null && e.apply(this, arguments)) || this;
        t.hasValue = false;
        return t;
      }
      SampleSubscriber.prototype._next = function(e) {
        this.value = e;
        this.hasValue = true;
      };
      SampleSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.emitValue();
      };
      SampleSubscriber.prototype.notifyComplete = function() {
        this.emitValue();
      };
      SampleSubscriber.prototype.emitValue = function() {
        if (this.hasValue) {
          this.hasValue = false;
          this.destination.next(this.value);
        }
      };
      return SampleSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(494);
    function shareReplay(e, t, r) {
      var n;
      if (e && typeof e === "object") {
        n = e;
      } else {
        n = { bufferSize: e, windowTime: t, refCount: false, scheduler: r };
      }
      return function(e) {
        return e.lift(shareReplayOperator(n));
      };
    }
    t.shareReplay = shareReplay;
    function shareReplayOperator(e) {
      var t = e.bufferSize,
        r = t === void 0 ? Number.POSITIVE_INFINITY : t,
        i = e.windowTime,
        o = i === void 0 ? Number.POSITIVE_INFINITY : i,
        s = e.refCount,
        u = e.scheduler;
      var a;
      var c = 0;
      var p;
      var l = false;
      var d = false;
      return function shareReplayOperation(e) {
        c++;
        if (!a || l) {
          l = false;
          a = new n.ReplaySubject(r, o, u);
          p = e.subscribe({
            next: function(e) {
              a.next(e);
            },
            error: function(e) {
              l = true;
              a.error(e);
            },
            complete: function() {
              d = true;
              p = undefined;
              a.complete();
            }
          });
        }
        var t = a.subscribe(this);
        this.add(function() {
          c--;
          t.unsubscribe();
          if (p && !d && s && c === 0) {
            p.unsubscribe();
            p = undefined;
            a = undefined;
          }
        });
      };
    }
  },
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    class Deprecation extends Error {
      constructor(e) {
        super(e);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "Deprecation";
      }
    }
    t.Deprecation = Deprecation;
  },
  ,
  ,
  ,
  function(e) {
    "use strict";
    function isObject(e) {
      return e != null && typeof e === "object" && Array.isArray(e) === false;
    }
    function isObjectObject(e) {
      return (
        isObject(e) === true &&
        Object.prototype.toString.call(e) === "[object Object]"
      );
    }
    function isPlainObject(e) {
      var t, r;
      if (isObjectObject(e) === false) return false;
      t = e.constructor;
      if (typeof t !== "function") return false;
      r = t.prototype;
      if (isObjectObject(r) === false) return false;
      if (r.hasOwnProperty("isPrototypeOf") === false) {
        return false;
      }
      return true;
    }
    e.exports = isPlainObject;
  },
  function(e) {
    "use strict";
    e.exports = (e, t) => {
      t = t || (() => {});
      return e.then(
        e =>
          new Promise(e => {
            e(t());
          }).then(() => e),
        e =>
          new Promise(e => {
            e(t());
          }).then(() => {
            throw e;
          })
      );
    };
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(827);
    function pipe() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return pipeFromArray(e);
    }
    t.pipe = pipe;
    function pipeFromArray(e) {
      if (e.length === 0) {
        return n.identity;
      }
      if (e.length === 1) {
        return e[0];
      }
      return function piped(t) {
        return e.reduce(function(e, t) {
          return t(e);
        }, t);
      };
    }
    t.pipeFromArray = pipeFromArray;
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(591);
    function distinct(e, t) {
      return function(r) {
        return r.lift(new s(e, t));
      };
    }
    t.distinct = distinct;
    var s = (function() {
      function DistinctOperator(e, t) {
        this.keySelector = e;
        this.flushes = t;
      }
      DistinctOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.keySelector, this.flushes));
      };
      return DistinctOperator;
    })();
    var u = (function(e) {
      n(DistinctSubscriber, e);
      function DistinctSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.keySelector = r;
        i.values = new Set();
        if (n) {
          i.add(o.subscribeToResult(i, n));
        }
        return i;
      }
      DistinctSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.values.clear();
      };
      DistinctSubscriber.prototype.notifyError = function(e, t) {
        this._error(e);
      };
      DistinctSubscriber.prototype._next = function(e) {
        if (this.keySelector) {
          this._useKeySelector(e);
        } else {
          this._finalizeNext(e, e);
        }
      };
      DistinctSubscriber.prototype._useKeySelector = function(e) {
        var t;
        var r = this.destination;
        try {
          t = this.keySelector(e);
        } catch (e) {
          r.error(e);
          return;
        }
        this._finalizeNext(t, e);
      };
      DistinctSubscriber.prototype._finalizeNext = function(e, t) {
        var r = this.values;
        if (!r.has(e)) {
          r.add(e);
          this.destination.next(t);
        }
      };
      return DistinctSubscriber;
    })(i.OuterSubscriber);
    t.DistinctSubscriber = u;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(565);
    var s = r(591);
    function repeatWhen(e) {
      return function(t) {
        return t.lift(new u(e));
      };
    }
    t.repeatWhen = repeatWhen;
    var u = (function() {
      function RepeatWhenOperator(e) {
        this.notifier = e;
      }
      RepeatWhenOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.notifier, t));
      };
      return RepeatWhenOperator;
    })();
    var a = (function(e) {
      n(RepeatWhenSubscriber, e);
      function RepeatWhenSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.notifier = r;
        i.source = n;
        i.sourceIsBeingSubscribedTo = true;
        return i;
      }
      RepeatWhenSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
      };
      RepeatWhenSubscriber.prototype.notifyComplete = function(t) {
        if (this.sourceIsBeingSubscribedTo === false) {
          return e.prototype.complete.call(this);
        }
      };
      RepeatWhenSubscriber.prototype.complete = function() {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
          if (!this.retries) {
            this.subscribeToRetries();
          }
          if (!this.retriesSubscription || this.retriesSubscription.closed) {
            return e.prototype.complete.call(this);
          }
          this._unsubscribeAndRecycle();
          this.notifications.next();
        }
      };
      RepeatWhenSubscriber.prototype._unsubscribe = function() {
        var e = this,
          t = e.notifications,
          r = e.retriesSubscription;
        if (t) {
          t.unsubscribe();
          this.notifications = null;
        }
        if (r) {
          r.unsubscribe();
          this.retriesSubscription = null;
        }
        this.retries = null;
      };
      RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function() {
        var t = this._unsubscribe;
        this._unsubscribe = null;
        e.prototype._unsubscribeAndRecycle.call(this);
        this._unsubscribe = t;
        return this;
      };
      RepeatWhenSubscriber.prototype.subscribeToRetries = function() {
        this.notifications = new i.Subject();
        var t;
        try {
          var r = this.notifier;
          t = r(this.notifications);
        } catch (t) {
          return e.prototype.complete.call(this);
        }
        this.retries = t;
        this.retriesSubscription = s.subscribeToResult(this, t);
      };
      return RepeatWhenSubscriber;
    })(o.OuterSubscriber);
  },
  function(e) {
    e.exports = {
      activity: {
        checkStarringRepo: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/user/starred/:owner/:repo"
        },
        deleteRepoSubscription: {
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/subscription"
        },
        deleteThreadSubscription: {
          method: "DELETE",
          params: { thread_id: { required: true, type: "integer" } },
          url: "/notifications/threads/:thread_id/subscription"
        },
        getRepoSubscription: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/subscription"
        },
        getThread: {
          method: "GET",
          params: { thread_id: { required: true, type: "integer" } },
          url: "/notifications/threads/:thread_id"
        },
        getThreadSubscription: {
          method: "GET",
          params: { thread_id: { required: true, type: "integer" } },
          url: "/notifications/threads/:thread_id/subscription"
        },
        listEventsForOrg: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/events/orgs/:org"
        },
        listEventsForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/events"
        },
        listFeeds: { method: "GET", params: {}, url: "/feeds" },
        listNotifications: {
          method: "GET",
          params: {
            all: { type: "boolean" },
            before: { type: "string" },
            page: { type: "integer" },
            participating: { type: "boolean" },
            per_page: { type: "integer" },
            since: { type: "string" }
          },
          url: "/notifications"
        },
        listNotificationsForRepo: {
          method: "GET",
          params: {
            all: { type: "boolean" },
            before: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            participating: { type: "boolean" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            since: { type: "string" }
          },
          url: "/repos/:owner/:repo/notifications"
        },
        listPublicEvents: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/events"
        },
        listPublicEventsForOrg: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/events"
        },
        listPublicEventsForRepoNetwork: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/networks/:owner/:repo/events"
        },
        listPublicEventsForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/events/public"
        },
        listReceivedEventsForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/received_events"
        },
        listReceivedPublicEventsForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/received_events/public"
        },
        listRepoEvents: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/events"
        },
        listReposStarredByAuthenticatedUser: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            sort: { enum: ["created", "updated"], type: "string" }
          },
          url: "/user/starred"
        },
        listReposStarredByUser: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            sort: { enum: ["created", "updated"], type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/starred"
        },
        listReposWatchedByUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/subscriptions"
        },
        listStargazersForRepo: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/stargazers"
        },
        listWatchedReposForAuthenticatedUser: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/subscriptions"
        },
        listWatchersForRepo: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/subscribers"
        },
        markAsRead: {
          method: "PUT",
          params: { last_read_at: { type: "string" } },
          url: "/notifications"
        },
        markNotificationsAsReadForRepo: {
          method: "PUT",
          params: {
            last_read_at: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/notifications"
        },
        markThreadAsRead: {
          method: "PATCH",
          params: { thread_id: { required: true, type: "integer" } },
          url: "/notifications/threads/:thread_id"
        },
        setRepoSubscription: {
          method: "PUT",
          params: {
            ignored: { type: "boolean" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            subscribed: { type: "boolean" }
          },
          url: "/repos/:owner/:repo/subscription"
        },
        setThreadSubscription: {
          method: "PUT",
          params: {
            ignored: { type: "boolean" },
            thread_id: { required: true, type: "integer" }
          },
          url: "/notifications/threads/:thread_id/subscription"
        },
        starRepo: {
          method: "PUT",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/user/starred/:owner/:repo"
        },
        unstarRepo: {
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/user/starred/:owner/:repo"
        }
      },
      apps: {
        addRepoToInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "PUT",
          params: {
            installation_id: { required: true, type: "integer" },
            repository_id: { required: true, type: "integer" }
          },
          url:
            "/user/installations/:installation_id/repositories/:repository_id"
        },
        checkAccountIsAssociatedWithAny: {
          method: "GET",
          params: {
            account_id: { required: true, type: "integer" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/marketplace_listing/accounts/:account_id"
        },
        checkAccountIsAssociatedWithAnyStubbed: {
          method: "GET",
          params: {
            account_id: { required: true, type: "integer" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/marketplace_listing/stubbed/accounts/:account_id"
        },
        checkAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
          method: "GET",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        checkToken: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "POST",
          params: {
            access_token: { type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/token"
        },
        createContentAttachment: {
          headers: { accept: "application/vnd.github.corsair-preview+json" },
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            content_reference_id: { required: true, type: "integer" },
            title: { required: true, type: "string" }
          },
          url: "/content_references/:content_reference_id/attachments"
        },
        createFromManifest: {
          headers: { accept: "application/vnd.github.fury-preview+json" },
          method: "POST",
          params: { code: { required: true, type: "string" } },
          url: "/app-manifests/:code/conversions"
        },
        createInstallationToken: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "POST",
          params: {
            installation_id: { required: true, type: "integer" },
            permissions: { type: "object" },
            repository_ids: { type: "integer[]" }
          },
          url: "/app/installations/:installation_id/access_tokens"
        },
        deleteAuthorization: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "DELETE",
          params: {
            access_token: { type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/grant"
        },
        deleteInstallation: {
          headers: {
            accept:
              "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
          },
          method: "DELETE",
          params: { installation_id: { required: true, type: "integer" } },
          url: "/app/installations/:installation_id"
        },
        deleteToken: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "DELETE",
          params: {
            access_token: { type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/token"
        },
        findOrgInstallation: {
          deprecated:
            "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { org: { required: true, type: "string" } },
          url: "/orgs/:org/installation"
        },
        findRepoInstallation: {
          deprecated:
            "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/installation"
        },
        findUserInstallation: {
          deprecated:
            "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { username: { required: true, type: "string" } },
          url: "/users/:username/installation"
        },
        getAuthenticated: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {},
          url: "/app"
        },
        getBySlug: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { app_slug: { required: true, type: "string" } },
          url: "/apps/:app_slug"
        },
        getInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { installation_id: { required: true, type: "integer" } },
          url: "/app/installations/:installation_id"
        },
        getOrgInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { org: { required: true, type: "string" } },
          url: "/orgs/:org/installation"
        },
        getRepoInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/installation"
        },
        getUserInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { username: { required: true, type: "string" } },
          url: "/users/:username/installation"
        },
        listAccountsUserOrOrgOnPlan: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            plan_id: { required: true, type: "integer" },
            sort: { enum: ["created", "updated"], type: "string" }
          },
          url: "/marketplace_listing/plans/:plan_id/accounts"
        },
        listAccountsUserOrOrgOnPlanStubbed: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            plan_id: { required: true, type: "integer" },
            sort: { enum: ["created", "updated"], type: "string" }
          },
          url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
        },
        listInstallationReposForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            installation_id: { required: true, type: "integer" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/user/installations/:installation_id/repositories"
        },
        listInstallations: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/app/installations"
        },
        listInstallationsForAuthenticatedUser: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/installations"
        },
        listMarketplacePurchasesForAuthenticatedUser: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/marketplace_purchases"
        },
        listMarketplacePurchasesForAuthenticatedUserStubbed: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/marketplace_purchases/stubbed"
        },
        listPlans: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/marketplace_listing/plans"
        },
        listPlansStubbed: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/marketplace_listing/stubbed/plans"
        },
        listRepos: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/installation/repositories"
        },
        removeRepoFromInstallation: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "DELETE",
          params: {
            installation_id: { required: true, type: "integer" },
            repository_id: { required: true, type: "integer" }
          },
          url:
            "/user/installations/:installation_id/repositories/:repository_id"
        },
        resetAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
          method: "POST",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        resetToken: {
          headers: {
            accept: "application/vnd.github.doctor-strange-preview+json"
          },
          method: "PATCH",
          params: {
            access_token: { type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/token"
        },
        revokeAuthorizationForApplication: {
          deprecated:
            "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
          method: "DELETE",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
          deprecated:
            "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
          method: "DELETE",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/grants/:access_token"
        }
      },
      checks: {
        create: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "POST",
          params: {
            actions: { type: "object[]" },
            "actions[].description": { required: true, type: "string" },
            "actions[].identifier": { required: true, type: "string" },
            "actions[].label": { required: true, type: "string" },
            completed_at: { type: "string" },
            conclusion: {
              enum: [
                "success",
                "failure",
                "neutral",
                "cancelled",
                "timed_out",
                "action_required"
              ],
              type: "string"
            },
            details_url: { type: "string" },
            external_id: { type: "string" },
            head_sha: { required: true, type: "string" },
            name: { required: true, type: "string" },
            output: { type: "object" },
            "output.annotations": { type: "object[]" },
            "output.annotations[].annotation_level": {
              enum: ["notice", "warning", "failure"],
              required: true,
              type: "string"
            },
            "output.annotations[].end_column": { type: "integer" },
            "output.annotations[].end_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].message": { required: true, type: "string" },
            "output.annotations[].path": { required: true, type: "string" },
            "output.annotations[].raw_details": { type: "string" },
            "output.annotations[].start_column": { type: "integer" },
            "output.annotations[].start_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].title": { type: "string" },
            "output.images": { type: "object[]" },
            "output.images[].alt": { required: true, type: "string" },
            "output.images[].caption": { type: "string" },
            "output.images[].image_url": { required: true, type: "string" },
            "output.summary": { required: true, type: "string" },
            "output.text": { type: "string" },
            "output.title": { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            started_at: { type: "string" },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-runs"
        },
        createSuite: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "POST",
          params: {
            head_sha: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/check-suites"
        },
        get: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "GET",
          params: {
            check_run_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/check-runs/:check_run_id"
        },
        getSuite: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "GET",
          params: {
            check_suite_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/check-suites/:check_suite_id"
        },
        listAnnotations: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "GET",
          params: {
            check_run_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
        },
        listForRef: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "GET",
          params: {
            check_name: { type: "string" },
            filter: { enum: ["latest", "all"], type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/commits/:ref/check-runs"
        },
        listForSuite: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "GET",
          params: {
            check_name: { type: "string" },
            check_suite_id: { required: true, type: "integer" },
            filter: { enum: ["latest", "all"], type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
        },
        listSuitesForRef: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "GET",
          params: {
            app_id: { type: "integer" },
            check_name: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:ref/check-suites"
        },
        rerequestSuite: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "POST",
          params: {
            check_suite_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
        },
        setSuitesPreferences: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "PATCH",
          params: {
            auto_trigger_checks: { type: "object[]" },
            "auto_trigger_checks[].app_id": { required: true, type: "integer" },
            "auto_trigger_checks[].setting": {
              required: true,
              type: "boolean"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/check-suites/preferences"
        },
        update: {
          headers: { accept: "application/vnd.github.antiope-preview+json" },
          method: "PATCH",
          params: {
            actions: { type: "object[]" },
            "actions[].description": { required: true, type: "string" },
            "actions[].identifier": { required: true, type: "string" },
            "actions[].label": { required: true, type: "string" },
            check_run_id: { required: true, type: "integer" },
            completed_at: { type: "string" },
            conclusion: {
              enum: [
                "success",
                "failure",
                "neutral",
                "cancelled",
                "timed_out",
                "action_required"
              ],
              type: "string"
            },
            details_url: { type: "string" },
            external_id: { type: "string" },
            name: { type: "string" },
            output: { type: "object" },
            "output.annotations": { type: "object[]" },
            "output.annotations[].annotation_level": {
              enum: ["notice", "warning", "failure"],
              required: true,
              type: "string"
            },
            "output.annotations[].end_column": { type: "integer" },
            "output.annotations[].end_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].message": { required: true, type: "string" },
            "output.annotations[].path": { required: true, type: "string" },
            "output.annotations[].raw_details": { type: "string" },
            "output.annotations[].start_column": { type: "integer" },
            "output.annotations[].start_line": {
              required: true,
              type: "integer"
            },
            "output.annotations[].title": { type: "string" },
            "output.images": { type: "object[]" },
            "output.images[].alt": { required: true, type: "string" },
            "output.images[].caption": { type: "string" },
            "output.images[].image_url": { required: true, type: "string" },
            "output.summary": { required: true, type: "string" },
            "output.text": { type: "string" },
            "output.title": { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            started_at: { type: "string" },
            status: {
              enum: ["queued", "in_progress", "completed"],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/check-runs/:check_run_id"
        }
      },
      codesOfConduct: {
        getConductCode: {
          headers: {
            accept: "application/vnd.github.scarlet-witch-preview+json"
          },
          method: "GET",
          params: { key: { required: true, type: "string" } },
          url: "/codes_of_conduct/:key"
        },
        getForRepo: {
          headers: {
            accept: "application/vnd.github.scarlet-witch-preview+json"
          },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/community/code_of_conduct"
        },
        listConductCodes: {
          headers: {
            accept: "application/vnd.github.scarlet-witch-preview+json"
          },
          method: "GET",
          params: {},
          url: "/codes_of_conduct"
        }
      },
      emojis: { get: { method: "GET", params: {}, url: "/emojis" } },
      gists: {
        checkIsStarred: {
          method: "GET",
          params: { gist_id: { required: true, type: "string" } },
          url: "/gists/:gist_id/star"
        },
        create: {
          method: "POST",
          params: {
            description: { type: "string" },
            files: { required: true, type: "object" },
            "files.content": { type: "string" },
            public: { type: "boolean" }
          },
          url: "/gists"
        },
        createComment: {
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            gist_id: { required: true, type: "string" }
          },
          url: "/gists/:gist_id/comments"
        },
        delete: {
          method: "DELETE",
          params: { gist_id: { required: true, type: "string" } },
          url: "/gists/:gist_id"
        },
        deleteComment: {
          method: "DELETE",
          params: {
            comment_id: { required: true, type: "integer" },
            gist_id: { required: true, type: "string" }
          },
          url: "/gists/:gist_id/comments/:comment_id"
        },
        fork: {
          method: "POST",
          params: { gist_id: { required: true, type: "string" } },
          url: "/gists/:gist_id/forks"
        },
        get: {
          method: "GET",
          params: { gist_id: { required: true, type: "string" } },
          url: "/gists/:gist_id"
        },
        getComment: {
          method: "GET",
          params: {
            comment_id: { required: true, type: "integer" },
            gist_id: { required: true, type: "string" }
          },
          url: "/gists/:gist_id/comments/:comment_id"
        },
        getRevision: {
          method: "GET",
          params: {
            gist_id: { required: true, type: "string" },
            sha: { required: true, type: "string" }
          },
          url: "/gists/:gist_id/:sha"
        },
        list: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" }
          },
          url: "/gists"
        },
        listComments: {
          method: "GET",
          params: {
            gist_id: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/gists/:gist_id/comments"
        },
        listCommits: {
          method: "GET",
          params: {
            gist_id: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/gists/:gist_id/commits"
        },
        listForks: {
          method: "GET",
          params: {
            gist_id: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/gists/:gist_id/forks"
        },
        listPublic: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" }
          },
          url: "/gists/public"
        },
        listPublicForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/gists"
        },
        listStarred: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" }
          },
          url: "/gists/starred"
        },
        star: {
          method: "PUT",
          params: { gist_id: { required: true, type: "string" } },
          url: "/gists/:gist_id/star"
        },
        unstar: {
          method: "DELETE",
          params: { gist_id: { required: true, type: "string" } },
          url: "/gists/:gist_id/star"
        },
        update: {
          method: "PATCH",
          params: {
            description: { type: "string" },
            files: { type: "object" },
            "files.content": { type: "string" },
            "files.filename": { type: "string" },
            gist_id: { required: true, type: "string" }
          },
          url: "/gists/:gist_id"
        },
        updateComment: {
          method: "PATCH",
          params: {
            body: { required: true, type: "string" },
            comment_id: { required: true, type: "integer" },
            gist_id: { required: true, type: "string" }
          },
          url: "/gists/:gist_id/comments/:comment_id"
        }
      },
      git: {
        createBlob: {
          method: "POST",
          params: {
            content: { required: true, type: "string" },
            encoding: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/blobs"
        },
        createCommit: {
          method: "POST",
          params: {
            author: { type: "object" },
            "author.date": { type: "string" },
            "author.email": { type: "string" },
            "author.name": { type: "string" },
            committer: { type: "object" },
            "committer.date": { type: "string" },
            "committer.email": { type: "string" },
            "committer.name": { type: "string" },
            message: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            parents: { required: true, type: "string[]" },
            repo: { required: true, type: "string" },
            signature: { type: "string" },
            tree: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/commits"
        },
        createRef: {
          method: "POST",
          params: {
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/refs"
        },
        createTag: {
          method: "POST",
          params: {
            message: { required: true, type: "string" },
            object: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            tag: { required: true, type: "string" },
            tagger: { type: "object" },
            "tagger.date": { type: "string" },
            "tagger.email": { type: "string" },
            "tagger.name": { type: "string" },
            type: {
              enum: ["commit", "tree", "blob"],
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/git/tags"
        },
        createTree: {
          method: "POST",
          params: {
            base_tree: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            tree: { required: true, type: "object[]" },
            "tree[].content": { type: "string" },
            "tree[].mode": {
              enum: ["100644", "100755", "040000", "160000", "120000"],
              type: "string"
            },
            "tree[].path": { type: "string" },
            "tree[].sha": { allowNull: true, type: "string" },
            "tree[].type": { enum: ["blob", "tree", "commit"], type: "string" }
          },
          url: "/repos/:owner/:repo/git/trees"
        },
        deleteRef: {
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/refs/:ref"
        },
        getBlob: {
          method: "GET",
          params: {
            file_sha: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/blobs/:file_sha"
        },
        getCommit: {
          method: "GET",
          params: {
            commit_sha: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/commits/:commit_sha"
        },
        getRef: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/ref/:ref"
        },
        getTag: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            tag_sha: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/tags/:tag_sha"
        },
        getTree: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            recursive: { enum: ["1"], type: "integer" },
            repo: { required: true, type: "string" },
            tree_sha: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/trees/:tree_sha"
        },
        listMatchingRefs: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/matching-refs/:ref"
        },
        listRefs: {
          method: "GET",
          params: {
            namespace: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/refs/:namespace"
        },
        updateRef: {
          method: "PATCH",
          params: {
            force: { type: "boolean" },
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/git/refs/:ref"
        }
      },
      gitignore: {
        getTemplate: {
          method: "GET",
          params: { name: { required: true, type: "string" } },
          url: "/gitignore/templates/:name"
        },
        listTemplates: {
          method: "GET",
          params: {},
          url: "/gitignore/templates"
        }
      },
      interactions: {
        addOrUpdateRestrictionsForOrg: {
          headers: { accept: "application/vnd.github.sombra-preview+json" },
          method: "PUT",
          params: {
            limit: {
              enum: [
                "existing_users",
                "contributors_only",
                "collaborators_only"
              ],
              required: true,
              type: "string"
            },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/interaction-limits"
        },
        addOrUpdateRestrictionsForRepo: {
          headers: { accept: "application/vnd.github.sombra-preview+json" },
          method: "PUT",
          params: {
            limit: {
              enum: [
                "existing_users",
                "contributors_only",
                "collaborators_only"
              ],
              required: true,
              type: "string"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/interaction-limits"
        },
        getRestrictionsForOrg: {
          headers: { accept: "application/vnd.github.sombra-preview+json" },
          method: "GET",
          params: { org: { required: true, type: "string" } },
          url: "/orgs/:org/interaction-limits"
        },
        getRestrictionsForRepo: {
          headers: { accept: "application/vnd.github.sombra-preview+json" },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/interaction-limits"
        },
        removeRestrictionsForOrg: {
          headers: { accept: "application/vnd.github.sombra-preview+json" },
          method: "DELETE",
          params: { org: { required: true, type: "string" } },
          url: "/orgs/:org/interaction-limits"
        },
        removeRestrictionsForRepo: {
          headers: { accept: "application/vnd.github.sombra-preview+json" },
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/interaction-limits"
        }
      },
      issues: {
        addAssignees: {
          method: "POST",
          params: {
            assignees: { type: "string[]" },
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        addLabels: {
          method: "POST",
          params: {
            issue_number: { required: true, type: "integer" },
            labels: { required: true, type: "string[]" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        checkAssignee: {
          method: "GET",
          params: {
            assignee: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/assignees/:assignee"
        },
        create: {
          method: "POST",
          params: {
            assignee: { type: "string" },
            assignees: { type: "string[]" },
            body: { type: "string" },
            labels: { type: "string[]" },
            milestone: { type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            title: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues"
        },
        createComment: {
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        createLabel: {
          method: "POST",
          params: {
            color: { required: true, type: "string" },
            description: { type: "string" },
            name: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/labels"
        },
        createMilestone: {
          method: "POST",
          params: {
            description: { type: "string" },
            due_on: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            state: { enum: ["open", "closed"], type: "string" },
            title: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/milestones"
        },
        deleteComment: {
          method: "DELETE",
          params: {
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        deleteLabel: {
          method: "DELETE",
          params: {
            name: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/labels/:name"
        },
        deleteMilestone: {
          method: "DELETE",
          params: {
            milestone_number: { required: true, type: "integer" },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        get: {
          method: "GET",
          params: {
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number"
        },
        getComment: {
          method: "GET",
          params: {
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        getEvent: {
          method: "GET",
          params: {
            event_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/events/:event_id"
        },
        getLabel: {
          method: "GET",
          params: {
            name: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/labels/:name"
        },
        getMilestone: {
          method: "GET",
          params: {
            milestone_number: { required: true, type: "integer" },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number"
        },
        list: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            filter: {
              enum: ["assigned", "created", "mentioned", "subscribed", "all"],
              type: "string"
            },
            labels: { type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" },
            sort: { enum: ["created", "updated", "comments"], type: "string" },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/issues"
        },
        listAssignees: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/assignees"
        },
        listComments: {
          method: "GET",
          params: {
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            since: { type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/comments"
        },
        listCommentsForRepo: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            since: { type: "string" },
            sort: { enum: ["created", "updated"], type: "string" }
          },
          url: "/repos/:owner/:repo/issues/comments"
        },
        listEvents: {
          method: "GET",
          params: {
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/events"
        },
        listEventsForRepo: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/events"
        },
        listEventsForTimeline: {
          headers: {
            accept: "application/vnd.github.mockingbird-preview+json"
          },
          method: "GET",
          params: {
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/timeline"
        },
        listForAuthenticatedUser: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            filter: {
              enum: ["assigned", "created", "mentioned", "subscribed", "all"],
              type: "string"
            },
            labels: { type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" },
            sort: { enum: ["created", "updated", "comments"], type: "string" },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/user/issues"
        },
        listForOrg: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            filter: {
              enum: ["assigned", "created", "mentioned", "subscribed", "all"],
              type: "string"
            },
            labels: { type: "string" },
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" },
            sort: { enum: ["created", "updated", "comments"], type: "string" },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/orgs/:org/issues"
        },
        listForRepo: {
          method: "GET",
          params: {
            assignee: { type: "string" },
            creator: { type: "string" },
            direction: { enum: ["asc", "desc"], type: "string" },
            labels: { type: "string" },
            mentioned: { type: "string" },
            milestone: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            since: { type: "string" },
            sort: { enum: ["created", "updated", "comments"], type: "string" },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/repos/:owner/:repo/issues"
        },
        listLabelsForMilestone: {
          method: "GET",
          params: {
            milestone_number: { required: true, type: "integer" },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
        },
        listLabelsForRepo: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/labels"
        },
        listLabelsOnIssue: {
          method: "GET",
          params: {
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        listMilestonesForRepo: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            sort: { enum: ["due_on", "completeness"], type: "string" },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/repos/:owner/:repo/milestones"
        },
        lock: {
          method: "PUT",
          params: {
            issue_number: { required: true, type: "integer" },
            lock_reason: {
              enum: ["off-topic", "too heated", "resolved", "spam"],
              type: "string"
            },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        removeAssignees: {
          method: "DELETE",
          params: {
            assignees: { type: "string[]" },
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/assignees"
        },
        removeLabel: {
          method: "DELETE",
          params: {
            issue_number: { required: true, type: "integer" },
            name: { required: true, type: "string" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
        },
        removeLabels: {
          method: "DELETE",
          params: {
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        replaceLabels: {
          method: "PUT",
          params: {
            issue_number: { required: true, type: "integer" },
            labels: { type: "string[]" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/labels"
        },
        unlock: {
          method: "DELETE",
          params: {
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/lock"
        },
        update: {
          method: "PATCH",
          params: {
            assignee: { type: "string" },
            assignees: { type: "string[]" },
            body: { type: "string" },
            issue_number: { required: true, type: "integer" },
            labels: { type: "string[]" },
            milestone: { allowNull: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            state: { enum: ["open", "closed"], type: "string" },
            title: { type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number"
        },
        updateComment: {
          method: "PATCH",
          params: {
            body: { required: true, type: "string" },
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id"
        },
        updateLabel: {
          method: "PATCH",
          params: {
            color: { type: "string" },
            current_name: { required: true, type: "string" },
            description: { type: "string" },
            name: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/labels/:current_name"
        },
        updateMilestone: {
          method: "PATCH",
          params: {
            description: { type: "string" },
            due_on: { type: "string" },
            milestone_number: { required: true, type: "integer" },
            number: {
              alias: "milestone_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            state: { enum: ["open", "closed"], type: "string" },
            title: { type: "string" }
          },
          url: "/repos/:owner/:repo/milestones/:milestone_number"
        }
      },
      licenses: {
        get: {
          method: "GET",
          params: { license: { required: true, type: "string" } },
          url: "/licenses/:license"
        },
        getForRepo: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/license"
        },
        list: {
          deprecated:
            "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
          method: "GET",
          params: {},
          url: "/licenses"
        },
        listCommonlyUsed: { method: "GET", params: {}, url: "/licenses" }
      },
      markdown: {
        render: {
          method: "POST",
          params: {
            context: { type: "string" },
            mode: { enum: ["markdown", "gfm"], type: "string" },
            text: { required: true, type: "string" }
          },
          url: "/markdown"
        },
        renderRaw: {
          headers: { "content-type": "text/plain; charset=utf-8" },
          method: "POST",
          params: { data: { mapTo: "data", required: true, type: "string" } },
          url: "/markdown/raw"
        }
      },
      meta: { get: { method: "GET", params: {}, url: "/meta" } },
      migrations: {
        cancelImport: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/import"
        },
        deleteArchiveForAuthenticatedUser: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "DELETE",
          params: { migration_id: { required: true, type: "integer" } },
          url: "/user/migrations/:migration_id/archive"
        },
        deleteArchiveForOrg: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "DELETE",
          params: {
            migration_id: { required: true, type: "integer" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getArchiveForAuthenticatedUser: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "GET",
          params: { migration_id: { required: true, type: "integer" } },
          url: "/user/migrations/:migration_id/archive"
        },
        getArchiveForOrg: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "GET",
          params: {
            migration_id: { required: true, type: "integer" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/migrations/:migration_id/archive"
        },
        getCommitAuthors: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            since: { type: "string" }
          },
          url: "/repos/:owner/:repo/import/authors"
        },
        getImportProgress: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/import"
        },
        getLargeFiles: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/import/large_files"
        },
        getStatusForAuthenticatedUser: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "GET",
          params: { migration_id: { required: true, type: "integer" } },
          url: "/user/migrations/:migration_id"
        },
        getStatusForOrg: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "GET",
          params: {
            migration_id: { required: true, type: "integer" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/migrations/:migration_id"
        },
        listForAuthenticatedUser: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/migrations"
        },
        listForOrg: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/migrations"
        },
        mapCommitAuthor: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "PATCH",
          params: {
            author_id: { required: true, type: "integer" },
            email: { type: "string" },
            name: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/import/authors/:author_id"
        },
        setLfsPreference: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "PATCH",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            use_lfs: {
              enum: ["opt_in", "opt_out"],
              required: true,
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/import/lfs"
        },
        startForAuthenticatedUser: {
          method: "POST",
          params: {
            exclude_attachments: { type: "boolean" },
            lock_repositories: { type: "boolean" },
            repositories: { required: true, type: "string[]" }
          },
          url: "/user/migrations"
        },
        startForOrg: {
          method: "POST",
          params: {
            exclude_attachments: { type: "boolean" },
            lock_repositories: { type: "boolean" },
            org: { required: true, type: "string" },
            repositories: { required: true, type: "string[]" }
          },
          url: "/orgs/:org/migrations"
        },
        startImport: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "PUT",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            tfvc_project: { type: "string" },
            vcs: {
              enum: ["subversion", "git", "mercurial", "tfvc"],
              type: "string"
            },
            vcs_password: { type: "string" },
            vcs_url: { required: true, type: "string" },
            vcs_username: { type: "string" }
          },
          url: "/repos/:owner/:repo/import"
        },
        unlockRepoForAuthenticatedUser: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "DELETE",
          params: {
            migration_id: { required: true, type: "integer" },
            repo_name: { required: true, type: "string" }
          },
          url: "/user/migrations/:migration_id/repos/:repo_name/lock"
        },
        unlockRepoForOrg: {
          headers: { accept: "application/vnd.github.wyandotte-preview+json" },
          method: "DELETE",
          params: {
            migration_id: { required: true, type: "integer" },
            org: { required: true, type: "string" },
            repo_name: { required: true, type: "string" }
          },
          url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
        },
        updateImport: {
          headers: {
            accept: "application/vnd.github.barred-rock-preview+json"
          },
          method: "PATCH",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            vcs_password: { type: "string" },
            vcs_username: { type: "string" }
          },
          url: "/repos/:owner/:repo/import"
        }
      },
      oauthAuthorizations: {
        checkAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
          method: "GET",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        createAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
          method: "POST",
          params: {
            client_id: { type: "string" },
            client_secret: { type: "string" },
            fingerprint: { type: "string" },
            note: { required: true, type: "string" },
            note_url: { type: "string" },
            scopes: { type: "string[]" }
          },
          url: "/authorizations"
        },
        deleteAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
          method: "DELETE",
          params: { authorization_id: { required: true, type: "integer" } },
          url: "/authorizations/:authorization_id"
        },
        deleteGrant: {
          deprecated:
            "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
          method: "DELETE",
          params: { grant_id: { required: true, type: "integer" } },
          url: "/applications/grants/:grant_id"
        },
        getAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
          method: "GET",
          params: { authorization_id: { required: true, type: "integer" } },
          url: "/authorizations/:authorization_id"
        },
        getGrant: {
          deprecated:
            "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
          method: "GET",
          params: { grant_id: { required: true, type: "integer" } },
          url: "/applications/grants/:grant_id"
        },
        getOrCreateAuthorizationForApp: {
          deprecated:
            "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
          method: "PUT",
          params: {
            client_id: { required: true, type: "string" },
            client_secret: { required: true, type: "string" },
            fingerprint: { type: "string" },
            note: { type: "string" },
            note_url: { type: "string" },
            scopes: { type: "string[]" }
          },
          url: "/authorizations/clients/:client_id"
        },
        getOrCreateAuthorizationForAppAndFingerprint: {
          deprecated:
            "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
          method: "PUT",
          params: {
            client_id: { required: true, type: "string" },
            client_secret: { required: true, type: "string" },
            fingerprint: { required: true, type: "string" },
            note: { type: "string" },
            note_url: { type: "string" },
            scopes: { type: "string[]" }
          },
          url: "/authorizations/clients/:client_id/:fingerprint"
        },
        getOrCreateAuthorizationForAppFingerprint: {
          deprecated:
            "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
          method: "PUT",
          params: {
            client_id: { required: true, type: "string" },
            client_secret: { required: true, type: "string" },
            fingerprint: { required: true, type: "string" },
            note: { type: "string" },
            note_url: { type: "string" },
            scopes: { type: "string[]" }
          },
          url: "/authorizations/clients/:client_id/:fingerprint"
        },
        listAuthorizations: {
          deprecated:
            "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/authorizations"
        },
        listGrants: {
          deprecated:
            "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/applications/grants"
        },
        resetAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
          method: "POST",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        revokeAuthorizationForApplication: {
          deprecated:
            "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
          method: "DELETE",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/tokens/:access_token"
        },
        revokeGrantForApplication: {
          deprecated:
            "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
          method: "DELETE",
          params: {
            access_token: { required: true, type: "string" },
            client_id: { required: true, type: "string" }
          },
          url: "/applications/:client_id/grants/:access_token"
        },
        updateAuthorization: {
          deprecated:
            "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
          method: "PATCH",
          params: {
            add_scopes: { type: "string[]" },
            authorization_id: { required: true, type: "integer" },
            fingerprint: { type: "string" },
            note: { type: "string" },
            note_url: { type: "string" },
            remove_scopes: { type: "string[]" },
            scopes: { type: "string[]" }
          },
          url: "/authorizations/:authorization_id"
        }
      },
      orgs: {
        addOrUpdateMembership: {
          method: "PUT",
          params: {
            org: { required: true, type: "string" },
            role: { enum: ["admin", "member"], type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/memberships/:username"
        },
        blockUser: {
          method: "PUT",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/blocks/:username"
        },
        checkBlockedUser: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/blocks/:username"
        },
        checkMembership: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/members/:username"
        },
        checkPublicMembership: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/public_members/:username"
        },
        concealMembership: {
          method: "DELETE",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/public_members/:username"
        },
        convertMemberToOutsideCollaborator: {
          method: "PUT",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/outside_collaborators/:username"
        },
        createHook: {
          method: "POST",
          params: {
            active: { type: "boolean" },
            config: { required: true, type: "object" },
            "config.content_type": { type: "string" },
            "config.insecure_ssl": { type: "string" },
            "config.secret": { type: "string" },
            "config.url": { required: true, type: "string" },
            events: { type: "string[]" },
            name: { required: true, type: "string" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/hooks"
        },
        createInvitation: {
          method: "POST",
          params: {
            email: { type: "string" },
            invitee_id: { type: "integer" },
            org: { required: true, type: "string" },
            role: {
              enum: ["admin", "direct_member", "billing_manager"],
              type: "string"
            },
            team_ids: { type: "integer[]" }
          },
          url: "/orgs/:org/invitations"
        },
        deleteHook: {
          method: "DELETE",
          params: {
            hook_id: { required: true, type: "integer" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/hooks/:hook_id"
        },
        get: {
          method: "GET",
          params: { org: { required: true, type: "string" } },
          url: "/orgs/:org"
        },
        getHook: {
          method: "GET",
          params: {
            hook_id: { required: true, type: "integer" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/hooks/:hook_id"
        },
        getMembership: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/memberships/:username"
        },
        getMembershipForAuthenticatedUser: {
          method: "GET",
          params: { org: { required: true, type: "string" } },
          url: "/user/memberships/orgs/:org"
        },
        list: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" }
          },
          url: "/organizations"
        },
        listBlockedUsers: {
          method: "GET",
          params: { org: { required: true, type: "string" } },
          url: "/orgs/:org/blocks"
        },
        listForAuthenticatedUser: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/orgs"
        },
        listForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/orgs"
        },
        listHooks: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/hooks"
        },
        listInstallations: {
          headers: {
            accept: "application/vnd.github.machine-man-preview+json"
          },
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/installations"
        },
        listInvitationTeams: {
          method: "GET",
          params: {
            invitation_id: { required: true, type: "integer" },
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/invitations/:invitation_id/teams"
        },
        listMembers: {
          method: "GET",
          params: {
            filter: { enum: ["2fa_disabled", "all"], type: "string" },
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            role: { enum: ["all", "admin", "member"], type: "string" }
          },
          url: "/orgs/:org/members"
        },
        listMemberships: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            state: { enum: ["active", "pending"], type: "string" }
          },
          url: "/user/memberships/orgs"
        },
        listOutsideCollaborators: {
          method: "GET",
          params: {
            filter: { enum: ["2fa_disabled", "all"], type: "string" },
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/outside_collaborators"
        },
        listPendingInvitations: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/invitations"
        },
        listPublicMembers: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/public_members"
        },
        pingHook: {
          method: "POST",
          params: {
            hook_id: { required: true, type: "integer" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/hooks/:hook_id/pings"
        },
        publicizeMembership: {
          method: "PUT",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/public_members/:username"
        },
        removeMember: {
          method: "DELETE",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/members/:username"
        },
        removeMembership: {
          method: "DELETE",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/memberships/:username"
        },
        removeOutsideCollaborator: {
          method: "DELETE",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/outside_collaborators/:username"
        },
        unblockUser: {
          method: "DELETE",
          params: {
            org: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/orgs/:org/blocks/:username"
        },
        update: {
          method: "PATCH",
          params: {
            billing_email: { type: "string" },
            company: { type: "string" },
            default_repository_permission: {
              enum: ["read", "write", "admin", "none"],
              type: "string"
            },
            description: { type: "string" },
            email: { type: "string" },
            has_organization_projects: { type: "boolean" },
            has_repository_projects: { type: "boolean" },
            location: { type: "string" },
            members_allowed_repository_creation_type: {
              enum: ["all", "private", "none"],
              type: "string"
            },
            members_can_create_repositories: { type: "boolean" },
            name: { type: "string" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org"
        },
        updateHook: {
          method: "PATCH",
          params: {
            active: { type: "boolean" },
            config: { type: "object" },
            "config.content_type": { type: "string" },
            "config.insecure_ssl": { type: "string" },
            "config.secret": { type: "string" },
            "config.url": { required: true, type: "string" },
            events: { type: "string[]" },
            hook_id: { required: true, type: "integer" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/hooks/:hook_id"
        },
        updateMembership: {
          method: "PATCH",
          params: {
            org: { required: true, type: "string" },
            state: { enum: ["active"], required: true, type: "string" }
          },
          url: "/user/memberships/orgs/:org"
        }
      },
      projects: {
        addCollaborator: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "PUT",
          params: {
            permission: { enum: ["read", "write", "admin"], type: "string" },
            project_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/projects/:project_id/collaborators/:username"
        },
        createCard: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "POST",
          params: {
            column_id: { required: true, type: "integer" },
            content_id: { type: "integer" },
            content_type: { type: "string" },
            note: { type: "string" }
          },
          url: "/projects/columns/:column_id/cards"
        },
        createColumn: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "POST",
          params: {
            name: { required: true, type: "string" },
            project_id: { required: true, type: "integer" }
          },
          url: "/projects/:project_id/columns"
        },
        createForAuthenticatedUser: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "POST",
          params: {
            body: { type: "string" },
            name: { required: true, type: "string" }
          },
          url: "/user/projects"
        },
        createForOrg: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "POST",
          params: {
            body: { type: "string" },
            name: { required: true, type: "string" },
            org: { required: true, type: "string" }
          },
          url: "/orgs/:org/projects"
        },
        createForRepo: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "POST",
          params: {
            body: { type: "string" },
            name: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/projects"
        },
        delete: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "DELETE",
          params: { project_id: { required: true, type: "integer" } },
          url: "/projects/:project_id"
        },
        deleteCard: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "DELETE",
          params: { card_id: { required: true, type: "integer" } },
          url: "/projects/columns/cards/:card_id"
        },
        deleteColumn: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "DELETE",
          params: { column_id: { required: true, type: "integer" } },
          url: "/projects/columns/:column_id"
        },
        get: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            project_id: { required: true, type: "integer" }
          },
          url: "/projects/:project_id"
        },
        getCard: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: { card_id: { required: true, type: "integer" } },
          url: "/projects/columns/cards/:card_id"
        },
        getColumn: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: { column_id: { required: true, type: "integer" } },
          url: "/projects/columns/:column_id"
        },
        listCards: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            archived_state: {
              enum: ["all", "archived", "not_archived"],
              type: "string"
            },
            column_id: { required: true, type: "integer" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/projects/columns/:column_id/cards"
        },
        listCollaborators: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            affiliation: { enum: ["outside", "direct", "all"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            project_id: { required: true, type: "integer" }
          },
          url: "/projects/:project_id/collaborators"
        },
        listColumns: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            project_id: { required: true, type: "integer" }
          },
          url: "/projects/:project_id/columns"
        },
        listForOrg: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/orgs/:org/projects"
        },
        listForRepo: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/repos/:owner/:repo/projects"
        },
        listForUser: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            state: { enum: ["open", "closed", "all"], type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/projects"
        },
        moveCard: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "POST",
          params: {
            card_id: { required: true, type: "integer" },
            column_id: { type: "integer" },
            position: {
              required: true,
              type: "string",
              validation: "^(top|bottom|after:\\d+)$"
            }
          },
          url: "/projects/columns/cards/:card_id/moves"
        },
        moveColumn: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "POST",
          params: {
            column_id: { required: true, type: "integer" },
            position: {
              required: true,
              type: "string",
              validation: "^(first|last|after:\\d+)$"
            }
          },
          url: "/projects/columns/:column_id/moves"
        },
        removeCollaborator: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "DELETE",
          params: {
            project_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/projects/:project_id/collaborators/:username"
        },
        reviewUserPermissionLevel: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            project_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/projects/:project_id/collaborators/:username/permission"
        },
        update: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "PATCH",
          params: {
            body: { type: "string" },
            name: { type: "string" },
            organization_permission: { type: "string" },
            private: { type: "boolean" },
            project_id: { required: true, type: "integer" },
            state: { enum: ["open", "closed"], type: "string" }
          },
          url: "/projects/:project_id"
        },
        updateCard: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "PATCH",
          params: {
            archived: { type: "boolean" },
            card_id: { required: true, type: "integer" },
            note: { type: "string" }
          },
          url: "/projects/columns/cards/:card_id"
        },
        updateColumn: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "PATCH",
          params: {
            column_id: { required: true, type: "integer" },
            name: { required: true, type: "string" }
          },
          url: "/projects/columns/:column_id"
        }
      },
      pulls: {
        checkIfMerged: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        create: {
          method: "POST",
          params: {
            base: { required: true, type: "string" },
            body: { type: "string" },
            draft: { type: "boolean" },
            head: { required: true, type: "string" },
            maintainer_can_modify: { type: "boolean" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            title: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls"
        },
        createComment: {
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            commit_id: { required: true, type: "string" },
            in_reply_to: {
              deprecated: true,
              description:
                "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
              type: "integer"
            },
            line: { type: "integer" },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            path: { required: true, type: "string" },
            position: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            side: { enum: ["LEFT", "RIGHT"], type: "string" },
            start_line: { type: "integer" },
            start_side: { enum: ["LEFT", "RIGHT", "side"], type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createCommentReply: {
          deprecated:
            "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            commit_id: { required: true, type: "string" },
            in_reply_to: {
              deprecated: true,
              description:
                "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
              type: "integer"
            },
            line: { type: "integer" },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            path: { required: true, type: "string" },
            position: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            side: { enum: ["LEFT", "RIGHT"], type: "string" },
            start_line: { type: "integer" },
            start_side: { enum: ["LEFT", "RIGHT", "side"], type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        createFromIssue: {
          deprecated:
            "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
          method: "POST",
          params: {
            base: { required: true, type: "string" },
            draft: { type: "boolean" },
            head: { required: true, type: "string" },
            issue: { required: true, type: "integer" },
            maintainer_can_modify: { type: "boolean" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls"
        },
        createReview: {
          method: "POST",
          params: {
            body: { type: "string" },
            comments: { type: "object[]" },
            "comments[].body": { required: true, type: "string" },
            "comments[].path": { required: true, type: "string" },
            "comments[].position": { required: true, type: "integer" },
            commit_id: { type: "string" },
            event: {
              enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
              type: "string"
            },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        createReviewCommentReply: {
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
        },
        createReviewRequest: {
          method: "POST",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            reviewers: { type: "string[]" },
            team_reviewers: { type: "string[]" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        deleteComment: {
          method: "DELETE",
          params: {
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        deletePendingReview: {
          method: "DELETE",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            review_id: { required: true, type: "integer" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        deleteReviewRequest: {
          method: "DELETE",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            reviewers: { type: "string[]" },
            team_reviewers: { type: "string[]" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        dismissReview: {
          method: "PUT",
          params: {
            message: { required: true, type: "string" },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            review_id: { required: true, type: "integer" }
          },
          url:
            "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
        },
        get: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        getComment: {
          method: "GET",
          params: {
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        getCommentsForReview: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            review_id: { required: true, type: "integer" }
          },
          url:
            "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
        },
        getReview: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            review_id: { required: true, type: "integer" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        },
        list: {
          method: "GET",
          params: {
            base: { type: "string" },
            direction: { enum: ["asc", "desc"], type: "string" },
            head: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            sort: {
              enum: ["created", "updated", "popularity", "long-running"],
              type: "string"
            },
            state: { enum: ["open", "closed", "all"], type: "string" }
          },
          url: "/repos/:owner/:repo/pulls"
        },
        listComments: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            since: { type: "string" },
            sort: { enum: ["created", "updated"], type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/comments"
        },
        listCommentsForRepo: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            since: { type: "string" },
            sort: { enum: ["created", "updated"], type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/comments"
        },
        listCommits: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/commits"
        },
        listFiles: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/files"
        },
        listReviewRequests: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
        },
        listReviews: {
          method: "GET",
          params: {
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
        },
        merge: {
          method: "PUT",
          params: {
            commit_message: { type: "string" },
            commit_title: { type: "string" },
            merge_method: {
              enum: ["merge", "squash", "rebase"],
              type: "string"
            },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            sha: { type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/merge"
        },
        submitReview: {
          method: "POST",
          params: {
            body: { type: "string" },
            event: {
              enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
              required: true,
              type: "string"
            },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            review_id: { required: true, type: "integer" }
          },
          url:
            "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
        },
        update: {
          method: "PATCH",
          params: {
            base: { type: "string" },
            body: { type: "string" },
            maintainer_can_modify: { type: "boolean" },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            state: { enum: ["open", "closed"], type: "string" },
            title: { type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number"
        },
        updateBranch: {
          headers: { accept: "application/vnd.github.lydian-preview+json" },
          method: "PUT",
          params: {
            expected_head_sha: { type: "string" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
        },
        updateComment: {
          method: "PATCH",
          params: {
            body: { required: true, type: "string" },
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id"
        },
        updateReview: {
          method: "PUT",
          params: {
            body: { required: true, type: "string" },
            number: { alias: "pull_number", deprecated: true, type: "integer" },
            owner: { required: true, type: "string" },
            pull_number: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            review_id: { required: true, type: "integer" }
          },
          url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
        }
      },
      rateLimit: { get: { method: "GET", params: {}, url: "/rate_limit" } },
      reactions: {
        createForCommitComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_id: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              required: true,
              type: "string"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        createForIssue: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              required: true,
              type: "string"
            },
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        createForIssueComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_id: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              required: true,
              type: "string"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        createForPullRequestReviewComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_id: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              required: true,
              type: "string"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        createForTeamDiscussion: {
          headers: {
            accept:
              "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              required: true,
              type: "string"
            },
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        createForTeamDiscussionComment: {
          headers: {
            accept:
              "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
          },
          method: "POST",
          params: {
            comment_number: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              required: true,
              type: "string"
            },
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url:
            "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        },
        delete: {
          headers: {
            accept:
              "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
          },
          method: "DELETE",
          params: { reaction_id: { required: true, type: "integer" } },
          url: "/reactions/:reaction_id"
        },
        listForCommitComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_id: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              type: "string"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/comments/:comment_id/reactions"
        },
        listForIssue: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              type: "string"
            },
            issue_number: { required: true, type: "integer" },
            number: {
              alias: "issue_number",
              deprecated: true,
              type: "integer"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/:issue_number/reactions"
        },
        listForIssueComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_id: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              type: "string"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
        },
        listForPullRequestReviewComment: {
          headers: {
            accept: "application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_id: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              type: "string"
            },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
        },
        listForTeamDiscussion: {
          headers: {
            accept:
              "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              type: "string"
            },
            discussion_number: { required: true, type: "integer" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/discussions/:discussion_number/reactions"
        },
        listForTeamDiscussionComment: {
          headers: {
            accept:
              "application/vnd.github.echo-preview+json,application/vnd.github.squirrel-girl-preview+json"
          },
          method: "GET",
          params: {
            comment_number: { required: true, type: "integer" },
            content: {
              enum: [
                "+1",
                "-1",
                "laugh",
                "confused",
                "heart",
                "hooray",
                "rocket",
                "eyes"
              ],
              type: "string"
            },
            discussion_number: { required: true, type: "integer" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url:
            "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
        }
      },
      repos: {
        acceptInvitation: {
          method: "PATCH",
          params: { invitation_id: { required: true, type: "integer" } },
          url: "/user/repository_invitations/:invitation_id"
        },
        addCollaborator: {
          method: "PUT",
          params: {
            owner: { required: true, type: "string" },
            permission: { enum: ["pull", "push", "admin"], type: "string" },
            repo: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/collaborators/:username"
        },
        addDeployKey: {
          method: "POST",
          params: {
            key: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            read_only: { type: "boolean" },
            repo: { required: true, type: "string" },
            title: { type: "string" }
          },
          url: "/repos/:owner/:repo/keys"
        },
        addProtectedBranchAdminEnforcement: {
          method: "POST",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        addProtectedBranchAppRestrictions: {
          method: "POST",
          params: {
            apps: { mapTo: "data", required: true, type: "string[]" },
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        addProtectedBranchRequiredSignatures: {
          headers: { accept: "application/vnd.github.zzzax-preview+json" },
          method: "POST",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        addProtectedBranchRequiredStatusChecksContexts: {
          method: "POST",
          params: {
            branch: { required: true, type: "string" },
            contexts: { mapTo: "data", required: true, type: "string[]" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        addProtectedBranchTeamRestrictions: {
          method: "POST",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            teams: { mapTo: "data", required: true, type: "string[]" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        addProtectedBranchUserRestrictions: {
          method: "POST",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            users: { mapTo: "data", required: true, type: "string[]" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        checkCollaborator: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/collaborators/:username"
        },
        checkVulnerabilityAlerts: {
          headers: { accept: "application/vnd.github.dorian-preview+json" },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        compareCommits: {
          method: "GET",
          params: {
            base: { required: true, type: "string" },
            head: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/compare/:base...:head"
        },
        createCommitComment: {
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            commit_sha: { required: true, type: "string" },
            line: { type: "integer" },
            owner: { required: true, type: "string" },
            path: { type: "string" },
            position: { type: "integer" },
            repo: { required: true, type: "string" },
            sha: { alias: "commit_sha", deprecated: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        createDeployment: {
          method: "POST",
          params: {
            auto_merge: { type: "boolean" },
            description: { type: "string" },
            environment: { type: "string" },
            owner: { required: true, type: "string" },
            payload: { type: "string" },
            production_environment: { type: "boolean" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            required_contexts: { type: "string[]" },
            task: { type: "string" },
            transient_environment: { type: "boolean" }
          },
          url: "/repos/:owner/:repo/deployments"
        },
        createDeploymentStatus: {
          method: "POST",
          params: {
            auto_inactive: { type: "boolean" },
            deployment_id: { required: true, type: "integer" },
            description: { type: "string" },
            environment: {
              enum: ["production", "staging", "qa"],
              type: "string"
            },
            environment_url: { type: "string" },
            log_url: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            state: {
              enum: [
                "error",
                "failure",
                "inactive",
                "in_progress",
                "queued",
                "pending",
                "success"
              ],
              required: true,
              type: "string"
            },
            target_url: { type: "string" }
          },
          url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        createDispatchEvent: {
          headers: { accept: "application/vnd.github.everest-preview+json" },
          method: "POST",
          params: {
            client_payload: { type: "object" },
            event_type: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/dispatches"
        },
        createFile: {
          deprecated:
            "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
          method: "PUT",
          params: {
            author: { type: "object" },
            "author.email": { required: true, type: "string" },
            "author.name": { required: true, type: "string" },
            branch: { type: "string" },
            committer: { type: "object" },
            "committer.email": { required: true, type: "string" },
            "committer.name": { required: true, type: "string" },
            content: { required: true, type: "string" },
            message: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            path: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { type: "string" }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        createForAuthenticatedUser: {
          method: "POST",
          params: {
            allow_merge_commit: { type: "boolean" },
            allow_rebase_merge: { type: "boolean" },
            allow_squash_merge: { type: "boolean" },
            auto_init: { type: "boolean" },
            description: { type: "string" },
            gitignore_template: { type: "string" },
            has_issues: { type: "boolean" },
            has_projects: { type: "boolean" },
            has_wiki: { type: "boolean" },
            homepage: { type: "string" },
            is_template: { type: "boolean" },
            license_template: { type: "string" },
            name: { required: true, type: "string" },
            private: { type: "boolean" },
            team_id: { type: "integer" }
          },
          url: "/user/repos"
        },
        createFork: {
          method: "POST",
          params: {
            organization: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/forks"
        },
        createHook: {
          method: "POST",
          params: {
            active: { type: "boolean" },
            config: { required: true, type: "object" },
            "config.content_type": { type: "string" },
            "config.insecure_ssl": { type: "string" },
            "config.secret": { type: "string" },
            "config.url": { required: true, type: "string" },
            events: { type: "string[]" },
            name: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/hooks"
        },
        createInOrg: {
          method: "POST",
          params: {
            allow_merge_commit: { type: "boolean" },
            allow_rebase_merge: { type: "boolean" },
            allow_squash_merge: { type: "boolean" },
            auto_init: { type: "boolean" },
            description: { type: "string" },
            gitignore_template: { type: "string" },
            has_issues: { type: "boolean" },
            has_projects: { type: "boolean" },
            has_wiki: { type: "boolean" },
            homepage: { type: "string" },
            is_template: { type: "boolean" },
            license_template: { type: "string" },
            name: { required: true, type: "string" },
            org: { required: true, type: "string" },
            private: { type: "boolean" },
            team_id: { type: "integer" }
          },
          url: "/orgs/:org/repos"
        },
        createOrUpdateFile: {
          method: "PUT",
          params: {
            author: { type: "object" },
            "author.email": { required: true, type: "string" },
            "author.name": { required: true, type: "string" },
            branch: { type: "string" },
            committer: { type: "object" },
            "committer.email": { required: true, type: "string" },
            "committer.name": { required: true, type: "string" },
            content: { required: true, type: "string" },
            message: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            path: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { type: "string" }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        createRelease: {
          method: "POST",
          params: {
            body: { type: "string" },
            draft: { type: "boolean" },
            name: { type: "string" },
            owner: { required: true, type: "string" },
            prerelease: { type: "boolean" },
            repo: { required: true, type: "string" },
            tag_name: { required: true, type: "string" },
            target_commitish: { type: "string" }
          },
          url: "/repos/:owner/:repo/releases"
        },
        createStatus: {
          method: "POST",
          params: {
            context: { type: "string" },
            description: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { required: true, type: "string" },
            state: {
              enum: ["error", "failure", "pending", "success"],
              required: true,
              type: "string"
            },
            target_url: { type: "string" }
          },
          url: "/repos/:owner/:repo/statuses/:sha"
        },
        createUsingTemplate: {
          headers: { accept: "application/vnd.github.baptiste-preview+json" },
          method: "POST",
          params: {
            description: { type: "string" },
            name: { required: true, type: "string" },
            owner: { type: "string" },
            private: { type: "boolean" },
            template_owner: { required: true, type: "string" },
            template_repo: { required: true, type: "string" }
          },
          url: "/repos/:template_owner/:template_repo/generate"
        },
        declineInvitation: {
          method: "DELETE",
          params: { invitation_id: { required: true, type: "integer" } },
          url: "/user/repository_invitations/:invitation_id"
        },
        delete: {
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo"
        },
        deleteCommitComment: {
          method: "DELETE",
          params: {
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/comments/:comment_id"
        },
        deleteDownload: {
          method: "DELETE",
          params: {
            download_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/downloads/:download_id"
        },
        deleteFile: {
          method: "DELETE",
          params: {
            author: { type: "object" },
            "author.email": { type: "string" },
            "author.name": { type: "string" },
            branch: { type: "string" },
            committer: { type: "object" },
            "committer.email": { type: "string" },
            "committer.name": { type: "string" },
            message: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            path: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        deleteHook: {
          method: "DELETE",
          params: {
            hook_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        deleteInvitation: {
          method: "DELETE",
          params: {
            invitation_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        deleteRelease: {
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            release_id: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/:release_id"
        },
        deleteReleaseAsset: {
          method: "DELETE",
          params: {
            asset_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        disableAutomatedSecurityFixes: {
          headers: { accept: "application/vnd.github.london-preview+json" },
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/automated-security-fixes"
        },
        disablePagesSite: {
          headers: { accept: "application/vnd.github.switcheroo-preview+json" },
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pages"
        },
        disableVulnerabilityAlerts: {
          headers: { accept: "application/vnd.github.dorian-preview+json" },
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        enableAutomatedSecurityFixes: {
          headers: { accept: "application/vnd.github.london-preview+json" },
          method: "PUT",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/automated-security-fixes"
        },
        enablePagesSite: {
          headers: { accept: "application/vnd.github.switcheroo-preview+json" },
          method: "POST",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            source: { type: "object" },
            "source.branch": { enum: ["master", "gh-pages"], type: "string" },
            "source.path": { type: "string" }
          },
          url: "/repos/:owner/:repo/pages"
        },
        enableVulnerabilityAlerts: {
          headers: { accept: "application/vnd.github.dorian-preview+json" },
          method: "PUT",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/vulnerability-alerts"
        },
        get: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo"
        },
        getAppsWithAccessToProtectedBranch: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        getArchiveLink: {
          method: "GET",
          params: {
            archive_format: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/:archive_format/:ref"
        },
        getBranch: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch"
        },
        getBranchProtection: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        getClones: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            per: { enum: ["day", "week"], type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/traffic/clones"
        },
        getCodeFrequencyStats: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/stats/code_frequency"
        },
        getCollaboratorPermissionLevel: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/collaborators/:username/permission"
        },
        getCombinedStatusForRef: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:ref/status"
        },
        getCommit: {
          method: "GET",
          params: {
            commit_sha: { alias: "ref", deprecated: true, type: "string" },
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { alias: "ref", deprecated: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:ref"
        },
        getCommitActivityStats: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/stats/commit_activity"
        },
        getCommitComment: {
          method: "GET",
          params: {
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/comments/:comment_id"
        },
        getCommitRefSha: {
          deprecated:
            "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
          headers: { accept: "application/vnd.github.v3.sha" },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:ref"
        },
        getContents: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            path: { required: true, type: "string" },
            ref: { type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        getContributorsStats: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/stats/contributors"
        },
        getDeployKey: {
          method: "GET",
          params: {
            key_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/keys/:key_id"
        },
        getDeployment: {
          method: "GET",
          params: {
            deployment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/deployments/:deployment_id"
        },
        getDeploymentStatus: {
          method: "GET",
          params: {
            deployment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            status_id: { required: true, type: "integer" }
          },
          url:
            "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
        },
        getDownload: {
          method: "GET",
          params: {
            download_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/downloads/:download_id"
        },
        getHook: {
          method: "GET",
          params: {
            hook_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        getLatestPagesBuild: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pages/builds/latest"
        },
        getLatestRelease: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/latest"
        },
        getPages: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pages"
        },
        getPagesBuild: {
          method: "GET",
          params: {
            build_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pages/builds/:build_id"
        },
        getParticipationStats: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/stats/participation"
        },
        getProtectedBranchAdminEnforcement: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        getProtectedBranchPullRequestReviewEnforcement: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        getProtectedBranchRequiredSignatures: {
          headers: { accept: "application/vnd.github.zzzax-preview+json" },
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        getProtectedBranchRequiredStatusChecks: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        getProtectedBranchRestrictions: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        getPunchCardStats: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/stats/punch_card"
        },
        getReadme: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            ref: { type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/readme"
        },
        getRelease: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            release_id: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/:release_id"
        },
        getReleaseAsset: {
          method: "GET",
          params: {
            asset_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        getReleaseByTag: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            tag: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/tags/:tag"
        },
        getTeamsWithAccessToProtectedBranch: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        getTopPaths: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/traffic/popular/paths"
        },
        getTopReferrers: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/traffic/popular/referrers"
        },
        getUsersWithAccessToProtectedBranch: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        getViews: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            per: { enum: ["day", "week"], type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/traffic/views"
        },
        list: {
          method: "GET",
          params: {
            affiliation: { type: "string" },
            direction: { enum: ["asc", "desc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            sort: {
              enum: ["created", "updated", "pushed", "full_name"],
              type: "string"
            },
            type: {
              enum: ["all", "owner", "public", "private", "member"],
              type: "string"
            },
            visibility: { enum: ["all", "public", "private"], type: "string" }
          },
          url: "/user/repos"
        },
        listAppsWithAccessToProtectedBranch: {
          deprecated:
            "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        listAssetsForRelease: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            release_id: { required: true, type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/:release_id/assets"
        },
        listBranches: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            protected: { type: "boolean" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches"
        },
        listBranchesForHeadCommit: {
          headers: { accept: "application/vnd.github.groot-preview+json" },
          method: "GET",
          params: {
            commit_sha: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
        },
        listCollaborators: {
          method: "GET",
          params: {
            affiliation: { enum: ["outside", "direct", "all"], type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/collaborators"
        },
        listCommentsForCommit: {
          method: "GET",
          params: {
            commit_sha: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            ref: { alias: "commit_sha", deprecated: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/comments"
        },
        listCommitComments: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/comments"
        },
        listCommits: {
          method: "GET",
          params: {
            author: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            path: { type: "string" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            sha: { type: "string" },
            since: { type: "string" },
            until: { type: "string" }
          },
          url: "/repos/:owner/:repo/commits"
        },
        listContributors: {
          method: "GET",
          params: {
            anon: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/contributors"
        },
        listDeployKeys: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/keys"
        },
        listDeploymentStatuses: {
          method: "GET",
          params: {
            deployment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
        },
        listDeployments: {
          method: "GET",
          params: {
            environment: { type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            ref: { type: "string" },
            repo: { required: true, type: "string" },
            sha: { type: "string" },
            task: { type: "string" }
          },
          url: "/repos/:owner/:repo/deployments"
        },
        listDownloads: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/downloads"
        },
        listForOrg: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            sort: {
              enum: ["created", "updated", "pushed", "full_name"],
              type: "string"
            },
            type: {
              enum: ["all", "public", "private", "forks", "sources", "member"],
              type: "string"
            }
          },
          url: "/orgs/:org/repos"
        },
        listForUser: {
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            sort: {
              enum: ["created", "updated", "pushed", "full_name"],
              type: "string"
            },
            type: { enum: ["all", "owner", "member"], type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/repos"
        },
        listForks: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" },
            sort: { enum: ["newest", "oldest", "stargazers"], type: "string" }
          },
          url: "/repos/:owner/:repo/forks"
        },
        listHooks: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/hooks"
        },
        listInvitations: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/invitations"
        },
        listInvitationsForAuthenticatedUser: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/repository_invitations"
        },
        listLanguages: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/languages"
        },
        listPagesBuilds: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pages/builds"
        },
        listProtectedBranchRequiredStatusChecksContexts: {
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        listProtectedBranchTeamRestrictions: {
          deprecated:
            "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listProtectedBranchUserRestrictions: {
          deprecated:
            "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        listPublic: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" }
          },
          url: "/repositories"
        },
        listPullRequestsAssociatedWithCommit: {
          headers: { accept: "application/vnd.github.groot-preview+json" },
          method: "GET",
          params: {
            commit_sha: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
        },
        listReleases: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases"
        },
        listStatusesForRef: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            ref: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/commits/:ref/statuses"
        },
        listTags: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/tags"
        },
        listTeams: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/teams"
        },
        listTeamsWithAccessToProtectedBranch: {
          deprecated:
            "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        listTopics: {
          headers: { accept: "application/vnd.github.mercy-preview+json" },
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/topics"
        },
        listUsersWithAccessToProtectedBranch: {
          deprecated:
            "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
          method: "GET",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        merge: {
          method: "POST",
          params: {
            base: { required: true, type: "string" },
            commit_message: { type: "string" },
            head: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/merges"
        },
        pingHook: {
          method: "POST",
          params: {
            hook_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id/pings"
        },
        removeBranchProtection: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        removeCollaborator: {
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/collaborators/:username"
        },
        removeDeployKey: {
          method: "DELETE",
          params: {
            key_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/keys/:key_id"
        },
        removeProtectedBranchAdminEnforcement: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
        },
        removeProtectedBranchAppRestrictions: {
          method: "DELETE",
          params: {
            apps: { mapTo: "data", required: true, type: "string[]" },
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        removeProtectedBranchPullRequestReviewEnforcement: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        removeProtectedBranchRequiredSignatures: {
          headers: { accept: "application/vnd.github.zzzax-preview+json" },
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
        },
        removeProtectedBranchRequiredStatusChecks: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        removeProtectedBranchRequiredStatusChecksContexts: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            contexts: { mapTo: "data", required: true, type: "string[]" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        removeProtectedBranchRestrictions: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
        },
        removeProtectedBranchTeamRestrictions: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            teams: { mapTo: "data", required: true, type: "string[]" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        removeProtectedBranchUserRestrictions: {
          method: "DELETE",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            users: { mapTo: "data", required: true, type: "string[]" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceProtectedBranchAppRestrictions: {
          method: "PUT",
          params: {
            apps: { mapTo: "data", required: true, type: "string[]" },
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
        },
        replaceProtectedBranchRequiredStatusChecksContexts: {
          method: "PUT",
          params: {
            branch: { required: true, type: "string" },
            contexts: { mapTo: "data", required: true, type: "string[]" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
        },
        replaceProtectedBranchTeamRestrictions: {
          method: "PUT",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            teams: { mapTo: "data", required: true, type: "string[]" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
        },
        replaceProtectedBranchUserRestrictions: {
          method: "PUT",
          params: {
            branch: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            users: { mapTo: "data", required: true, type: "string[]" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
        },
        replaceTopics: {
          headers: { accept: "application/vnd.github.mercy-preview+json" },
          method: "PUT",
          params: {
            names: { required: true, type: "string[]" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/topics"
        },
        requestPageBuild: {
          method: "POST",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/pages/builds"
        },
        retrieveCommunityProfileMetrics: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/community/profile"
        },
        testPushHook: {
          method: "POST",
          params: {
            hook_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id/tests"
        },
        transfer: {
          headers: { accept: "application/vnd.github.nightshade-preview+json" },
          method: "POST",
          params: {
            new_owner: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            team_ids: { type: "integer[]" }
          },
          url: "/repos/:owner/:repo/transfer"
        },
        update: {
          method: "PATCH",
          params: {
            allow_merge_commit: { type: "boolean" },
            allow_rebase_merge: { type: "boolean" },
            allow_squash_merge: { type: "boolean" },
            archived: { type: "boolean" },
            default_branch: { type: "string" },
            description: { type: "string" },
            has_issues: { type: "boolean" },
            has_projects: { type: "boolean" },
            has_wiki: { type: "boolean" },
            homepage: { type: "string" },
            is_template: { type: "boolean" },
            name: { type: "string" },
            owner: { required: true, type: "string" },
            private: { type: "boolean" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo"
        },
        updateBranchProtection: {
          method: "PUT",
          params: {
            branch: { required: true, type: "string" },
            enforce_admins: {
              allowNull: true,
              required: true,
              type: "boolean"
            },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            required_pull_request_reviews: {
              allowNull: true,
              required: true,
              type: "object"
            },
            "required_pull_request_reviews.dismiss_stale_reviews": {
              type: "boolean"
            },
            "required_pull_request_reviews.dismissal_restrictions": {
              type: "object"
            },
            "required_pull_request_reviews.dismissal_restrictions.teams": {
              type: "string[]"
            },
            "required_pull_request_reviews.dismissal_restrictions.users": {
              type: "string[]"
            },
            "required_pull_request_reviews.require_code_owner_reviews": {
              type: "boolean"
            },
            "required_pull_request_reviews.required_approving_review_count": {
              type: "integer"
            },
            required_status_checks: {
              allowNull: true,
              required: true,
              type: "object"
            },
            "required_status_checks.contexts": {
              required: true,
              type: "string[]"
            },
            "required_status_checks.strict": {
              required: true,
              type: "boolean"
            },
            restrictions: { allowNull: true, required: true, type: "object" },
            "restrictions.apps": { type: "string[]" },
            "restrictions.teams": { required: true, type: "string[]" },
            "restrictions.users": { required: true, type: "string[]" }
          },
          url: "/repos/:owner/:repo/branches/:branch/protection"
        },
        updateCommitComment: {
          method: "PATCH",
          params: {
            body: { required: true, type: "string" },
            comment_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/comments/:comment_id"
        },
        updateFile: {
          deprecated:
            "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
          method: "PUT",
          params: {
            author: { type: "object" },
            "author.email": { required: true, type: "string" },
            "author.name": { required: true, type: "string" },
            branch: { type: "string" },
            committer: { type: "object" },
            "committer.email": { required: true, type: "string" },
            "committer.name": { required: true, type: "string" },
            content: { required: true, type: "string" },
            message: { required: true, type: "string" },
            owner: { required: true, type: "string" },
            path: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            sha: { type: "string" }
          },
          url: "/repos/:owner/:repo/contents/:path"
        },
        updateHook: {
          method: "PATCH",
          params: {
            active: { type: "boolean" },
            add_events: { type: "string[]" },
            config: { type: "object" },
            "config.content_type": { type: "string" },
            "config.insecure_ssl": { type: "string" },
            "config.secret": { type: "string" },
            "config.url": { required: true, type: "string" },
            events: { type: "string[]" },
            hook_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            remove_events: { type: "string[]" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/hooks/:hook_id"
        },
        updateInformationAboutPagesSite: {
          method: "PUT",
          params: {
            cname: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            source: {
              enum: ['"gh-pages"', '"master"', '"master /docs"'],
              type: "string"
            }
          },
          url: "/repos/:owner/:repo/pages"
        },
        updateInvitation: {
          method: "PATCH",
          params: {
            invitation_id: { required: true, type: "integer" },
            owner: { required: true, type: "string" },
            permissions: { enum: ["read", "write", "admin"], type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/invitations/:invitation_id"
        },
        updateProtectedBranchPullRequestReviewEnforcement: {
          method: "PATCH",
          params: {
            branch: { required: true, type: "string" },
            dismiss_stale_reviews: { type: "boolean" },
            dismissal_restrictions: { type: "object" },
            "dismissal_restrictions.teams": { type: "string[]" },
            "dismissal_restrictions.users": { type: "string[]" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            require_code_owner_reviews: { type: "boolean" },
            required_approving_review_count: { type: "integer" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
        },
        updateProtectedBranchRequiredStatusChecks: {
          method: "PATCH",
          params: {
            branch: { required: true, type: "string" },
            contexts: { type: "string[]" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            strict: { type: "boolean" }
          },
          url:
            "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
        },
        updateRelease: {
          method: "PATCH",
          params: {
            body: { type: "string" },
            draft: { type: "boolean" },
            name: { type: "string" },
            owner: { required: true, type: "string" },
            prerelease: { type: "boolean" },
            release_id: { required: true, type: "integer" },
            repo: { required: true, type: "string" },
            tag_name: { type: "string" },
            target_commitish: { type: "string" }
          },
          url: "/repos/:owner/:repo/releases/:release_id"
        },
        updateReleaseAsset: {
          method: "PATCH",
          params: {
            asset_id: { required: true, type: "integer" },
            label: { type: "string" },
            name: { type: "string" },
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" }
          },
          url: "/repos/:owner/:repo/releases/assets/:asset_id"
        },
        uploadReleaseAsset: {
          method: "POST",
          params: {
            file: { mapTo: "data", required: true, type: "string | object" },
            headers: { required: true, type: "object" },
            "headers.content-length": { required: true, type: "integer" },
            "headers.content-type": { required: true, type: "string" },
            label: { type: "string" },
            name: { required: true, type: "string" },
            url: { required: true, type: "string" }
          },
          url: ":url"
        }
      },
      search: {
        code: {
          method: "GET",
          params: {
            order: { enum: ["desc", "asc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            q: { required: true, type: "string" },
            sort: { enum: ["indexed"], type: "string" }
          },
          url: "/search/code"
        },
        commits: {
          headers: { accept: "application/vnd.github.cloak-preview+json" },
          method: "GET",
          params: {
            order: { enum: ["desc", "asc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            q: { required: true, type: "string" },
            sort: { enum: ["author-date", "committer-date"], type: "string" }
          },
          url: "/search/commits"
        },
        issues: {
          deprecated:
            "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
          method: "GET",
          params: {
            order: { enum: ["desc", "asc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            q: { required: true, type: "string" },
            sort: {
              enum: [
                "comments",
                "reactions",
                "reactions-+1",
                "reactions--1",
                "reactions-smile",
                "reactions-thinking_face",
                "reactions-heart",
                "reactions-tada",
                "interactions",
                "created",
                "updated"
              ],
              type: "string"
            }
          },
          url: "/search/issues"
        },
        issuesAndPullRequests: {
          method: "GET",
          params: {
            order: { enum: ["desc", "asc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            q: { required: true, type: "string" },
            sort: {
              enum: [
                "comments",
                "reactions",
                "reactions-+1",
                "reactions--1",
                "reactions-smile",
                "reactions-thinking_face",
                "reactions-heart",
                "reactions-tada",
                "interactions",
                "created",
                "updated"
              ],
              type: "string"
            }
          },
          url: "/search/issues"
        },
        labels: {
          method: "GET",
          params: {
            order: { enum: ["desc", "asc"], type: "string" },
            q: { required: true, type: "string" },
            repository_id: { required: true, type: "integer" },
            sort: { enum: ["created", "updated"], type: "string" }
          },
          url: "/search/labels"
        },
        repos: {
          method: "GET",
          params: {
            order: { enum: ["desc", "asc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            q: { required: true, type: "string" },
            sort: {
              enum: ["stars", "forks", "help-wanted-issues", "updated"],
              type: "string"
            }
          },
          url: "/search/repositories"
        },
        topics: {
          method: "GET",
          params: { q: { required: true, type: "string" } },
          url: "/search/topics"
        },
        users: {
          method: "GET",
          params: {
            order: { enum: ["desc", "asc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            q: { required: true, type: "string" },
            sort: {
              enum: ["followers", "repositories", "joined"],
              type: "string"
            }
          },
          url: "/search/users"
        }
      },
      teams: {
        addMember: {
          deprecated:
            "octokit.teams.addMember() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member",
          method: "PUT",
          params: {
            team_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/teams/:team_id/members/:username"
        },
        addOrUpdateMembership: {
          method: "PUT",
          params: {
            role: { enum: ["member", "maintainer"], type: "string" },
            team_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        addOrUpdateProject: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "PUT",
          params: {
            permission: { enum: ["read", "write", "admin"], type: "string" },
            project_id: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        addOrUpdateRepo: {
          method: "PUT",
          params: {
            owner: { required: true, type: "string" },
            permission: { enum: ["pull", "push", "admin"], type: "string" },
            repo: { required: true, type: "string" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        checkManagesRepo: {
          method: "GET",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        create: {
          method: "POST",
          params: {
            description: { type: "string" },
            maintainers: { type: "string[]" },
            name: { required: true, type: "string" },
            org: { required: true, type: "string" },
            parent_team_id: { type: "integer" },
            permission: { enum: ["pull", "push", "admin"], type: "string" },
            privacy: { enum: ["secret", "closed"], type: "string" },
            repo_names: { type: "string[]" }
          },
          url: "/orgs/:org/teams"
        },
        createDiscussion: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            private: { type: "boolean" },
            team_id: { required: true, type: "integer" },
            title: { required: true, type: "string" }
          },
          url: "/teams/:team_id/discussions"
        },
        createDiscussionComment: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "POST",
          params: {
            body: { required: true, type: "string" },
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        delete: {
          method: "DELETE",
          params: { team_id: { required: true, type: "integer" } },
          url: "/teams/:team_id"
        },
        deleteDiscussion: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "DELETE",
          params: {
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        deleteDiscussionComment: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "DELETE",
          params: {
            comment_number: { required: true, type: "integer" },
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url:
            "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        get: {
          method: "GET",
          params: { team_id: { required: true, type: "integer" } },
          url: "/teams/:team_id"
        },
        getByName: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            team_slug: { required: true, type: "string" }
          },
          url: "/orgs/:org/teams/:team_slug"
        },
        getDiscussion: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "GET",
          params: {
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        getDiscussionComment: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "GET",
          params: {
            comment_number: { required: true, type: "integer" },
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url:
            "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        },
        getMember: {
          deprecated:
            "octokit.teams.getMember() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member",
          method: "GET",
          params: {
            team_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/teams/:team_id/members/:username"
        },
        getMembership: {
          method: "GET",
          params: {
            team_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        list: {
          method: "GET",
          params: {
            org: { required: true, type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" }
          },
          url: "/orgs/:org/teams"
        },
        listChild: {
          headers: { accept: "application/vnd.github.hellcat-preview+json" },
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/teams"
        },
        listDiscussionComments: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            discussion_number: { required: true, type: "integer" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/discussions/:discussion_number/comments"
        },
        listDiscussions: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "GET",
          params: {
            direction: { enum: ["asc", "desc"], type: "string" },
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/discussions"
        },
        listForAuthenticatedUser: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/teams"
        },
        listMembers: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            role: { enum: ["member", "maintainer", "all"], type: "string" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/members"
        },
        listPendingInvitations: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/invitations"
        },
        listProjects: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/projects"
        },
        listRepos: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/repos"
        },
        removeMember: {
          deprecated:
            "octokit.teams.removeMember() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member",
          method: "DELETE",
          params: {
            team_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/teams/:team_id/members/:username"
        },
        removeMembership: {
          method: "DELETE",
          params: {
            team_id: { required: true, type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/teams/:team_id/memberships/:username"
        },
        removeProject: {
          method: "DELETE",
          params: {
            project_id: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        removeRepo: {
          method: "DELETE",
          params: {
            owner: { required: true, type: "string" },
            repo: { required: true, type: "string" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/repos/:owner/:repo"
        },
        reviewProject: {
          headers: { accept: "application/vnd.github.inertia-preview+json" },
          method: "GET",
          params: {
            project_id: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id/projects/:project_id"
        },
        update: {
          method: "PATCH",
          params: {
            description: { type: "string" },
            name: { required: true, type: "string" },
            parent_team_id: { type: "integer" },
            permission: { enum: ["pull", "push", "admin"], type: "string" },
            privacy: { enum: ["secret", "closed"], type: "string" },
            team_id: { required: true, type: "integer" }
          },
          url: "/teams/:team_id"
        },
        updateDiscussion: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "PATCH",
          params: {
            body: { type: "string" },
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" },
            title: { type: "string" }
          },
          url: "/teams/:team_id/discussions/:discussion_number"
        },
        updateDiscussionComment: {
          headers: { accept: "application/vnd.github.echo-preview+json" },
          method: "PATCH",
          params: {
            body: { required: true, type: "string" },
            comment_number: { required: true, type: "integer" },
            discussion_number: { required: true, type: "integer" },
            team_id: { required: true, type: "integer" }
          },
          url:
            "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
        }
      },
      users: {
        addEmails: {
          method: "POST",
          params: { emails: { required: true, type: "string[]" } },
          url: "/user/emails"
        },
        block: {
          method: "PUT",
          params: { username: { required: true, type: "string" } },
          url: "/user/blocks/:username"
        },
        checkBlocked: {
          method: "GET",
          params: { username: { required: true, type: "string" } },
          url: "/user/blocks/:username"
        },
        checkFollowing: {
          method: "GET",
          params: { username: { required: true, type: "string" } },
          url: "/user/following/:username"
        },
        checkFollowingForUser: {
          method: "GET",
          params: {
            target_user: { required: true, type: "string" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/following/:target_user"
        },
        createGpgKey: {
          method: "POST",
          params: { armored_public_key: { type: "string" } },
          url: "/user/gpg_keys"
        },
        createPublicKey: {
          method: "POST",
          params: { key: { type: "string" }, title: { type: "string" } },
          url: "/user/keys"
        },
        deleteEmails: {
          method: "DELETE",
          params: { emails: { required: true, type: "string[]" } },
          url: "/user/emails"
        },
        deleteGpgKey: {
          method: "DELETE",
          params: { gpg_key_id: { required: true, type: "integer" } },
          url: "/user/gpg_keys/:gpg_key_id"
        },
        deletePublicKey: {
          method: "DELETE",
          params: { key_id: { required: true, type: "integer" } },
          url: "/user/keys/:key_id"
        },
        follow: {
          method: "PUT",
          params: { username: { required: true, type: "string" } },
          url: "/user/following/:username"
        },
        getAuthenticated: { method: "GET", params: {}, url: "/user" },
        getByUsername: {
          method: "GET",
          params: { username: { required: true, type: "string" } },
          url: "/users/:username"
        },
        getContextForUser: {
          headers: { accept: "application/vnd.github.hagar-preview+json" },
          method: "GET",
          params: {
            subject_id: { type: "string" },
            subject_type: {
              enum: ["organization", "repository", "issue", "pull_request"],
              type: "string"
            },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/hovercard"
        },
        getGpgKey: {
          method: "GET",
          params: { gpg_key_id: { required: true, type: "integer" } },
          url: "/user/gpg_keys/:gpg_key_id"
        },
        getPublicKey: {
          method: "GET",
          params: { key_id: { required: true, type: "integer" } },
          url: "/user/keys/:key_id"
        },
        list: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            since: { type: "string" }
          },
          url: "/users"
        },
        listBlocked: { method: "GET", params: {}, url: "/user/blocks" },
        listEmails: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/emails"
        },
        listFollowersForAuthenticatedUser: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/followers"
        },
        listFollowersForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/followers"
        },
        listFollowingForAuthenticatedUser: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/following"
        },
        listFollowingForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/following"
        },
        listGpgKeys: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/gpg_keys"
        },
        listGpgKeysForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/gpg_keys"
        },
        listPublicEmails: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/public_emails"
        },
        listPublicKeys: {
          method: "GET",
          params: { page: { type: "integer" }, per_page: { type: "integer" } },
          url: "/user/keys"
        },
        listPublicKeysForUser: {
          method: "GET",
          params: {
            page: { type: "integer" },
            per_page: { type: "integer" },
            username: { required: true, type: "string" }
          },
          url: "/users/:username/keys"
        },
        togglePrimaryEmailVisibility: {
          method: "PATCH",
          params: {
            email: { required: true, type: "string" },
            visibility: { required: true, type: "string" }
          },
          url: "/user/email/visibility"
        },
        unblock: {
          method: "DELETE",
          params: { username: { required: true, type: "string" } },
          url: "/user/blocks/:username"
        },
        unfollow: {
          method: "DELETE",
          params: { username: { required: true, type: "string" } },
          url: "/user/following/:username"
        },
        updateAuthenticated: {
          method: "PATCH",
          params: {
            bio: { type: "string" },
            blog: { type: "string" },
            company: { type: "string" },
            email: { type: "string" },
            hireable: { type: "boolean" },
            location: { type: "string" },
            name: { type: "string" }
          },
          url: "/user"
        }
      }
    };
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(844);
    var i = r(511);
    var o = r(758);
    var s = r(698);
    function reduce(e, t) {
      if (arguments.length >= 2) {
        return function reduceOperatorFunctionWithSeed(r) {
          return s.pipe(n.scan(e, t), i.takeLast(1), o.defaultIfEmpty(t))(r);
        };
      }
      return function reduceOperatorFunction(t) {
        return s.pipe(
          n.scan(function(t, r, n) {
            return e(t, r, n + 1);
          }),
          i.takeLast(1)
        )(t);
      };
    }
    t.reduce = reduce;
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(330);
    var i = r(981);
    function partition(e, t) {
      return function(r) {
        return [i.filter(e, t)(r), i.filter(n.not(e, t))(r)];
      };
    }
    t.partition = partition;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(312);
    var o = r(591);
    var s = r(565);
    function bufferToggle(e, t) {
      return function bufferToggleOperatorFunction(r) {
        return r.lift(new u(e, t));
      };
    }
    t.bufferToggle = bufferToggle;
    var u = (function() {
      function BufferToggleOperator(e, t) {
        this.openings = e;
        this.closingSelector = t;
      }
      BufferToggleOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.openings, this.closingSelector));
      };
      return BufferToggleOperator;
    })();
    var a = (function(e) {
      n(BufferToggleSubscriber, e);
      function BufferToggleSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.openings = r;
        i.closingSelector = n;
        i.contexts = [];
        i.add(o.subscribeToResult(i, r));
        return i;
      }
      BufferToggleSubscriber.prototype._next = function(e) {
        var t = this.contexts;
        var r = t.length;
        for (var n = 0; n < r; n++) {
          t[n].buffer.push(e);
        }
      };
      BufferToggleSubscriber.prototype._error = function(t) {
        var r = this.contexts;
        while (r.length > 0) {
          var n = r.shift();
          n.subscription.unsubscribe();
          n.buffer = null;
          n.subscription = null;
        }
        this.contexts = null;
        e.prototype._error.call(this, t);
      };
      BufferToggleSubscriber.prototype._complete = function() {
        var t = this.contexts;
        while (t.length > 0) {
          var r = t.shift();
          this.destination.next(r.buffer);
          r.subscription.unsubscribe();
          r.buffer = null;
          r.subscription = null;
        }
        this.contexts = null;
        e.prototype._complete.call(this);
      };
      BufferToggleSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        e ? this.closeBuffer(e) : this.openBuffer(t);
      };
      BufferToggleSubscriber.prototype.notifyComplete = function(e) {
        this.closeBuffer(e.context);
      };
      BufferToggleSubscriber.prototype.openBuffer = function(e) {
        try {
          var t = this.closingSelector;
          var r = t.call(this, e);
          if (r) {
            this.trySubscribe(r);
          }
        } catch (e) {
          this._error(e);
        }
      };
      BufferToggleSubscriber.prototype.closeBuffer = function(e) {
        var t = this.contexts;
        if (t && e) {
          var r = e.buffer,
            n = e.subscription;
          this.destination.next(r);
          t.splice(t.indexOf(e), 1);
          this.remove(n);
          n.unsubscribe();
        }
      };
      BufferToggleSubscriber.prototype.trySubscribe = function(e) {
        var t = this.contexts;
        var r = [];
        var n = new i.Subscription();
        var s = { buffer: r, subscription: n };
        t.push(s);
        var u = o.subscribeToResult(this, e, s);
        if (!u || u.closed) {
          this.closeBuffer(s);
        } else {
          u.context = s;
          this.add(u);
          n.add(u);
        }
      };
      return BufferToggleSubscriber;
    })(s.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(114);
    function canReportError(e) {
      while (e) {
        var t = e,
          r = t.closed,
          i = t.destination,
          o = t.isStopped;
        if (r || o) {
          return false;
        } else if (i && i instanceof n.Subscriber) {
          e = i;
        } else {
          e = null;
        }
      }
      return true;
    }
    t.canReportError = canReportError;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function isEmpty() {
      return function(e) {
        return e.lift(new o());
      };
    }
    t.isEmpty = isEmpty;
    var o = (function() {
      function IsEmptyOperator() {}
      IsEmptyOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e));
      };
      return IsEmptyOperator;
    })();
    var s = (function(e) {
      n(IsEmptySubscriber, e);
      function IsEmptySubscriber(t) {
        return e.call(this, t) || this;
      }
      IsEmptySubscriber.prototype.notifyComplete = function(e) {
        var t = this.destination;
        t.next(e);
        t.complete();
      };
      IsEmptySubscriber.prototype._next = function(e) {
        this.notifyComplete(false);
      };
      IsEmptySubscriber.prototype._complete = function() {
        this.notifyComplete(true);
      };
      return IsEmptySubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    var n = r(816);
    e.exports = function(e) {
      var t = e.match(n);
      if (!t) {
        return null;
      }
      var r = t[0].replace(/#! ?/, "").split(" ");
      var i = r[0].split("/").pop();
      var o = r[1];
      return i === "env" ? o : i + (o ? " " + o : "");
    };
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    var n = r(747);
    var i;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      i = r(818);
    } else {
      i = r(197);
    }
    e.exports = isexe;
    isexe.sync = sync;
    function isexe(e, t, r) {
      if (typeof t === "function") {
        r = t;
        t = {};
      }
      if (!r) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(r, n) {
          isexe(e, t || {}, function(e, t) {
            if (e) {
              n(e);
            } else {
              r(t);
            }
          });
        });
      }
      i(e, t || {}, function(e, n) {
        if (e) {
          if (e.code === "EACCES" || (t && t.ignoreErrors)) {
            e = null;
            n = false;
          }
        }
        r(e, n);
      });
    }
    function sync(e, t) {
      try {
        return i.sync(e, t || {});
      } catch (e) {
        if ((t && t.ignoreErrors) || e.code === "EACCES") {
          return false;
        } else {
          throw e;
        }
      }
    }
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(974);
    function isIterable(e) {
      return e && typeof e[n.iterator] === "function";
    }
    t.isIterable = isIterable;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(594);
    function skipLast(e) {
      return function(t) {
        return t.lift(new s(e));
      };
    }
    t.skipLast = skipLast;
    var s = (function() {
      function SkipLastOperator(e) {
        this._skipCount = e;
        if (this._skipCount < 0) {
          throw new o.ArgumentOutOfRangeError();
        }
      }
      SkipLastOperator.prototype.call = function(e, t) {
        if (this._skipCount === 0) {
          return t.subscribe(new i.Subscriber(e));
        } else {
          return t.subscribe(new u(e, this._skipCount));
        }
      };
      return SkipLastOperator;
    })();
    var u = (function(e) {
      n(SkipLastSubscriber, e);
      function SkipLastSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n._skipCount = r;
        n._count = 0;
        n._ring = new Array(r);
        return n;
      }
      SkipLastSubscriber.prototype._next = function(e) {
        var t = this._skipCount;
        var r = this._count++;
        if (r < t) {
          this._ring[r] = e;
        } else {
          var n = r % t;
          var i = this._ring;
          var o = i[n];
          i[n] = e;
          this.destination.next(o);
        }
      };
      return SkipLastSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(347);
    function observeOn(e, t) {
      if (t === void 0) {
        t = 0;
      }
      return function observeOnOperatorFunction(r) {
        return r.lift(new s(e, t));
      };
    }
    t.observeOn = observeOn;
    var s = (function() {
      function ObserveOnOperator(e, t) {
        if (t === void 0) {
          t = 0;
        }
        this.scheduler = e;
        this.delay = t;
      }
      ObserveOnOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.scheduler, this.delay));
      };
      return ObserveOnOperator;
    })();
    t.ObserveOnOperator = s;
    var u = (function(e) {
      n(ObserveOnSubscriber, e);
      function ObserveOnSubscriber(t, r, n) {
        if (n === void 0) {
          n = 0;
        }
        var i = e.call(this, t) || this;
        i.scheduler = r;
        i.delay = n;
        return i;
      }
      ObserveOnSubscriber.dispatch = function(e) {
        var t = e.notification,
          r = e.destination;
        t.observe(r);
        this.unsubscribe();
      };
      ObserveOnSubscriber.prototype.scheduleMessage = function(e) {
        var t = this.destination;
        t.add(
          this.scheduler.schedule(
            ObserveOnSubscriber.dispatch,
            this.delay,
            new a(e, this.destination)
          )
        );
      };
      ObserveOnSubscriber.prototype._next = function(e) {
        this.scheduleMessage(o.Notification.createNext(e));
      };
      ObserveOnSubscriber.prototype._error = function(e) {
        this.scheduleMessage(o.Notification.createError(e));
        this.unsubscribe();
      };
      ObserveOnSubscriber.prototype._complete = function() {
        this.scheduleMessage(o.Notification.createComplete());
        this.unsubscribe();
      };
      return ObserveOnSubscriber;
    })(i.Subscriber);
    t.ObserveOnSubscriber = u;
    var a = (function() {
      function ObserveOnMessage(e, t) {
        this.notification = e;
        this.destination = t;
      }
      return ObserveOnMessage;
    })();
    t.ObserveOnMessage = a;
  },
  ,
  function(e) {
    e.exports = require("fs");
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(347);
    function materialize() {
      return function materializeOperatorFunction(e) {
        return e.lift(new s());
      };
    }
    t.materialize = materialize;
    var s = (function() {
      function MaterializeOperator() {}
      MaterializeOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e));
      };
      return MaterializeOperator;
    })();
    var u = (function(e) {
      n(MaterializeSubscriber, e);
      function MaterializeSubscriber(t) {
        return e.call(this, t) || this;
      }
      MaterializeSubscriber.prototype._next = function(e) {
        this.destination.next(o.Notification.createNext(e));
      };
      MaterializeSubscriber.prototype._error = function(e) {
        var t = this.destination;
        t.next(o.Notification.createError(e));
        t.complete();
      };
      MaterializeSubscriber.prototype._complete = function() {
        var e = this.destination;
        e.next(o.Notification.createComplete());
        e.complete();
      };
      return MaterializeSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(406);
    var i = r(40);
    function endWith() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return function(t) {
        return n.concat(t, i.of.apply(void 0, e));
      };
    }
    t.endWith = endWith;
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function _interopDefault(e) {
      return e && typeof e === "object" && "default" in e ? e["default"] : e;
    }
    var n = r(385);
    var i = r(796);
    var o = _interopDefault(r(696));
    var s = _interopDefault(r(454));
    var u = r(463);
    const a = "5.3.1";
    function getBufferResponse(e) {
      return e.arrayBuffer();
    }
    function fetchWrapper(e) {
      if (o(e.body) || Array.isArray(e.body)) {
        e.body = JSON.stringify(e.body);
      }
      let t = {};
      let r;
      let n;
      const i = (e.request && e.request.fetch) || s;
      return i(
        e.url,
        Object.assign(
          {
            method: e.method,
            body: e.body,
            headers: e.headers,
            redirect: e.redirect
          },
          e.request
        )
      )
        .then(i => {
          n = i.url;
          r = i.status;
          for (const e of i.headers) {
            t[e[0]] = e[1];
          }
          if (r === 204 || r === 205) {
            return;
          }
          if (e.method === "HEAD") {
            if (r < 400) {
              return;
            }
            throw new u.RequestError(i.statusText, r, {
              headers: t,
              request: e
            });
          }
          if (r === 304) {
            throw new u.RequestError("Not modified", r, {
              headers: t,
              request: e
            });
          }
          if (r >= 400) {
            return i.text().then(n => {
              const i = new u.RequestError(n, r, { headers: t, request: e });
              try {
                let e = JSON.parse(i.message);
                Object.assign(i, e);
                let t = e.errors;
                i.message = i.message + ": " + t.map(JSON.stringify).join(", ");
              } catch (e) {}
              throw i;
            });
          }
          const o = i.headers.get("content-type");
          if (/application\/json/.test(o)) {
            return i.json();
          }
          if (!o || /^text\/|charset=utf-8$/.test(o)) {
            return i.text();
          }
          return getBufferResponse(i);
        })
        .then(e => {
          return { status: r, url: n, headers: t, data: e };
        })
        .catch(r => {
          if (r instanceof u.RequestError) {
            throw r;
          }
          throw new u.RequestError(r.message, 500, { headers: t, request: e });
        });
    }
    function withDefaults(e, t) {
      const r = e.defaults(t);
      const n = function(e, t) {
        const n = r.merge(e, t);
        if (!n.request || !n.request.hook) {
          return fetchWrapper(r.parse(n));
        }
        const i = (e, t) => {
          return fetchWrapper(r.parse(r.merge(e, t)));
        };
        Object.assign(i, { endpoint: r, defaults: withDefaults.bind(null, r) });
        return n.request.hook(i, n);
      };
      return Object.assign(n, {
        endpoint: r,
        defaults: withDefaults.bind(null, r)
      });
    }
    const c = withDefaults(n.endpoint, {
      headers: { "user-agent": `octokit-request.js/${a} ${i.getUserAgent()}` }
    });
    t.request = c;
  },
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    t.rxSubscriber = (function() {
      return typeof Symbol === "function"
        ? Symbol("rxSubscriber")
        : "@@rxSubscriber_" + Math.random();
    })();
    t.$$rxSubscriber = t.rxSubscriber;
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function defaultIfEmpty(e) {
      if (e === void 0) {
        e = null;
      }
      return function(t) {
        return t.lift(new o(e));
      };
    }
    t.defaultIfEmpty = defaultIfEmpty;
    var o = (function() {
      function DefaultIfEmptyOperator(e) {
        this.defaultValue = e;
      }
      DefaultIfEmptyOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.defaultValue));
      };
      return DefaultIfEmptyOperator;
    })();
    var s = (function(e) {
      n(DefaultIfEmptySubscriber, e);
      function DefaultIfEmptySubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.defaultValue = r;
        n.isEmpty = true;
        return n;
      }
      DefaultIfEmptySubscriber.prototype._next = function(e) {
        this.isEmpty = false;
        this.destination.next(e);
      };
      DefaultIfEmptySubscriber.prototype._complete = function() {
        if (this.isEmpty) {
          this.destination.next(this.defaultValue);
        }
        this.destination.complete();
      };
      return DefaultIfEmptySubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  function(e) {
    e.exports = require("zlib");
  },
  ,
  function(e) {
    e.exports = removeHook;
    function removeHook(e, t, r) {
      if (!e.registry[t]) {
        return;
      }
      var n = e.registry[t]
        .map(function(e) {
          return e.orig;
        })
        .indexOf(r);
      if (n === -1) {
        return;
      }
      e.registry[t].splice(n, 1);
    }
  },
  ,
  ,
  ,
  ,
  function(e) {
    "use strict";
    e.exports = function(e) {
      var t = typeof e === "string" ? "\n" : "\n".charCodeAt();
      var r = typeof e === "string" ? "\r" : "\r".charCodeAt();
      if (e[e.length - 1] === t) {
        e = e.slice(0, e.length - 1);
      }
      if (e[e.length - 1] === r) {
        e = e.slice(0, e.length - 1);
      }
      return e;
    };
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(907);
    function merge() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      return function(t) {
        return t.lift.call(n.merge.apply(void 0, [t].concat(e)));
      };
    }
    t.merge = merge;
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function takeWhile(e, t) {
      if (t === void 0) {
        t = false;
      }
      return function(r) {
        return r.lift(new o(e, t));
      };
    }
    t.takeWhile = takeWhile;
    var o = (function() {
      function TakeWhileOperator(e, t) {
        this.predicate = e;
        this.inclusive = t;
      }
      TakeWhileOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.predicate, this.inclusive));
      };
      return TakeWhileOperator;
    })();
    var s = (function(e) {
      n(TakeWhileSubscriber, e);
      function TakeWhileSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.predicate = r;
        i.inclusive = n;
        i.index = 0;
        return i;
      }
      TakeWhileSubscriber.prototype._next = function(e) {
        var t = this.destination;
        var r;
        try {
          r = this.predicate(e, this.index++);
        } catch (e) {
          t.error(e);
          return;
        }
        this.nextOrComplete(e, r);
      };
      TakeWhileSubscriber.prototype.nextOrComplete = function(e, t) {
        var r = this.destination;
        if (Boolean(t)) {
          r.next(e);
        } else {
          if (this.inclusive) {
            r.next(e);
          }
          r.complete();
        }
      };
      return TakeWhileSubscriber;
    })(i.Subscriber);
  },
  ,
  function(e, t, r) {
    e.exports = getFirstPage;
    const n = r(265);
    function getFirstPage(e, t, r) {
      return n(e, t, "first", r);
    }
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function refCount() {
      return function refCountOperatorFunction(e) {
        return e.lift(new o(e));
      };
    }
    t.refCount = refCount;
    var o = (function() {
      function RefCountOperator(e) {
        this.connectable = e;
      }
      RefCountOperator.prototype.call = function(e, t) {
        var r = this.connectable;
        r._refCount++;
        var n = new s(e, r);
        var i = t.subscribe(n);
        if (!n.closed) {
          n.connection = r.connect();
        }
        return i;
      };
      return RefCountOperator;
    })();
    var s = (function(e) {
      n(RefCountSubscriber, e);
      function RefCountSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.connectable = r;
        return n;
      }
      RefCountSubscriber.prototype._unsubscribe = function() {
        var e = this.connectable;
        if (!e) {
          this.connection = null;
          return;
        }
        this.connectable = null;
        var t = e._refCount;
        if (t <= 0) {
          this.connection = null;
          return;
        }
        e._refCount = t - 1;
        if (t > 1) {
          this.connection = null;
          return;
        }
        var r = this.connection;
        var n = e._connection;
        this.connection = null;
        if (n && (!r || n === r)) {
          n.unsubscribe();
        }
      };
      return RefCountSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = (function() {
      function Scheduler(e, t) {
        if (t === void 0) {
          t = Scheduler.now;
        }
        this.SchedulerAction = e;
        this.now = t;
      }
      Scheduler.prototype.schedule = function(e, t, r) {
        if (t === void 0) {
          t = 0;
        }
        return new this.SchedulerAction(this, e).schedule(r, t);
      };
      Scheduler.now = function() {
        return Date.now();
      };
      return Scheduler;
    })();
    t.Scheduler = r;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function _interopDefault(e) {
      return e && typeof e === "object" && "default" in e ? e["default"] : e;
    }
    var n = _interopDefault(r(2));
    function getUserAgent() {
      try {
        return `Node.js/${process.version.substr(1)} (${n()}; ${process.arch})`;
      } catch (e) {
        if (/wmic os get Caption/.test(e.message)) {
          return "Windows <version undetectable>";
        }
        throw e;
      }
    }
    t.getUserAgent = getUserAgent;
  },
  ,
  ,
  ,
  function(e, t, r) {
    var n = r(357);
    var i = r(654);
    var o = r(614);
    if (typeof o !== "function") {
      o = o.EventEmitter;
    }
    var s;
    if (process.__signal_exit_emitter__) {
      s = process.__signal_exit_emitter__;
    } else {
      s = process.__signal_exit_emitter__ = new o();
      s.count = 0;
      s.emitted = {};
    }
    if (!s.infinite) {
      s.setMaxListeners(Infinity);
      s.infinite = true;
    }
    e.exports = function(e, t) {
      n.equal(
        typeof e,
        "function",
        "a callback must be provided for exit handler"
      );
      if (a === false) {
        load();
      }
      var r = "exit";
      if (t && t.alwaysLast) {
        r = "afterexit";
      }
      var i = function() {
        s.removeListener(r, e);
        if (
          s.listeners("exit").length === 0 &&
          s.listeners("afterexit").length === 0
        ) {
          unload();
        }
      };
      s.on(r, e);
      return i;
    };
    e.exports.unload = unload;
    function unload() {
      if (!a) {
        return;
      }
      a = false;
      i.forEach(function(e) {
        try {
          process.removeListener(e, u[e]);
        } catch (e) {}
      });
      process.emit = p;
      process.reallyExit = c;
      s.count -= 1;
    }
    function emit(e, t, r) {
      if (s.emitted[e]) {
        return;
      }
      s.emitted[e] = true;
      s.emit(e, t, r);
    }
    var u = {};
    i.forEach(function(e) {
      u[e] = function listener() {
        var t = process.listeners(e);
        if (t.length === s.count) {
          unload();
          emit("exit", null, e);
          emit("afterexit", null, e);
          process.kill(process.pid, e);
        }
      };
    });
    e.exports.signals = function() {
      return i;
    };
    e.exports.load = load;
    var a = false;
    function load() {
      if (a) {
        return;
      }
      a = true;
      s.count += 1;
      i = i.filter(function(e) {
        try {
          process.on(e, u[e]);
          return true;
        } catch (e) {
          return false;
        }
      });
      process.emit = processEmit;
      process.reallyExit = processReallyExit;
    }
    var c = process.reallyExit;
    function processReallyExit(e) {
      process.exitCode = e || 0;
      emit("exit", process.exitCode, null);
      emit("afterexit", process.exitCode, null);
      c.call(process, process.exitCode);
    }
    var p = process.emit;
    function processEmit(e, t) {
      if (e === "exit") {
        if (t !== undefined) {
          process.exitCode = t;
        }
        var r = p.apply(this, arguments);
        emit("exit", process.exitCode, null);
        emit("afterexit", process.exitCode, null);
        return r;
      } else {
        return p.apply(this, arguments);
      }
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function map(e, t) {
      return function mapOperation(r) {
        if (typeof e !== "function") {
          throw new TypeError(
            "argument is not a function. Are you looking for `mapTo()`?"
          );
        }
        return r.lift(new o(e, t));
      };
    }
    t.map = map;
    var o = (function() {
      function MapOperator(e, t) {
        this.project = e;
        this.thisArg = t;
      }
      MapOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.project, this.thisArg));
      };
      return MapOperator;
    })();
    t.MapOperator = o;
    var s = (function(e) {
      n(MapSubscriber, e);
      function MapSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.project = r;
        i.count = 0;
        i.thisArg = n || i;
        return i;
      }
      MapSubscriber.prototype._next = function(e) {
        var t;
        try {
          t = this.project.call(this.thisArg, e, this.count++);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.destination.next(t);
      };
      return MapSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = paginate;
    const n = r(193);
    function paginate(e, t, r, i) {
      if (typeof r === "function") {
        i = r;
        r = undefined;
      }
      r = e.request.endpoint.merge(t, r);
      return gather(e, [], n(e, r)[Symbol.asyncIterator](), i);
    }
    function gather(e, t, r, n) {
      return r.next().then(i => {
        if (i.done) {
          return t;
        }
        let o = false;
        function done() {
          o = true;
        }
        t = t.concat(n ? n(i.value, done) : i.value.data);
        if (o) {
          return t;
        }
        return gather(e, t, r, n);
      });
    }
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = which;
    which.sync = whichSync;
    var n =
      process.platform === "win32" ||
      process.env.OSTYPE === "cygwin" ||
      process.env.OSTYPE === "msys";
    var i = r(622);
    var o = n ? ";" : ":";
    var s = r(742);
    function getNotFoundError(e) {
      var t = new Error("not found: " + e);
      t.code = "ENOENT";
      return t;
    }
    function getPathInfo(e, t) {
      var r = t.colon || o;
      var i = t.path || process.env.PATH || "";
      var s = [""];
      i = i.split(r);
      var u = "";
      if (n) {
        i.unshift(process.cwd());
        u = t.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM";
        s = u.split(r);
        if (e.indexOf(".") !== -1 && s[0] !== "") s.unshift("");
      }
      if (e.match(/\//) || (n && e.match(/\\/))) i = [""];
      return { env: i, ext: s, extExe: u };
    }
    function which(e, t, r) {
      if (typeof t === "function") {
        r = t;
        t = {};
      }
      var n = getPathInfo(e, t);
      var o = n.env;
      var u = n.ext;
      var a = n.extExe;
      var c = [];
      (function F(n, p) {
        if (n === p) {
          if (t.all && c.length) return r(null, c);
          else return r(getNotFoundError(e));
        }
        var l = o[n];
        if (l.charAt(0) === '"' && l.slice(-1) === '"') l = l.slice(1, -1);
        var d = i.join(l, e);
        if (!l && /^\.[\\\/]/.test(e)) {
          d = e.slice(0, 2) + d;
        }
        (function E(e, i) {
          if (e === i) return F(n + 1, p);
          var o = u[e];
          s(d + o, { pathExt: a }, function(n, s) {
            if (!n && s) {
              if (t.all) c.push(d + o);
              else return r(null, d + o);
            }
            return E(e + 1, i);
          });
        })(0, u.length);
      })(0, o.length);
    }
    function whichSync(e, t) {
      t = t || {};
      var r = getPathInfo(e, t);
      var n = r.env;
      var o = r.ext;
      var u = r.extExe;
      var a = [];
      for (var c = 0, p = n.length; c < p; c++) {
        var l = n[c];
        if (l.charAt(0) === '"' && l.slice(-1) === '"') l = l.slice(1, -1);
        var d = i.join(l, e);
        if (!l && /^\.[\\\/]/.test(e)) {
          d = e.slice(0, 2) + d;
        }
        for (var f = 0, h = o.length; f < h; f++) {
          var y = d + o[f];
          var b;
          try {
            b = s.sync(y, { pathExt: u });
            if (b) {
              if (t.all) a.push(y);
              else return y;
            }
          } catch (e) {}
        }
      }
      if (t.all && a.length) return a;
      if (t.nothrow) return null;
      throw getNotFoundError(e);
    }
  },
  ,
  function(e) {
    "use strict";
    e.exports = /^#!.*/;
  },
  ,
  function(e, t, r) {
    e.exports = isexe;
    isexe.sync = sync;
    var n = r(747);
    function checkPathExt(e, t) {
      var r = t.pathExt !== undefined ? t.pathExt : process.env.PATHEXT;
      if (!r) {
        return true;
      }
      r = r.split(";");
      if (r.indexOf("") !== -1) {
        return true;
      }
      for (var n = 0; n < r.length; n++) {
        var i = r[n].toLowerCase();
        if (i && e.substr(-i.length).toLowerCase() === i) {
          return true;
        }
      }
      return false;
    }
    function checkStat(e, t, r) {
      if (!e.isSymbolicLink() && !e.isFile()) {
        return false;
      }
      return checkPathExt(t, r);
    }
    function isexe(e, t, r) {
      n.stat(e, function(n, i) {
        r(n, n ? false : checkStat(i, e, t));
      });
    }
    function sync(e, t) {
      return checkStat(n.statSync(e), e, t);
    }
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(411);
    var o = r(154);
    var s = r(400);
    function timer(e, t, r) {
      if (e === void 0) {
        e = 0;
      }
      var u = -1;
      if (o.isNumeric(t)) {
        u = (Number(t) < 1 && 1) || Number(t);
      } else if (s.isScheduler(t)) {
        r = t;
      }
      if (!s.isScheduler(r)) {
        r = i.async;
      }
      return new n.Observable(function(t) {
        var n = o.isNumeric(e) ? e : +e - r.now();
        return r.schedule(dispatch, n, { index: 0, period: u, subscriber: t });
      });
    }
    t.timer = timer;
    function dispatch(e) {
      var t = e.index,
        r = e.period,
        n = e.subscriber;
      n.next(t);
      if (n.closed) {
        return;
      } else if (r === -1) {
        return n.complete();
      }
      e.index = t + 1;
      this.schedule(e, r);
    }
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(618);
    var i = r(981);
    var o = r(511);
    var s = r(559);
    var u = r(758);
    var a = r(827);
    function last(e, t) {
      var r = arguments.length >= 2;
      return function(c) {
        return c.pipe(
          e
            ? i.filter(function(t, r) {
                return e(t, r, c);
              })
            : a.identity,
          o.takeLast(1),
          r
            ? u.defaultIfEmpty(t)
            : s.throwIfEmpty(function() {
                return new n.EmptyError();
              })
        );
      };
    }
    t.last = last;
  },
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function identity(e) {
      return e;
    }
    t.identity = identity;
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(227);
    var i = r(978);
    t.queue = new i.QueueScheduler(n.QueueAction);
  },
  ,
  ,
  ,
  function(e) {
    e.exports = require("url");
  },
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(411);
    var s = r(114);
    var u = r(154);
    var a = r(400);
    function windowTime(e) {
      var t = o.async;
      var r = null;
      var n = Number.POSITIVE_INFINITY;
      if (a.isScheduler(arguments[3])) {
        t = arguments[3];
      }
      if (a.isScheduler(arguments[2])) {
        t = arguments[2];
      } else if (u.isNumeric(arguments[2])) {
        n = arguments[2];
      }
      if (a.isScheduler(arguments[1])) {
        t = arguments[1];
      } else if (u.isNumeric(arguments[1])) {
        r = arguments[1];
      }
      return function windowTimeOperatorFunction(i) {
        return i.lift(new c(e, r, n, t));
      };
    }
    t.windowTime = windowTime;
    var c = (function() {
      function WindowTimeOperator(e, t, r, n) {
        this.windowTimeSpan = e;
        this.windowCreationInterval = t;
        this.maxWindowSize = r;
        this.scheduler = n;
      }
      WindowTimeOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new l(
            e,
            this.windowTimeSpan,
            this.windowCreationInterval,
            this.maxWindowSize,
            this.scheduler
          )
        );
      };
      return WindowTimeOperator;
    })();
    var p = (function(e) {
      n(CountedSubject, e);
      function CountedSubject() {
        var t = (e !== null && e.apply(this, arguments)) || this;
        t._numberOfNextedValues = 0;
        return t;
      }
      CountedSubject.prototype.next = function(t) {
        this._numberOfNextedValues++;
        e.prototype.next.call(this, t);
      };
      Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
        get: function() {
          return this._numberOfNextedValues;
        },
        enumerable: true,
        configurable: true
      });
      return CountedSubject;
    })(i.Subject);
    var l = (function(e) {
      n(WindowTimeSubscriber, e);
      function WindowTimeSubscriber(t, r, n, i, o) {
        var s = e.call(this, t) || this;
        s.destination = t;
        s.windowTimeSpan = r;
        s.windowCreationInterval = n;
        s.maxWindowSize = i;
        s.scheduler = o;
        s.windows = [];
        var u = s.openWindow();
        if (n !== null && n >= 0) {
          var a = { subscriber: s, window: u, context: null };
          var c = {
            windowTimeSpan: r,
            windowCreationInterval: n,
            subscriber: s,
            scheduler: o
          };
          s.add(o.schedule(dispatchWindowClose, r, a));
          s.add(o.schedule(dispatchWindowCreation, n, c));
        } else {
          var p = { subscriber: s, window: u, windowTimeSpan: r };
          s.add(o.schedule(dispatchWindowTimeSpanOnly, r, p));
        }
        return s;
      }
      WindowTimeSubscriber.prototype._next = function(e) {
        var t = this.windows;
        var r = t.length;
        for (var n = 0; n < r; n++) {
          var i = t[n];
          if (!i.closed) {
            i.next(e);
            if (i.numberOfNextedValues >= this.maxWindowSize) {
              this.closeWindow(i);
            }
          }
        }
      };
      WindowTimeSubscriber.prototype._error = function(e) {
        var t = this.windows;
        while (t.length > 0) {
          t.shift().error(e);
        }
        this.destination.error(e);
      };
      WindowTimeSubscriber.prototype._complete = function() {
        var e = this.windows;
        while (e.length > 0) {
          var t = e.shift();
          if (!t.closed) {
            t.complete();
          }
        }
        this.destination.complete();
      };
      WindowTimeSubscriber.prototype.openWindow = function() {
        var e = new p();
        this.windows.push(e);
        var t = this.destination;
        t.next(e);
        return e;
      };
      WindowTimeSubscriber.prototype.closeWindow = function(e) {
        e.complete();
        var t = this.windows;
        t.splice(t.indexOf(e), 1);
      };
      return WindowTimeSubscriber;
    })(s.Subscriber);
    function dispatchWindowTimeSpanOnly(e) {
      var t = e.subscriber,
        r = e.windowTimeSpan,
        n = e.window;
      if (n) {
        t.closeWindow(n);
      }
      e.window = t.openWindow();
      this.schedule(e, r);
    }
    function dispatchWindowCreation(e) {
      var t = e.windowTimeSpan,
        r = e.subscriber,
        n = e.scheduler,
        i = e.windowCreationInterval;
      var o = r.openWindow();
      var s = this;
      var u = { action: s, subscription: null };
      var a = { subscriber: r, window: o, context: u };
      u.subscription = n.schedule(dispatchWindowClose, t, a);
      s.add(u.subscription);
      s.schedule(e, i);
    }
    function dispatchWindowClose(e) {
      var t = e.subscriber,
        r = e.window,
        n = e.context;
      if (n && n.action && n.subscription) {
        n.action.remove(n.subscription);
      }
      t.closeWindow(r);
    }
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function scan(e, t) {
      var r = false;
      if (arguments.length >= 2) {
        r = true;
      }
      return function scanOperatorFunction(n) {
        return n.lift(new o(e, t, r));
      };
    }
    t.scan = scan;
    var o = (function() {
      function ScanOperator(e, t, r) {
        if (r === void 0) {
          r = false;
        }
        this.accumulator = e;
        this.seed = t;
        this.hasSeed = r;
      }
      ScanOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.accumulator, this.seed, this.hasSeed));
      };
      return ScanOperator;
    })();
    var s = (function(e) {
      n(ScanSubscriber, e);
      function ScanSubscriber(t, r, n, i) {
        var o = e.call(this, t) || this;
        o.accumulator = r;
        o._seed = n;
        o.hasSeed = i;
        o.index = 0;
        return o;
      }
      Object.defineProperty(ScanSubscriber.prototype, "seed", {
        get: function() {
          return this._seed;
        },
        set: function(e) {
          this.hasSeed = true;
          this._seed = e;
        },
        enumerable: true,
        configurable: true
      });
      ScanSubscriber.prototype._next = function(e) {
        if (!this.hasSeed) {
          this.seed = e;
          this.destination.next(e);
        } else {
          return this._tryNext(e);
        }
      };
      ScanSubscriber.prototype._tryNext = function(e) {
        var t = this.index++;
        var r;
        try {
          r = this.accumulator(this.seed, e, t);
        } catch (e) {
          this.destination.error(e);
        }
        this.seed = r;
        this.destination.next(r);
      };
      return ScanSubscriber;
    })(i.Subscriber);
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(213);
    var i = r(96);
    function publishBehavior(e) {
      return function(t) {
        return i.multicast(new n.BehaviorSubject(e))(t);
      };
    }
    t.publishBehavior = publishBehavior;
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(411);
    function debounceTime(e, t) {
      if (t === void 0) {
        t = o.async;
      }
      return function(r) {
        return r.lift(new s(e, t));
      };
    }
    t.debounceTime = debounceTime;
    var s = (function() {
      function DebounceTimeOperator(e, t) {
        this.dueTime = e;
        this.scheduler = t;
      }
      DebounceTimeOperator.prototype.call = function(e, t) {
        return t.subscribe(new u(e, this.dueTime, this.scheduler));
      };
      return DebounceTimeOperator;
    })();
    var u = (function(e) {
      n(DebounceTimeSubscriber, e);
      function DebounceTimeSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.dueTime = r;
        i.scheduler = n;
        i.debouncedSubscription = null;
        i.lastValue = null;
        i.hasValue = false;
        return i;
      }
      DebounceTimeSubscriber.prototype._next = function(e) {
        this.clearDebounce();
        this.lastValue = e;
        this.hasValue = true;
        this.add(
          (this.debouncedSubscription = this.scheduler.schedule(
            dispatchNext,
            this.dueTime,
            this
          ))
        );
      };
      DebounceTimeSubscriber.prototype._complete = function() {
        this.debouncedNext();
        this.destination.complete();
      };
      DebounceTimeSubscriber.prototype.debouncedNext = function() {
        this.clearDebounce();
        if (this.hasValue) {
          var e = this.lastValue;
          this.lastValue = null;
          this.hasValue = false;
          this.destination.next(e);
        }
      };
      DebounceTimeSubscriber.prototype.clearDebounce = function() {
        var e = this.debouncedSubscription;
        if (e !== null) {
          this.remove(e);
          e.unsubscribe();
          this.debouncedSubscription = null;
        }
      };
      return DebounceTimeSubscriber;
    })(i.Subscriber);
    function dispatchNext(e) {
      e.debouncedNext();
    }
  },
  ,
  ,
  ,
  function(e) {
    var t = "Expected a function";
    var r = "__lodash_hash_undefined__";
    var n = 1 / 0;
    var i = "[object Function]",
      o = "[object GeneratorFunction]",
      s = "[object Symbol]";
    var u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      a = /^\w*$/,
      c = /^\./,
      p = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var l = /[\\^$.*+?()[\]{}|]/g;
    var d = /\\(\\)?/g;
    var f = /^\[object .+?Constructor\]$/;
    var h =
      typeof global == "object" && global && global.Object === Object && global;
    var y = typeof self == "object" && self && self.Object === Object && self;
    var b = h || y || Function("return this")();
    function getValue(e, t) {
      return e == null ? undefined : e[t];
    }
    function isHostObject(e) {
      var t = false;
      if (e != null && typeof e.toString != "function") {
        try {
          t = !!(e + "");
        } catch (e) {}
      }
      return t;
    }
    var g = Array.prototype,
      m = Function.prototype,
      _ = Object.prototype;
    var v = b["__core-js_shared__"];
    var w = (function() {
      var e = /[^.]+$/.exec((v && v.keys && v.keys.IE_PROTO) || "");
      return e ? "Symbol(src)_1." + e : "";
    })();
    var S = m.toString;
    var q = _.hasOwnProperty;
    var O = _.toString;
    var E = RegExp(
      "^" +
        S.call(q)
          .replace(l, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?"
          ) +
        "$"
    );
    var T = b.Symbol,
      j = g.splice;
    var x = getNative(b, "Map"),
      P = getNative(Object, "create");
    var C = T ? T.prototype : undefined,
      A = C ? C.toString : undefined;
    function Hash(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function hashClear() {
      this.__data__ = P ? P(null) : {};
    }
    function hashDelete(e) {
      return this.has(e) && delete this.__data__[e];
    }
    function hashGet(e) {
      var t = this.__data__;
      if (P) {
        var n = t[e];
        return n === r ? undefined : n;
      }
      return q.call(t, e) ? t[e] : undefined;
    }
    function hashHas(e) {
      var t = this.__data__;
      return P ? t[e] !== undefined : q.call(t, e);
    }
    function hashSet(e, t) {
      var n = this.__data__;
      n[e] = P && t === undefined ? r : t;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(e) {
      var t = this.__data__,
        r = assocIndexOf(t, e);
      if (r < 0) {
        return false;
      }
      var n = t.length - 1;
      if (r == n) {
        t.pop();
      } else {
        j.call(t, r, 1);
      }
      return true;
    }
    function listCacheGet(e) {
      var t = this.__data__,
        r = assocIndexOf(t, e);
      return r < 0 ? undefined : t[r][1];
    }
    function listCacheHas(e) {
      return assocIndexOf(this.__data__, e) > -1;
    }
    function listCacheSet(e, t) {
      var r = this.__data__,
        n = assocIndexOf(r, e);
      if (n < 0) {
        r.push([e, t]);
      } else {
        r[n][1] = t;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        hash: new Hash(),
        map: new (x || ListCache)(),
        string: new Hash()
      };
    }
    function mapCacheDelete(e) {
      return getMapData(this, e)["delete"](e);
    }
    function mapCacheGet(e) {
      return getMapData(this, e).get(e);
    }
    function mapCacheHas(e) {
      return getMapData(this, e).has(e);
    }
    function mapCacheSet(e, t) {
      getMapData(this, e).set(e, t);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function assocIndexOf(e, t) {
      var r = e.length;
      while (r--) {
        if (eq(e[r][0], t)) {
          return r;
        }
      }
      return -1;
    }
    function baseGet(e, t) {
      t = isKey(t, e) ? [t] : castPath(t);
      var r = 0,
        n = t.length;
      while (e != null && r < n) {
        e = e[toKey(t[r++])];
      }
      return r && r == n ? e : undefined;
    }
    function baseIsNative(e) {
      if (!isObject(e) || isMasked(e)) {
        return false;
      }
      var t = isFunction(e) || isHostObject(e) ? E : f;
      return t.test(toSource(e));
    }
    function baseToString(e) {
      if (typeof e == "string") {
        return e;
      }
      if (isSymbol(e)) {
        return A ? A.call(e) : "";
      }
      var t = e + "";
      return t == "0" && 1 / e == -n ? "-0" : t;
    }
    function castPath(e) {
      return R(e) ? e : k(e);
    }
    function getMapData(e, t) {
      var r = e.__data__;
      return isKeyable(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
    }
    function getNative(e, t) {
      var r = getValue(e, t);
      return baseIsNative(r) ? r : undefined;
    }
    function isKey(e, t) {
      if (R(e)) {
        return false;
      }
      var r = typeof e;
      if (
        r == "number" ||
        r == "symbol" ||
        r == "boolean" ||
        e == null ||
        isSymbol(e)
      ) {
        return true;
      }
      return a.test(e) || !u.test(e) || (t != null && e in Object(t));
    }
    function isKeyable(e) {
      var t = typeof e;
      return t == "string" || t == "number" || t == "symbol" || t == "boolean"
        ? e !== "__proto__"
        : e === null;
    }
    function isMasked(e) {
      return !!w && w in e;
    }
    var k = memoize(function(e) {
      e = toString(e);
      var t = [];
      if (c.test(e)) {
        t.push("");
      }
      e.replace(p, function(e, r, n, i) {
        t.push(n ? i.replace(d, "$1") : r || e);
      });
      return t;
    });
    function toKey(e) {
      if (typeof e == "string" || isSymbol(e)) {
        return e;
      }
      var t = e + "";
      return t == "0" && 1 / e == -n ? "-0" : t;
    }
    function toSource(e) {
      if (e != null) {
        try {
          return S.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    function memoize(e, r) {
      if (typeof e != "function" || (r && typeof r != "function")) {
        throw new TypeError(t);
      }
      var n = function() {
        var t = arguments,
          i = r ? r.apply(this, t) : t[0],
          o = n.cache;
        if (o.has(i)) {
          return o.get(i);
        }
        var s = e.apply(this, t);
        n.cache = o.set(i, s);
        return s;
      };
      n.cache = new (memoize.Cache || MapCache)();
      return n;
    }
    memoize.Cache = MapCache;
    function eq(e, t) {
      return e === t || (e !== e && t !== t);
    }
    var R = Array.isArray;
    function isFunction(e) {
      var t = isObject(e) ? O.call(e) : "";
      return t == i || t == o;
    }
    function isObject(e) {
      var t = typeof e;
      return !!e && (t == "object" || t == "function");
    }
    function isObjectLike(e) {
      return !!e && typeof e == "object";
    }
    function isSymbol(e) {
      return typeof e == "symbol" || (isObjectLike(e) && O.call(e) == s);
    }
    function toString(e) {
      return e == null ? "" : baseToString(e);
    }
    function get(e, t, r) {
      var n = e == null ? undefined : baseGet(e, t);
      return n === undefined ? r : n;
    }
    e.exports = get;
  },
  function(e, t, r) {
    e.exports = registerPlugin;
    const n = r(47);
    function registerPlugin(e, t) {
      return n(e.includes(t) ? e : e.concat(t));
    }
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(400);
    var o = r(260);
    var s = r(565);
    var u = r(591);
    var a = r(634);
    var c = {};
    function combineLatest() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = null;
      var n = null;
      if (i.isScheduler(e[e.length - 1])) {
        n = e.pop();
      }
      if (typeof e[e.length - 1] === "function") {
        r = e.pop();
      }
      if (e.length === 1 && o.isArray(e[0])) {
        e = e[0];
      }
      return a.fromArray(e, n).lift(new p(r));
    }
    t.combineLatest = combineLatest;
    var p = (function() {
      function CombineLatestOperator(e) {
        this.resultSelector = e;
      }
      CombineLatestOperator.prototype.call = function(e, t) {
        return t.subscribe(new l(e, this.resultSelector));
      };
      return CombineLatestOperator;
    })();
    t.CombineLatestOperator = p;
    var l = (function(e) {
      n(CombineLatestSubscriber, e);
      function CombineLatestSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.resultSelector = r;
        n.active = 0;
        n.values = [];
        n.observables = [];
        return n;
      }
      CombineLatestSubscriber.prototype._next = function(e) {
        this.values.push(c);
        this.observables.push(e);
      };
      CombineLatestSubscriber.prototype._complete = function() {
        var e = this.observables;
        var t = e.length;
        if (t === 0) {
          this.destination.complete();
        } else {
          this.active = t;
          this.toRespond = t;
          for (var r = 0; r < t; r++) {
            var n = e[r];
            this.add(u.subscribeToResult(this, n, n, r));
          }
        }
      };
      CombineLatestSubscriber.prototype.notifyComplete = function(e) {
        if ((this.active -= 1) === 0) {
          this.destination.complete();
        }
      };
      CombineLatestSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        var o = this.values;
        var s = o[r];
        var u = !this.toRespond
          ? 0
          : s === c
          ? --this.toRespond
          : this.toRespond;
        o[r] = t;
        if (u === 0) {
          if (this.resultSelector) {
            this._tryResultSelector(o);
          } else {
            this.destination.next(o.slice());
          }
        }
      };
      CombineLatestSubscriber.prototype._tryResultSelector = function(e) {
        var t;
        try {
          t = this.resultSelector.apply(this, e);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.destination.next(t);
      };
      return CombineLatestSubscriber;
    })(s.OuterSubscriber);
    t.CombineLatestSubscriber = l;
  },
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function hostReportError(e) {
      setTimeout(function() {
        throw e;
      }, 0);
    }
    t.hostReportError = hostReportError;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(565);
    var o = r(668);
    var s = r(591);
    var u = r(802);
    var a = r(997);
    function exhaustMap(e, t) {
      if (t) {
        return function(r) {
          return r.pipe(
            exhaustMap(function(r, n) {
              return a.from(e(r, n)).pipe(
                u.map(function(e, i) {
                  return t(r, e, n, i);
                })
              );
            })
          );
        };
      }
      return function(t) {
        return t.lift(new c(e));
      };
    }
    t.exhaustMap = exhaustMap;
    var c = (function() {
      function ExhaustMapOperator(e) {
        this.project = e;
      }
      ExhaustMapOperator.prototype.call = function(e, t) {
        return t.subscribe(new p(e, this.project));
      };
      return ExhaustMapOperator;
    })();
    var p = (function(e) {
      n(ExhaustMapSubscriber, e);
      function ExhaustMapSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.project = r;
        n.hasSubscription = false;
        n.hasCompleted = false;
        n.index = 0;
        return n;
      }
      ExhaustMapSubscriber.prototype._next = function(e) {
        if (!this.hasSubscription) {
          this.tryNext(e);
        }
      };
      ExhaustMapSubscriber.prototype.tryNext = function(e) {
        var t;
        var r = this.index++;
        try {
          t = this.project(e, r);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        this.hasSubscription = true;
        this._innerSub(t, e, r);
      };
      ExhaustMapSubscriber.prototype._innerSub = function(e, t, r) {
        var n = new o.InnerSubscriber(this, t, r);
        var i = this.destination;
        i.add(n);
        var u = s.subscribeToResult(this, e, undefined, undefined, n);
        if (u !== n) {
          i.add(u);
        }
      };
      ExhaustMapSubscriber.prototype._complete = function() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
          this.destination.complete();
        }
        this.unsubscribe();
      };
      ExhaustMapSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.destination.next(t);
      };
      ExhaustMapSubscriber.prototype.notifyError = function(e) {
        this.destination.error(e);
      };
      ExhaustMapSubscriber.prototype.notifyComplete = function(e) {
        var t = this.destination;
        t.remove(e);
        this.hasSubscription = false;
        if (this.hasCompleted) {
          this.destination.complete();
        }
      };
      return ExhaustMapSubscriber;
    })(i.OuterSubscriber);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(411);
    var o = r(114);
    var s = r(400);
    function bufferTime(e) {
      var t = arguments.length;
      var r = i.async;
      if (s.isScheduler(arguments[arguments.length - 1])) {
        r = arguments[arguments.length - 1];
        t--;
      }
      var n = null;
      if (t >= 2) {
        n = arguments[1];
      }
      var o = Number.POSITIVE_INFINITY;
      if (t >= 3) {
        o = arguments[2];
      }
      return function bufferTimeOperatorFunction(t) {
        return t.lift(new u(e, n, o, r));
      };
    }
    t.bufferTime = bufferTime;
    var u = (function() {
      function BufferTimeOperator(e, t, r, n) {
        this.bufferTimeSpan = e;
        this.bufferCreationInterval = t;
        this.maxBufferSize = r;
        this.scheduler = n;
      }
      BufferTimeOperator.prototype.call = function(e, t) {
        return t.subscribe(
          new c(
            e,
            this.bufferTimeSpan,
            this.bufferCreationInterval,
            this.maxBufferSize,
            this.scheduler
          )
        );
      };
      return BufferTimeOperator;
    })();
    var a = (function() {
      function Context() {
        this.buffer = [];
      }
      return Context;
    })();
    var c = (function(e) {
      n(BufferTimeSubscriber, e);
      function BufferTimeSubscriber(t, r, n, i, o) {
        var s = e.call(this, t) || this;
        s.bufferTimeSpan = r;
        s.bufferCreationInterval = n;
        s.maxBufferSize = i;
        s.scheduler = o;
        s.contexts = [];
        var u = s.openContext();
        s.timespanOnly = n == null || n < 0;
        if (s.timespanOnly) {
          var a = { subscriber: s, context: u, bufferTimeSpan: r };
          s.add((u.closeAction = o.schedule(dispatchBufferTimeSpanOnly, r, a)));
        } else {
          var c = { subscriber: s, context: u };
          var p = {
            bufferTimeSpan: r,
            bufferCreationInterval: n,
            subscriber: s,
            scheduler: o
          };
          s.add((u.closeAction = o.schedule(dispatchBufferClose, r, c)));
          s.add(o.schedule(dispatchBufferCreation, n, p));
        }
        return s;
      }
      BufferTimeSubscriber.prototype._next = function(e) {
        var t = this.contexts;
        var r = t.length;
        var n;
        for (var i = 0; i < r; i++) {
          var o = t[i];
          var s = o.buffer;
          s.push(e);
          if (s.length == this.maxBufferSize) {
            n = o;
          }
        }
        if (n) {
          this.onBufferFull(n);
        }
      };
      BufferTimeSubscriber.prototype._error = function(t) {
        this.contexts.length = 0;
        e.prototype._error.call(this, t);
      };
      BufferTimeSubscriber.prototype._complete = function() {
        var t = this,
          r = t.contexts,
          n = t.destination;
        while (r.length > 0) {
          var i = r.shift();
          n.next(i.buffer);
        }
        e.prototype._complete.call(this);
      };
      BufferTimeSubscriber.prototype._unsubscribe = function() {
        this.contexts = null;
      };
      BufferTimeSubscriber.prototype.onBufferFull = function(e) {
        this.closeContext(e);
        var t = e.closeAction;
        t.unsubscribe();
        this.remove(t);
        if (!this.closed && this.timespanOnly) {
          e = this.openContext();
          var r = this.bufferTimeSpan;
          var n = { subscriber: this, context: e, bufferTimeSpan: r };
          this.add(
            (e.closeAction = this.scheduler.schedule(
              dispatchBufferTimeSpanOnly,
              r,
              n
            ))
          );
        }
      };
      BufferTimeSubscriber.prototype.openContext = function() {
        var e = new a();
        this.contexts.push(e);
        return e;
      };
      BufferTimeSubscriber.prototype.closeContext = function(e) {
        this.destination.next(e.buffer);
        var t = this.contexts;
        var r = t ? t.indexOf(e) : -1;
        if (r >= 0) {
          t.splice(t.indexOf(e), 1);
        }
      };
      return BufferTimeSubscriber;
    })(o.Subscriber);
    function dispatchBufferTimeSpanOnly(e) {
      var t = e.subscriber;
      var r = e.context;
      if (r) {
        t.closeContext(r);
      }
      if (!t.closed) {
        e.context = t.openContext();
        e.context.closeAction = this.schedule(e, e.bufferTimeSpan);
      }
    }
    function dispatchBufferCreation(e) {
      var t = e.bufferCreationInterval,
        r = e.bufferTimeSpan,
        n = e.subscriber,
        i = e.scheduler;
      var o = n.openContext();
      var s = this;
      if (!n.closed) {
        n.add(
          (o.closeAction = i.schedule(dispatchBufferClose, r, {
            subscriber: n,
            context: o
          }))
        );
        s.schedule(e, t);
      }
    }
    function dispatchBufferClose(e) {
      var t = e.subscriber,
        r = e.context;
      t.closeContext(r);
    }
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(114);
    var i = r(754);
    var o = r(16);
    function toSubscriber(e, t, r) {
      if (e) {
        if (e instanceof n.Subscriber) {
          return e;
        }
        if (e[i.rxSubscriber]) {
          return e[i.rxSubscriber]();
        }
      }
      if (!e && !t && !r) {
        return new n.Subscriber(o.empty);
      }
      return new n.Subscriber(e, t, r);
    }
    t.toSubscriber = toSubscriber;
  },
  function(e) {
    var t = "Expected a function";
    var r = "__lodash_hash_undefined__";
    var n = 1 / 0,
      i = 9007199254740991;
    var o = "[object Function]",
      s = "[object GeneratorFunction]",
      u = "[object Symbol]";
    var a = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      c = /^\w*$/,
      p = /^\./,
      l = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var d = /[\\^$.*+?()[\]{}|]/g;
    var f = /\\(\\)?/g;
    var h = /^\[object .+?Constructor\]$/;
    var y = /^(?:0|[1-9]\d*)$/;
    var b =
      typeof global == "object" && global && global.Object === Object && global;
    var g = typeof self == "object" && self && self.Object === Object && self;
    var m = b || g || Function("return this")();
    function getValue(e, t) {
      return e == null ? undefined : e[t];
    }
    function isHostObject(e) {
      var t = false;
      if (e != null && typeof e.toString != "function") {
        try {
          t = !!(e + "");
        } catch (e) {}
      }
      return t;
    }
    var _ = Array.prototype,
      v = Function.prototype,
      w = Object.prototype;
    var S = m["__core-js_shared__"];
    var q = (function() {
      var e = /[^.]+$/.exec((S && S.keys && S.keys.IE_PROTO) || "");
      return e ? "Symbol(src)_1." + e : "";
    })();
    var O = v.toString;
    var E = w.hasOwnProperty;
    var T = w.toString;
    var j = RegExp(
      "^" +
        O.call(E)
          .replace(d, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?"
          ) +
        "$"
    );
    var x = m.Symbol,
      P = _.splice;
    var C = getNative(m, "Map"),
      A = getNative(Object, "create");
    var k = x ? x.prototype : undefined,
      R = k ? k.toString : undefined;
    function Hash(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function hashClear() {
      this.__data__ = A ? A(null) : {};
    }
    function hashDelete(e) {
      return this.has(e) && delete this.__data__[e];
    }
    function hashGet(e) {
      var t = this.__data__;
      if (A) {
        var n = t[e];
        return n === r ? undefined : n;
      }
      return E.call(t, e) ? t[e] : undefined;
    }
    function hashHas(e) {
      var t = this.__data__;
      return A ? t[e] !== undefined : E.call(t, e);
    }
    function hashSet(e, t) {
      var n = this.__data__;
      n[e] = A && t === undefined ? r : t;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
    }
    function listCacheDelete(e) {
      var t = this.__data__,
        r = assocIndexOf(t, e);
      if (r < 0) {
        return false;
      }
      var n = t.length - 1;
      if (r == n) {
        t.pop();
      } else {
        P.call(t, r, 1);
      }
      return true;
    }
    function listCacheGet(e) {
      var t = this.__data__,
        r = assocIndexOf(t, e);
      return r < 0 ? undefined : t[r][1];
    }
    function listCacheHas(e) {
      return assocIndexOf(this.__data__, e) > -1;
    }
    function listCacheSet(e, t) {
      var r = this.__data__,
        n = assocIndexOf(r, e);
      if (n < 0) {
        r.push([e, t]);
      } else {
        r[n][1] = t;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(e) {
      var t = -1,
        r = e ? e.length : 0;
      this.clear();
      while (++t < r) {
        var n = e[t];
        this.set(n[0], n[1]);
      }
    }
    function mapCacheClear() {
      this.__data__ = {
        hash: new Hash(),
        map: new (C || ListCache)(),
        string: new Hash()
      };
    }
    function mapCacheDelete(e) {
      return getMapData(this, e)["delete"](e);
    }
    function mapCacheGet(e) {
      return getMapData(this, e).get(e);
    }
    function mapCacheHas(e) {
      return getMapData(this, e).has(e);
    }
    function mapCacheSet(e, t) {
      getMapData(this, e).set(e, t);
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function assignValue(e, t, r) {
      var n = e[t];
      if (!(E.call(e, t) && eq(n, r)) || (r === undefined && !(t in e))) {
        e[t] = r;
      }
    }
    function assocIndexOf(e, t) {
      var r = e.length;
      while (r--) {
        if (eq(e[r][0], t)) {
          return r;
        }
      }
      return -1;
    }
    function baseIsNative(e) {
      if (!isObject(e) || isMasked(e)) {
        return false;
      }
      var t = isFunction(e) || isHostObject(e) ? j : h;
      return t.test(toSource(e));
    }
    function baseSet(e, t, r, n) {
      if (!isObject(e)) {
        return e;
      }
      t = isKey(t, e) ? [t] : castPath(t);
      var i = -1,
        o = t.length,
        s = o - 1,
        u = e;
      while (u != null && ++i < o) {
        var a = toKey(t[i]),
          c = r;
        if (i != s) {
          var p = u[a];
          c = n ? n(p, a, u) : undefined;
          if (c === undefined) {
            c = isObject(p) ? p : isIndex(t[i + 1]) ? [] : {};
          }
        }
        assignValue(u, a, c);
        u = u[a];
      }
      return e;
    }
    function baseToString(e) {
      if (typeof e == "string") {
        return e;
      }
      if (isSymbol(e)) {
        return R ? R.call(e) : "";
      }
      var t = e + "";
      return t == "0" && 1 / e == -n ? "-0" : t;
    }
    function castPath(e) {
      return G(e) ? e : I(e);
    }
    function getMapData(e, t) {
      var r = e.__data__;
      return isKeyable(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
    }
    function getNative(e, t) {
      var r = getValue(e, t);
      return baseIsNative(r) ? r : undefined;
    }
    function isIndex(e, t) {
      t = t == null ? i : t;
      return (
        !!t &&
        (typeof e == "number" || y.test(e)) &&
        e > -1 && e % 1 == 0 && e < t
      );
    }
    function isKey(e, t) {
      if (G(e)) {
        return false;
      }
      var r = typeof e;
      if (
        r == "number" ||
        r == "symbol" ||
        r == "boolean" ||
        e == null ||
        isSymbol(e)
      ) {
        return true;
      }
      return c.test(e) || !a.test(e) || (t != null && e in Object(t));
    }
    function isKeyable(e) {
      var t = typeof e;
      return t == "string" || t == "number" || t == "symbol" || t == "boolean"
        ? e !== "__proto__"
        : e === null;
    }
    function isMasked(e) {
      return !!q && q in e;
    }
    var I = memoize(function(e) {
      e = toString(e);
      var t = [];
      if (p.test(e)) {
        t.push("");
      }
      e.replace(l, function(e, r, n, i) {
        t.push(n ? i.replace(f, "$1") : r || e);
      });
      return t;
    });
    function toKey(e) {
      if (typeof e == "string" || isSymbol(e)) {
        return e;
      }
      var t = e + "";
      return t == "0" && 1 / e == -n ? "-0" : t;
    }
    function toSource(e) {
      if (e != null) {
        try {
          return O.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    }
    function memoize(e, r) {
      if (typeof e != "function" || (r && typeof r != "function")) {
        throw new TypeError(t);
      }
      var n = function() {
        var t = arguments,
          i = r ? r.apply(this, t) : t[0],
          o = n.cache;
        if (o.has(i)) {
          return o.get(i);
        }
        var s = e.apply(this, t);
        n.cache = o.set(i, s);
        return s;
      };
      n.cache = new (memoize.Cache || MapCache)();
      return n;
    }
    memoize.Cache = MapCache;
    function eq(e, t) {
      return e === t || (e !== e && t !== t);
    }
    var G = Array.isArray;
    function isFunction(e) {
      var t = isObject(e) ? T.call(e) : "";
      return t == o || t == s;
    }
    function isObject(e) {
      var t = typeof e;
      return !!e && (t == "object" || t == "function");
    }
    function isObjectLike(e) {
      return !!e && typeof e == "object";
    }
    function isSymbol(e) {
      return typeof e == "symbol" || (isObjectLike(e) && T.call(e) == u);
    }
    function toString(e) {
      return e == null ? "" : baseToString(e);
    }
    function set(e, t, r) {
      return e == null ? e : baseSet(e, t, r);
    }
    e.exports = set;
  },
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = (function() {
      function UnsubscriptionErrorImpl(e) {
        Error.call(this);
        this.message = e
          ? e.length +
            " errors occurred during unsubscription:\n" +
            e
              .map(function(e, t) {
                return t + 1 + ") " + e.toString();
              })
              .join("\n  ")
          : "";
        this.name = "UnsubscriptionError";
        this.errors = e;
        return this;
      }
      UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
      return UnsubscriptionErrorImpl;
    })();
    t.UnsubscriptionError = r;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function count(e) {
      return function(t) {
        return t.lift(new o(e, t));
      };
    }
    t.count = count;
    var o = (function() {
      function CountOperator(e, t) {
        this.predicate = e;
        this.source = t;
      }
      CountOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.predicate, this.source));
      };
      return CountOperator;
    })();
    var s = (function(e) {
      n(CountSubscriber, e);
      function CountSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.predicate = r;
        i.source = n;
        i.count = 0;
        i.index = 0;
        return i;
      }
      CountSubscriber.prototype._next = function(e) {
        if (this.predicate) {
          this._tryPredicate(e);
        } else {
          this.count++;
        }
      };
      CountSubscriber.prototype._tryPredicate = function(e) {
        var t;
        try {
          t = this.predicate(e, this.index++, this.source);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        if (t) {
          this.count++;
        }
      };
      CountSubscriber.prototype._complete = function() {
        this.destination.next(this.count);
        this.destination.complete();
      };
      return CountSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = registerEndpoints;
    const { Deprecation: n } = r(692);
    function registerEndpoints(e, t) {
      Object.keys(t).forEach(r => {
        if (!e[r]) {
          e[r] = {};
        }
        Object.keys(t[r]).forEach(i => {
          const o = t[r][i];
          const s = ["method", "url", "headers"].reduce((e, t) => {
            if (typeof o[t] !== "undefined") {
              e[t] = o[t];
            }
            return e;
          }, {});
          s.request = { validate: o.params };
          let u = e.request.defaults(s);
          const a = Object.keys(o.params || {}).find(
            e => o.params[e].deprecated
          );
          if (a) {
            const t = patchForDeprecation.bind(null, e, o);
            u = t(e.request.defaults(s), `.${r}.${i}()`);
            u.endpoint = t(u.endpoint, `.${r}.${i}.endpoint()`);
            u.endpoint.merge = t(
              u.endpoint.merge,
              `.${r}.${i}.endpoint.merge()`
            );
          }
          if (o.deprecated) {
            e[r][i] = function deprecatedEndpointMethod() {
              e.log.warn(new n(`[@octokit/rest] ${o.deprecated}`));
              e[r][i] = u;
              return u.apply(null, arguments);
            };
            return;
          }
          e[r][i] = u;
        });
      });
    }
    function patchForDeprecation(e, t, r, i) {
      const o = o => {
        o = Object.assign({}, o);
        Object.keys(o).forEach(r => {
          if (t.params[r] && t.params[r].deprecated) {
            const s = t.params[r].alias;
            e.log.warn(
              new n(
                `[@octokit/rest] "${r}" parameter is deprecated for "${i}". Use "${s}" instead`
              )
            );
            if (!(s in o)) {
              o[s] = o[r];
            }
            delete o[r];
          }
        });
        return r(o);
      };
      Object.keys(r).forEach(e => {
        o[e] = r[e];
      });
      return o;
    }
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(189);
    t.ajax = (function() {
      return n.AjaxObservable.create;
    })();
  },
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var r = typeof window !== "undefined" && window;
    var n =
      typeof self !== "undefined" &&
      typeof WorkerGlobalScope !== "undefined" &&
      self instanceof WorkerGlobalScope &&
      self;
    var i = typeof global !== "undefined" && global;
    var o = r || i || n;
    t.root = o;
    (function() {
      if (!o) {
        throw new Error(
          "RxJS could not find any global context (window, self, global)"
        );
      }
    })();
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(400);
    var o = r(465);
    var s = r(634);
    function merge() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = Number.POSITIVE_INFINITY;
      var u = null;
      var a = e[e.length - 1];
      if (i.isScheduler(a)) {
        u = e.pop();
        if (e.length > 1 && typeof e[e.length - 1] === "number") {
          r = e.pop();
        }
      } else if (typeof a === "number") {
        r = e.pop();
      }
      if (u === null && e.length === 1 && e[0] instanceof n.Observable) {
        return e[0];
      }
      return o.mergeAll(r)(s.fromArray(e, u));
    }
    t.merge = merge;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function isDate(e) {
      return e instanceof Date && !isNaN(+e);
    }
    t.isDate = isDate;
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(312);
    var o = r(565);
    var s = r(591);
    function bufferWhen(e) {
      return function(t) {
        return t.lift(new u(e));
      };
    }
    t.bufferWhen = bufferWhen;
    var u = (function() {
      function BufferWhenOperator(e) {
        this.closingSelector = e;
      }
      BufferWhenOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.closingSelector));
      };
      return BufferWhenOperator;
    })();
    var a = (function(e) {
      n(BufferWhenSubscriber, e);
      function BufferWhenSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.closingSelector = r;
        n.subscribing = false;
        n.openBuffer();
        return n;
      }
      BufferWhenSubscriber.prototype._next = function(e) {
        this.buffer.push(e);
      };
      BufferWhenSubscriber.prototype._complete = function() {
        var t = this.buffer;
        if (t) {
          this.destination.next(t);
        }
        e.prototype._complete.call(this);
      };
      BufferWhenSubscriber.prototype._unsubscribe = function() {
        this.buffer = null;
        this.subscribing = false;
      };
      BufferWhenSubscriber.prototype.notifyNext = function(e, t, r, n, i) {
        this.openBuffer();
      };
      BufferWhenSubscriber.prototype.notifyComplete = function() {
        if (this.subscribing) {
          this.complete();
        } else {
          this.openBuffer();
        }
      };
      BufferWhenSubscriber.prototype.openBuffer = function() {
        var e = this.closingSubscription;
        if (e) {
          this.remove(e);
          e.unsubscribe();
        }
        var t = this.buffer;
        if (this.buffer) {
          this.destination.next(t);
        }
        this.buffer = [];
        var r;
        try {
          var n = this.closingSelector;
          r = n();
        } catch (e) {
          return this.error(e);
        }
        e = new i.Subscription();
        this.closingSubscription = e;
        this.add(e);
        this.subscribing = true;
        e.add(s.subscribeToResult(this, r));
        this.subscribing = false;
      };
      return BufferWhenSubscriber;
    })(o.OuterSubscriber);
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(465);
    function concatAll() {
      return n.mergeAll(1);
    }
    t.concatAll = concatAll;
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = hasNextPage;
    const n = r(370);
    const i = r(577);
    function hasNextPage(e) {
      n(
        `octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`
      );
      return i(e).next;
    }
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(33);
    var o = r(149);
    var s = r(154);
    var u = (function(e) {
      n(SubscribeOnObservable, e);
      function SubscribeOnObservable(t, r, n) {
        if (r === void 0) {
          r = 0;
        }
        if (n === void 0) {
          n = o.asap;
        }
        var i = e.call(this) || this;
        i.source = t;
        i.delayTime = r;
        i.scheduler = n;
        if (!s.isNumeric(r) || r < 0) {
          i.delayTime = 0;
        }
        if (!n || typeof n.schedule !== "function") {
          i.scheduler = o.asap;
        }
        return i;
      }
      SubscribeOnObservable.create = function(e, t, r) {
        if (t === void 0) {
          t = 0;
        }
        if (r === void 0) {
          r = o.asap;
        }
        return new SubscribeOnObservable(e, t, r);
      };
      SubscribeOnObservable.dispatch = function(e) {
        var t = e.source,
          r = e.subscriber;
        return this.add(t.subscribe(r));
      };
      SubscribeOnObservable.prototype._subscribe = function(e) {
        var t = this.delayTime;
        var r = this.source;
        var n = this.scheduler;
        return n.schedule(SubscribeOnObservable.dispatch, t, {
          source: r,
          subscriber: e
        });
      };
      return SubscribeOnObservable;
    })(i.Observable);
    t.SubscribeOnObservable = u;
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(246);
    function concatMap(e, t) {
      return n.mergeMap(e, t, 1);
    }
    t.concatMap = concatMap;
  },
  ,
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(312);
    function scheduleArray(e, t) {
      return new n.Observable(function(r) {
        var n = new i.Subscription();
        var o = 0;
        n.add(
          t.schedule(function() {
            if (o === e.length) {
              r.complete();
              return;
            }
            r.next(e[o++]);
            if (!r.closed) {
              n.add(this.schedule());
            }
          })
        );
        return n;
      });
    }
    t.scheduleArray = scheduleArray;
  },
  ,
  ,
  ,
  ,
  ,
  function(e) {
    "use strict";
    e.exports = function(e) {
      try {
        return e();
      } catch (e) {}
    };
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    var o = r(594);
    var s = r(553);
    function take(e) {
      return function(t) {
        if (e === 0) {
          return s.empty();
        } else {
          return t.lift(new u(e));
        }
      };
    }
    t.take = take;
    var u = (function() {
      function TakeOperator(e) {
        this.total = e;
        if (this.total < 0) {
          throw new o.ArgumentOutOfRangeError();
        }
      }
      TakeOperator.prototype.call = function(e, t) {
        return t.subscribe(new a(e, this.total));
      };
      return TakeOperator;
    })();
    var a = (function(e) {
      n(TakeSubscriber, e);
      function TakeSubscriber(t, r) {
        var n = e.call(this, t) || this;
        n.total = r;
        n.count = 0;
        return n;
      }
      TakeSubscriber.prototype._next = function(e) {
        var t = this.total;
        var r = ++this.count;
        if (r <= t) {
          this.destination.next(e);
          if (r === t) {
            this.destination.complete();
            this.unsubscribe();
          }
        }
      };
      return TakeSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  function(e) {
    e.exports = validateAuth;
    function validateAuth(e) {
      if (typeof e === "string") {
        return;
      }
      if (typeof e === "function") {
        return;
      }
      if (e.username && e.password) {
        return;
      }
      if (e.clientId && e.clientSecret) {
        return;
      }
      throw new Error(`Invalid "auth" option: ${JSON.stringify(e)}`);
    }
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(564);
    var o = r(312);
    var s = (function(e) {
      n(AsyncSubject, e);
      function AsyncSubject() {
        var t = (e !== null && e.apply(this, arguments)) || this;
        t.value = null;
        t.hasNext = false;
        t.hasCompleted = false;
        return t;
      }
      AsyncSubject.prototype._subscribe = function(t) {
        if (this.hasError) {
          t.error(this.thrownError);
          return o.Subscription.EMPTY;
        } else if (this.hasCompleted && this.hasNext) {
          t.next(this.value);
          t.complete();
          return o.Subscription.EMPTY;
        }
        return e.prototype._subscribe.call(this, t);
      };
      AsyncSubject.prototype.next = function(e) {
        if (!this.hasCompleted) {
          this.value = e;
          this.hasNext = true;
        }
      };
      AsyncSubject.prototype.error = function(t) {
        if (!this.hasCompleted) {
          e.prototype.error.call(this, t);
        }
      };
      AsyncSubject.prototype.complete = function() {
        this.hasCompleted = true;
        if (this.hasNext) {
          e.prototype.next.call(this, this.value);
        }
        e.prototype.complete.call(this);
      };
      return AsyncSubject;
    })(i.Subject);
    t.AsyncSubject = s;
  },
  function(e, t, r) {
    e.exports = paginationMethodsPlugin;
    function paginationMethodsPlugin(e) {
      e.getFirstPage = r(777).bind(null, e);
      e.getLastPage = r(649).bind(null, e);
      e.getNextPage = r(397).bind(null, e);
      e.getPreviousPage = r(337).bind(null, e);
      e.hasFirstPage = r(536);
      e.hasLastPage = r(336);
      e.hasNextPage = r(929);
      e.hasPreviousPage = r(558);
    }
  },
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(802);
    function pluck() {
      var e = [];
      for (var t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
      }
      var r = e.length;
      if (r === 0) {
        throw new Error("list of properties cannot be empty.");
      }
      return function(t) {
        return n.map(plucker(e, r))(t);
      };
    }
    t.pluck = pluck;
    function plucker(e, t) {
      var r = function(r) {
        var n = r;
        for (var i = 0; i < t; i++) {
          var o = n[e[i]];
          if (typeof o !== "undefined") {
            n = o;
          } else {
            return undefined;
          }
        }
        return n;
      };
      return r;
    }
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(594);
    var i = r(981);
    var o = r(559);
    var s = r(758);
    var u = r(949);
    function elementAt(e, t) {
      if (e < 0) {
        throw new n.ArgumentOutOfRangeError();
      }
      var r = arguments.length >= 2;
      return function(a) {
        return a.pipe(
          i.filter(function(t, r) {
            return r === e;
          }),
          u.take(1),
          r
            ? s.defaultIfEmpty(t)
            : o.throwIfEmpty(function() {
                return new n.ArgumentOutOfRangeError();
              })
        );
      };
    }
    t.elementAt = elementAt;
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    const { PassThrough: n } = r(413);
    e.exports = e => {
      e = Object.assign({}, e);
      const { array: t } = e;
      let { encoding: r } = e;
      const i = r === "buffer";
      let o = false;
      if (t) {
        o = !(r || i);
      } else {
        r = r || "utf8";
      }
      if (i) {
        r = null;
      }
      let s = 0;
      const u = [];
      const a = new n({ objectMode: o });
      if (r) {
        a.setEncoding(r);
      }
      a.on("data", e => {
        u.push(e);
        if (o) {
          s = u.length;
        } else {
          s += e.length;
        }
      });
      a.getBufferedValue = () => {
        if (t) {
          return u;
        }
        return i ? Buffer.concat(u, s) : u.join("");
      };
      a.getBufferedLength = () => s;
      return a;
    };
  },
  ,
  ,
  function(e, t, r) {
    var n = r(11);
    e.exports = n(once);
    e.exports.strict = n(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(e) {
      var t = function() {
        if (t.called) return t.value;
        t.called = true;
        return (t.value = e.apply(this, arguments));
      };
      t.called = false;
      return t;
    }
    function onceStrict(e) {
      var t = function() {
        if (t.called) throw new Error(t.onceError);
        t.called = true;
        return (t.value = e.apply(this, arguments));
      };
      var r = e.name || "Function wrapped with `once`";
      t.onceError = r + " shouldn't be called more than once";
      t.called = false;
      return t;
    }
  },
  ,
  ,
  ,
  function(e) {
    e.exports = class HttpError extends Error {
      constructor(e, t, r) {
        super(e);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.code = t;
        this.headers = r;
      }
    };
  },
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function getSymbolIterator() {
      if (typeof Symbol !== "function" || !Symbol.iterator) {
        return "@@iterator";
      }
      return Symbol.iterator;
    }
    t.getSymbolIterator = getSymbolIterator;
    t.iterator = getSymbolIterator();
    t.$$iterator = t.iterator;
  },
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(255);
    var o = (function(e) {
      n(QueueScheduler, e);
      function QueueScheduler() {
        return (e !== null && e.apply(this, arguments)) || this;
      }
      return QueueScheduler;
    })(i.AsyncScheduler);
    t.QueueScheduler = o;
  },
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(522);
    t.subscribeToObservable = function(e) {
      return function(t) {
        var r = e[n.observable]();
        if (typeof r.subscribe !== "function") {
          throw new TypeError(
            "Provided object does not correctly implement Symbol.observable"
          );
        } else {
          return r.subscribe(t);
        }
      };
    };
  },
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function filter(e, t) {
      return function filterOperatorFunction(r) {
        return r.lift(new o(e, t));
      };
    }
    t.filter = filter;
    var o = (function() {
      function FilterOperator(e, t) {
        this.predicate = e;
        this.thisArg = t;
      }
      FilterOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e, this.predicate, this.thisArg));
      };
      return FilterOperator;
    })();
    var s = (function(e) {
      n(FilterSubscriber, e);
      function FilterSubscriber(t, r, n) {
        var i = e.call(this, t) || this;
        i.predicate = r;
        i.thisArg = n;
        i.count = 0;
        return i;
      }
      FilterSubscriber.prototype._next = function(e) {
        var t;
        try {
          t = this.predicate.call(this.thisArg, e, this.count++);
        } catch (e) {
          this.destination.error(e);
          return;
        }
        if (t) {
          this.destination.next(e);
        }
      };
      return FilterSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    "use strict";
    var n =
      (this && this.__extends) ||
      (function() {
        var e = function(t, r) {
          e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) if (t.hasOwnProperty(r)) e[r] = t[r];
            };
          return e(t, r);
        };
        return function(t, r) {
          e(t, r);
          function __() {
            this.constructor = t;
          }
          t.prototype =
            r === null
              ? Object.create(r)
              : ((__.prototype = r.prototype), new __());
        };
      })();
    Object.defineProperty(t, "__esModule", { value: true });
    var i = r(114);
    function dematerialize() {
      return function dematerializeOperatorFunction(e) {
        return e.lift(new o());
      };
    }
    t.dematerialize = dematerialize;
    var o = (function() {
      function DeMaterializeOperator() {}
      DeMaterializeOperator.prototype.call = function(e, t) {
        return t.subscribe(new s(e));
      };
      return DeMaterializeOperator;
    })();
    var s = (function(e) {
      n(DeMaterializeSubscriber, e);
      function DeMaterializeSubscriber(t) {
        return e.call(this, t) || this;
      }
      DeMaterializeSubscriber.prototype._next = function(e) {
        e.observe(this.destination);
      };
      return DeMaterializeSubscriber;
    })(i.Subscriber);
  },
  ,
  ,
  ,
  ,
  function(e, t, r) {
    e.exports = authenticationRequestError;
    const { RequestError: n } = r(463);
    function authenticationRequestError(e, t, r) {
      if (!t.headers) throw t;
      const i = /required/.test(t.headers["x-github-otp"] || "");
      if (t.status !== 401 || !i) {
        throw t;
      }
      if (
        t.status === 401 &&
        i &&
        t.request &&
        t.request.headers["x-github-otp"]
      ) {
        if (e.otp) {
          delete e.otp;
        } else {
          throw new n(
            "Invalid one-time password for two-factor authentication",
            401,
            { headers: t.headers, request: r }
          );
        }
      }
      if (typeof e.auth.on2fa !== "function") {
        throw new n(
          "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
          401,
          { headers: t.headers, request: r }
        );
      }
      return Promise.resolve()
        .then(() => {
          return e.auth.on2fa();
        })
        .then(t => {
          const n = Object.assign(r, {
            headers: Object.assign(r.headers, { "x-github-otp": t })
          });
          return e.octokit.request(n).then(r => {
            e.otp = t;
            return r;
          });
        });
    }
  },
  ,
  ,
  function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    function isObject(e) {
      return e !== null && typeof e === "object";
    }
    t.isObject = isObject;
  },
  ,
  ,
  function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: true });
    var n = r(33);
    var i = r(568);
    var o = r(90);
    function from(e, t) {
      if (!t) {
        if (e instanceof n.Observable) {
          return e;
        }
        return new n.Observable(i.subscribeTo(e));
      } else {
        return o.scheduled(e, t);
      }
    }
    t.from = from;
  }
]);
