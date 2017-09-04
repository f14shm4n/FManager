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
Array.prototype.All = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
};
String.prototype.Format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var format = this;
    for (var p in args) {
        format = format.replace("{" + p + "}", arguments[p]);
    }
    return format;
};
// String.prototype.contains = function (conString) {
//     ///<signature>
//     ///<summary>Check source string for conString entries.</summary>
//     ///<param name='conString' type='String'>A string that must be found in source string.</param>
//     ///<return type="String">true - conString is found in source string; false - not found</retrun>
//     ///</signature>
//     return this.indexOf(conString) !== -1;
// };
// String.isNullOrWhitespace = function (input) {
//     if (typeof input === 'undefined' || input === null) return true;
//     return input.replace(/\s/g, '').length < 1;
// }; 

"use strict";

"use strict";
var f14;
(function (f14) {
    var Models;
    (function (Models) {
        var ActionButtonInfo = (function () {
            function ActionButtonInfo() {
            }
            return ActionButtonInfo;
        }());
        Models.ActionButtonInfo = ActionButtonInfo;
        var FileSystemItemType;
        (function (FileSystemItemType) {
            FileSystemItemType[FileSystemItemType["Folder"] = 0] = "Folder";
            FileSystemItemType[FileSystemItemType["File"] = 1] = "File";
            FileSystemItemType[FileSystemItemType["Back"] = 2] = "Back";
        })(FileSystemItemType = Models.FileSystemItemType || (Models.FileSystemItemType = {}));
        var FileSystemInfo = (function () {
            function FileSystemInfo(name, props) {
                this.properties = {};
                this.name = name;
                if (props) {
                    for (var i in props) {
                        this.properties[i] = props[i];
                    }
                }
            }
            return FileSystemInfo;
        }());
        Models.FileSystemInfo = FileSystemInfo;
        var FileInfo = (function (_super) {
            __extends(FileInfo, _super);
            function FileInfo(name, folder, props) {
                var _this = _super.call(this, name, props) || this;
                _this.Directory = folder;
                if (!_this.properties['extension']) {
                    _this.properties['extension'] = name.split('.').pop();
                }
                return _this;
            }
            return FileInfo;
        }(FileSystemInfo));
        Models.FileInfo = FileInfo;
        var DirectoryInfo = (function (_super) {
            __extends(DirectoryInfo, _super);
            function DirectoryInfo(name, parent, props) {
                var _this = _super.call(this, name, props) || this;
                _this.Folders = [];
                _this.Files = [];
                _this.Parent = parent;
                return _this;
            }
            DirectoryInfo.prototype.GetFullPath = function () {
                if (this.Parent !== undefined) {
                    return this.Parent.GetFullPath() + '/' + this.name;
                }
                return this.name;
            };
            DirectoryInfo.prototype.CreateFolder = function (name) {
                var folder = new DirectoryInfo(name, this);
                this.Folders.push(folder);
                return folder;
            };
            DirectoryInfo.prototype.CreateFile = function (name) {
                var file = new FileInfo(name, this);
                this.Files.push(file);
                return file;
            };
            DirectoryInfo.prototype.FileExists = function (name) {
                return this.Files.some(function (x) { return x.name === name; });
            };
            DirectoryInfo.prototype.FolderExists = function (name) {
                return this.Files.some(function (x) { return x.name === name; });
            };
            DirectoryInfo.prototype.GetFile = function (name) {
                var filtered = this.Files.filter(function (x) { return x.name === name; });
                if (filtered.length > 0) {
                    return filtered[0];
                }
                return undefined;
            };
            DirectoryInfo.prototype.GetFolder = function (name) {
                var filtered = this.Folders.filter(function (x) { return x.name === name; });
                if (filtered.length > 0) {
                    return filtered[0];
                }
                return undefined;
            };
            DirectoryInfo.prototype.GetObject = function (name) {
                return this.GetFile(name) || this.GetFolder(name);
            };
            DirectoryInfo.prototype.AddObject = function (obj) {
                if (obj instanceof FileSystemInfo) {
                    this._AddObject(obj);
                }
                else {
                    for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                        var i = obj_1[_i];
                        this._AddObject(i);
                    }
                }
            };
            DirectoryInfo.prototype._AddObject = function (obj) {
                if (obj instanceof FileInfo) {
                    if (this.FileExists(obj.name)) {
                        this.DeleteObject(obj.name);
                    }
                    this.Files.push(obj);
                }
                else if (obj instanceof DirectoryInfo) {
                    var dir = this.GetFolder(obj.name);
                    if (dir) {
                        dir.AddObject(obj.Files);
                        dir.AddObject(obj.Folders);
                    }
                    else {
                        this.Folders.push(obj);
                    }
                }
            };
            DirectoryInfo.prototype.DeleteObject = function (name) {
                return this._DeleteObject(this.Files, name) || this._DeleteObject(this.Folders, name);
            };
            DirectoryInfo.prototype._DeleteObject = function (collection, name) {
                for (var i = 0; i < collection.length; i++) {
                    var o = collection[i];
                    if (o.name === name) {
                        collection.splice(i, 1);
                        return o;
                    }
                }
                return undefined;
            };
            return DirectoryInfo;
        }(FileSystemInfo));
        Models.DirectoryInfo = DirectoryInfo;
    })(Models = f14.Models || (f14.Models = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Data;
    (function (Data) {
        var RemoteDataService = (function () {
            function RemoteDataService(config) {
                this.config = config;
            }
            RemoteDataService.prototype.GenerateActionRequestData = function (data, callback) {
                var _this = this;
                var ajaxSettings = {
                    url: this.config.actionRequest,
                    type: 'POST',
                    contentType: 'application/json charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    beforeSend: this.config.xhrBeforeSend,
                    success: function (payload) {
                        if (_this.config.DEBUG) {
                            console.log(payload);
                        }
                        if (callback) {
                            callback(payload);
                        }
                    }
                };
                return ajaxSettings;
            };
            RemoteDataService.prototype.GenerateUploadRequestData = function (data, callback, progress) {
                var _this = this;
                var ajaxSettings = {
                    url: this.config.uploadRequest,
                    type: 'POST',
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: data,
                    dataType: 'json',
                    beforeSend: this.config.xhrBeforeSend,
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload && progress) {
                            xhr.upload.addEventListener('progress', progress, false);
                        }
                        return xhr;
                    },
                    success: function (payload) {
                        if (_this.config.DEBUG) {
                            console.log(payload);
                        }
                        if (callback) {
                            callback(payload);
                        }
                    }
                };
                return ajaxSettings;
            };
            RemoteDataService.prototype.LoadFileSystemInfo = function (requestData, callback) {
                var settings = this.GenerateActionRequestData(requestData, callback);
                $.ajax(settings);
            };
            RemoteDataService.prototype.RenameObjects = function (requestData, callback) {
                var settings = this.GenerateActionRequestData(requestData, callback);
                $.ajax(settings);
            };
            RemoteDataService.prototype.DeleteObjects = function (requestData, callback) {
                var settings = this.GenerateActionRequestData(requestData, callback);
                $.ajax(settings);
            };
            RemoteDataService.prototype.CreateObject = function (requestData, callback) {
                var settings = this.GenerateActionRequestData(requestData, callback);
                $.ajax(settings);
            };
            RemoteDataService.prototype.MoveObjects = function (data, callback) {
                var settings = this.GenerateActionRequestData(data, callback);
                $.ajax(settings);
            };
            RemoteDataService.prototype.UploadFile = function (file, callback, progress) {
                var data = new FormData();
                data.append('path', f14.Explorer.NavigationData.GetCurrentPath());
                data.append('file', file);
                var settings = this.GenerateUploadRequestData(data, callback, progress);
                $.ajax(settings);
            };
            return RemoteDataService;
        }());
        Data.RemoteDataService = RemoteDataService;
        var InMemoryDataService = (function () {
            function InMemoryDataService(map) {
                this.map = map;
            }
            InMemoryDataService.prototype.LoadFileSystemInfo = function (requestData, callback) {
                var folder = this.map.GetFolderItemForPath(requestData.path);
                if (folder === undefined) {
                    throw "No folder info for given path: " + requestData.path;
                }
                var payload = {
                    data: {
                        folders: folder.Folders,
                        files: folder.Files
                    }
                };
                callback(payload);
            };
            InMemoryDataService.prototype.RenameObjects = function (requestData, callback) {
                var renameData = requestData;
                var folder = this.map.GetFolderItemForPath(renameData.path);
                if (folder === undefined) {
                    throw "No folder info for given path: " + renameData.path;
                }
                var renameInfo = renameData.renames[0];
                console.log(renameInfo);
                if (folder.FileExists(renameInfo.newName)) {
                    var msg = f14.Utils.getString('.popup.rename.error.exist').Format(renameInfo.newName);
                    callback({
                        error: msg,
                        data: { errors: [msg] }
                    });
                }
                else {
                    folder.GetObject(renameInfo.oldName).name = renameInfo.newName;
                    callback({ success: 'Done.', data: {} });
                }
            };
            InMemoryDataService.prototype.DeleteObjects = function (requestData, callback) {
                var data = requestData;
                var dir = this.map.GetFolderItemForPath(data.path);
                for (var _i = 0, _a = data.objectNames; _i < _a.length; _i++) {
                    var n = _a[_i];
                    dir.DeleteObject(n);
                }
                callback({
                    success: 'Done.',
                    data: {
                        affected: data.objectNames.length
                    }
                });
            };
            InMemoryDataService.prototype.CreateObject = function (requestData, callback) {
                throw new Error("Method not implemented.");
            };
            InMemoryDataService.prototype.MoveObjects = function (data, callback) {
                var payload = {};
                var srcDir = this.map.GetFolderItemForPath(data.sourceDirectory);
                var dstDir = this.map.GetFolderItemForPath(data.destinationDirectory);
                var itemsToMove = [];
                if (data.type === 'move') {
                    for (var _i = 0, _a = data.targets; _i < _a.length; _i++) {
                        var n = _a[_i];
                        var o = srcDir.DeleteObject(n.name);
                        if (o) {
                            itemsToMove.push(o);
                        }
                    }
                }
                else if (data.type === 'copy') {
                    for (var _b = 0, _c = data.targets; _b < _c.length; _b++) {
                        var n = _c[_b];
                        var o = srcDir.GetObject(n.name);
                        if (o) {
                            itemsToMove.push(o);
                        }
                    }
                }
                dstDir.AddObject(itemsToMove);
                callback(payload);
            };
            InMemoryDataService.prototype.UploadFile = function (file, callback, progress) {
                var interval = f14.Utils.NextInt(50, 150);
                var total = 100;
                var current = 0;
                var handlerId = setInterval(function () {
                    current += 1;
                    progress(new ProgressEvent('counter', {
                        lengthComputable: true,
                        total: total,
                        loaded: current
                    }));
                }, interval);
                setTimeout(function () {
                    clearInterval(handlerId);
                    var r = Math.round(Math.random());
                    if (r === 0) {
                        callback({
                            error: 'Fail.'
                        });
                    }
                    else {
                        callback({
                            success: 'Done.'
                        });
                    }
                }, interval * total);
            };
            return InMemoryDataService;
        }());
        Data.InMemoryDataService = InMemoryDataService;
    })(Data = f14.Data || (f14.Data = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Memory;
    (function (Memory) {
        var InMemoryNavigationMap = (function () {
            function InMemoryNavigationMap() {
                this.map = {};
            }
            InMemoryNavigationMap.prototype.GetFolderItemForPath = function (path) {
                return this.map[path];
            };
            InMemoryNavigationMap.prototype.CreateMap = function (root, skipRoot) {
                if (!skipRoot) {
                    this.map[root.GetFullPath()] = root;
                }
                for (var _i = 0, _a = root.Folders; _i < _a.length; _i++) {
                    var i = _a[_i];
                    this.map[i.GetFullPath()] = i;
                    if (i.Folders.length > 0) {
                        this.CreateMap(i, true);
                    }
                }
            };
            InMemoryNavigationMap.prototype.ToString = function () {
                var output = 'NavigationMap:';
                for (var i in this.map) {
                    output += '\n' + i;
                }
                return output;
            };
            return InMemoryNavigationMap;
        }());
        Memory.InMemoryNavigationMap = InMemoryNavigationMap;
        var MoveOperationData = (function () {
            function MoveOperationData() {
            }
            return MoveOperationData;
        }());
        Memory.MoveOperationData = MoveOperationData;
        var AppBuffer = (function () {
            function AppBuffer() {
            }
            return AppBuffer;
        }());
        Memory.AppBuffer = AppBuffer;
    })(Memory = f14.Memory || (f14.Memory = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Navigation;
    (function (Navigation) {
        var NavigationStack = (function () {
            function NavigationStack() {
                this.pathStack = [];
            }
            NavigationStack.prototype.Add = function (pathPart) {
                this.pathStack.push(pathPart);
            };
            NavigationStack.prototype.Pop = function () {
                return this.pathStack.pop();
            };
            NavigationStack.prototype.Clear = function () {
                this.pathStack.length = 0;
            };
            NavigationStack.prototype.GetCurrentPath = function () {
                var path = '';
                for (var _i = 0, _a = this.pathStack; _i < _a.length; _i++) {
                    var i = _a[_i];
                    path += i + '/';
                }
                return path.slice(0, path.length - 1);
            };
            NavigationStack.prototype.IsRootPath = function (path) {
                if (path === undefined) {
                    path = this.GetCurrentPath();
                }
                if (this.pathStack.length > 0) {
                    return this.pathStack[0] === path;
                }
                throw "Navigation path stack is empty. Critical error.";
            };
            return NavigationStack;
        }());
        Navigation.NavigationStack = NavigationStack;
    })(Navigation = f14.Navigation || (f14.Navigation = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Ajax;
    (function (Ajax) {
        var ResponseData = (function () {
            function ResponseData() {
                this.error = undefined;
                this.success = undefined;
            }
            return ResponseData;
        }());
        Ajax.ResponseData = ResponseData;
        var RenameFileInfo = (function () {
            function RenameFileInfo(oldName, newName, isFile) {
                this.oldName = oldName;
                this.newName = newName;
                this.isFile = isFile;
            }
            return RenameFileInfo;
        }());
        Ajax.RenameFileInfo = RenameFileInfo;
        var MoveTarget = (function () {
            function MoveTarget(name, isFile) {
                this.name = name;
                this.isFile = isFile;
            }
            return MoveTarget;
        }());
        Ajax.MoveTarget = MoveTarget;
        var BaseRequestData = (function () {
            function BaseRequestData(type) {
                this.type = type;
            }
            return BaseRequestData;
        }());
        Ajax.BaseRequestData = BaseRequestData;
        var FileSystemRequestData = (function (_super) {
            __extends(FileSystemRequestData, _super);
            function FileSystemRequestData(folderPath) {
                var _this = _super.call(this, 'struct') || this;
                _this.path = folderPath;
                return _this;
            }
            return FileSystemRequestData;
        }(BaseRequestData));
        Ajax.FileSystemRequestData = FileSystemRequestData;
        var RenameRequestData = (function (_super) {
            __extends(RenameRequestData, _super);
            function RenameRequestData(folderPath) {
                var _this = _super.call(this, 'rename') || this;
                _this.renames = [];
                _this.path = folderPath;
                return _this;
            }
            RenameRequestData.prototype.AddRenameItem = function (oldName, newName, isFile) {
                this.renames.push(new RenameFileInfo(oldName, newName, isFile));
            };
            RenameRequestData.prototype.HasData = function () {
                return this.renames.length > 0;
            };
            return RenameRequestData;
        }(BaseRequestData));
        Ajax.RenameRequestData = RenameRequestData;
        var DeleteRequestData = (function (_super) {
            __extends(DeleteRequestData, _super);
            function DeleteRequestData(folderPath, items) {
                var _this = _super.call(this, 'delete') || this;
                _this.objectNames = [];
                _this.path = folderPath;
                if (items && items.length > 0) {
                    items.forEach(function (x) { return _this.objectNames.push(x); });
                }
                return _this;
            }
            DeleteRequestData.prototype.Add = function (name) {
                this.objectNames.push(name);
            };
            return DeleteRequestData;
        }(BaseRequestData));
        Ajax.DeleteRequestData = DeleteRequestData;
        var MoveRequestData = (function (_super) {
            __extends(MoveRequestData, _super);
            function MoveRequestData(type, srcDir, destDir, targets) {
                var _this = _super.call(this, type) || this;
                _this.overwrite = false;
                _this.sourceDirectory = srcDir;
                _this.destinationDirectory = destDir;
                _this.targets = targets;
                return _this;
            }
            MoveRequestData.From = function (data) {
                return new MoveRequestData(data.type, data.sourceDirectory, data.destinationDirectory, data.targets);
            };
            return MoveRequestData;
        }(BaseRequestData));
        Ajax.MoveRequestData = MoveRequestData;
        var CreateRequestData = (function (_super) {
            __extends(CreateRequestData, _super);
            function CreateRequestData(type) {
                return _super.call(this, type) || this;
            }
            return CreateRequestData;
        }(BaseRequestData));
        Ajax.CreateRequestData = CreateRequestData;
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Events;
    (function (Events) {
        var IOObjectEvents = (function () {
            function IOObjectEvents() {
            }
            IOObjectEvents.onItemClick = function (e, self) {
                self.TriggerCheckState();
            };
            IOObjectEvents.onItemDoubleClick = function (e, self) {
                switch (self.Type) {
                    case f14.Models.FileSystemItemType.Back:
                        f14.Explorer.GoBack();
                        break;
                    case f14.Models.FileSystemItemType.File:
                        f14.Explorer.OpenFile(self.FileSystemInfo.name);
                        break;
                    case f14.Models.FileSystemItemType.Folder:
                        f14.Explorer.GoForward(self.FileSystemInfo.name);
                        break;
                }
            };
            return IOObjectEvents;
        }());
        Events.IOObjectEvents = IOObjectEvents;
        var ActionButtonEvents = (function () {
            function ActionButtonEvents() {
            }
            ActionButtonEvents.AcceptSelection = function (e) {
                var selectedItems = f14.UI.GetCheckedItems().filter(function (x) { return x.Type === f14.Models.FileSystemItemType.File; });
                if (selectedItems.length > 0) {
                    var selectedFiles_1 = [];
                    var currentFolderPath_1 = f14.Explorer.NavigationData.GetCurrentPath();
                    selectedItems.forEach(function (x) {
                        selectedFiles_1.push(currentFolderPath_1 + '/' + x.FileSystemInfo.name);
                    });
                    if (f14.Core.Config.DEBUG) {
                        console.log(selectedFiles_1);
                    }
                    if (f14.Core.Config.selectCallback) {
                        f14.Core.Config.selectCallback(selectedFiles_1);
                    }
                    if (window.opener) {
                        window.opener.selectedFiles = selectedFiles_1;
                        window.close();
                    }
                }
                else {
                    f14.UI.ShowToast({
                        message: f14.Utils.getString('.toast.msg.selection.empty')
                    });
                }
            };
            ActionButtonEvents.UploadObjects = function (e) {
                f14.UI.ShowPopup(new f14.UI.Popups.UploadFilesPopup());
            };
            ActionButtonEvents.RenameObjects = function (e) {
                var items = f14.UI.GetCheckedItems();
                if (items.length > 0) {
                    var popup = new f14.UI.Popups.RenamePopup(items[0]);
                    f14.UI.ShowPopup(popup);
                }
            };
            ActionButtonEvents.CreateObject = function (e) {
            };
            ActionButtonEvents.DeleteObjects = function (e) {
                var items = f14.UI.GetCheckedItems();
                if (items.length > 0) {
                    var popup = new f14.UI.Popups.DeletePopup(f14.Explorer.NavigationData.GetCurrentPath(), items.map(function (x) { return x.FileSystemInfo.name; }));
                    f14.UI.ShowPopup(popup);
                }
            };
            ActionButtonEvents.MoveObjects = function (e) {
                ActionButtonEvents.PrepareItemsToMove('move');
            };
            ActionButtonEvents.CopyObjects = function (e) {
                ActionButtonEvents.PrepareItemsToMove('copy');
            };
            ActionButtonEvents.PasteObjects = function (e) {
                if (f14.Core.AppBuffer.MoveOperation) {
                    var op = f14.Core.AppBuffer.MoveOperation;
                    op.destinationDirectory = f14.Explorer.NavigationData.GetCurrentPath();
                    if (op.type === 'move' && op.destinationDirectory === op.sourceDirectory) {
                        f14.UI.ShowToast({
                            message: f14.Utils.getString('.toast.msg.same.folder')
                        });
                        return;
                    }
                    if (f14.Core.Config.DEBUG) {
                        console.log(op);
                    }
                    f14.Core.Config.dataService.MoveObjects(f14.Ajax.MoveRequestData.From(op), function (payload) {
                        f14.Explorer.ReNavigate();
                    });
                }
            };
            ActionButtonEvents.SelectObjects = function (e) {
                var items = f14.UI.GetFileStructItemSet();
                if (items.All(function (x) { return x.CheckState; })) {
                    items.forEach(function (x) { return x.SetCheckState(false); });
                }
                else {
                    items.forEach(function (x) { return x.SetCheckState(true); });
                }
            };
            // Helpers
            ActionButtonEvents.PrepareItemsToMove = function (type) {
                var items = f14.UI.GetCheckedItems();
                if (items.length > 0) {
                    var opData = new f14.Memory.MoveOperationData();
                    opData.type = type;
                    opData.sourceDirectory = f14.Explorer.NavigationData.GetCurrentPath();
                    opData.targets = items.map(function (x) { return new f14.Ajax.MoveTarget(x.FileSystemInfo.name, x.Type == f14.Models.FileSystemItemType.File); });
                    f14.Core.AppBuffer.MoveOperation = opData;
                }
            };
            return ActionButtonEvents;
        }());
        Events.ActionButtonEvents = ActionButtonEvents;
    })(Events = f14.Events || (f14.Events = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Core;
    (function (Core) {
        var Configuration = (function () {
            function Configuration() {
                this.actionButtons = [];
                this.allowShortcuts = false;
                this.DEBUG = false;
            }
            return Configuration;
        }());
        Core.Configuration = Configuration;
        Core.L10NPrefix = 'f14fm';
        Core.Title = 'FManager';
        Core.TitleShort = 'FM';
        Core.Config = new Configuration();
        Core.AppBuffer = new f14.Memory.AppBuffer();
        var shortcutsObjects = {};
        function Configure(settings) {
            if (settings) {
                $.extend(true, Core.Config, settings);
            }
            CheckRequiredValues();
            if (Core.Config.allowShortcuts) {
                // TODO: Shorcuts
                window.addEventListener('keydown', function (e) {
                    var cmd = FindCommandForShortcut([]);
                    if (cmd) {
                        cmd.Execute();
                    }
                    e.preventDefault();
                }, false);
            }
        }
        Core.Configure = Configure;
        function RegisterShortcut(cmd) {
            shortcutsObjects[cmd.shortcut] = cmd;
        }
        Core.RegisterShortcut = RegisterShortcut;
        function FindCommandForShortcut(keys) {
            return undefined;
        }
        function CheckRequiredValues() {
            if (Core.Config.rootFolder === undefined) {
                throw "Root folder must be set.";
            }
            if (Core.Config.dataService === undefined) {
                if (Core.Config.DEBUG) {
                    console.log('The data service is not specified, configure the data service as remote.');
                }
                Core.Config.dataService = new f14.Data.RemoteDataService(Core.Config);
            }
        }
    })(Core = f14.Core || (f14.Core = {}));
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
                    'f14fm.io.select.files': 'Выбрать файлы',
                    'f14fm.io.delete': 'Удалить',
                    'f14fm.io.create': 'Создать',
                    'f14fm.io.rename': 'Переименовать',
                    'f14fm.io.move': 'Переместить',
                    'f14fm.io.copy': 'Копировать',
                    'f14fm.io.paste': 'Вставить',
                    'f14fm.apply': 'Применить',
                    'f14fm.close': 'Закрыть',
                    'f14fm.cancel': 'Отмена',
                    'f14fm.popup.delete.title': 'Удалить файлы и папки...',
                    'f14fm.popup.delete.desc': 'Вы уверены что хотите удалить эти файлы\\папки?',
                    'f14fm.popup.upload.title': 'Загрузка файлов',
                    'f14fm.popup.rename.error.exist': "\u0424\u0430\u0439\u043B \u0441 \u0442\u0430\u043A\u0438\u043C \u0438\u043C\u0435\u043D\u0435\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442! \u0418\u043C\u044F \u0444\u0430\u0439\u043B\u0430: {0}",
                    'f14fm.toast.msg.selection.empty': 'Ни один файл не выбран.',
                    'f14fm.toast.msg.same.folder': 'Папка назначения совпадает с исходной папкой.',
                    'f14fm.toast.delete.count.format': 'Удалено {0} объектов.',
                },
                'en': {
                    'f14fm.io.accept': 'Done',
                    'f14fm.io.select-all': 'Select All',
                    'f14fm.io.clear-selection': 'Clear Selection',
                    'f14fm.io.inverse-selection': 'Inverse Selection',
                    'f14fm.io.upload': 'Upload Files',
                    'f14fm.io.select.files': 'Select files',
                    'f14fm.io.delete': 'Delete',
                    'f14fm.io.create': 'Create',
                    'f14fm.io.rename': 'Rename',
                    'f14fm.io.move': 'Move',
                    'f14fm.io.copy': 'Copy',
                    'f14fm.io.paste': 'Paste',
                    'f14fm.io.apply': 'Apply',
                    'f14fm.close': 'Close',
                    'f14fm.cancel': 'Cancel',
                    'f14fm.popup.delete.title': 'Delete files and folders...',
                    'f14fm.popup.delete.desc': 'Are you sure you want to delete this files\\folders?',
                    'f14fm.popup.upload.title': 'File uploader',
                    'f14fm.popup.rename.error.exist': "A File with this name already exists! File name: {0}",
                    'f14fm.toast.msg.selection.empty': 'No selected files.',
                    'f14fm.toast.msg.same.folder': 'Destination folder coincides with the source folder.',
                    'f14fm.toast.delete.count.format': '{0} items deleted.',
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
        function NextInt(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }
        Utils.NextInt = NextInt;
    })(Utils = f14.Utils || (f14.Utils = {}));
})(f14 || (f14 = {}));

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

"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        var models = f14.Models;
        /**
         * Main UI container.
         */
        var UIContainer = (function () {
            function UIContainer() {
                this.$This = $('<div>').addClass('ui-container');
                this.$This.append((this.ToastContainer = new ToasContainer()).$This);
                this.$This.append((this.PopupContainer = new PopupContainer()).$This);
                this.$This.append((this.ContentPanel = new ContentPanel()).$This);
            }
            return UIContainer;
        }());
        UI.UIContainer = UIContainer;
        /**
         * Toast notification container.
         */
        var ToasContainer = (function () {
            function ToasContainer() {
                this.isShown = false;
                this.$This = $('<div>').addClass('ui-toast-container');
                this.$Title = $('<div>').addClass('ui-toast-title').appendTo(this.$This);
                this.$Message = $('<div>').addClass('ui-toast-message').appendTo(this.$This);
                this.$Title.text('Toast title');
                this.$Message.text("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");
                this.$This.hide();
            }
            ToasContainer.prototype.IsShown = function () {
                return this.isShown;
            };
            ToasContainer.prototype.Show = function (data) {
                var _this = this;
                if (this.isShown) {
                    return;
                }
                if (data.title && data.title.length > 0) {
                    this.$Title.text(data.title);
                    this.$Title.css('display', 'block');
                }
                else {
                    this.$Title.css('display', 'none');
                }
                this.$Message.text(data.message);
                // Default: 3 sec.
                // Max: 10 sec.
                var timeout = Math.min(10000, data.timeout) || 3000;
                var callback = function (self) {
                    self.isShown = true;
                    setTimeout(function () {
                        self.Hide();
                    }, timeout);
                };
                this.$This.css({
                    display: '',
                    top: "-300px",
                    opacity: "0"
                }).animate({
                    top: "0px",
                    opacity: "1"
                }, 400, function () { return callback(_this); });
            };
            ToasContainer.prototype.Hide = function () {
                var _this = this;
                this.$This.animate({
                    top: "-300px",
                    opacity: "0"
                }, 150, function () {
                    _this.isShown = false;
                    _this.$This.css('display', 'none');
                });
            };
            return ToasContainer;
        }());
        UI.ToasContainer = ToasContainer;
        /**
         * Main popup container.
         */
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
        /**
         * Container for other panels.
         */
        var ContentPanel = (function () {
            function ContentPanel() {
                this.$This = $('<div>').addClass('ui-content-panel');
                this.$This.append((this.FileActionPanel = new FileActionPanel()).$This);
                this.$This.append((this.FileStructPanel = new FileStructPanel()).$This);
            }
            return ContentPanel;
        }());
        UI.ContentPanel = ContentPanel;
        /**
         * The Panels with file actions.
         */
        var FileActionPanel = (function () {
            function FileActionPanel() {
                this.$This = $('<div>').addClass('ui-file-action-panel');
                this.$This.append((this.LogoButton = new UI.LogoButton()).$This);
                this.$This.append((this.ActionPanel = new ActionPanel()).$This);
            }
            return FileActionPanel;
        }());
        UI.FileActionPanel = FileActionPanel;
        /**
         * The Panel for represent file system.
         */
        var FileStructPanel = (function () {
            function FileStructPanel() {
                this.Items = [];
                this.$This = $('<div>').addClass('ui-file-struct-panel');
            }
            FileStructPanel.prototype.Fill = function (folders, files) {
                this.Items.length = 0;
                this.$This.empty();
                if (!f14.Explorer.NavigationData.IsRootPath()) {
                    this.AddItem(models.FileSystemItemType.Back);
                }
                for (var _i = 0, folders_1 = folders; _i < folders_1.length; _i++) {
                    var i = folders_1[_i];
                    this.AddItem(models.FileSystemItemType.Folder, i);
                }
                for (var _a = 0, files_1 = files; _a < files_1.length; _a++) {
                    var i = files_1[_a];
                    this.AddItem(models.FileSystemItemType.File, i);
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
        /**
         * Container for action buttons.
         */
        var ActionPanel = (function () {
            function ActionPanel() {
                this.Buttons = [];
                this.$This = $('<div>').addClass('ui-action-buttons-panel');
            }
            ActionPanel.prototype.AddButton = function (btn) {
                this.Buttons.push(btn);
                this.$This.append(btn.$This);
            };
            return ActionPanel;
        }());
        UI.ActionPanel = ActionPanel;
        /**
         * Represents the single file or folder item.
         */
        var FileStructItem = (function () {
            function FileStructItem(type, data) {
                var _this = this;
                this.CheckState = false;
                this.Type = type;
                this.FileSystemInfo = data;
                this.$This = $('<div>')
                    .addClass('ui-file-struct-item ui-input-group')
                    .on('click', function (e) { return f14.Events.IOObjectEvents.onItemClick(e, _this); })
                    .on('dblclick', function (e) { return f14.Events.IOObjectEvents.onItemDoubleClick(e, _this); });
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
                    this.CheckBox.on('click', function (e) { return _this.CheckBoxStateChangeHandler(e, _this); });
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
            FileStructItem.prototype.createInputGroupItem = function (cls) {
                return $('<div>').addClass('ui-input-group-item ' + cls);
            };
            FileStructItem.prototype.SetItemName = function (name) {
                this.FileSystemInfo.name = name;
                this.NameContainer.text(name);
            };
            FileStructItem.prototype.SetCheckState = function (state) {
                this.CheckState = state;
                if (this.CheckState) {
                    this.$This.addClass('checked');
                }
                else {
                    this.$This.removeClass('checked');
                }
            };
            FileStructItem.prototype.TriggerCheckState = function () {
                if (this.CheckBox && this.Type === f14.Models.FileSystemItemType.File) {
                    this.CheckBox.trigger('click');
                }
            };
            FileStructItem.prototype.CheckBoxStateChangeHandler = function (e, self) {
                self.SetCheckState(!self.CheckState);
                if (e) {
                    e.stopPropagation();
                }
            };
            FileStructItem.prototype.ToString = function () {
                return "[Type: " + this.Type + ", Name: " + this.FileSystemInfo.name + ", CheckState: " + this.CheckState;
            };
            return FileStructItem;
        }());
        UI.FileStructItem = FileStructItem;
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        /**
         * The button base element.
         */
        var BaseButton = (function () {
            function BaseButton(text, icon, classes) {
                this.$This = $('<div>').addClass('ui-btn');
                if (classes && classes.length > 0) {
                    this.$This.addClass(classes);
                }
                this.SetIcon(icon);
                this.SetText(text);
            }
            BaseButton.prototype.SetText = function (text) {
                if (!this.$Text) {
                    this.$Text = $('<span>').addClass('ui-btn-text').appendTo(this.$This);
                }
                if (!text) {
                    text = '';
                }
                this.$Text.text(text);
                this.$This.attr('title', text);
                return this;
            };
            BaseButton.prototype.SetIcon = function (iconCls) {
                if (iconCls !== undefined && iconCls.length > 0) {
                    if (!this.$Icon) {
                        this.$Icon = $('<i>').addClass('ui-btn-icon').addClass(iconCls).prependTo(this.$This);
                    }
                    else {
                        this.$Icon.removeClass();
                        this.$Icon.addClass(iconCls);
                    }
                }
                else {
                    if (this.$Icon) {
                        this.$Icon.remove();
                        this.$Icon = undefined;
                    }
                }
                return this;
            };
            BaseButton.prototype.OnClick = function (handler) {
                if (handler) {
                    this.$This.on('click', handler);
                }
                else {
                    this.$This.off('click');
                }
                return this;
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
            ActionButton.prototype.SetText = function (text) {
                return _super.prototype.SetText.call(this, text);
            };
            ActionButton.prototype.SetIcon = function (iconCls) {
                return _super.prototype.SetIcon.call(this, iconCls);
            };
            ActionButton.prototype.Execute = function () {
                this.$This.trigger('click');
            };
            ActionButton.Create = function (data) {
                var btn = new ActionButton();
                if (data.classes) {
                    btn.$This.addClass(data.classes);
                }
                btn.SetText(data.text);
                btn.SetIcon(data.icon);
                btn.OnClick(data.action);
                btn.shortcut = data.shortcut;
                return btn;
            };
            return ActionButton;
        }(BaseButton));
        UI.ActionButton = ActionButton;
        var LogoButton = (function () {
            function LogoButton() {
                var _this = this;
                this.$This = $('<div>').addClass('ui-logo-button');
                this.$Text = $('<span>')
                    .text(f14.Core.Title)
                    .appendTo(this.$This);
                this.$This.on('click', function (e) {
                    var panel = UI.GetUIContainer().ContentPanel.FileActionPanel;
                    if (panel.$This.hasClass('collapsed')) {
                        panel.$This.removeClass('collapsed');
                        _this.$Text.text(f14.Core.Title);
                    }
                    else {
                        panel.$This.addClass('collapsed');
                        _this.$Text.text('');
                    }
                });
            }
            return LogoButton;
        }());
        UI.LogoButton = LogoButton;
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
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
            //===============================================================//
            //=========================== Popup =============================//
            //===============================================================//
            var Popup = (function () {
                function Popup() {
                    this.FooterButtons = [];
                    this.$This = $('<div>').addClass('ui-popup');
                    this.Container = $('<div>').addClass('container').appendTo(this.$This);
                    this.Header = $('<div>').addClass('ui-popup-header');
                    this.Body = $('<div>').addClass('ui-popup-body');
                    this.Footer = $('<div>').addClass('ui-popup-footer');
                    this.AddErrorSection();
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
                Popup.prototype.AddErrorSection = function () {
                    this.ErrorSection = $('<div>').addClass('ui-popup-errors').appendTo(this.Body).hide();
                };
                Popup.prototype.PopulatePayloadErrors = function (payload) {
                    var _this = this;
                    this.ErrorSection.empty();
                    var addErrorItem = function (msg) {
                        $('<div>')
                            .addClass('ui-popup-error-message')
                            .text(msg)
                            .appendTo(_this.ErrorSection);
                    };
                    if (payload.data && payload.data.errors) {
                        for (var _i = 0, _a = payload.data.errors; _i < _a.length; _i++) {
                            var i = _a[_i];
                            addErrorItem(i);
                        }
                    }
                    else {
                        addErrorItem(payload.error);
                    }
                    this.ErrorSection.show(200);
                };
                Popup.prototype.GenerateButton = function (text, action) {
                    var btn = new UI.BaseButton();
                    btn.SetText(text);
                    if (action) {
                        btn.$This.on('click', action);
                    }
                    return btn;
                };
                Popup.prototype.CreateCloseBtn = function () {
                    return this.GenerateButton(f14.Utils.getString('.close'), function (e) {
                        UI.HidePopup();
                    });
                };
                return Popup;
            }());
            Popups.Popup = Popup;
            var RenamePopup = (function (_super) {
                __extends(RenamePopup, _super);
                function RenamePopup(item) {
                    var _this = _super.call(this) || this;
                    _this.SetTitle(f14.Utils.getString('.io.rename'));
                    _this.item = item;
                    _this.CreateRenameTextbox(_this.item);
                    var applyBtn = _this.GenerateButton(f14.Utils.getString('.apply'), function (e) {
                        var textBox = _this.Body.find('.tb-rename');
                        var requestData = new f14.Ajax.RenameRequestData(f14.Explorer.NavigationData.GetCurrentPath());
                        var oldName = textBox.attr('data-origin-name');
                        var newName = textBox.val();
                        if (oldName !== newName) {
                            requestData.AddRenameItem(oldName, newName, textBox.data('io-type') == f14.Models.FileSystemItemType.File);
                        }
                        if (requestData.HasData()) {
                            f14.Core.Config.dataService.RenameObjects(requestData, function (payload) {
                                _this.updateItemNames(requestData, payload);
                            });
                        }
                        else {
                            UI.HidePopup();
                        }
                    });
                    _this.AddFooterButton(applyBtn);
                    _this.AddFooterButton(_this.CreateCloseBtn());
                    return _this;
                }
                RenamePopup.prototype.CreateRenameTextbox = function (item) {
                    var itemName = item.FileSystemInfo.name;
                    var tb = new UI.TextBox();
                    tb.$This.addClass('tb-rename');
                    tb.$This.attr('data-origin-name', itemName);
                    tb.$This.data('io-type', item.Type);
                    tb.$This.val(itemName);
                    this.Body.append(tb.$This);
                };
                RenamePopup.prototype.updateItemNames = function (requestData, payload) {
                    if (payload) {
                        if (payload.error) {
                            this.PopulatePayloadErrors(payload);
                        }
                        else {
                            for (var _i = 0, _a = requestData.renames; _i < _a.length; _i++) {
                                var i = _a[_i];
                                this.item.SetItemName(i.newName);
                            }
                            UI.HidePopup();
                        }
                    }
                };
                return RenamePopup;
            }(Popup));
            Popups.RenamePopup = RenamePopup;
            var DeletePopup = (function (_super) {
                __extends(DeletePopup, _super);
                function DeletePopup(folderPath, itemNames) {
                    var _this = _super.call(this) || this;
                    _this.$This.addClass('danger');
                    _this.SetTitle(f14.Utils.getString('.popup.delete.title'));
                    _this.FolderPath = folderPath;
                    _this.ItemNames = itemNames;
                    $('<p>').text(f14.Utils.getString('.popup.delete.desc')).appendTo(_this.Body);
                    var delBtn = _this.GenerateButton(f14.Utils.getString('.io.delete'), function (e) {
                        var rData = new f14.Ajax.DeleteRequestData(_this.FolderPath, _this.ItemNames);
                        f14.Core.Config.dataService.DeleteObjects(rData, function (payload) {
                            if (f14.Core.Config.DEBUG) {
                                console.log(rData);
                            }
                            if (payload.error) {
                                _this.PopulatePayloadErrors(payload);
                            }
                            if (payload.data.affected > 0) {
                                f14.Explorer.ReNavigate();
                                UI.ShowToast({
                                    message: f14.Utils.getString('.toast.delete.count.format').Format(payload.data.affected)
                                });
                                if (payload.success) {
                                    UI.HidePopup();
                                }
                            }
                        });
                    });
                    _this.AddFooterButton(delBtn);
                    _this.AddFooterButton(_this.CreateCloseBtn());
                    return _this;
                }
                return DeletePopup;
            }(Popup));
            Popups.DeletePopup = DeletePopup;
            var UploadFilesPopup = (function (_super) {
                __extends(UploadFilesPopup, _super);
                function UploadFilesPopup() {
                    var _this = _super.call(this) || this;
                    _this.tasksCount = 0;
                    _this.SetTitle(f14.Utils.getString('.popup.upload.title'));
                    _this.$Form = $('<form>').addClass('ui-upload-form').appendTo(_this.Body);
                    _this.$Form.text('No files selected.');
                    _this.AddFooterButton(_this.CreateFileSelectBtn());
                    _this.AddFooterButton(_this.CreateUploadButton());
                    _this.AddFooterButton(_this.CreateCloseBtn());
                    return _this;
                }
                UploadFilesPopup.prototype.AddFilePresenter = function (file) {
                    var fileEntry = $('<div>').addClass('ui-input-group file-container').data('file', file);
                    var fileName = $('<div>')
                        .addClass('ui-input-group-item max')
                        .text(file.name)
                        .appendTo(fileEntry);
                    var fileBtns = $('<div>')
                        .addClass('ui-input-group-item min actions')
                        .append(new UI.BaseButton('', 'mdl2-close', 'icon-transparent close-btn').OnClick(function (e) {
                        $(e.target).closest('.file-container').remove();
                    }).$This)
                        .appendTo(fileEntry);
                    var states = $('<div>').addClass('ui-input-group-item min status')
                        .append($('<i>').addClass('mdl2 status-value'))
                        .appendTo(fileEntry);
                    var progress = $('<div>').addClass('ui-input-group-item min progress')
                        .append($('<div>').addClass('progress-value').text('0%'))
                        .appendTo(fileEntry);
                    this.$Form.append(fileEntry);
                };
                UploadFilesPopup.prototype.CreateFileSelectBtn = function () {
                    var _this = this;
                    var btn = new UI.BaseButton();
                    btn.$This.addClass('btn-file');
                    btn.SetText(f14.Utils.getString('.io.select.files'));
                    var input = $('<input>')
                        .attr('type', 'file')
                        .attr('multiple', 'multiple')
                        .attr('accept', f14.Core.Config.uploadFileFilter || '*');
                    input.on('change', function (e) {
                        var fileSelector = e.target;
                        var files = fileSelector.files;
                        if (files.length > 0) {
                            _this.$Form.empty();
                            for (var i in files) {
                                var f = files[i];
                                if (f instanceof File) {
                                    _this.AddFilePresenter(files[i]);
                                }
                            }
                        }
                    });
                    btn.$This.append(input);
                    return btn;
                };
                UploadFilesPopup.prototype.CreateUploadButton = function () {
                    var _this = this;
                    var btn = this.GenerateButton(f14.Utils.getString('.io.upload'), function (e) {
                        var fileContainers = _this.$Form.find('.file-container:not(.loading,.success,.error)');
                        if (fileContainers.length > 0) {
                            $(_this.Footer.find('.btn-file')).addClass('disabled');
                            btn.$This.addClass('disabled');
                            fileContainers.each(function (i, e) {
                                _this.tasksCount += 1;
                                var container = $(e);
                                var progress = $(container.find('.progress-value')[0]);
                                var file = container.data('file');
                                container.addClass('loading');
                                f14.Core.Config.dataService.UploadFile(file, function (payload) {
                                    container.removeClass('loading');
                                    if (payload.success) {
                                        container.addClass('success');
                                    }
                                    else {
                                        container.addClass('error');
                                    }
                                    _this.tasksCount = Math.max(0, _this.tasksCount - 1);
                                    if (_this.tasksCount === 0) {
                                        $(_this.Footer.find('.btn-file')).removeClass('disabled');
                                        btn.$This.removeClass('disabled');
                                        f14.Explorer.ReNavigate();
                                    }
                                }, function (e) {
                                    if (e.lengthComputable) {
                                        var prc = Math.ceil(e.loaded / e.total * 100);
                                        progress.text(prc + '%');
                                    }
                                });
                            });
                        }
                    });
                    btn.$This.addClass('btn-primary btn-upload');
                    return btn;
                };
                return UploadFilesPopup;
            }(Popup));
            Popups.UploadFilesPopup = UploadFilesPopup;
        })(Popups = UI.Popups || (UI.Popups = {}));
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        var Toasts;
        (function (Toasts) {
            var ToastData = (function () {
                function ToastData() {
                }
                return ToastData;
            }());
            Toasts.ToastData = ToastData;
        })(Toasts = UI.Toasts || (UI.Toasts = {}));
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Explorer;
    (function (Explorer) {
        Explorer.NavigationData = new f14.Navigation.NavigationStack();
        function Navigate() {
            var path = Explorer.NavigationData.GetCurrentPath();
            if (f14.Core.Config.DEBUG) {
                console.log('Navigate => ' + path);
            }
            f14.Core.Config.dataService.LoadFileSystemInfo(new f14.Ajax.FileSystemRequestData(path), function (payload) {
                f14.UI.RenderFileStruct(payload.data.folders, payload.data.files);
            });
        }
        function NavigateTo(folderPath) {
            if (folderPath === undefined) {
                throw "Folder path must be set.";
            }
            // Clear current navigation stack.
            Explorer.NavigationData.Clear();
            Explorer.NavigationData.Add(folderPath);
            Navigate();
        }
        Explorer.NavigateTo = NavigateTo;
        function GoForward(folderName) {
            if (folderName) {
                Explorer.NavigationData.Add(folderName);
                Navigate();
            }
            else {
                // TODO: Move to last forward history.
            }
        }
        Explorer.GoForward = GoForward;
        function GoBack() {
            Explorer.NavigationData.Pop();
            Navigate();
        }
        Explorer.GoBack = GoBack;
        /**
         * Navigate to the current location. Used for redraw the file struct section.
         */
        function ReNavigate() {
            Navigate();
        }
        Explorer.ReNavigate = ReNavigate;
        function OpenFile(fileName) {
            // TODO: Open file
        }
        Explorer.OpenFile = OpenFile;
    })(Explorer = f14.Explorer || (f14.Explorer = {}));
})(f14 || (f14 = {}));

"use strict";
var FManager = (function () {
    function FManager(settings) {
        f14.Localization.Init(); // Initialize localization
        f14.Core.Configure(settings); // Apply config        
        f14.UI.Render(); // Render ui        
        f14.Explorer.NavigateTo(f14.Core.Config.rootFolder); // Navigate to root folder
    }
    return FManager;
}());

"use strict";
var f14;
(function (f14) {
    var Tests;
    (function (Tests) {
        var FManagerTest = (function () {
            function FManagerTest(settings) {
                this.GenerateTestData();
                new FManager(settings);
            }
            FManagerTest.prototype.GenerateTestData = function () {
                var navMap = new f14.Memory.InMemoryNavigationMap();
                var root = new f14.Models.DirectoryInfo('C:');
                root.CreateFile('boot.sys');
                root.CreateFile('autorun.exe');
                root.CreateFile('pagefile.sys');
                var myDocs = root.CreateFolder('MyDocs');
                var users = root.CreateFolder('Users');
                var imgs = myDocs.CreateFolder('Images');
                for (var i = 0; i < 30; i++) {
                    var name_1 = "image-" + (i + 1) + ".jpg";
                    imgs.CreateFile(name_1);
                }
                var snds = myDocs.CreateFolder('Sounds');
                for (var i = 0; i < 10; i++) {
                    var name_2 = "sound-" + (i + 1) + ".mp3";
                    snds.CreateFile(name_2);
                }
                navMap.CreateMap(root, false);
                console.log(navMap.ToString());
                f14.Core.Config.dataService = new f14.Data.InMemoryDataService(navMap);
            };
            return FManagerTest;
        }());
        Tests.FManagerTest = FManagerTest;
    })(Tests = f14.Tests || (f14.Tests = {}));
})(f14 || (f14 = {}));
