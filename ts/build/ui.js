"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        var Body;
        var _uIContainer;
        // Public API
        /**
         * Main render method.
         */
        function Render() {
            PrepareMarkup();
            CreateUIBase();
        }
        UI.Render = Render;
        /**
         * Render files and folder items in the struct panel.
         * @param folders
         * @param files
         */
        function RenderFileStruct(folders, files) {
            if (f14.Core.Config.DEBUG) {
                console.log('Folders: ' + folders.length + ' Files: ' + files.length);
            }
            _uIContainer.ContentPanel.FileStructPanel.Fill(folders, files);
        }
        UI.RenderFileStruct = RenderFileStruct;
        /**
         * Return main ui container.
         */
        function GetUIContainer() {
            return _uIContainer;
        }
        UI.GetUIContainer = GetUIContainer;
        /**
         * Get all files and folders ui items.
         */
        function GetFileStructItemSet() {
            return _uIContainer.ContentPanel.FileStructPanel.Items;
        }
        UI.GetFileStructItemSet = GetFileStructItemSet;
        /**
         * Get all selected items.
         */
        function GetCheckedItems() {
            return _uIContainer.ContentPanel.FileStructPanel.GetCheckedItems();
        }
        UI.GetCheckedItems = GetCheckedItems;
        /**
         * Show popup to the user.
         * @param popup Specified popup.
         */
        function ShowPopup(popup) {
            _uIContainer.PopupContainer.SetPopup(popup);
        }
        UI.ShowPopup = ShowPopup;
        /**
         * Hide current popup.
         */
        function HidePopup() {
            _uIContainer.PopupContainer.UnsetPopup();
        }
        UI.HidePopup = HidePopup;
        /**
         * Show toast message to the user.
         * @param data Toast data.
         */
        function ShowToast(data) {
            _uIContainer.ToastContainer.Show(data);
        }
        UI.ShowToast = ShowToast;
        /**
         * Hide toast.
         */
        function HideToast() {
            _uIContainer.ToastContainer.Hide();
        }
        UI.HideToast = HideToast;
        // Private API
        function PrepareMarkup() {
            if (_uIContainer) {
                _uIContainer.$This.remove();
                _uIContainer = null;
            }
        }
        function CreateUIBase() {
            Body = $('body');
            if (Body === undefined) {
                throw "Current html does not contains body element.";
            }
            _uIContainer = new UI.UIContainer();
            Body.prepend(_uIContainer.$This);
            // Add buttons
            var actionPanel = _uIContainer.ContentPanel.FileActionPanel.ActionPanel;
            // Show the accept button if callback is set.
            if (f14.Core.Config.selectCallback) {
                actionPanel.AddButton(UI.ActionButton.Create({
                    classes: 'btn-primary',
                    icon: 'mdl2-accept',
                    text: f14.Utils.getString('.io.accept'),
                    action: f14.Events.ActionButtonEvents.AcceptSelection
                }));
            }
            // Show the upload button if uploadUrl is set.
            if (f14.Core.Config.uploadRequest) {
                actionPanel.AddButton(UI.ActionButton.Create({
                    classes: 'btn-primary',
                    icon: 'mdl2-upload',
                    text: f14.Utils.getString('.io.upload'),
                    action: f14.Events.ActionButtonEvents.UploadObjects
                }));
            }
            // TODO: This action make sense if we can edit file after creation.
            // actionPanel.AddButton(ActionButton.Create({
            //     icon: 'mdl2-new-folder',
            //     text: Utils.getString('.io.create'),
            //     action: Events.ActionButtonEvents.CreateObject
            // }));
            actionPanel.AddButton(UI.ActionButton.Create({
                icon: 'mdl2-delete',
                text: f14.Utils.getString('.io.delete'),
                action: f14.Events.ActionButtonEvents.DeleteObjects
            }));
            actionPanel.AddButton(UI.ActionButton.Create({
                icon: 'mdl2-rename',
                text: f14.Utils.getString('.io.rename'),
                action: f14.Events.ActionButtonEvents.RenameObjects
            }));
            actionPanel.AddButton(UI.ActionButton.Create({
                icon: 'mdl2-copy',
                text: f14.Utils.getString('.io.copy'),
                shortcut: 'ctrl+c',
                action: f14.Events.ActionButtonEvents.CopyObjects
            }));
            actionPanel.AddButton(UI.ActionButton.Create({
                icon: 'mdl2-move',
                text: f14.Utils.getString('.io.move'),
                shortcut: 'ctrl+x',
                action: f14.Events.ActionButtonEvents.MoveObjects
            }));
            actionPanel.AddButton(UI.ActionButton.Create({
                icon: 'mdl2-paste',
                text: f14.Utils.getString('.io.paste'),
                shortcut: 'ctrl+v',
                action: f14.Events.ActionButtonEvents.PasteObjects
            }));
            actionPanel.AddButton(UI.ActionButton.Create({
                icon: 'mdl2-select-all',
                text: f14.Utils.getString('.io.select-all'),
                action: f14.Events.ActionButtonEvents.SelectObjects
            }));
            // Add button defined in configuration.
            if (f14.Core.Config.actionButtons && f14.Core.Config.actionButtons.length > 0) {
                for (var _i = 0, _a = f14.Core.Config.actionButtons; _i < _a.length; _i++) {
                    var o = _a[_i];
                    actionPanel.AddButton(UI.ActionButton.Create(o));
                }
            }
        }
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));
