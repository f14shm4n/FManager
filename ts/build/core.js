"use strict";
var f14;
(function (f14) {
    var Core;
    (function (Core) {
        var Configuration = (function () {
            function Configuration() {
                this.actionButtons = [];
                this.DEBUG = false;
            }
            return Configuration;
        }());
        Core.Configuration = Configuration;
        Core.L10NPrefix = 'f14fm';
        Core.Title = 'FManager';
        Core.TitleShort = 'FM';
        Core.Config = new Configuration();
        Core.AppBuffer = new f14.Memory.AppBuffer();
        var shortcutsObjects = {};
        function Configure(settings) {
            if (settings) {
                $.extend(true, Core.Config, settings);
            }
            CheckRequiredValues();
            if (Core.Config.allowShortcuts) {
                // TODO: Shorcuts
                window.addEventListener('keydown', function (e) {
                    var cmd = FindCommandForShortcut([]);
                    if (cmd) {
                        cmd.Execute();
                    }
                    e.preventDefault();
                }, false);
            }
        }
        Core.Configure = Configure;
        function RegisterShortcut(cmd) {
            shortcutsObjects[cmd.shortcut] = cmd;
        }
        Core.RegisterShortcut = RegisterShortcut;
        function FindCommandForShortcut(keys) {
            return undefined;
        }
        function CheckRequiredValues() {
            if (Core.Config.rootFolder === undefined) {
                throw "Root folder must be set.";
            }
            if (Core.Config.dataService === undefined) {
                if (Core.Config.DEBUG) {
                    console.log('The data service is not specified, configure the data service as remote.');
                }
                Core.Config.dataService = new f14.Data.RemoteDataService(Core.Config);
            }
        }
    })(Core = f14.Core || (f14.Core = {}));
})(f14 || (f14 = {}));
