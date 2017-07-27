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
