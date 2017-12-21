namespace f14.UI {

    import models = f14.Models;

    type OnClickHandler = (e: JQueryEventObject, self: FileStructItem) => any;

    /**
     * JQuery based object.
     */
    export interface IJQueryObject {
        $This: JQuery;
    }
    /**
     * Main UI container.
     */
    export class UIContainer implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-container');
            this.$This.append((this.ToastContainer = new ToasContainer()).$This);
            this.$This.append((this.PopupContainer = new PopupContainer()).$This);
            this.$This.append((this.ContentPanel = new ContentPanel()).$This);
        }

        public $This: JQuery;
        public ToastContainer: ToasContainer;
        public PopupContainer: PopupContainer;
        public ContentPanel: ContentPanel;
    }
    /**
     * Toast notification container.
     */
    export class ToasContainer implements IJQueryObject {
        $This: JQuery;
        private $Title: JQuery;
        private $Message: JQuery;
        private isShown: boolean = false;

        public IsShown(): boolean {
            return this.isShown;
        }

        constructor() {
            this.$This = $('<div>').addClass('ui-toast-container');
            this.$Title = $('<div>').addClass('ui-toast-title').appendTo(this.$This);
            this.$Message = $('<div>').addClass('ui-toast-message').appendTo(this.$This);

            this.$Title.text('Toast title');
            this.$Message.text("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");

            this.$This.hide();
        }

        public Show(data: Toasts.ToastData): void {
            if (this.isShown) {
                return;
            }

            if (data.title && data.title.length > 0) {
                this.$Title.text(data.title);
                this.$Title.css('display', 'block');
            } else {
                this.$Title.css('display', 'none');
            }
            this.$Message.text(data.message);

            // Default: 3 sec.
            // Max: 10 sec.
            let timeout = Math.min(10000, data.timeout) || 3000;

            let callback = (self: ToasContainer) => {
                self.isShown = true;
                setTimeout(function () {
                    self.Hide();
                }, timeout);
            };

            this.$This.css({
                display: '',
                bottom: "-300px",
                opacity: "0"
            }).animate({
                bottom: "0px",
                opacity: "1"
            }, 400, () => callback(this));
        }

        public Hide(): void {
            this.$This.animate({
                bottom: "-300px",
                opacity: "0"
            }, 150, () => {
                this.isShown = false;
                this.$This.css('display', 'none');
            });
        }
    }
    /**
     * Main popup container.
     */
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
    /**
     * Container for other panels.
     */
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
    /**
     * The Panels with file actions.
     */
    export class FileActionPanel implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-file-action-panel');
            this.$This.append((this.LogoButton = new LogoButton()).$This);
            this.$This.append((this.ActionPanel = new ActionPanel()).$This);
        }

        public $This: JQuery;
        public LogoButton: LogoButton;
        public ActionPanel: ActionPanel;
    }
    /**
     * The Panel for represent file system.
     */
    export class FileStructPanel implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-file-struct-panel');
        }
        public $This: JQuery;
        public Items: FileStructItem[] = [];

        public Fill(folders: models.DirectoryInfo[], files: models.FileInfo[]): void {
            this.Items.length = 0;
            this.$This.empty();

            if (!f14.Explorer.NavigationData.IsRootPath()) {
                this.AddItem(models.FileSystemItemType.Back);
            }

            for (let i of folders) {
                this.AddItem(models.FileSystemItemType.Folder, i);
            }

            for (let i of files) {
                this.AddItem(models.FileSystemItemType.File, i);
            }
        }

        private AddItem(type: models.FileSystemItemType, data?: models.BaseFileInfo): void {
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
    /**
     * Container for action buttons.
     */
    export class ActionPanel implements IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-action-buttons-panel');
        }
        public $This: JQuery;
        public Buttons: ActionButton[] = [];

        public AddButton(btn: ActionButton): void {
            this.Buttons.push(btn);
            this.$This.append(btn.$This);
        }
    }

    /**
     * Represents the single file or folder item.
     */
    export class FileStructItem implements IJQueryObject {

        public Type: models.FileSystemItemType;
        public FileSystemInfo: models.BaseFileInfo;
        public CheckState: boolean = false;

        public $This: JQuery;
        private CheckBox: JQuery;
        private IconContainer: JQuery;
        private Icon: JQuery;
        private NameContainer: JQuery;

        constructor(type: models.FileSystemItemType, data: models.BaseFileInfo) {
            this.Type = type;
            this.FileSystemInfo = data;

            this.$This = $('<div>')
                .addClass('ui-file-struct-item ui-input-group')
                .on('click', e => this.TriggerCheckState())
                .on('dblclick', e => {
                    switch (this.Type) {
                        case Models.FileSystemItemType.Back:
                            Explorer.GoBack();
                            break;
                        case Models.FileSystemItemType.File:
                            Explorer.OpenFile(this.FileSystemInfo.name);
                            break;
                        case Models.FileSystemItemType.Folder:
                            Explorer.GoForward(this.FileSystemInfo.name);
                            break;
                    }
                });

            this.IconContainer = $('<div>').addClass('ui-item-icon');
            this.NameContainer;
            this.Icon = $('<i>');
            this.IconContainer.append(this.Icon);

            switch (type) {
                case models.FileSystemItemType.File:
                    this.Icon.addClass('mdl2-file');
                    break;
                case models.FileSystemItemType.Folder:
                    this.Icon.addClass('mdl2-folder');
                    break;
                case models.FileSystemItemType.Back:
                    this.Icon.addClass('mdl2-more');
                    break;
            }

            if (type !== models.FileSystemItemType.Back) {
                this.CheckBox = $('<div>').addClass('ui-item-check');
                this.NameContainer = $('<div>').addClass('ui-item-name').text(data.name);
            }

            if (this.CheckBox) {
                this.CheckBox.on('click', e => this.CheckBoxStateChangeHandler(e, this));

                this.createInputGroupItem('min').append(this.CheckBox).appendTo(this.$This);
            }

            this.createInputGroupItem('min').append(this.IconContainer).appendTo(this.$This);

            if (this.NameContainer) {
                this.createInputGroupItem('max').append(this.NameContainer).appendTo(this.$This);
            }

            // for (let p in this.FileSystemInfo.properties) {
            //     let pVal = this.FileSystemInfo.properties[p];
            //     this.createInputGroupItem('min')
            //         .append(
            //         $('<div>')
            //             .text(pVal)
            //             .css({
            //                 width: '100px'
            //             })).appendTo(this.$This);
            // }
        }

        private createInputGroupItem(cls: string): JQuery {
            return $('<div>').addClass('ui-input-group-item ' + cls);
        }

        public SetItemName(name: string): void {
            this.FileSystemInfo.name = name;
            this.NameContainer.text(name);
        }

        public SetCheckState(state: boolean): void {
            this.CheckState = state;
            if (this.CheckState) {
                this.$This.addClass('checked');
            } else {
                this.$This.removeClass('checked');
            }
        }

        public TriggerCheckState(): void {
            if (this.CheckBox && this.Type === Models.FileSystemItemType.File) {
                this.CheckBox.trigger('click');
            }
        }

        private CheckBoxStateChangeHandler(e: JQueryEventObject, self: FileStructItem) {
            self.SetCheckState(!self.CheckState);
            if (e) {
                e.stopPropagation();
            }
        }

        public ToString(): string {
            return `[Type: ${this.Type}, Name: ${this.FileSystemInfo.name}, CheckState: ${this.CheckState}`;
        }
    }
}