"use strict";
var f14;
(function (f14) {
    var Core;
    (function (Core) {
        Core.L10NPrefix = 'f14fm';
        Core.Title = 'FManager';
        Core.currentFolderPath = undefined;
        Core.Config = {
            rootFolder: undefined,
            actionRequest: undefined,
            uploadRequest: undefined,
            xhrBeforeSend: function (xhr) { },
            selectCallback: undefined,
            DEBUG: false,
            IS_TEST: false,
            test_folders: undefined,
            test_files: undefined
        };
        function Configure(settings) {
            if (settings) {
                $.extend(true, Core.Config, settings);
            }
            CheckRequiredValues();
        }
        Core.Configure = Configure;
        function CheckRequiredValues() {
            if (Core.Config.rootFolder === undefined || Core.Config.rootFolder === '') {
                throw "Root folder must be set.";
            }
            if (Core.Config.actionRequest === undefined || Core.Config.actionRequest === '') {
                throw "Action request url must be set.";
            }
            if (Core.Config.DEBUG) {
                console.log(Core.Config);
            }
        }
    })(Core = f14.Core || (f14.Core = {}));
})(f14 || (f14 = {}));
