"use strict";
var f14;
(function (f14) {
    var Ajax;
    (function (Ajax) {
        var config = f14.Core.Config;
        function GetFileSystemInfo(folderPath, onSuccess) {
            var settings = GetActionRequestAjaxData();
            settings.data = JSON.stringify({
                type: 'struct',
                folderPath: folderPath
            });
            settings.success = function (payload) {
                if (config.DEBUG) {
                    console.log(payload);
                }
                if (typeof onSuccess === 'function') {
                    onSuccess(payload);
                }
            };
            $.ajax(settings);
        }
        Ajax.GetFileSystemInfo = GetFileSystemInfo;
        function GetActionRequestAjaxData() {
            var ajaxSettings = {
                url: config.actionRequest,
                type: 'POST',
                contentType: 'application/json charset=utf-8',
                dataType: 'json',
                beforeSend: config.xhrBeforeSend
            };
            return ajaxSettings;
        }
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));
