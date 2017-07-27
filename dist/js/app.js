"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

"use strict";
var f14;
(function (f14) {
    var Core;
    (function (Core) {
        Core.L10NPrefix = 'f14fm';
        Core.Title = 'FManager';
        Core.currentFolderPath = undefined;
        Core.Config = {
            rootFolder: undefined,
            actionRequest: undefined,
            uploadRequest: undefined,
            xhrBeforeSend: function (xhr) { },
            selectCallback: undefined,
            DEBUG: false,
            IS_TEST: false,
            test_folders: undefined,
            test_files: undefined
        };
        function Configure(settings) {
            if (settings) {
                $.extend(true, Core.Config, settings);
            }
            CheckRequiredValues();
        }
        Core.Configure = Configure;
        function CheckRequiredValues() {
            if (Core.Config.rootFolder === undefined || Core.Config.rootFolder === '') {
                throw "Root folder must be set.";
            }
            if (Core.Config.actionRequest === undefined || Core.Config.actionRequest === '') {
                throw "Action request url must be set.";
            }
            if (Core.Config.DEBUG) {
                console.log(Core.Config);
            }
        }
    })(Core = f14.Core || (f14.Core = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Models;
    (function (Models) {
        var FileSystemItemType;
        (function (FileSystemItemType) {
            FileSystemItemType[FileSystemItemType["Folder"] = 0] = "Folder";
            FileSystemItemType[FileSystemItemType["File"] = 1] = "File";
            FileSystemItemType[FileSystemItemType["Back"] = 2] = "Back";
        })(FileSystemItemType = Models.FileSystemItemType || (Models.FileSystemItemType = {}));
        var BaseFileSystemInfo = (function () {
            function BaseFileSystemInfo(name) {
                this.name = name;
            }
            return BaseFileSystemInfo;
        }());
        var FileInfo = (function (_super) {
            __extends(FileInfo, _super);
            function FileInfo(name, extension) {
                var _this = _super.call(this, name) || this;
                _this.extension = extension;
                return _this;
            }
            return FileInfo;
        }(BaseFileSystemInfo));
        Models.FileInfo = FileInfo;
        var FolderInfo = (function (_super) {
            __extends(FolderInfo, _super);
            function FolderInfo(name) {
                return _super.call(this, name) || this;
            }
            return FolderInfo;
        }(BaseFileSystemInfo));
        Models.FolderInfo = FolderInfo;
    })(Models = f14.Models || (f14.Models = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Localization;
    (function (Localization) {
        function Init() {
            l10n.addLocaleMap({
                'ru': {
                    'f14fm.io.accept': 'Принять',
                    'f14fm.io.select-all': 'Выбрать все',
                    'f14fm.io.clear-selection': 'Снять выделение',
                    'f14fm.io.inverse-selection': 'Обратить выделение',
                    'f14fm.io.upload': 'Загрузить файлы',
                    'f14fm.io.delete': 'Удалить',
                    'f14fm.io.create': 'Создать',
                    'f14fm.io.rename': 'Переименовать',
                    'f14fm.io.move': 'Переместить',
                    'f14fm.close': 'Закрыть',
                    'f14fm.cancel': 'Отмена',
                },
                'en': {
                    'f14fm.io.accept': 'Done',
                    'f14fm.io.select-all': 'Select All',
                    'f14fm.io.clear-selection': 'Clear Selection',
                    'f14fm.io.inverse-selection': 'Inverse Selection',
                    'f14fm.io.upload': 'Upload Files',
                    'f14fm.io.delete': 'Delete',
                    'f14fm.io.create': 'Create',
                    'f14fm.io.rename': 'Rename',
                    'f14fm.io.move': 'Move',
                    'f14fm.close': 'Close',
                    'f14fm.cancel': 'Cancel'
                }
            });
        }
        Localization.Init = Init;
    })(Localization = f14.Localization || (f14.Localization = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Utils;
    (function (Utils) {
        function getString(key) {
            return l10n.getString(f14.Core.L10NPrefix + key);
        }
        Utils.getString = getString;
    })(Utils = f14.Utils || (f14.Utils = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        var models = f14.Models;
        var config = f14.Core.Config;
        var Body;
        var _uIContainer;
        // Public API
        function Render() {
            PrepareMarkup();
            CreateUIBase();
        }
        UI.Render = Render;
        function RenderFileStruct(folders, files) {
            if (config.DEBUG) {
                console.log('Folders: ' + folders.length + ' Files: ' + files.length);
            }
            _uIContainer.ContentPanel.FileStructPanel.Fill(folders, files);
        }
        UI.RenderFileStruct = RenderFileStruct;
        function GetCheckedItems() {
            return _uIContainer.ContentPanel.FileStructPanel.GetCheckedItems();
        }
        UI.GetCheckedItems = GetCheckedItems;
        function ShowPopup(popup) {
            if (!_uIContainer.PopupContainer) {
                throw "Popup container not created.";
            }
            _uIContainer.PopupContainer.SetPopup(popup);
        }
        UI.ShowPopup = ShowPopup;
        function HidePopup() {
            _uIContainer.PopupContainer.UnsetPopup();
        }
        UI.HidePopup = HidePopup;
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
            _uIContainer = new UIContainer();
            Body.prepend(_uIContainer.$This);
        }
        var UIContainer = (function () {
            function UIContainer() {
                this.$This = $('<div>').addClass('ui-container');
                this.$This.append((this.PopupContainer = new PopupContainer()).$This);
                this.$This.append((this.ContentPanel = new ContentPanel()).$This);
            }
            return UIContainer;
        }());
        UI.UIContainer = UIContainer;
        var PopupContainer = (function () {
            function PopupContainer() {
                this.$This = $('<div>').addClass('ui-popup-container');
                this.$This.css('opacity', '0');
                this.$This.css('display', 'none');
            }
            PopupContainer.prototype.SetPopup = function (popup) {
                if (this.Popup) {
                    this.UnsetPopup();
                    var self_1 = this;
                    setTimeout(function () {
                        self_1.SetPopup(popup);
                    }, 500);
                }
                else {
                    this.Popup = popup;
                    this.$This.append(popup.$This);
                    this.$This.css('display', 'flex');
                    this.$This.fadeTo(150, 1);
                }
            };
            PopupContainer.prototype.UnsetPopup = function () {
                if (this.Popup) {
                    var self_2 = this;
                    this.$This.fadeTo(150, 0, function () {
                        self_2.$This.css('display', 'none');
                        self_2.$This.empty();
                        self_2.Popup = undefined;
                    });
                }
            };
            return PopupContainer;
        }());
        UI.PopupContainer = PopupContainer;
        var ContentPanel = (function () {
            function ContentPanel() {
                this.$This = $('<div>').addClass('ui-content-panel');
                this.$This.append((this.FileActionPanel = new FileActionPanel()).$This);
                this.$This.append((this.FileStructPanel = new FileStructPanel()).$This);
            }
            return ContentPanel;
        }());
        UI.ContentPanel = ContentPanel;
        var FileActionPanel = (function () {
            function FileActionPanel() {
                this.$This = $('<div>').addClass('ui-file-action-panel');
                this.$This.append((this.LogoButton = new LogoButton()).$This);
                this.$This.append((this.ActionButtonsPanel = new ActionPanel()).$This);
            }
            return FileActionPanel;
        }());
        UI.FileActionPanel = FileActionPanel;
        var FileStructPanel = (function () {
            function FileStructPanel() {
                this.Items = [];
                this.$This = $('<div>').addClass('ui-file-struct-panel');
            }
            FileStructPanel.prototype.Fill = function (folders, files) {
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
            };
            FileStructPanel.prototype.AddItem = function (type, data) {
                if (type === models.FileSystemItemType.Back) {
                    data = { name: 'up' };
                }
                var item = new FileStructItem(type, data);
                this.Items.push(item);
                this.$This.append(item.$This);
            };
            FileStructPanel.prototype.GetCheckedItems = function () {
                return this.Items.filter(function (x) { return x.CheckState; });
            };
            return FileStructPanel;
        }());
        UI.FileStructPanel = FileStructPanel;
        var ActionPanel = (function () {
            function ActionPanel() {
                this.Buttons = [];
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
            ActionPanel.prototype.AddButton = function (btn) {
                this.Buttons.push(btn);
                this.$This.append(btn.$This);
            };
            return ActionPanel;
        }());
        UI.ActionPanel = ActionPanel;
        var FileStructItem = (function () {
            function FileStructItem(type, data) {
                var _this = this;
                this.CheckState = false;
                this.$This = $('<div>')
                    .addClass('ui-file-struct-item')
                    .data('type', type)
                    .data('name', data.name)
                    .on('click', function (e) { return _this.ContainerClickHandler(e, _this); });
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
                }
                else {
                    this.checkBox = $('<div>').addClass('ui-item-check');
                    this.nameContainer = $('<div>').addClass('ui-item-name').text(data.name);
                }
                if (this.checkBox) {
                    this.checkBox.on('click', function (e) { return _this.CheckBoxStateChangeHandler(e, _this); });
                    this.$This.append(this.checkBox);
                }
                this.$This.append(this.iconContainer);
                if (this.nameContainer) {
                    this.$This.append(this.nameContainer);
                }
            }
            FileStructItem.prototype.ContainerClickHandler = function (e, self) {
                if (self.$This.data('type') === models.FileSystemItemType.Folder) {
                    var path = void 0;
                    if (self.$This.data('move-back')) {
                        var lastSlash = core.currentFolderPath.lastIndexOf('/');
                        path = core.currentFolderPath.slice(0, lastSlash);
                    }
                    else {
                        var name_1 = self.$This.data('name');
                        path = core.currentFolderPath + "/" + name_1;
                    }
                    f14.Explorer.Navigate(path);
                }
                else {
                    if (self.checkBox) {
                        self.checkBox.trigger('click');
                    }
                }
            };
            FileStructItem.prototype.CheckBoxStateChangeHandler = function (e, self) {
                if (self.checkBox.hasClass('checked')) {
                    self.checkBox.removeClass('checked');
                    self.CheckState = false;
                }
                else {
                    self.checkBox.addClass('checked');
                    self.CheckState = true;
                }
                if (core.Config.DEBUG) {
                    console.log('ItemContainerCheckState: ' + self.$This.data('check-state'));
                }
                e.stopPropagation();
            };
            return FileStructItem;
        }());
        UI.FileStructItem = FileStructItem;
        // UI Buttons
        var BaseButton = (function () {
            function BaseButton() {
                this.$This = $('<div>').addClass('ui-btn');
            }
            BaseButton.prototype.SetText = function (text) {
                this.$This.text(text);
            };
            return BaseButton;
        }());
        UI.BaseButton = BaseButton;
        var ActionButton = (function (_super) {
            __extends(ActionButton, _super);
            function ActionButton() {
                var _this = _super.call(this) || this;
                _this.$This.addClass('ui-action-btn');
                return _this;
            }
            return ActionButton;
        }(BaseButton));
        UI.ActionButton = ActionButton;
        var LogoButton = (function () {
            function LogoButton() {
                this.$This = $('<div>').addClass('ui-logo-button');
                var text = $('<span>').text(core.Title);
                this.$This.append(text);
            }
            return LogoButton;
        }());
        UI.LogoButton = LogoButton;
        //#endregion
        // System action buttons     
        var DoneActionButton = (function (_super) {
            __extends(DoneActionButton, _super);
            function DoneActionButton() {
                var _this = _super.call(this) || this;
                _this.$This.addClass('btn-done');
                _this.SetText;
                _this.$This.text(f14.Utils.getString('.io.accept'));
                _this.$This.on('click', function () {
                    console.log('Done');
                });
                return _this;
            }
            return DoneActionButton;
        }(ActionButton));
        UI.DoneActionButton = DoneActionButton;
        var UploadActionButton = (function (_super) {
            __extends(UploadActionButton, _super);
            function UploadActionButton() {
                var _this = _super.call(this) || this;
                _this.$This.addClass('btn-upload');
                _this.SetText(f14.Utils.getString('.io.upload'));
                _this.$This.on('click', function () {
                    console.log('Upload');
                });
                return _this;
            }
            return UploadActionButton;
        }(ActionButton));
        UI.UploadActionButton = UploadActionButton;
        var CreateActionButton = (function (_super) {
            __extends(CreateActionButton, _super);
            function CreateActionButton() {
                var _this = _super.call(this) || this;
                _this.SetText(f14.Utils.getString('.io.create'));
                _this.$This.on('click', function () {
                    console.log('Create');
                });
                return _this;
            }
            return CreateActionButton;
        }(ActionButton));
        UI.CreateActionButton = CreateActionButton;
        var RenameActionButton = (function (_super) {
            __extends(RenameActionButton, _super);
            function RenameActionButton() {
                var _this = _super.call(this) || this;
                _this.SetText(f14.Utils.getString('.io.rename'));
                _this.$This.on('click', function () {
                    var items = ui.GetCheckedItems();
                    var names = items.map(function (x) { return x.$This.data('name'); });
                    names.forEach(function (x) { return console.log(x); });
                    var popup = new UI.Popups.RenamePopup(items);
                    ShowPopup(popup);
                });
                return _this;
            }
            return RenameActionButton;
        }(ActionButton));
        UI.RenameActionButton = RenameActionButton;
        var DeleteActionButton = (function (_super) {
            __extends(DeleteActionButton, _super);
            function DeleteActionButton() {
                var _this = _super.call(this) || this;
                _this.SetText(f14.Utils.getString('.io.delete'));
                _this.$This.on('click', function () {
                    console.log('Delete');
                });
                return _this;
            }
            return DeleteActionButton;
        }(ActionButton));
        UI.DeleteActionButton = DeleteActionButton;
        var MoveActionButton = (function (_super) {
            __extends(MoveActionButton, _super);
            function MoveActionButton() {
                var _this = _super.call(this) || this;
                _this.SetText(f14.Utils.getString('.io.move'));
                _this.$This.on('click', function () {
                    console.log('Move');
                });
                return _this;
            }
            return MoveActionButton;
        }(ActionButton));
        UI.MoveActionButton = MoveActionButton;
        var SelectAllActionButton = (function (_super) {
            __extends(SelectAllActionButton, _super);
            function SelectAllActionButton() {
                var _this = _super.call(this) || this;
                _this.SetText(f14.Utils.getString('.io.select-all'));
                _this.$This.on('click', function () {
                    console.log('Select All');
                });
                return _this;
            }
            return SelectAllActionButton;
        }(ActionButton));
        UI.SelectAllActionButton = SelectAllActionButton;
        var InverseSelectionActionButton = (function (_super) {
            __extends(InverseSelectionActionButton, _super);
            function InverseSelectionActionButton() {
                var _this = _super.call(this) || this;
                _this.SetText(f14.Utils.getString('.io.inverse-selection'));
                _this.$This.on('click', function () {
                    console.log('Inverse selection');
                });
                return _this;
            }
            return InverseSelectionActionButton;
        }(ActionButton));
        UI.InverseSelectionActionButton = InverseSelectionActionButton;
        // TextBoxes
        var TextBox = (function () {
            function TextBox() {
                this.$This = $('<input>').addClass('ui-textbox');
            }
            return TextBox;
        }());
        UI.TextBox = TextBox;
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        var Popups;
        (function (Popups) {
            var ui = f14.UI;
            var Popup = (function () {
                function Popup() {
                    this.FooterButtons = [];
                    this.$This = $('<div>').addClass('ui-popup');
                    this.Container = $('<div>').addClass('container').appendTo(this.$This);
                    this.Header = $('<div>').addClass('ui-popup-header');
                    this.Body = $('<div>').addClass('ui-popup-body');
                    this.Footer = $('<div>').addClass('ui-popup-footer');
                    this.Container
                        .append(this.Header)
                        .append(this.Body)
                        .append(this.Footer);
                }
                Popup.prototype.SetTitle = function (title) {
                    if (!this.Title) {
                        this.Title = $('<span>').addClass('ui-popup-title');
                        this.Header.append(this.Title);
                    }
                    this.Title.text(title);
                };
                Popup.prototype.AddFooterButton = function (btn) {
                    this.FooterButtons.push(btn);
                    this.Footer.append(btn.$This);
                };
                return Popup;
            }());
            Popups.Popup = Popup;
            var RenamePopup = (function (_super) {
                __extends(RenamePopup, _super);
                function RenamePopup(items) {
                    var _this = _super.call(this) || this;
                    _this.SetTitle(f14.Utils.getString('.io.rename'));
                    items.forEach(function (x) {
                        var iName = x.$This.data('name');
                        var tb = new ui.TextBox();
                        tb.$This.data('origin-name', iName);
                        tb.$This.val(iName);
                        _this.Body.append(tb.$This);
                    });
                    _this.AddFooterButton(new CloseButton());
                    return _this;
                }
                return RenamePopup;
            }(Popup));
            Popups.RenamePopup = RenamePopup;
            var CloseButton = (function (_super) {
                __extends(CloseButton, _super);
                function CloseButton() {
                    var _this = _super.call(this) || this;
                    _this.SetText(f14.Utils.getString('.close'));
                    _this.$This.on('click', function () {
                        ui.HidePopup();
                    });
                    return _this;
                }
                return CloseButton;
            }(ui.BaseButton));
        })(Popups = UI.Popups || (UI.Popups = {}));
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Explorer;
    (function (Explorer) {
        var core = f14.Core;
        var config = core.Config;
        var ajax = f14.Ajax;
        var ui = f14.UI;
        function Navigate(folderPath) {
            if (folderPath === undefined) {
                folderPath = config.rootFolder;
            }
            if (config.DEBUG) {
                console.log("Navigate to: " + folderPath);
            }
            core.currentFolderPath = folderPath;
            var renderFileStruct = function (payload) { return ui.RenderFileStruct(payload.folders, payload.files); };
            if (config.IS_TEST) {
                console.log('Test mode navigation.');
            }
            else {
                ajax.GetFileSystemInfo(folderPath, renderFileStruct);
            }
        }
        Explorer.Navigate = Navigate;
    })(Explorer = f14.Explorer || (f14.Explorer = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Ajax;
    (function (Ajax) {
        var config = f14.Core.Config;
        function GetFileSystemInfo(folderPath, onSuccess) {
            var settings = GetActionRequestAjaxData();
            settings.data = JSON.stringify({
                type: 'struct',
                folderPath: folderPath
            });
            settings.success = function (payload) {
                if (config.DEBUG) {
                    console.log(payload);
                }
                if (typeof onSuccess === 'function') {
                    onSuccess(payload);
                }
            };
            $.ajax(settings);
        }
        Ajax.GetFileSystemInfo = GetFileSystemInfo;
        function GetActionRequestAjaxData() {
            var ajaxSettings = {
                url: config.actionRequest,
                type: 'POST',
                contentType: 'application/json charset=utf-8',
                dataType: 'json',
                beforeSend: config.xhrBeforeSend
            };
            return ajaxSettings;
        }
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));

"use strict";
var core = f14.Core;
var localization = f14.Localization;
var ui = f14.UI;
var explorer = f14.Explorer;
var FManager = (function () {
    function FManager(settings) {
        localization.Init(); // Initialize localization
        core.Configure(settings); // Apply config
        ui.Render(); // Render ui
        if (!f14.Core.Config.IS_TEST) {
            // Navigate to root folder
            explorer.Navigate();
        }
    }
    return FManager;
}());
var FManagerTest = (function (_super) {
    __extends(FManagerTest, _super);
    function FManagerTest(settings) {
        var _this = _super.call(this, settings) || this;
        _this.GenerateTestData();
        return _this;
    }
    FManagerTest.prototype.GenerateTestData = function () {
        var folders = [];
        var files = [];
        for (var i = 0; i < 5; i++) {
            folders.push({ name: 'folder_' + i });
        }
        for (var i = 0; i < 50; i++) {
            files.push({ name: 'file_' + i + '.txt', extension: '.txt' });
        }
        f14.UI.RenderFileStruct(folders, files);
    };
    return FManagerTest;
}(FManager));
