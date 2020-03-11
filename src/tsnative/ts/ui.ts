namespace f14.UI {

    var Body: JQuery;
    var _uIContainer: UIContainer;

    // Public API

    /**
     * Main render method.
     */
    export function Render(): void {
        PrepareMarkup();
        CreateUIBase();
    }

    /**
     * Render files and folder items in the struct panel.
     * @param folders 
     * @param files 
     */
    export function RenderFileStruct(folders: Models.DirectoryInfo[], files: Models.FileInfo[]): void {
        if (Core.Config.DEBUG) {
            console.log('Folders: ' + folders.length + ' Files: ' + files.length);
        }
        _uIContainer.ContentPanel.FileStructPanel.Fill(folders, files);
    }

    /**
     * Return main ui container.
     */
    export function GetUIContainer(): UIContainer {
        return _uIContainer;
    }

    /**
     * Get all files and folders ui items.
     */
    export function GetFileStructItemSet(): FileStructItem[] {
        return _uIContainer.ContentPanel.FileStructPanel.Items;
    }

    /**
     * Get all selected items.
     */
    export function GetCheckedItems(): FileStructItem[] {
        return _uIContainer.ContentPanel.FileStructPanel.GetCheckedItems();
    }
    /**
     * Show popup to the user.
     * @param popup Specified popup.
     */
    export function ShowPopup(popup: Popups.Popup): void {
        _uIContainer.PopupContainer.SetPopup(popup);
    }
    /**
     * Hide current popup.
     */
    export function HidePopup(): void {
        _uIContainer.PopupContainer.UnsetPopup();
    }
    /**
     * Show toast message to the user.
     * @param data Toast data.
     */
    export function ShowToast(data: Toasts.ToastData): void {
        _uIContainer.ToastContainer.Show(data);
    }
    /**
     * Hide toast.
     */
    export function HideToast(): void {
        _uIContainer.ToastContainer.Hide();
    }

    export function DisplayPayloadError(payload: Ajax.BaseResult) {
        if (payload.hasErrors()) {
            UI.ShowToast({
                message: payload.errors.join('\n'),
                title: 'Ajax response'
            });
        }
    }

    // Private API

    function PrepareMarkup(): void {
        if (_uIContainer) {
            _uIContainer.$This.remove();
            _uIContainer = null;
        }
    }

    function CreateUIBase(): void {
        Body = $('body');

        if (Body === undefined) {
            throw "Current html does not contains body element.";
        }

        _uIContainer = new UIContainer();
        Body.prepend(_uIContainer.$This);

        let config = Core.Config;
        let actionTypes = Ajax.AjaxActionTypes;
        let actionEvents = Events.ActionButtonEvents;
        let actionPanel = _uIContainer.ContentPanel.FileActionPanel.ActionPanel;

        // Show the accept button if callback is set.
        if (config.selectCallback) {
            actionPanel.AddButton(ActionButton.Create({
                classes: 'btn-primary',
                icon: 'mdl2-accept',
                text: Utils.getString('.io.accept'),
                action: Events.ActionButtonEvents.AcceptSelection
            }));
        }

        addActionButton(actionPanel, actionTypes.UploadFile, "btn-primary", "mdl2-upload", null, Utils.getString(".io.upload"), actionEvents.UploadObjects);
        addActionButton(actionPanel, actionTypes.CreateFolder, null, "mdl2-new-folder", null, Utils.getString(".io.create-folder"), actionEvents.CreateFolder);
        addActionButton(actionPanel, actionTypes.Delete, null, "mdl2-delete", null, Utils.getString(".io.delete"), actionEvents.DeleteObjects);
        addActionButton(actionPanel, actionTypes.Rename, null, "mdl2-rename", null, Utils.getString(".io.rename"), actionEvents.RenameObjects);
        addActionButton(actionPanel, actionTypes.Copy, null, "mdl2-copy", "ctrl+c", Utils.getString(".io.copy"), actionEvents.CopyObjects);
        addActionButton(actionPanel, actionTypes.Move, null, "mdl2-move", "ctrl+x", Utils.getString(".io.move"), actionEvents.MoveObjects);
        addActionButton(actionPanel, [actionTypes.Move, actionTypes.Copy], null, "mdl2-paste", "ctrl+v", Utils.getString(".io.paste"), actionEvents.PasteObjects);
        addActionButton(actionPanel, null, null, "mdl2-select-all", null, Utils.getString(".io.select-all"), actionEvents.SelectObjects);

        // Add button defined in configuration.
        if (config.actionButtons && config.actionButtons.length > 0) {
            for (let o of Core.Config.actionButtons) {
                actionPanel.AddButton(ActionButton.Create(o));
            }
        }
    }

    function addActionButton(panel: ActionPanel, actionTypes: string | string[], classes: string, icon: string,
        shortcut: string, text: string, action: (e: JQueryEventObject) => void): void {

        let hasAny: boolean = false;

        if (actionTypes != null) {
            if (Array.isArray(actionTypes)) {
                for (let t of actionTypes) {
                    if (Core.Config.endPointUrlMap[t]) {
                        hasAny = true;
                        break;
                    }
                }
            } else {
                hasAny = Core.Config.endPointUrlMap[actionTypes] != null;
            }
        } else {
            hasAny = true;
        }

        if (hasAny) {
            let buttonInfo: Models.ActionButtonInfo = {
                classes: classes,
                icon: icon,
                shortcut: shortcut,
                text: text,
                action: action
            };
            panel.AddButton(ActionButton.Create(buttonInfo));
        }
    }
}
