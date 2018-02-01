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
        var ActionButtonInfo = /** @class */ (function () {
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
        var BaseFileInfo = /** @class */ (function () {
            function BaseFileInfo(name, props) {
                this.properties = {};
                this.name = name;
                if (props) {
                    for (var i in props) {
                        this.properties[i] = props[i];
                    }
                }
            }
            return BaseFileInfo;
        }());
        Models.BaseFileInfo = BaseFileInfo;
        var FileInfo = /** @class */ (function (_super) {
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
        }(BaseFileInfo));
        Models.FileInfo = FileInfo;
        var DirectoryInfo = /** @class */ (function (_super) {
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
                if (obj instanceof BaseFileInfo) {
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
        }(BaseFileInfo));
        Models.DirectoryInfo = DirectoryInfo;
    })(Models = f14.Models || (f14.Models = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Memory;
    (function (Memory) {
        var InMemoryNavigationMap = /** @class */ (function () {
            function InMemoryNavigationMap() {
                this.map = {};
            }
            InMemoryNavigationMap.prototype.GetFolderItemForPath = function (path) {
                return this.map[path];
            };
            InMemoryNavigationMap.prototype.MapFolder = function (root) {
                this.map[root.GetFullPath()] = root;
                for (var _i = 0, _a = root.Folders; _i < _a.length; _i++) {
                    var i = _a[_i];
                    this.map[i.GetFullPath()] = i;
                    if (i.Folders.length > 0) {
                        this.MapFolder(i);
                    }
                }
            };
            InMemoryNavigationMap.prototype.replace = function (oldPath, dir) {
                delete this.map[oldPath];
                this.MapFolder(dir);
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
        var MoveOperationData = /** @class */ (function () {
            function MoveOperationData() {
            }
            return MoveOperationData;
        }());
        Memory.MoveOperationData = MoveOperationData;
        var AppBuffer = /** @class */ (function () {
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
        var NavigationStack = /** @class */ (function () {
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
        var AjaxActionTypes = /** @class */ (function () {
            function AjaxActionTypes() {
            }
            AjaxActionTypes.FolderStruct = 'folder_struct';
            AjaxActionTypes.Rename = 'rename';
            AjaxActionTypes.Delete = 'delete';
            AjaxActionTypes.Move = 'move';
            AjaxActionTypes.Copy = 'copy';
            AjaxActionTypes.CreateFolder = 'create_folder';
            AjaxActionTypes.UploadFile = "upload_file";
            return AjaxActionTypes;
        }());
        Ajax.AjaxActionTypes = AjaxActionTypes;
        var BaseActionTarget = /** @class */ (function () {
            function BaseActionTarget(name, isFile) {
                this.name = name;
                this.isFile = isFile;
            }
            return BaseActionTarget;
        }());
        Ajax.BaseActionTarget = BaseActionTarget;
        var RenameActionTarget = /** @class */ (function (_super) {
            __extends(RenameActionTarget, _super);
            function RenameActionTarget(oldName, newName, isFile) {
                var _this = _super.call(this, newName, isFile) || this;
                _this.oldName = oldName;
                return _this;
            }
            return RenameActionTarget;
        }(BaseActionTarget));
        Ajax.RenameActionTarget = RenameActionTarget;
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Ajax;
    (function (Ajax) {
        var BaseParam = /** @class */ (function () {
            function BaseParam() {
            }
            return BaseParam;
        }());
        Ajax.BaseParam = BaseParam;
        var TargetCollectionParam = /** @class */ (function (_super) {
            __extends(TargetCollectionParam, _super);
            function TargetCollectionParam(targets) {
                var _this = _super.call(this) || this;
                _this.targets = [];
                if (targets) {
                    _this.targets = targets;
                }
                return _this;
            }
            return TargetCollectionParam;
        }(BaseParam));
        Ajax.TargetCollectionParam = TargetCollectionParam;
        var MoveParam = /** @class */ (function (_super) {
            __extends(MoveParam, _super);
            function MoveParam(srcDir, destDir, targets) {
                var _this = _super.call(this, targets) || this;
                _this.overwrite = false;
                _this.sourceDirectory = srcDir;
                _this.destinationDirectory = destDir;
                return _this;
            }
            return MoveParam;
        }(TargetCollectionParam));
        Ajax.MoveParam = MoveParam;
        var CopyParam = /** @class */ (function (_super) {
            __extends(CopyParam, _super);
            function CopyParam(srcDir, destDir, targets) {
                return _super.call(this, srcDir, destDir, targets) || this;
            }
            return CopyParam;
        }(MoveParam));
        Ajax.CopyParam = CopyParam;
        var DeleteParam = /** @class */ (function (_super) {
            __extends(DeleteParam, _super);
            function DeleteParam(folderPath, targets) {
                var _this = _super.call(this, targets) || this;
                _this.currentFolderPath = folderPath;
                return _this;
            }
            return DeleteParam;
        }(TargetCollectionParam));
        Ajax.DeleteParam = DeleteParam;
        var CreateFolderParam = /** @class */ (function (_super) {
            __extends(CreateFolderParam, _super);
            function CreateFolderParam(workFolder, newObjectName) {
                var _this = _super.call(this) || this;
                _this.currentFolderPath = workFolder;
                _this.name = newObjectName;
                return _this;
            }
            return CreateFolderParam;
        }(BaseParam));
        Ajax.CreateFolderParam = CreateFolderParam;
        var RenameParam = /** @class */ (function (_super) {
            __extends(RenameParam, _super);
            function RenameParam(folderPath, targets) {
                var _this = _super.call(this, targets) || this;
                _this.currentFolderPath = folderPath;
                return _this;
            }
            RenameParam.prototype.AddRenameItem = function (oldName, newName, isFile) {
                this.targets.push(new Ajax.RenameActionTarget(oldName, newName, isFile));
            };
            RenameParam.prototype.HasData = function () {
                return this.targets.length > 0;
            };
            return RenameParam;
        }(TargetCollectionParam));
        Ajax.RenameParam = RenameParam;
        var FolderStructParam = /** @class */ (function (_super) {
            __extends(FolderStructParam, _super);
            function FolderStructParam(folderPath, fileExtensions) {
                var _this = _super.call(this) || this;
                _this.fileExtensions = [];
                _this.currentFolderPath = folderPath;
                _this.fileExtensions = fileExtensions;
                return _this;
            }
            return FolderStructParam;
        }(BaseParam));
        Ajax.FolderStructParam = FolderStructParam;
        var UploadFileParam = /** @class */ (function (_super) {
            __extends(UploadFileParam, _super);
            function UploadFileParam(folderPath, file, progress) {
                var _this = _super.call(this) || this;
                _this.currentFolderPath = folderPath;
                _this.file = file;
                _this.progressChanged = progress;
                return _this;
            }
            UploadFileParam.prototype.makeFormData = function () {
                var data = new FormData();
                data.append('currentFolderPath', this.currentFolderPath);
                data.append('file', this.file);
                return data;
            };
            return UploadFileParam;
        }(BaseParam));
        Ajax.UploadFileParam = UploadFileParam;
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Ajax;
    (function (Ajax) {
        var BaseResult = /** @class */ (function () {
            function BaseResult() {
                this.errors = [];
            }
            BaseResult.prototype.hasErrors = function () {
                return this.errors && this.errors.length > 0;
            };
            return BaseResult;
        }());
        Ajax.BaseResult = BaseResult;
        var AffectedResult = /** @class */ (function (_super) {
            __extends(AffectedResult, _super);
            function AffectedResult() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return AffectedResult;
        }(BaseResult));
        Ajax.AffectedResult = AffectedResult;
        var MoveResult = /** @class */ (function (_super) {
            __extends(MoveResult, _super);
            function MoveResult() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MoveResult;
        }(BaseResult));
        Ajax.MoveResult = MoveResult;
        var CopyResult = /** @class */ (function (_super) {
            __extends(CopyResult, _super);
            function CopyResult() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CopyResult;
        }(MoveResult));
        Ajax.CopyResult = CopyResult;
        var DeleteResult = /** @class */ (function (_super) {
            __extends(DeleteResult, _super);
            function DeleteResult() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return DeleteResult;
        }(AffectedResult));
        Ajax.DeleteResult = DeleteResult;
        var CreateFolderResult = /** @class */ (function (_super) {
            __extends(CreateFolderResult, _super);
            function CreateFolderResult() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CreateFolderResult;
        }(BaseResult));
        Ajax.CreateFolderResult = CreateFolderResult;
        var FolderStructResult = /** @class */ (function (_super) {
            __extends(FolderStructResult, _super);
            function FolderStructResult() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.folders = [];
                _this.files = [];
                return _this;
            }
            return FolderStructResult;
        }(BaseResult));
        Ajax.FolderStructResult = FolderStructResult;
        var RenameResult = /** @class */ (function (_super) {
            __extends(RenameResult, _super);
            function RenameResult() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.renamedObjects = [];
                return _this;
            }
            return RenameResult;
        }(AffectedResult));
        Ajax.RenameResult = RenameResult;
        var UploadFileResult = /** @class */ (function (_super) {
            __extends(UploadFileResult, _super);
            function UploadFileResult() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return UploadFileResult;
        }(BaseResult));
        Ajax.UploadFileResult = UploadFileResult;
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Ajax;
    (function (Ajax) {
        var BaseOperationRequest = /** @class */ (function () {
            function BaseOperationRequest(config) {
                this.config = config;
            }
            BaseOperationRequest.prototype.execute = function (param, callback) {
                var data = this.makeAjaxData(this.getUrl(), param, callback);
                $.ajax(data);
            };
            BaseOperationRequest.prototype.makeAjaxData = function (url, param, callback) {
                var _this = this;
                this.callback = callback;
                var ajaxSettings = {
                    url: url,
                    type: 'POST',
                    contentType: 'application/json charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(param),
                    beforeSend: this.config.xhrBeforeSend,
                    success: function (data) { return _this.ajaxSuccess(data); },
                    error: function (xhr, status, error) { return _this.ajaxError(xhr, status, error); }
                };
                this.extendAjaxData(ajaxSettings, param);
                return ajaxSettings;
            };
            BaseOperationRequest.prototype.extendAjaxData = function (ajaxSettings, param) {
            };
            BaseOperationRequest.prototype.ajaxSuccess = function (data) {
                if (this.config.DEBUG) {
                    console.log(data);
                }
                if (this.callback) {
                    this.callback(this.makeResultFrom(data));
                }
            };
            BaseOperationRequest.prototype.ajaxError = function (xhr, textStatus, errorThrown) {
                console.log("Status: %s\nError: %s", textStatus);
            };
            return BaseOperationRequest;
        }());
        Ajax.BaseOperationRequest = BaseOperationRequest;
        var CopyRequest = /** @class */ (function (_super) {
            __extends(CopyRequest, _super);
            function CopyRequest(config) {
                return _super.call(this, config) || this;
            }
            CopyRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Copy];
            };
            CopyRequest.prototype.makeResultFrom = function (data) {
                var r = new Ajax.CopyResult();
                $.extend(true, r, data);
                return r;
            };
            return CopyRequest;
        }(BaseOperationRequest));
        Ajax.CopyRequest = CopyRequest;
        var MoveRequest = /** @class */ (function (_super) {
            __extends(MoveRequest, _super);
            function MoveRequest(config) {
                return _super.call(this, config) || this;
            }
            MoveRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Move];
            };
            MoveRequest.prototype.makeResultFrom = function (data) {
                var r = new Ajax.MoveResult();
                $.extend(true, r, data);
                return r;
            };
            return MoveRequest;
        }(BaseOperationRequest));
        Ajax.MoveRequest = MoveRequest;
        var CreateFolderRequest = /** @class */ (function (_super) {
            __extends(CreateFolderRequest, _super);
            function CreateFolderRequest(config) {
                return _super.call(this, config) || this;
            }
            CreateFolderRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[Ajax.AjaxActionTypes.CreateFolder];
            };
            CreateFolderRequest.prototype.makeResultFrom = function (data) {
                var r = new Ajax.CreateFolderResult();
                $.extend(true, r, data);
                return r;
            };
            return CreateFolderRequest;
        }(BaseOperationRequest));
        Ajax.CreateFolderRequest = CreateFolderRequest;
        var DeleteRequest = /** @class */ (function (_super) {
            __extends(DeleteRequest, _super);
            function DeleteRequest(config) {
                return _super.call(this, config) || this;
            }
            DeleteRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Delete];
            };
            DeleteRequest.prototype.makeResultFrom = function (data) {
                var r = new Ajax.DeleteResult();
                $.extend(true, r, data);
                return r;
            };
            return DeleteRequest;
        }(BaseOperationRequest));
        Ajax.DeleteRequest = DeleteRequest;
        var FolderStructRequest = /** @class */ (function (_super) {
            __extends(FolderStructRequest, _super);
            function FolderStructRequest(config) {
                return _super.call(this, config) || this;
            }
            FolderStructRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[Ajax.AjaxActionTypes.FolderStruct];
            };
            FolderStructRequest.prototype.makeResultFrom = function (data) {
                var r = new Ajax.FolderStructResult();
                $.extend(true, r, data);
                return r;
            };
            return FolderStructRequest;
        }(BaseOperationRequest));
        Ajax.FolderStructRequest = FolderStructRequest;
        var RenameRequest = /** @class */ (function (_super) {
            __extends(RenameRequest, _super);
            function RenameRequest(config) {
                return _super.call(this, config) || this;
            }
            RenameRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Rename];
            };
            RenameRequest.prototype.makeResultFrom = function (data) {
                var r = new Ajax.RenameResult();
                $.extend(true, r, data);
                return r;
            };
            return RenameRequest;
        }(BaseOperationRequest));
        Ajax.RenameRequest = RenameRequest;
        var UploadFileRequest = /** @class */ (function (_super) {
            __extends(UploadFileRequest, _super);
            function UploadFileRequest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UploadFileRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[Ajax.AjaxActionTypes.UploadFile];
            };
            UploadFileRequest.prototype.extendAjaxData = function (ajaxSettings, param) {
                $.extend(true, ajaxSettings, {
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: param.makeFormData(),
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload && param.progressChanged) {
                            xhr.upload.addEventListener('progress', param.progressChanged, false);
                        }
                        return xhr;
                    }
                });
            };
            UploadFileRequest.prototype.makeResultFrom = function (data) {
                var r = new Ajax.UploadFileResult();
                $.extend(true, r, data);
                return r;
            };
            return UploadFileRequest;
        }(BaseOperationRequest));
        Ajax.UploadFileRequest = UploadFileRequest;
    })(Ajax = f14.Ajax || (f14.Ajax = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Events;
    (function (Events) {
        var ActionButtonEvents = /** @class */ (function () {
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
            ActionButtonEvents.CreateFolder = function (e) {
                var param = new f14.Ajax.CreateFolderParam(f14.Explorer.NavigationData.GetCurrentPath(), "new folder");
                f14.Core.Config.ajaxRequestMap[f14.Ajax.AjaxActionTypes.CreateFolder].execute(param, function (payload) {
                    var r = payload;
                    if (r.hasErrors()) {
                        f14.UI.DisplayPayloadError(r);
                    }
                    else {
                        f14.UI.ShowToast({
                            message: f14.Utils.getString(".toast.msg.dir.created")
                        });
                    }
                    f14.Explorer.ReNavigate();
                });
            };
            ActionButtonEvents.DeleteObjects = function (e) {
                var items = f14.UI.GetCheckedItems();
                if (items.length > 0) {
                    var popup = new f14.UI.Popups.DeletePopup(f14.Explorer.NavigationData.GetCurrentPath(), items.map(function (x) { return new f14.Ajax.BaseActionTarget(x.FileSystemInfo.name, x.Type == f14.Models.FileSystemItemType.File); }));
                    f14.UI.ShowPopup(popup);
                }
            };
            ActionButtonEvents.MoveObjects = function (e) {
                ActionButtonEvents.PrepareItemsToMove(f14.Ajax.AjaxActionTypes.Move);
            };
            ActionButtonEvents.CopyObjects = function (e) {
                ActionButtonEvents.PrepareItemsToMove(f14.Ajax.AjaxActionTypes.Copy);
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
                    var srcDir = op.sourceDirectory;
                    var dstDir = op.destinationDirectory;
                    var targets = op.targets.map(function (v, i, arr) { return new f14.Ajax.BaseActionTarget(v.name, v.isFile); });
                    var baseParam;
                    switch (op.type) {
                        case f14.Ajax.AjaxActionTypes.Move:
                            baseParam = new f14.Ajax.MoveParam(srcDir, dstDir, targets);
                            break;
                        case f14.Ajax.AjaxActionTypes.Copy:
                            baseParam = new f14.Ajax.CopyParam(srcDir, dstDir, targets);
                            break;
                    }
                    f14.Core.Config.ajaxRequestMap[op.type].execute(baseParam, function (payload) {
                        if (payload.hasErrors()) {
                            f14.UI.DisplayPayloadError(payload);
                        }
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
                    opData.targets = items.map(function (x) { return new f14.Ajax.BaseActionTarget(x.FileSystemInfo.name, x.Type == f14.Models.FileSystemItemType.File); });
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
        var Configuration = /** @class */ (function () {
            function Configuration() {
                this.actionButtons = [];
                this.allowShortcuts = false;
                this.DEBUG = false;
                this.MOCK = false;
                this.endPointUrlMap = {};
                this.ajaxRequestMap = {};
                this.ajaxRequestMap[f14.Ajax.AjaxActionTypes.Copy] = new f14.Ajax.CopyRequest(this);
                this.ajaxRequestMap[f14.Ajax.AjaxActionTypes.Move] = new f14.Ajax.MoveRequest(this);
                this.ajaxRequestMap[f14.Ajax.AjaxActionTypes.CreateFolder] = new f14.Ajax.CreateFolderRequest(this);
                this.ajaxRequestMap[f14.Ajax.AjaxActionTypes.Delete] = new f14.Ajax.DeleteRequest(this);
                this.ajaxRequestMap[f14.Ajax.AjaxActionTypes.FolderStruct] = new f14.Ajax.FolderStructRequest(this);
                this.ajaxRequestMap[f14.Ajax.AjaxActionTypes.Rename] = new f14.Ajax.RenameRequest(this);
                this.ajaxRequestMap[f14.Ajax.AjaxActionTypes.UploadFile] = new f14.Ajax.UploadFileRequest(this);
            }
            return Configuration;
        }());
        Core.Configuration = Configuration;
        Core.L10NPrefix = "f14fm";
        Core.Title = "FManager";
        Core.TitleShort = "FM";
        Core.Config = new Configuration();
        Core.AppBuffer = new f14.Memory.AppBuffer();
        var shortcutsObjects = {};
        function configure(settings) {
            if (settings) {
                $.extend(true, Core.Config, settings);
            }
            if (!Core.Config.MOCK) {
                checkRequiredValues();
            }
            else {
                useMockData();
            }
            if (Core.Config.allowShortcuts) {
                // TODO: Shorcuts
                window.addEventListener("keydown", function (e) {
                    var cmd = findCommandForShortcut([]);
                    if (cmd) {
                        cmd.Execute();
                    }
                    e.preventDefault();
                }, false);
            }
        }
        Core.configure = configure;
        function registerShortcut(cmd) {
            shortcutsObjects[cmd.shortcut] = cmd;
        }
        Core.registerShortcut = registerShortcut;
        function findCommandForShortcut(keys) {
            return undefined;
        }
        function checkRequiredValues() {
            if (Core.Config.rootFolder === undefined) {
                throw "Root folder must be set.";
            }
            if (Core.Config.endPointUrlMap === undefined || Object.keys(Core.Config.endPointUrlMap).length == 0) {
                throw "The map with end point urls is empty or null.";
            }
        }
        function useMockData() {
            Core.Config.endPointUrlMap[f14.Ajax.AjaxActionTypes.UploadFile] = "action/upload/file";
            Core.Config.inMemoryData = new f14.Mock.MockNavigationMap();
            var ajaxMap = Core.Config.ajaxRequestMap;
            ajaxMap[f14.Ajax.AjaxActionTypes.Copy] = new f14.Mock.MockCopyRequest(Core.Config);
            ajaxMap[f14.Ajax.AjaxActionTypes.Move] = new f14.Mock.MockMoveRequest(Core.Config);
            ajaxMap[f14.Ajax.AjaxActionTypes.CreateFolder] = new f14.Mock.MockCreateFolderRequest(Core.Config);
            ajaxMap[f14.Ajax.AjaxActionTypes.Delete] = new f14.Mock.MockDeleteRequest(Core.Config);
            ajaxMap[f14.Ajax.AjaxActionTypes.FolderStruct] = new f14.Mock.MockFolderStructRequest(Core.Config);
            ajaxMap[f14.Ajax.AjaxActionTypes.Rename] = new f14.Mock.MockRenameRequest(Core.Config);
            ajaxMap[f14.Ajax.AjaxActionTypes.UploadFile] = new f14.Mock.MockUploadFileRequest(Core.Config);
        }
    })(Core = f14.Core || (f14.Core = {}));
})(f14 || (f14 = {}));

"use strict";
var f14;
(function (f14) {
    var Localization;
    (function (Localization) {
        function Init() {
            var l10nProvider = f14.Core.Config.L10NProvider || f14.L10n.Config.L10nProvider;
            l10nProvider.AddLocale("ru", {
                "f14fm.io.accept": "Принять",
                "f14fm.io.select-all": "Выбрать все",
                "f14fm.io.clear-selection": "Снять выделение",
                "f14fm.io.inverse-selection": "Обратить выделение",
                "f14fm.io.upload": "Загрузить файлы",
                "f14fm.io.select.files": "Выбрать файлы",
                "f14fm.io.delete": "Удалить",
                "f14fm.io.create-folder": "Создать папку",
                "f14fm.io.rename": "Переименовать",
                "f14fm.io.move": "Переместить",
                "f14fm.io.copy": "Копировать",
                "f14fm.io.paste": "Вставить",
                "f14fm.apply": "Применить",
                "f14fm.close": "Закрыть",
                "f14fm.cancel": "Отмена",
                "f14fm.popup.delete.title": "Удалить файлы и папки...",
                "f14fm.popup.delete.desc": "Вы уверены что хотите удалить эти файлы\\папки?",
                "f14fm.popup.upload.title": "Загрузка файлов",
                "f14fm.popup.rename.error.exist": "\u0424\u0430\u0439\u043B \u0441 \u0442\u0430\u043A\u0438\u043C \u0438\u043C\u0435\u043D\u0435\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442! \u0418\u043C\u044F \u0444\u0430\u0439\u043B\u0430: {0}",
                "f14fm.toast.msg.selection.empty": "Ни один файл не выбран.",
                "f14fm.toast.msg.same.folder": "Папка назначения совпадает с исходной папкой.",
                "f14fm.toast.msg.dir.created": "Новая папка создана.",
                "f14fm.toast.delete.count.format": "Удалено {0} объектов.",
            });
            l10nProvider.AddLocale("en", {
                "f14fm.io.accept": "Done",
                "f14fm.io.select-all": "Select All",
                "f14fm.io.clear-selection": "Clear Selection",
                "f14fm.io.inverse-selection": "Inverse Selection",
                "f14fm.io.upload": "Upload Files",
                "f14fm.io.select.files": "Select files",
                "f14fm.io.delete": "Delete",
                "f14fm.io.create-folder": "Create folder",
                "f14fm.io.rename": "Rename",
                "f14fm.io.move": "Move",
                "f14fm.io.copy": "Copy",
                "f14fm.io.paste": "Paste",
                "f14fm.io.apply": "Apply",
                "f14fm.close": "Close",
                "f14fm.cancel": "Cancel",
                "f14fm.popup.delete.title": "Delete files and folders...",
                "f14fm.popup.delete.desc": "Are you sure you want to delete this files\\folders?",
                "f14fm.popup.upload.title": "File uploader",
                "f14fm.popup.rename.error.exist": "A File with this name already exists! File name: {0}",
                "f14fm.toast.msg.selection.empty": "No selected files.",
                "f14fm.toast.msg.same.folder": "Destination folder coincides with the source folder.",
                "f14fm.toast.msg.dir.created": "A new directory has been created.",
                "f14fm.toast.delete.count.format": "{0} items deleted.",
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
            var l10nProvider = f14.Core.Config.L10NProvider || f14.L10n.Config.L10nProvider;
            return l10nProvider.GetString(f14.Core.L10NPrefix + key);
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
        function DisplayPayloadError(payload) {
            if (payload.hasErrors()) {
                UI.ShowToast({
                    message: payload.errors.join('\n'),
                    title: 'Ajax response'
                });
            }
        }
        UI.DisplayPayloadError = DisplayPayloadError;
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
            var config = f14.Core.Config;
            var actionTypes = f14.Ajax.AjaxActionTypes;
            var actionEvents = f14.Events.ActionButtonEvents;
            var actionPanel = _uIContainer.ContentPanel.FileActionPanel.ActionPanel;
            // Show the accept button if callback is set.
            if (config.selectCallback) {
                actionPanel.AddButton(UI.ActionButton.Create({
                    classes: 'btn-primary',
                    icon: 'mdl2-accept',
                    text: f14.Utils.getString('.io.accept'),
                    action: f14.Events.ActionButtonEvents.AcceptSelection
                }));
            }
            addActionButton(actionPanel, actionTypes.UploadFile, "btn-primary", "mdl2-upload", null, f14.Utils.getString(".io.upload"), actionEvents.UploadObjects);
            addActionButton(actionPanel, actionTypes.CreateFolder, null, "mdl2-new-folder", null, f14.Utils.getString(".io.create-folder"), actionEvents.CreateFolder);
            addActionButton(actionPanel, actionTypes.Delete, null, "mdl2-delete", null, f14.Utils.getString(".io.delete"), actionEvents.DeleteObjects);
            addActionButton(actionPanel, actionTypes.Rename, null, "mdl2-rename", null, f14.Utils.getString(".io.rename"), actionEvents.RenameObjects);
            addActionButton(actionPanel, actionTypes.Copy, null, "mdl2-copy", "ctrl+c", f14.Utils.getString(".io.copy"), actionEvents.CopyObjects);
            addActionButton(actionPanel, actionTypes.Move, null, "mdl2-move", "ctrl+x", f14.Utils.getString(".io.move"), actionEvents.MoveObjects);
            addActionButton(actionPanel, [actionTypes.Move, actionTypes.Copy], null, "mdl2-paste", "ctrl+v", f14.Utils.getString(".io.paste"), actionEvents.PasteObjects);
            addActionButton(actionPanel, null, null, "mdl2-select-all", null, f14.Utils.getString(".io.select-all"), actionEvents.SelectObjects);
            // Add button defined in configuration.
            if (config.actionButtons && config.actionButtons.length > 0) {
                for (var _i = 0, _a = f14.Core.Config.actionButtons; _i < _a.length; _i++) {
                    var o = _a[_i];
                    actionPanel.AddButton(UI.ActionButton.Create(o));
                }
            }
        }
        function addActionButton(panel, actionTypes, classes, icon, shortcut, text, action) {
            var hasAny = false;
            if (actionTypes != null) {
                if (Array.isArray(actionTypes)) {
                    for (var _i = 0, actionTypes_1 = actionTypes; _i < actionTypes_1.length; _i++) {
                        var t = actionTypes_1[_i];
                        if (f14.Core.Config.endPointUrlMap[t]) {
                            hasAny = true;
                            break;
                        }
                    }
                }
                else {
                    hasAny = f14.Core.Config.endPointUrlMap[actionTypes] != null;
                }
            }
            else {
                hasAny = true;
            }
            if (hasAny) {
                var buttonInfo = {
                    classes: classes,
                    icon: icon,
                    shortcut: shortcut,
                    text: text,
                    action: action
                };
                panel.AddButton(UI.ActionButton.Create(buttonInfo));
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
        var UIContainer = /** @class */ (function () {
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
        var ToasContainer = /** @class */ (function () {
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
                    bottom: "-300px",
                    opacity: "0"
                }).animate({
                    bottom: "0px",
                    opacity: "1"
                }, 400, function () { return callback(_this); });
            };
            ToasContainer.prototype.Hide = function () {
                var _this = this;
                this.$This.animate({
                    bottom: "-300px",
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
        var PopupContainer = /** @class */ (function () {
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
        var ContentPanel = /** @class */ (function () {
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
        var FileActionPanel = /** @class */ (function () {
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
        var FileStructPanel = /** @class */ (function () {
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
        var ActionPanel = /** @class */ (function () {
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
        var FileStructItem = /** @class */ (function () {
            function FileStructItem(type, data) {
                var _this = this;
                this.CheckState = false;
                this.Type = type;
                this.FileSystemInfo = data;
                this.$This = $('<div>')
                    .addClass('ui-file-struct-item ui-input-group')
                    .on('click', function (e) { return _this.TriggerCheckState(); })
                    .on('dblclick', function (e) {
                    switch (_this.Type) {
                        case f14.Models.FileSystemItemType.Back:
                            f14.Explorer.GoBack();
                            break;
                        case f14.Models.FileSystemItemType.File:
                            f14.Explorer.OpenFile(_this.FileSystemInfo.name);
                            break;
                        case f14.Models.FileSystemItemType.Folder:
                            f14.Explorer.GoForward(_this.FileSystemInfo.name);
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
        var BaseButton = /** @class */ (function () {
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
        var ActionButton = /** @class */ (function (_super) {
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
        var LogoButton = /** @class */ (function () {
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
        var TextBox = /** @class */ (function () {
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
            var Popup = /** @class */ (function () {
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
                    if (payload.hasErrors()) {
                        for (var _i = 0, _a = payload.errors; _i < _a.length; _i++) {
                            var i = _a[_i];
                            addErrorItem(i);
                        }
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
            var RenamePopup = /** @class */ (function (_super) {
                __extends(RenamePopup, _super);
                function RenamePopup(item) {
                    var _this = _super.call(this) || this;
                    _this.SetTitle(f14.Utils.getString('.io.rename'));
                    _this.item = item;
                    _this.CreateRenameTextbox(_this.item);
                    var applyBtn = _this.GenerateButton(f14.Utils.getString('.apply'), function (e) {
                        var textBox = _this.Body.find('.tb-rename');
                        var requestParam = new f14.Ajax.RenameParam(f14.Explorer.NavigationData.GetCurrentPath());
                        var oldName = textBox.attr('data-origin-name');
                        var newName = textBox.val();
                        if (oldName !== newName) {
                            requestParam.AddRenameItem(oldName, newName, textBox.data('io-type') == f14.Models.FileSystemItemType.File);
                        }
                        if (requestParam.HasData()) {
                            f14.Core.Config.ajaxRequestMap[f14.Ajax.AjaxActionTypes.Rename].execute(requestParam, function (payload) { return _this.updateItemNames(payload); });
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
                RenamePopup.prototype.updateItemNames = function (payload) {
                    if (payload.hasErrors()) {
                        this.PopulatePayloadErrors(payload);
                    }
                    else {
                        var result = payload;
                        this.item.SetItemName(result.renamedObjects[0].name); // TODO: multiple renames
                        UI.HidePopup();
                    }
                };
                return RenamePopup;
            }(Popup));
            Popups.RenamePopup = RenamePopup;
            var DeletePopup = /** @class */ (function (_super) {
                __extends(DeletePopup, _super);
                function DeletePopup(folderPath, itemNames) {
                    var _this = _super.call(this) || this;
                    _this.$This.addClass('danger');
                    _this.SetTitle(f14.Utils.getString('.popup.delete.title'));
                    _this.FolderPath = folderPath;
                    _this.ItemNames = itemNames;
                    $('<p>').text(f14.Utils.getString('.popup.delete.desc')).appendTo(_this.Body);
                    var delBtn = _this.GenerateButton(f14.Utils.getString('.io.delete'), function (e) {
                        var param = new f14.Ajax.DeleteParam(_this.FolderPath, _this.ItemNames.map(function (v, i, arr) { return v.name; }));
                        f14.Core.Config.ajaxRequestMap[f14.Ajax.AjaxActionTypes.Delete].execute(param, function (payload) {
                            if (f14.Core.Config.DEBUG) {
                                console.log(param);
                            }
                            if (payload.hasErrors()) {
                                _this.PopulatePayloadErrors(payload);
                            }
                            var result = payload;
                            if (result.affected > 0) {
                                f14.Explorer.ReNavigate();
                                UI.ShowToast({
                                    message: f14.Utils.getString('.toast.delete.count.format').Format(result.affected.toString())
                                });
                                if (!result.hasErrors()) {
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
            var UploadFilesPopup = /** @class */ (function (_super) {
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
                                var param = new f14.Ajax.UploadFileParam(f14.Explorer.NavigationData.GetCurrentPath(), file, function (e) {
                                    if (e.lengthComputable) {
                                        var prc = Math.ceil(e.loaded / e.total * 100);
                                        progress.text(prc + '%');
                                    }
                                });
                                f14.Core.Config.ajaxRequestMap[f14.Ajax.AjaxActionTypes.UploadFile].execute(param, function (payload) {
                                    container.removeClass('loading');
                                    if (payload.hasErrors()) {
                                        container.addClass('error');
                                    }
                                    else {
                                        container.addClass('success');
                                    }
                                    _this.tasksCount = Math.max(0, _this.tasksCount - 1);
                                    if (_this.tasksCount === 0) {
                                        $(_this.Footer.find('.btn-file')).removeClass('disabled');
                                        btn.$This.removeClass('disabled');
                                        f14.Explorer.ReNavigate();
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
            var ToastData = /** @class */ (function () {
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
            var config = f14.Core.Config;
            if (config.DEBUG) {
                console.log('Navigate => ' + path);
            }
            config.ajaxRequestMap[f14.Ajax.AjaxActionTypes.FolderStruct].execute(new f14.Ajax.FolderStructParam(path), function (payload) {
                if (payload.hasErrors()) {
                    f14.UI.DisplayPayloadError(payload);
                }
                else {
                    var result = payload;
                    f14.UI.RenderFileStruct(result.folders, result.files);
                }
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
var FManager = /** @class */ (function () {
    function FManager(settings) {
        f14.Localization.Init(); // Initialize localization
        f14.Core.configure(settings); // Apply config        
        f14.UI.Render(); // Render ui        
        f14.Explorer.NavigateTo(f14.Core.Config.rootFolder); // Navigate to root folder
    }
    return FManager;
}());

"use strict";
var f14;
(function (f14) {
    var Mock;
    (function (Mock) {
        var MockNavigationMap = /** @class */ (function (_super) {
            __extends(MockNavigationMap, _super);
            function MockNavigationMap() {
                var _this = _super.call(this) || this;
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
                _this.MapFolder(root);
                console.log(_this.ToString());
                return _this;
            }
            return MockNavigationMap;
        }(f14.Memory.InMemoryNavigationMap));
        Mock.MockNavigationMap = MockNavigationMap;
        var MockOperationRequest = /** @class */ (function () {
            function MockOperationRequest(config) {
                this.config = config;
                this.map = config.inMemoryData;
            }
            return MockOperationRequest;
        }());
        Mock.MockOperationRequest = MockOperationRequest;
        var MockCopyRequest = /** @class */ (function (_super) {
            __extends(MockCopyRequest, _super);
            function MockCopyRequest(config) {
                return _super.call(this, config) || this;
            }
            MockCopyRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[f14.Ajax.AjaxActionTypes.Copy];
            };
            MockCopyRequest.prototype.execute = function (param, callback) {
                var srcDir = this.map.GetFolderItemForPath(param.sourceDirectory);
                var dstDir = this.map.GetFolderItemForPath(param.destinationDirectory);
                var copyFile = function (file, dir) {
                    var copy = new f14.Models.FileInfo(file.name, dir);
                    $.extend(true, copy, file);
                    return copy;
                };
                var copyFolder = function (dir, parent) {
                    var copy = new f14.Models.DirectoryInfo(dir.name, parent);
                    for (var _i = 0, _a = dir.Files; _i < _a.length; _i++) {
                        var f = _a[_i];
                        copy.AddObject(copyFile(f, copy));
                    }
                    for (var _b = 0, _c = dir.Folders; _b < _c.length; _b++) {
                        var f = _c[_b];
                        copy.AddObject(copyFolder(f, copy));
                    }
                    return copy;
                };
                for (var _i = 0, _a = param.targets; _i < _a.length; _i++) {
                    var n = _a[_i];
                    var o = srcDir.GetObject(n.name);
                    if (o) {
                        if (n.isFile) {
                            var file = copyFile(o, dstDir);
                            dstDir.AddObject(file);
                            if (this.config.DEBUG) {
                                console.log(file);
                            }
                        }
                        else {
                            var folder = copyFolder(o, dstDir);
                            this.map.MapFolder(folder);
                            dstDir.AddObject(folder);
                            if (this.config.DEBUG) {
                                console.log(folder);
                                console.log(this.map.ToString());
                            }
                        }
                    }
                }
                var result = new f14.Ajax.CopyResult();
                callback(result);
            };
            return MockCopyRequest;
        }(MockOperationRequest));
        Mock.MockCopyRequest = MockCopyRequest;
        var MockMoveRequest = /** @class */ (function (_super) {
            __extends(MockMoveRequest, _super);
            function MockMoveRequest(config) {
                return _super.call(this, config) || this;
            }
            MockMoveRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[f14.Ajax.AjaxActionTypes.Move];
            };
            MockMoveRequest.prototype.execute = function (param, callback) {
                var srcDir = this.map.GetFolderItemForPath(param.sourceDirectory);
                var dstDir = this.map.GetFolderItemForPath(param.destinationDirectory);
                var itemsToMove = [];
                for (var _i = 0, _a = param.targets; _i < _a.length; _i++) {
                    var n = _a[_i];
                    var o = srcDir.DeleteObject(n.name);
                    if (o) {
                        itemsToMove.push(o);
                    }
                }
                dstDir.AddObject(itemsToMove);
                var result = new f14.Ajax.MoveResult();
                callback(result);
            };
            return MockMoveRequest;
        }(MockOperationRequest));
        Mock.MockMoveRequest = MockMoveRequest;
        var MockCreateFolderRequest = /** @class */ (function (_super) {
            __extends(MockCreateFolderRequest, _super);
            function MockCreateFolderRequest(config) {
                return _super.call(this, config) || this;
            }
            MockCreateFolderRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[f14.Ajax.AjaxActionTypes.CreateFolder];
            };
            MockCreateFolderRequest.prototype.execute = function (param, callback) {
                var currentDir = this.map.GetFolderItemForPath(param.currentFolderPath);
                var newDir = currentDir.CreateFolder(param.name);
                this.map.MapFolder(newDir);
                var result = new f14.Ajax.CreateFolderResult();
                callback(result);
            };
            return MockCreateFolderRequest;
        }(MockOperationRequest));
        Mock.MockCreateFolderRequest = MockCreateFolderRequest;
        var MockDeleteRequest = /** @class */ (function (_super) {
            __extends(MockDeleteRequest, _super);
            function MockDeleteRequest(config) {
                return _super.call(this, config) || this;
            }
            MockDeleteRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[f14.Ajax.AjaxActionTypes.Delete];
            };
            MockDeleteRequest.prototype.execute = function (param, callback) {
                var dir = this.map.GetFolderItemForPath(param.currentFolderPath);
                for (var _i = 0, _a = param.targets; _i < _a.length; _i++) {
                    var n = _a[_i];
                    dir.DeleteObject(n);
                }
                var result = new f14.Ajax.DeleteResult();
                result.affected = param.targets.length;
                callback(result);
            };
            return MockDeleteRequest;
        }(MockOperationRequest));
        Mock.MockDeleteRequest = MockDeleteRequest;
        var MockFolderStructRequest = /** @class */ (function (_super) {
            __extends(MockFolderStructRequest, _super);
            function MockFolderStructRequest(config) {
                return _super.call(this, config) || this;
            }
            MockFolderStructRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[f14.Ajax.AjaxActionTypes.FolderStruct];
            };
            MockFolderStructRequest.prototype.execute = function (param, callback) {
                var folder = this.map.GetFolderItemForPath(param.currentFolderPath);
                if (folder === undefined) {
                    throw "No folder info for given path: " + param.currentFolderPath;
                }
                var result = new f14.Ajax.FolderStructResult();
                result.files = folder.Files;
                result.folders = folder.Folders;
                callback(result);
            };
            return MockFolderStructRequest;
        }(MockOperationRequest));
        Mock.MockFolderStructRequest = MockFolderStructRequest;
        var MockRenameRequest = /** @class */ (function (_super) {
            __extends(MockRenameRequest, _super);
            function MockRenameRequest(config) {
                return _super.call(this, config) || this;
            }
            MockRenameRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[f14.Ajax.AjaxActionTypes.Rename];
            };
            MockRenameRequest.prototype.execute = function (param, callback) {
                var workFolder = this.map.GetFolderItemForPath(param.currentFolderPath);
                if (workFolder === undefined) {
                    throw "No folder info for given path: " + param.currentFolderPath;
                }
                var result = new f14.Ajax.RenameResult();
                for (var _i = 0, _a = param.targets; _i < _a.length; _i++) {
                    var t = _a[_i];
                    if (t.isFile) {
                        if (workFolder.FileExists(t.name)) {
                            result.errors.push(f14.Utils.getString('.popup.rename.error.exist').Format(t.name));
                        }
                        else {
                            workFolder.GetFile(t.oldName).name = t.name;
                            result.renamedObjects.push(t);
                        }
                    }
                    else {
                        if (workFolder.FolderExists(t.name)) {
                            result.errors.push(f14.Utils.getString('.popup.rename.error.exist').Format(t.name));
                        }
                        else {
                            var target = workFolder.GetFolder(t.oldName);
                            var oldPath = target.GetFullPath();
                            target.name = t.name;
                            if (f14.Core.Config.DEBUG) {
                                console.log("Old path: " + oldPath + " New path: " + target.GetFullPath());
                            }
                            this.map.replace(oldPath, target);
                            result.renamedObjects.push(t);
                        }
                    }
                }
                callback(result);
            };
            return MockRenameRequest;
        }(MockOperationRequest));
        Mock.MockRenameRequest = MockRenameRequest;
        var MockUploadFileRequest = /** @class */ (function (_super) {
            __extends(MockUploadFileRequest, _super);
            function MockUploadFileRequest() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MockUploadFileRequest.prototype.getUrl = function () {
                return this.config.endPointUrlMap[f14.Ajax.AjaxActionTypes.UploadFile];
            };
            MockUploadFileRequest.prototype.execute = function (param, callback) {
                var _this = this;
                var interval = f14.Utils.NextInt(50, 150);
                var total = 100;
                var current = 0;
                var handlerId = setInterval(function () {
                    current += 1;
                    if (param.progressChanged) {
                        param.progressChanged(new ProgressEvent('counter', {
                            lengthComputable: true,
                            total: total,
                            loaded: current
                        }));
                    }
                }, interval);
                setTimeout(function () {
                    clearInterval(handlerId);
                    var dir = _this.map.GetFolderItemForPath(param.currentFolderPath);
                    dir.CreateFile(param.file.name);
                    var result = new f14.Ajax.UploadFileResult();
                    callback(result);
                }, interval * total);
            };
            return MockUploadFileRequest;
        }(MockOperationRequest));
        Mock.MockUploadFileRequest = MockUploadFileRequest;
    })(Mock = f14.Mock || (f14.Mock = {}));
})(f14 || (f14 = {}));
