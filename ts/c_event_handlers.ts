namespace f14.Events {

    export class ActionButtonEvents {

        public static AcceptSelection(e: JQueryEventObject): void {
            let selectedItems = UI.GetCheckedItems().filter(x => x.Type === Models.FileSystemItemType.File);
            if (selectedItems.length > 0) {
                let selectedFiles: string[] = [];
                let currentFolderPath = Explorer.NavigationData.GetCurrentPath();

                selectedItems.forEach(x => {
                    selectedFiles.push(currentFolderPath + '/' + x.FileSystemInfo.name);
                });

                if (Core.Config.DEBUG) {
                    console.log(selectedFiles);
                }

                if (Core.Config.selectCallback) {
                    Core.Config.selectCallback(selectedFiles);
                }

                if (window.opener) {
                    window.opener.selectedFiles = selectedFiles;
                    window.close();
                }
            } else {
                UI.ShowToast({
                    message: Utils.getString('.toast.msg.selection.empty')
                });
            }
        }

        public static UploadObjects(e: JQueryEventObject): void {
            UI.ShowPopup(new UI.Popups.UploadFilesPopup());
        }

        public static RenameObjects(e: JQueryEventObject): void {
            let items: UI.FileStructItem[] = UI.GetCheckedItems();
            if (items.length > 0) {
                let popup: UI.Popups.Popup = new UI.Popups.RenamePopup(items[0]);
                UI.ShowPopup(popup);
            }
        }

        public static CreateFolder(e: JQueryEventObject): void {
            let param = new Ajax.CreateFolderParam(Explorer.NavigationData.GetCurrentPath(), "new folder");
            Core.Config.ajaxRequestMap[Ajax.AjaxActionTypes.CreateFolder].execute(param, payload => {
                let r = payload as Ajax.CreateFolderResult;
                if (r.hasErrors()) {
                    UI.DisplayPayloadError(r);
                } else {
                    UI.ShowToast({
                        message: Utils.getString(".toast.msg.dir.created")
                    });
                }
                Explorer.ReNavigate();
            });
        }

        public static DeleteObjects(e: JQueryEventObject): void {
            let items = UI.GetCheckedItems();
            if (items.length > 0) {
                let popup = new UI.Popups.DeletePopup(Explorer.NavigationData.GetCurrentPath(),
                    items.map(x => new Ajax.BaseActionTarget(x.FileSystemInfo.name, x.Type == Models.FileSystemItemType.File)));
                UI.ShowPopup(popup);
            }
        }

        public static MoveObjects(e: JQueryEventObject): void {
            ActionButtonEvents.PrepareItemsToMove(Ajax.AjaxActionTypes.Move);
        }

        public static CopyObjects(e: JQueryEventObject): void {
            ActionButtonEvents.PrepareItemsToMove(Ajax.AjaxActionTypes.Copy);
        }

        public static PasteObjects(e: JQueryEventObject): void {
            if (Core.AppBuffer.MoveOperation) {
                let op = Core.AppBuffer.MoveOperation;
                op.destinationDirectory = Explorer.NavigationData.GetCurrentPath();

                if (op.type === 'move' && op.destinationDirectory === op.sourceDirectory) {
                    UI.ShowToast({
                        message: Utils.getString('.toast.msg.same.folder')
                    })
                    return;
                }

                if (Core.Config.DEBUG) {
                    console.log(op);
                }

                var srcDir = op.sourceDirectory;
                var dstDir = op.destinationDirectory;
                var targets = op.targets.map((v, i, arr) => new Ajax.BaseActionTarget(v.name, v.isFile));
                var baseParam: Ajax.BaseParam;
                switch (op.type) {
                    case Ajax.AjaxActionTypes.Move:
                        baseParam = new Ajax.MoveParam(srcDir, dstDir, targets);
                        break;
                    case Ajax.AjaxActionTypes.Copy:
                        baseParam = new Ajax.CopyParam(srcDir, dstDir, targets);
                        break;
                }

                Core.Config.ajaxRequestMap[op.type].execute(baseParam, payload => {
                    if (payload.hasErrors()) {
                        UI.DisplayPayloadError(payload);
                    }
                    Explorer.ReNavigate();
                });
            }
        }

        public static SelectObjects(e: JQueryEventObject): void {
            let items = UI.GetFileStructItemSet();
            if (items.All(x => x.CheckState)) {
                items.forEach(x => x.SetCheckState(false));
            } else {
                items.forEach(x => x.SetCheckState(true));
            }
        }

        // Helpers

        private static PrepareItemsToMove(type: string): void {
            let items: UI.FileStructItem[] = UI.GetCheckedItems();
            if (items.length > 0) {
                let opData = new Memory.MoveOperationData();
                opData.type = type;
                opData.sourceDirectory = Explorer.NavigationData.GetCurrentPath();
                opData.targets = items.map(x => new Ajax.BaseActionTarget(x.FileSystemInfo.name, x.Type == Models.FileSystemItemType.File));
                Core.AppBuffer.MoveOperation = opData;
            }
        }
    }
}