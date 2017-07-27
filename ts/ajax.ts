namespace f14.Ajax {

    import config = f14.Core.Config;

    export function GetFileSystemInfo(folderPath: string, onSuccess): void {
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

    function GetActionRequestAjaxData(): any {
        var ajaxSettings = {
            url: config.actionRequest,
            type: 'POST',
            contentType: 'application/json charset=utf-8',
            dataType: 'json',
            beforeSend: config.xhrBeforeSend
        };
        return ajaxSettings;
    }
}