"use strict";
var f14;
(function (f14) {
    var Models;
    (function (Models) {
        var Configuration = (function () {
            function Configuration() {
                this.DEBUG = false;
                this.IS_TEST = false;
            }
            return Configuration;
        }());
        Models.Configuration = Configuration;
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
        Models.NavigationStack = NavigationStack;
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
                var output = 'NavigationTestMap:';
                for (var i in this.map) {
                    output += '\n' + i;
                }
                return output;
            };
            return InMemoryNavigationMap;
        }());
        Models.InMemoryNavigationMap = InMemoryNavigationMap;
        var FolderItem = (function () {
            function FolderItem(name, parent) {
                this.Folders = [];
                this.Files = [];
                this.name = name;
                this.Parent = parent;
            }
            FolderItem.prototype.GetFullPath = function () {
                if (this.Parent !== undefined) {
                    return this.Parent.GetFullPath() + '/' + this.name;
                }
                return this.name;
            };
            FolderItem.prototype.CreateFolder = function (name) {
                var folder = new FolderItem(name, this);
                this.Folders.push(folder);
                return folder;
            };
            FolderItem.prototype.CreateFile = function (name) {
                var file = new FileItem(name, this);
                this.Files.push(file);
                return file;
            };
            FolderItem.prototype.GetFolderInfoSet = function () {
                var results = [];
                this.Folders.forEach(function (x) { return results.push(x.ToFolderInfo()); });
                return results;
            };
            FolderItem.prototype.GetFileInfoSet = function () {
                var results = [];
                this.Files.forEach(function (x) { return results.push(x.ToFileInfo()); });
                return results;
            };
            FolderItem.prototype.ToFolderInfo = function () {
                return new FolderInfo(this.name);
            };
            return FolderItem;
        }());
        Models.FolderItem = FolderItem;
        var FileItem = (function () {
            function FileItem(name, folder) {
                this.name = name;
                this.extension = name.split('.').pop();
                this.Folder = folder;
            }
            FileItem.prototype.ToFileInfo = function () {
                return new FileInfo(this.name, this.extension);
            };
            return FileItem;
        }());
        Models.FileItem = FileItem;
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
        var BaseRequestData = (function () {
            function BaseRequestData(type) {
                this.type = type;
            }
            return BaseRequestData;
        }());
        Models.BaseRequestData = BaseRequestData;
        var RenameRequestData = (function (_super) {
            __extends(RenameRequestData, _super);
            function RenameRequestData(folderPath) {
                var _this = _super.call(this, 'rename') || this;
                _this.renames = [];
                _this.folderPath = folderPath;
                return _this;
            }
            RenameRequestData.prototype.AddRenameItem = function (oldName, newName) {
                this.renames.push(new RenameFileInfo(oldName, newName));
            };
            RenameRequestData.prototype.HasData = function () {
                return this.renames.length > 0;
            };
            return RenameRequestData;
        }(BaseRequestData));
        Models.RenameRequestData = RenameRequestData;
        var RenameFileInfo = (function () {
            function RenameFileInfo(oldName, newName) {
                this.oldName = oldName;
                this.newName = newName;
            }
            return RenameFileInfo;
        }());
        Models.RenameFileInfo = RenameFileInfo;
    })(Models = f14.Models || (f14.Models = {}));
})(f14 || (f14 = {}));
