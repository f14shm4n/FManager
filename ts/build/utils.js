"use strict";
var f14;
(function (f14) {
    var Utils;
    (function (Utils) {
        function getString(key) {
            return l10n.getString(f14.Core.L10NPrefix + key);
        }
        Utils.getString = getString;
        function NextInt(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }
        Utils.NextInt = NextInt;
    })(Utils = f14.Utils || (f14.Utils = {}));
})(f14 || (f14 = {}));
