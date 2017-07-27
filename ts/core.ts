namespace f14.Core {

    export var L10NPrefix = 'f14fm';
    export var Title = 'FManager';

    export var currentFolderPath = undefined;

    export var Config = {
        rootFolder: undefined,
        actionRequest: undefined,
        uploadRequest: undefined,
        xhrBeforeSend: (xhr: XMLHttpRequest) => { },
        selectCallback: undefined,
        DEBUG: false,
        IS_TEST: false,
        test_folders: undefined,
        test_files: undefined
    };

    export function Configure(settings): void {
        if (settings) {
            $.extend(true, Config, settings);
        }
        CheckRequiredValues();
    }

    function CheckRequiredValues(): void {
        if (Config.rootFolder === undefined || Config.rootFolder === '') {
            throw "Root folder must be set.";
        }
        if (Config.actionRequest === undefined || Config.actionRequest === '') {
            throw "Action request url must be set.";
        }
        if (Config.DEBUG) {
            console.log(Config);
        }
    }
}