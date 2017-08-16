"use strict";
var f14;
(function (f14) {
    var Ajax;
    (function (Ajax) {
        var config = f14.Core.Config;
        function GetActionRequestAjaxData(onSuccess) {
            var ajaxSettings = {
                url: config.actionRequest,
                type: 'POST',
                contentType: 'application/json charset=utf-8',
                dataType: 'json',
                beforeSend: config.xhrBeforeSend,
                success: function (payload) {
                    if (config.DEBUG) {
                        console.log(payload);
                    }
                    if (typeof onSuccess === 'function') {
                        onSuccess(payload);
                    }
                }
            };
            return ajaxSettings;
        }
        function GetFileSystemInfo(folderPath, onSuccess) {
            var settings = GetActionRequestAjaxData(onSuccess);
            settings.data = JSON.stringify({
                type: 'struct',
                folderPath: folderPath
            });
            $.ajax(settings);
        }
        Ajax.GetFileSystemInfo = GetFileSystemInfo;
        function RenameObjects(requestData, onSuccess) {
            var settings = GetActionRequestAjaxData(onSuccess);
            settings.data = requestData;
            $.ajax(settings);
        }
        Ajax.RenameObjects = RenameObjects;
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));
