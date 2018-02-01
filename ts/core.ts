namespace f14.Core {

    export class Configuration {
        rootFolder: string;
        xhrBeforeSend: (xhr: XMLHttpRequest) => void;
        selectCallback: (selectedObjects: string[]) => void = (files) => { };
        actionButtons: Models.ActionButtonInfo[] = [];
        allowShortcuts: boolean = false;
        uploadFileFilter: string;
        L10NProvider: L10n.IL10NProvider;
        DEBUG: boolean = false;
        MOCK: boolean = false;

        endPointUrlMap: IStringMap<string> = {};
        ajaxRequestMap: IStringMap<Ajax.IOperationRequest<Ajax.BaseParam, Ajax.BaseResult>> = {};
        inMemoryData: Memory.InMemoryNavigationMap;

        constructor() {
            this.ajaxRequestMap[Ajax.AjaxActionTypes.Copy] = new Ajax.CopyRequest(this);
            this.ajaxRequestMap[Ajax.AjaxActionTypes.Move] = new Ajax.MoveRequest(this);
            this.ajaxRequestMap[Ajax.AjaxActionTypes.CreateFolder] = new Ajax.CreateFolderRequest(this);
            this.ajaxRequestMap[Ajax.AjaxActionTypes.Delete] = new Ajax.DeleteRequest(this);
            this.ajaxRequestMap[Ajax.AjaxActionTypes.FolderStruct] = new Ajax.FolderStructRequest(this);
            this.ajaxRequestMap[Ajax.AjaxActionTypes.Rename] = new Ajax.RenameRequest(this);
            this.ajaxRequestMap[Ajax.AjaxActionTypes.UploadFile] = new Ajax.UploadFileRequest(this);
        }
    }

    export var L10NPrefix: string = "f14fm";
    export var Title: string = "FManager";
    export var TitleShort: string = "FM";

    export var Config: Configuration = new Configuration();
    export var AppBuffer: Memory.AppBuffer = new Memory.AppBuffer();

    var shortcutsObjects: IStringMap<UI.IShortcutCommand> = {};

    export function configure(settings: Configuration): void {
        if (settings) {
            $.extend(true, Config, settings);
        }

        if (!Config.MOCK) {
            checkRequiredValues();
        } else {
            useMockData();
        }

        if (Config.allowShortcuts) {
            // TODO: Shorcuts
            window.addEventListener("keydown", e => {
                let cmd = findCommandForShortcut([]);
                if (cmd) {
                    cmd.Execute();
                }
                e.preventDefault();
            }, false);
        }
    }

    export function registerShortcut(cmd: UI.IShortcutCommand): void {
        shortcutsObjects[cmd.shortcut] = cmd;
    }

    function findCommandForShortcut(keys: string[]): UI.IShortcutCommand {
        return undefined;
    }

    function checkRequiredValues(): void {
        if (Config.rootFolder === undefined) {
            throw "Root folder must be set.";
        }

        if (Config.endPointUrlMap === undefined || Object.keys(Config.endPointUrlMap).length == 0) {
            throw "The map with end point urls is empty or null.";
        }
    }

    function useMockData() {
        Config.endPointUrlMap[Ajax.AjaxActionTypes.UploadFile] = "action/upload/file";

        Config.inMemoryData = new Mock.MockNavigationMap();

        let ajaxMap = Config.ajaxRequestMap;

        ajaxMap[Ajax.AjaxActionTypes.Copy] = new Mock.MockCopyRequest(Config);
        ajaxMap[Ajax.AjaxActionTypes.Move] = new Mock.MockMoveRequest(Config);
        ajaxMap[Ajax.AjaxActionTypes.CreateFolder] = new Mock.MockCreateFolderRequest(Config);
        ajaxMap[Ajax.AjaxActionTypes.Delete] = new Mock.MockDeleteRequest(Config);
        ajaxMap[Ajax.AjaxActionTypes.FolderStruct] = new Mock.MockFolderStructRequest(Config);
        ajaxMap[Ajax.AjaxActionTypes.Rename] = new Mock.MockRenameRequest(Config);
        ajaxMap[Ajax.AjaxActionTypes.UploadFile] = new Mock.MockUploadFileRequest(Config);
    }
}