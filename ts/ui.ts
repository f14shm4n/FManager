namespace f14.UI {
    import models = f14.Models;
    import config = f14.Core.Config;

    var Body: JQuery;
    var _uIContainer: UIContainer;

    // Public API

    export function Render(): void {
        PrepareMarkup();
        CreateUIBase();
    }

    export function RenderFileStruct(folders: models.FolderInfo[], files: models.FileInfo[]): void {
        if (config.DEBUG) {
            console.log('Folders: ' + folders.length + ' Files: ' + files.length);
        }
        _uIContainer.ContentPanel.FileStructPanel.Fill(folders, files);
    }

    export function GetCheckedItems(): FileStructItem[] {
        return _uIContainer.ContentPanel.FileStructPanel.GetCheckedItems();
    }

    export function ShowPopup(popup: Popups.Popup): void {
        if (!_uIContainer.PopupContainer) {
            throw "Popup container not created.";
        }
        _uIContainer.PopupContainer.SetPopup(popup);
    }

    export function HidePopup(): void {
        _uIContainer.PopupContainer.UnsetPopup();
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
    }

    // Classes

    export interface IJQueryObject {
        $This: JQuery;
    }

    export class UIContainer implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-container');
            this.$This.append((this.PopupContainer = new PopupContainer()).$This);
            this.$This.append((this.ContentPanel = new ContentPanel()).$This);
        }

        public $This: JQuery;
        public PopupContainer: PopupContainer;
        public ContentPanel: ContentPanel;
    }

    export class PopupContainer implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-popup-container');
            this.$This.css('opacity', '0');
            this.$This.css('display', 'none');
        }

        public $This: JQuery;
        public Popup: Popups.Popup;

        public SetPopup(popup: Popups.Popup): void {
            if (this.Popup) {
                this.UnsetPopup();
                let self = this;
                setTimeout(function () {
                    self.SetPopup(popup);
                }, 500);
            } else {
                this.Popup = popup;
                this.$This.append(popup.$This);
                this.$This.css('display', 'flex');
                this.$This.fadeTo(150, 1);
            }
        }

        public UnsetPopup(): void {
            if (this.Popup) {
                let self = this;
                this.$This.fadeTo(150, 0, function () {
                    self.$This.css('display', 'none');
                    self.$This.empty();
                    self.Popup = undefined;
                });
            }
        }
    }

    export class ContentPanel implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-content-panel');
            this.$This.append((this.FileActionPanel = new FileActionPanel()).$This);
            this.$This.append((this.FileStructPanel = new FileStructPanel()).$This);
        }
        public $This: JQuery;
        public FileActionPanel: FileActionPanel;
        public FileStructPanel: FileStructPanel;
    }

    export class FileActionPanel implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-file-action-panel');
            this.$This.append((this.LogoButton = new LogoButton()).$This);
            this.$This.append((this.ActionButtonsPanel = new ActionPanel()).$This);
        }

        public $This: JQuery;
        public LogoButton: LogoButton;
        public ActionButtonsPanel: ActionPanel;
    }

    export class FileStructPanel implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-file-struct-panel');
        }
        public $This: JQuery;
        public Items: FileStructItem[] = [];

        public Fill(folders: models.FolderInfo[], files: models.FileInfo[]): void {
            this.Items.length = 0;

            if (core.currentFolderPath !== core.Config.rootFolder) {
                this.AddItem(models.FileSystemItemType.Back);
            }

            for (var i in folders) {
                this.AddItem(models.FileSystemItemType.Folder, folders[i]);
            }

            for (var i in files) {
                this.AddItem(models.FileSystemItemType.File, files[i]);
            }
        }

        private AddItem(type: models.FileSystemItemType, data?: models.IFileSystemInfo): void {
            if (type === models.FileSystemItemType.Back) {
                data = { name: 'up' };
            }

            var item = new FileStructItem(type, data);
            this.Items.push(item);
            this.$This.append(item.$This);
        }

        public GetCheckedItems(): FileStructItem[] {
            return this.Items.filter((x) => x.CheckState);
        }
    }

    export class ActionPanel implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-action-buttons-panel');

            this.AddButton(new DoneActionButton());
            this.AddButton(new UploadActionButton());
            this.AddButton(new CreateActionButton());
            this.AddButton(new RenameActionButton());
            this.AddButton(new DeleteActionButton());
            this.AddButton(new MoveActionButton());
            this.AddButton(new SelectAllActionButton());
            this.AddButton(new InverseSelectionActionButton());
        }
        public $This: JQuery;
        public Buttons: ActionButton[] = [];

        public AddButton(btn: ActionButton): void {
            this.Buttons.push(btn);
            this.$This.append(btn.$This);
        }
    }

    export class FileStructItem implements IJQueryObject {
        constructor(type: models.FileSystemItemType, data: models.IFileSystemInfo) {
            this.$This = $('<div>')
                .addClass('ui-file-struct-item')
                .data('type', type)
                .data('name', data.name)
                .on('click', e => this.ContainerClickHandler(e, this));

            this.iconContainer = $('<div>').addClass('ui-item-icon');
            this.nameContainer;
            this.icon = $('<i>');
            this.iconContainer.append(this.icon);

            switch (type) {
                case models.FileSystemItemType.File:
                    this.icon.addClass('mdl2-file');
                    break;
                case models.FileSystemItemType.Folder:
                    this.icon.addClass('mdl2-folder');
                    break;
                case models.FileSystemItemType.Back:
                    this.icon.addClass('mdl2-more');
                    break;
            }

            if (type === models.FileSystemItemType.Back) {
                this.$This.data('move-back', true);
            } else {
                this.checkBox = $('<div>').addClass('ui-item-check');
                this.nameContainer = $('<div>').addClass('ui-item-name').text(data.name);
            }

            if (this.checkBox) {
                this.checkBox.on('click', e => this.CheckBoxStateChangeHandler(e, this));
                this.$This.append(this.checkBox);
            }

            this.$This.append(this.iconContainer);

            if (this.nameContainer) {
                this.$This.append(this.nameContainer);
            }
        }

        public $This: JQuery;
        public CheckState: boolean = false;
        private checkBox: JQuery;
        private iconContainer: JQuery;
        private nameContainer: JQuery;
        private icon: JQuery;

        private ContainerClickHandler(e: JQueryEventObject, self: FileStructItem) {
            if (self.$This.data('type') === models.FileSystemItemType.Folder) {
                let path: string;
                if (self.$This.data('move-back')) {
                    let lastSlash = core.currentFolderPath.lastIndexOf('/');
                    path = core.currentFolderPath.slice(0, lastSlash);
                } else {
                    let name = self.$This.data('name');
                    path = `${core.currentFolderPath}/${name}`;
                }
                f14.Explorer.Navigate(path);
            } else {
                if (self.checkBox) {
                    self.checkBox.trigger('click');
                }
            }
        }

        private CheckBoxStateChangeHandler(e: JQueryEventObject, self: FileStructItem) {
            if (self.checkBox.hasClass('checked')) {
                self.checkBox.removeClass('checked');
                self.CheckState = false;
            } else {
                self.checkBox.addClass('checked');
                self.CheckState = true;
            }
            if (core.Config.DEBUG) {
                console.log('ItemContainerCheckState: ' + self.$This.data('check-state'));
            }
            e.stopPropagation();
        }
    }

    // UI Buttons

    export class BaseButton implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-btn');
        }
        public $This: JQuery;

        public SetText(text: string): void {
            this.$This.text(text);
        }
    }

    export class ActionButton extends BaseButton {
        constructor() {
            super();
            this.$This.addClass('ui-action-btn');
        }
    }

    export class LogoButton implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-logo-button');

            var text = $('<span>').text(core.Title);
            this.$This.append(text);
        }

        public $This: JQuery;
    }

    //#endregion

    // System action buttons     

    export class DoneActionButton extends ActionButton {
        constructor() {
            super();

            this.$This.addClass('btn-done');
            this.SetText
            this.$This.text(f14.Utils.getString('.io.accept'));

            this.$This.on('click', function () {
                console.log('Done');
            });
        }
    }

    export class UploadActionButton extends ActionButton {
        constructor() {
            super();

            this.$This.addClass('btn-upload');
            this.SetText(f14.Utils.getString('.io.upload'));

            this.$This.on('click', function () {
                console.log('Upload');
            });
        }
    }

    export class CreateActionButton extends ActionButton {
        constructor() {
            super();

            this.SetText(f14.Utils.getString('.io.create'));

            this.$This.on('click', function () {
                console.log('Create');
            });
        }
    }

    export class RenameActionButton extends ActionButton {
        constructor() {
            super();

            this.SetText(f14.Utils.getString('.io.rename'));

            this.$This.on('click', function () {
                let items: FileStructItem[] = ui.GetCheckedItems();
                let names: string[] = items.map(x => x.$This.data('name'));
                names.forEach((x) => console.log(x));

                let popup: Popups.Popup = new Popups.RenamePopup(items);
                ShowPopup(popup);
            });
        }
    }

    export class DeleteActionButton extends ActionButton {
        constructor() {
            super();

            this.SetText(f14.Utils.getString('.io.delete'));

            this.$This.on('click', function () {
                console.log('Delete');
            });
        }
    }

    export class MoveActionButton extends ActionButton {
        constructor() {
            super();

            this.SetText(f14.Utils.getString('.io.move'));

            this.$This.on('click', function () {
                console.log('Move');
            });
        }
    }

    export class SelectAllActionButton extends ActionButton {
        constructor() {
            super();

            this.SetText(f14.Utils.getString('.io.select-all'));

            this.$This.on('click', function () {
                console.log('Select All');
            });
        }
    }

    export class InverseSelectionActionButton extends ActionButton {
        constructor() {
            super();

            this.SetText(f14.Utils.getString('.io.inverse-selection'));

            this.$This.on('click', function () {
                console.log('Inverse selection');
            });
        }
    }

    // TextBoxes

    export class TextBox implements IJQueryObject {
        constructor() {
            this.$This = $('<input>').addClass('ui-textbox');
        }

        public $This: JQuery;
    }
}
