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

        // Add buttons
        let actionPanel = _uIContainer.ContentPanel.FileActionPanel.ActionPanel;
        // Show the accept button if callback is set.
        if (Core.Config.selectCallback) {
            actionPanel.AddButton(ActionButton.Create({
                classes: 'btn-primary',
                icon: 'mdl2-accept',
                text: Utils.getString('.io.accept'),
                action: Events.ActionButtonEvents.AcceptSelection
            }));
        }
        // Show the upload button if uploadUrl is set.
        if (Core.Config.uploadRequest) {
            actionPanel.AddButton(ActionButton.Create({
                classes: 'btn-primary',
                icon: 'mdl2-upload',
                text: Utils.getString('.io.upload'),
                action: Events.ActionButtonEvents.UploadObjects
            }));
        }
        // TODO: This action make sense if we can edit file after creation.
        // actionPanel.AddButton(ActionButton.Create({
        //     icon: 'mdl2-new-folder',
        //     text: Utils.getString('.io.create'),
        //     action: Events.ActionButtonEvents.CreateObject
        // }));
        actionPanel.AddButton(ActionButton.Create({
            icon: 'mdl2-delete',
            text: Utils.getString('.io.delete'),
            action: Events.ActionButtonEvents.DeleteObjects
        }));
        actionPanel.AddButton(ActionButton.Create({
            icon: 'mdl2-rename',
            text: Utils.getString('.io.rename'),
            action: Events.ActionButtonEvents.RenameObjects
        }));
        actionPanel.AddButton(ActionButton.Create({
            icon: 'mdl2-copy',
            text: Utils.getString('.io.copy'),
            shortcut: 'ctrl+c',
            action: Events.ActionButtonEvents.CopyObjects
        }));
        actionPanel.AddButton(ActionButton.Create({
            icon: 'mdl2-move',
            text: Utils.getString('.io.move'),
            shortcut: 'ctrl+x',
            action: Events.ActionButtonEvents.MoveObjects
        }));
        actionPanel.AddButton(ActionButton.Create({
            icon: 'mdl2-paste',
            text: Utils.getString('.io.paste'),
            shortcut: 'ctrl+v',
            action: Events.ActionButtonEvents.PasteObjects
        }));
        actionPanel.AddButton(ActionButton.Create({
            icon: 'mdl2-select-all',
            text: Utils.getString('.io.select-all'),
            action: Events.ActionButtonEvents.SelectObjects
        }));

        // Add button defined in configuration.
        if (Core.Config.actionButtons && Core.Config.actionButtons.length > 0) {
            for (let o of Core.Config.actionButtons) {
                actionPanel.AddButton(ActionButton.Create(o));
            }
        }
    }
}
