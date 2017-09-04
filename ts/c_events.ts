namespace f14.Events {
    export class IOObjectEvents {
        public static onItemClick(e: JQueryEventObject, self: UI.FileStructItem): void {
            self.TriggerCheckState();
        }

        public static onItemDoubleClick(e: JQueryEventObject, self: UI.FileStructItem): void {
            switch (self.Type) {
                case Models.FileSystemItemType.Back:
                    Explorer.GoBack();
                    break;
                case Models.FileSystemItemType.File:
                    Explorer.OpenFile(self.FileSystemInfo.name);
                    break;
                case Models.FileSystemItemType.Folder:
                    Explorer.GoForward(self.FileSystemInfo.name);
                    break;
            }
        }
    }

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

        public static CreateObject(e: JQueryEventObject): void {

        }

        public static DeleteObjects(e: JQueryEventObject): void {
            let items = UI.GetCheckedItems();
            if (items.length > 0) {
                let popup = new UI.Popups.DeletePopup(Explorer.NavigationData.GetCurrentPath(), items.map(x => x.FileSystemInfo.name));
                UI.ShowPopup(popup);
            }
        }

        public static MoveObjects(e: JQueryEventObject): void {
            ActionButtonEvents.PrepareItemsToMove('move');
        }

        public static CopyObjects(e: JQueryEventObject): void {
            ActionButtonEvents.PrepareItemsToMove('copy');
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

                Core.Config.dataService.MoveObjects(Ajax.MoveRequestData.From(op), payload => {
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
                opData.targets = items.map(x => new Ajax.MoveTarget(x.FileSystemInfo.name, x.Type == Models.FileSystemItemType.File));
                Core.AppBuffer.MoveOperation = opData;
            }
        }
    }
}