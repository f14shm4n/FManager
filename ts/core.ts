namespace f14.Core {

    export class Configuration {
        rootFolder: string;
        actionRequest: string;
        uploadRequest: string;
        xhrBeforeSend: (xhr: XMLHttpRequest) => void;
        selectCallback: (selectedObjects: string[]) => void;
        dataService: Data.IDataService;
        actionButtons: Models.ActionButtonInfo[] = [];
        allowShortcuts: boolean = false;
        uploadFileFilter: string;
        DEBUG: boolean = false;
    }

    export var L10NPrefix: string = 'f14fm';
    export var Title: string = 'FManager';
    export var TitleShort: string = 'FM';

    export var Config: Configuration = new Configuration();
    export var AppBuffer: Memory.AppBuffer = new Memory.AppBuffer();

    var shortcutsObjects: IStringMap<UI.IShortcutCommand> = {};

    export function Configure(settings: Configuration): void {
        if (settings) {
            $.extend(true, Config, settings);
        }
        CheckRequiredValues();

        if (Config.allowShortcuts) {
            // TODO: Shorcuts
            window.addEventListener('keydown', e => {
                let cmd = FindCommandForShortcut([]);
                if (cmd) {
                    cmd.Execute();
                }
                e.preventDefault();
            }, false);
        }
    }

    export function RegisterShortcut(cmd: UI.IShortcutCommand): void {
        shortcutsObjects[cmd.shortcut] = cmd;
    }

    function FindCommandForShortcut(keys: string[]): UI.IShortcutCommand {
        return undefined;
    }

    function CheckRequiredValues(): void {
        if (Config.rootFolder === undefined) {
            throw "Root folder must be set.";
        }
        if (Config.dataService === undefined) {
            if (Config.DEBUG) {
                console.log('The data service is not specified, configure the data service as remote.');
            }
            Config.dataService = new Data.RemoteDataService(Config);
        }
    }
}