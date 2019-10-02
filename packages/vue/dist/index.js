!(function(e, n) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = n(require('flare-client')))
        : 'function' == typeof define && define.amd
        ? define(['flare-client'], n)
        : 'object' == typeof exports
        ? (exports['flare-vue'] = n(require('flare-client')))
        : (e['flare-vue'] = n(e['flare-client']));
})(window, function(e) {
    return (function(e) {
        var n = {};
        function r(o) {
            if (n[o]) return n[o].exports;
            var t = (n[o] = { i: o, l: !1, exports: {} });
            return e[o].call(t.exports, t, t.exports, r), (t.l = !0), t.exports;
        }
        return (
            (r.m = e),
            (r.c = n),
            (r.d = function(e, n, o) {
                r.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: o });
            }),
            (r.r = function(e) {
                'undefined' != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
                    Object.defineProperty(e, '__esModule', { value: !0 });
            }),
            (r.t = function(e, n) {
                if ((1 & n && (e = r(e)), 8 & n)) return e;
                if (4 & n && 'object' == typeof e && e && e.__esModule) return e;
                var o = Object.create(null);
                if (
                    (r.r(o),
                    Object.defineProperty(o, 'default', { enumerable: !0, value: e }),
                    2 & n && 'string' != typeof e)
                )
                    for (var t in e)
                        r.d(
                            o,
                            t,
                            function(n) {
                                return e[n];
                            }.bind(null, t)
                        );
                return o;
            }),
            (r.n = function(e) {
                var n =
                    e && e.__esModule
                        ? function() {
                              return e.default;
                          }
                        : function() {
                              return e;
                          };
                return r.d(n, 'a', n), n;
            }),
            (r.o = function(e, n) {
                return Object.prototype.hasOwnProperty.call(e, n);
            }),
            (r.p = ''),
            r((r.s = 1))
        );
    })([
        function(n, r) {
            n.exports = e;
        },
        function(e, n, r) {
            'use strict';
            r.r(n),
                r.d(n, 'default', function() {
                    return u;
                });
            var o = r(0),
                t = r.n(o);
            function u(e) {
                t.a ||
                    console.error(
                        'Flare Vue Plugin: the Flare Client could not be found.\n            Errors in your Vue components will not be reported.'
                    ),
                    (e && e.config) ||
                        console.error(
                            'Flare Vue Plugin: The Vue errorHandler could not be found.\n            Errors in your Vue components will not be reported.'
                        );
                var n = e.config.errorHandler;
                e.config.errorHandler = function(e, r, o) {
                    var u, i;
                    (null == r ? void 0 : null === (u = r.$options) || void 0 === u ? void 0 : u._componentTag) &&
                        (i = (function(e) {
                            for (var n = (e += '').split('-'), r = 0; r < n.length; r++)
                                n[r] = n[r].slice(0, 1).toUpperCase() + n[r].slice(1, n[r].length);
                            return n.join('');
                        })(r.$options._componentTag));
                    var l = { vue: { info: o, componentName: i || 'Anonymous Component' } };
                    if ((t.a.reportError(e, l), 'function' != typeof n)) throw e;
                    n(e, r, o);
                };
            }
        },
    ]);
});
