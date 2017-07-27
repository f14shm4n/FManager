; (function ($, ns) {
    ns.browse = function (folderPath) {
        if (ns.config.DEBUG) {
            console.log('Move to: ' + folderPath);
        }

        ns.currentFolderPath = folderPath;
        $.ajax({
            url: ns.config.actionRequest,
            type: 'POST',
            contentType: 'application/json charset=utf-8',
            dataType: 'json',
            beforeSend: ns.config.xhrBeforeSend,
            data: JSON.stringify({
                type: 'struct',
                folderPath: folderPath
            }),
            success: function (data) {
                if (ns.config.DEBUG === true) {
                    console.log(data);
                }
                ns.renderFileStruct(data.data.folders, data.data.files);
            }
        });
    };
})(jQuery, window.f14fm = window.f14fm || {});