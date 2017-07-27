"use strict";
var f14;
(function (f14) {
    var Explorer;
    (function (Explorer) {
        var core = f14.Core;
        var config = core.Config;
        var ajax = f14.Ajax;
        var ui = f14.UI;
        function Navigate(folderPath) {
            if (folderPath === undefined) {
                folderPath = config.rootFolder;
            }
            if (config.DEBUG) {
                console.log("Navigate to: " + folderPath);
            }
            core.currentFolderPath = folderPath;
            var renderFileStruct = function (payload) { return ui.RenderFileStruct(payload.folders, payload.files); };
            if (config.IS_TEST) {
                console.log('Test mode navigation.');
            }
            else {
                ajax.GetFileSystemInfo(folderPath, renderFileStruct);
            }
        }
        Explorer.Navigate = Navigate;
    })(Explorer = f14.Explorer || (f14.Explorer = {}));
})(f14 || (f14 = {}));
