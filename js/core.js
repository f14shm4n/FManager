(function ($, ns, undefined) {

    if ($ === undefined) {
        throw new Error("jQuery is missing.");
    }

    if (typeof l10n === 'undefined' || !l10n.f14Info) {
        throw new Error("f14-l10n.js is missing.");
    }

    var _l10nPrefix = 'f14fm';

    ns.Title = 'FManager';

    ns.currentFolderPath = '';

    ns.config = {
        rootFolder: '',
        actionRequest: '',
        uploadRequest: undefined,
        xhrBeforeSend: xrh => { },        
        selectCallback: undefined,
        DEBUG: false,
        IS_TEST: false
    };

    ns.getString = function (key) {
        return l10n.getString(_l10nPrefix + key);
    };

    /**
    * Initialize file manager.
    * @param {PlainObject} config File manager configuration.
    */
    ns.init = function (settings) {                                     
        if (settings) {
            $.extend(true, ns.config, settings);
        }

        if (ns.config.actionRequest === 'undefined' || ns.config.actionRequest === '') {
            throw new Error("Request url is not set.");
        }
        if (ns.config.rootFolder === 'undefined' || ns.config.rootFolder === '') {
            throw new Error("RootFolder is not set.");
        }

        if (ns.config.DEBUG) {
            console.log(ns.config);
        }

        //this.contextMenuManager.initialize();
        ns.renderUI();        
        if (!ns.config.IS_TEST) {            
            ns.browse(ns.config.rootFolder);
        }
    };     

})(jQuery, window.f14fm = window.f14fm || {});