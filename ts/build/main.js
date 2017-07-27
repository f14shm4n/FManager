"use strict";
var core = f14.Core;
var localization = f14.Localization;
var ui = f14.UI;
var explorer = f14.Explorer;
var FManager = (function () {
    function FManager(settings) {
        localization.Init(); // Initialize localization
        core.Configure(settings); // Apply config
        ui.Render(); // Render ui
        if (!f14.Core.Config.IS_TEST) {
            // Navigate to root folder
            explorer.Navigate();
        }
    }
    return FManager;
}());
var FManagerTest = (function (_super) {
    __extends(FManagerTest, _super);
    function FManagerTest(settings) {
        var _this = _super.call(this, settings) || this;
        _this.GenerateTestData();
        return _this;
    }
    FManagerTest.prototype.GenerateTestData = function () {
        var folders = [];
        var files = [];
        for (var i = 0; i < 5; i++) {
            folders.push({ name: 'folder_' + i });
        }
        for (var i = 0; i < 50; i++) {
            files.push({ name: 'file_' + i + '.txt', extension: '.txt' });
        }
        f14.UI.RenderFileStruct(folders, files);
    };
    return FManagerTest;
}(FManager));
