namespace f14.Data {
    export interface IDataService {
        LoadFileSystemInfo(path: string, callback: (payload: any) => void): void;
        RenameObjects(requestData: Ajax.RenameRequestData, callback: (payload: any) => void): void;
        DeleteObjects(requestData: Ajax.DeleteRequestData, callback: (payload: any) => void): void;
        CreateObject(requestData: Ajax.IRequestData, callback: (payload: any) => void): void;
        MoveObjects(data: Ajax.MoveRequestData, callback: (payload: any) => void): void;
        UploadFile(file: File, callback: (payload: any) => void, progress: (e: ProgressEvent) => any): void;
    }

    export class RemoteDataService implements IDataService {
        private config: Core.Configuration;

        constructor(config: Core.Configuration) {
            this.config = config;
        }

        private GenerateActionRequestData(data: any, callback?: (payload: any) => void): any {
            var ajaxSettings = {
                url: this.config.actionRequest,
                type: 'POST',
                contentType: 'application/json charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(data),
                beforeSend: this.config.xhrBeforeSend,
                success: function (payload) {
                    if (this.config.DEBUG) {
                        console.log(payload);
                    }
                    if (callback) {
                        callback(payload);
                    }
                }
            };
            return ajaxSettings;
        }

        private GenerateUploadRequestData(data: FormData, callback: (payload: any) => void, progress: (e: ProgressEvent) => any): any {
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
                    if (this.config.DEBUG) {
                        console.log(payload);
                    }
                    if (callback) {
                        callback(payload);
                    }
                }
            };
            return ajaxSettings;
        }

        LoadFileSystemInfo(path: string, callback: (payload: any) => void): void {
            var settings = this.GenerateActionRequestData({
                type: 'struct',
                folderPath: path
            }, callback);
            $.ajax(settings);
        }

        RenameObjects(requestData: Ajax.RenameRequestData, callback: (payload: any) => void): void {
            var settings = this.GenerateActionRequestData(requestData, callback);
            $.ajax(settings);
        }

        DeleteObjects(requestData: Ajax.DeleteRequestData, callback: (payload: any) => void): void {
            var settings = this.GenerateActionRequestData(requestData, callback);
            $.ajax(settings);
        }

        CreateObject(requestData: Ajax.IRequestData, callback: (payload: any) => void): void {
            var settings = this.GenerateActionRequestData(requestData, callback);
            $.ajax(settings);
        }

        MoveObjects(data: Ajax.MoveRequestData, callback: (payload: any) => void): void {
            var settings = this.GenerateActionRequestData(data, callback);
            $.ajax(settings);
        }

        UploadFile(file: File, callback: (payload: any) => void, progress: (e: ProgressEvent) => any): void {
            let data = new FormData();
            data.append('file', file);

            let settings = this.GenerateUploadRequestData(data, callback, progress);
            $.ajax(settings);
        }
    }

    export class InMemoryDataService implements IDataService {

        private map: Memory.InMemoryNavigationMap;

        constructor(map: Memory.InMemoryNavigationMap) {
            this.map = map;            
        }

        LoadFileSystemInfo(path: string, callback: (payload: any) => void): void {
            let folder = this.map.GetFolderItemForPath(path);
            if (folder === undefined) {
                throw `No folder info for given path: ${path}`;
            }
            let payload = {
                data: {
                    folders: folder.Folders,
                    files: folder.Files
                }
            };
            callback(payload);
        }

        RenameObjects(requestData: Ajax.RenameRequestData, callback: (payload: any) => void): void {
            let renameData = requestData;

            let folder = this.map.GetFolderItemForPath(renameData.folderPath);
            if (folder === undefined) {
                throw `No folder info for given path: ${renameData.folderPath}`;
            }
            let renameInfo = renameData.renames[0];

            if (folder.FileExists(renameInfo.newName)) {
                let msg = Utils.getString('.popup.rename.error.exist').Format(renameInfo.newName);
                callback({
                    error: msg,
                    data: { errors: [msg] }
                });
            } else {
                folder.GetFile(renameInfo.oldName).name = renameInfo.newName;
                callback({ success: 'Done.', data: {} });
            }
        }

        DeleteObjects(requestData: Ajax.DeleteRequestData, callback: (payload: any) => void): void {
            let data = requestData;
            let dir = this.map.GetFolderItemForPath(data.folderPath);
            for (let n of data.objectNames) {
                dir.DeleteObject(n);
            }
            callback({
                success: 'Done.',
                data: {
                    affected: data.objectNames.length
                }
            });
        }

        CreateObject(requestData: Ajax.IRequestData, callback: (payload: any) => void): void {
            throw new Error("Method not implemented.");
        }

        MoveObjects(data: Ajax.MoveRequestData, callback: (payload: any) => void): void {
            let payload: any = {};

            let srcDir = this.map.GetFolderItemForPath(data.sourceDirectory);
            let dstDir = this.map.GetFolderItemForPath(data.destinationDirectory);

            let itemsToMove: Models.FileSystemInfo[] = [];
            if (data.type === 'move') {
                for (let n of data.targets) {
                    let o = srcDir.DeleteObject(n);
                    if (o) {
                        itemsToMove.push(o);
                    }
                }
            } else if (data.type === 'copy') {
                for (let n of data.targets) {
                    let o = srcDir.GetObject(n);
                    if (o) {
                        itemsToMove.push(o);
                    }
                }
            }

            dstDir.AddObject(itemsToMove);

            callback(payload);
        }

        UploadFile(file: File, callback: (payload: any) => void, progress: (e: ProgressEvent) => any): void {
            let interval = Utils.NextInt(50, 150);
            let total: number = 100;
            let current = 0;
            let handlerId = setInterval(() => {
                current += 1;
                progress(new ProgressEvent('counter', {
                    lengthComputable: true,
                    total: total,
                    loaded: current
                }));
            }, interval);

            setTimeout(() => {
                clearInterval(handlerId);

                let r = Math.round(Math.random());
                if (r === 0) {
                    callback({
                        error: 'Fail.'
                    });
                } else {
                    callback({
                        success: 'Done.'
                    });
                }

            }, interval * total);
        }
    }
}