"use strict";
var f14;
(function (f14) {
    var Explorer;
    (function (Explorer) {
        Explorer.NavigationData = new f14.Navigation.NavigationStack();
        function Navigate() {
            var path = Explorer.NavigationData.GetCurrentPath();
            if (f14.Core.Config.DEBUG) {
                console.log('Navigate => ' + path);
            }
            f14.Core.Config.dataService.LoadFileSystemInfo(path, function (payload) {
                f14.UI.RenderFileStruct(payload.data.folders, payload.data.files);
            });
        }
        function NavigateTo(folderPath) {
            if (folderPath === undefined) {
                throw "Folder path must be set.";
            }
            // Clear current navigation stack.
            Explorer.NavigationData.Clear();
            Explorer.NavigationData.Add(folderPath);
            Navigate();
        }
        Explorer.NavigateTo = NavigateTo;
        function GoForward(folderName) {
            if (folderName) {
                Explorer.NavigationData.Add(folderName);
                Navigate();
            }
            else {
                // TODO: Move to last forward history.
            }
        }
        Explorer.GoForward = GoForward;
        function GoBack() {
            Explorer.NavigationData.Pop();
            Navigate();
        }
        Explorer.GoBack = GoBack;
        /**
         * Navigate to the current location. Using for redraw file struct section.
         */
        function ReNavigate() {
            Navigate();
        }
        Explorer.ReNavigate = ReNavigate;
        function OpenFile(fileName) {
            // TODO: Open file
        }
        Explorer.OpenFile = OpenFile;
    })(Explorer = f14.Explorer || (f14.Explorer = {}));
})(f14 || (f14 = {}));
