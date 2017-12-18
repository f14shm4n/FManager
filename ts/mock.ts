namespace f14.Mock {

    export class MockNavigationMap extends Memory.InMemoryNavigationMap {
        constructor() {
            super();

            let root = new f14.Models.DirectoryInfo('C:');
            root.CreateFile('boot.sys');
            root.CreateFile('autorun.exe');
            root.CreateFile('pagefile.sys');

            let myDocs = root.CreateFolder('MyDocs');
            let users = root.CreateFolder('Users');

            let imgs = myDocs.CreateFolder('Images');
            for (var i = 0; i < 30; i++) {
                let name = `image-${i + 1}.jpg`;
                imgs.CreateFile(name);
            }
            let snds = myDocs.CreateFolder('Sounds');
            for (var i = 0; i < 10; i++) {
                let name = `sound-${i + 1}.mp3`;
                snds.CreateFile(name);
            }

            this.MapFolder(root);
            console.log(this.ToString());
        }
    }

    export abstract class MockOperationRequest<T extends Ajax.BaseParam> implements Ajax.IOperationRequest<T>{
        protected config: f14.Core.Configuration;
        protected map: f14.Memory.InMemoryNavigationMap;

        constructor(config: f14.Core.Configuration) {
            this.config = config;
            this.map = config.inMemoryData;
        }

        public abstract getUrl(): string;

        public abstract execute(param: T, callback: Ajax.OperationRequestCallback): void;
    }

    export class MockCopyRequest extends MockOperationRequest<Ajax.CopyParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Copy];
        }

        public execute(param: Ajax.CopyParam, callback: Ajax.OperationRequestCallback): void {
            let srcDir = this.map.GetFolderItemForPath(param.sourceDirectory);
            let dstDir = this.map.GetFolderItemForPath(param.destinationDirectory);

            let copyFile = (file: Models.FileInfo, dir: Models.DirectoryInfo): Models.FileInfo => {
                let copy = new Models.FileInfo(file.name, dir);
                Object.assign(copy, file);
                return copy;
            };

            let copyFolder = (dir: Models.DirectoryInfo, parent: Models.DirectoryInfo): Models.DirectoryInfo => {
                let copy = new Models.DirectoryInfo(dir.name, parent);

                for (let f of dir.Files) {
                    copy.AddObject(copyFile(f, copy));
                }

                for (let f of dir.Folders) {
                    copy.AddObject(copyFolder(f, copy));
                }
                return copy;
            };

            for (let n of param.targets) {
                let o = srcDir.GetObject(n.name);
                if (o) {
                    if (n.isFile) {
                        let file = copyFile(o as Models.FileInfo, dstDir);
                        dstDir.AddObject(file);

                        if (this.config.DEBUG) {
                            console.log(file);
                        }
                    } else {
                        let folder = copyFolder(o as Models.DirectoryInfo, dstDir);

                        this.map.MapFolder(folder);
                        dstDir.AddObject(folder);

                        if (this.config.DEBUG) {
                            console.log(folder);
                            console.log(this.map.ToString());
                        }
                    }
                }
            }

            let result = new Ajax.CopyResult();
            callback(result);
        }
    }

    export class MockMoveRequest extends MockOperationRequest<Ajax.MoveParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Move];
        }

        public execute(param: Ajax.MoveParam, callback: Ajax.OperationRequestCallback): void {
            let srcDir = this.map.GetFolderItemForPath(param.sourceDirectory);
            let dstDir = this.map.GetFolderItemForPath(param.destinationDirectory);

            let itemsToMove: Models.BaseFileInfo[] = [];

            for (let n of param.targets) {
                let o = srcDir.DeleteObject(n.name);
                if (o) {
                    itemsToMove.push(o);
                }
            }

            dstDir.AddObject(itemsToMove);

            let result = new Ajax.MoveResult();
            callback(result);
        }
    }

    export class MockCreateFolderRequest extends MockOperationRequest<Ajax.CreateFolderParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.CreateFolder];
        }

        public execute(param: Ajax.CreateFolderParam, callback: Ajax.OperationRequestCallback): void {
            let dir = this.map.GetFolderItemForPath(param.currentFolderPath);
            dir.CreateFolder(param.name);

            let result = new Ajax.CreateFolderResult();
            callback(result);
        }
    }

    export class MockDeleteRequest extends MockOperationRequest<Ajax.DeleteParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Delete];
        }

        public execute(param: Ajax.DeleteParam, callback: Ajax.OperationRequestCallback): void {
            let dir = this.map.GetFolderItemForPath(param.currentFolderPath);
            for (let n of param.targets) {
                dir.DeleteObject(n);
            }

            let result = new Ajax.DeleteResult();
            result.affected = param.targets.length;

            callback(result);
        }
    }

    export class MockFolderStructRequest extends MockOperationRequest<Ajax.FolderStructParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.FolderStruct];
        }

        public execute(param: Ajax.FolderStructParam, callback: Ajax.OperationRequestCallback): void {
            let folder = this.map.GetFolderItemForPath(param.currentFolderPath);
            if (folder === undefined) {
                throw `No folder info for given path: ${param.currentFolderPath}`;
            }

            let result = new Ajax.FolderStructResult();
            result.files = folder.Files;
            result.folders = folder.Folders;

            callback(result);
        }
    }

    export class MockRenameRequest extends MockOperationRequest<Ajax.RenameParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Rename];
        }

        public execute(param: Ajax.RenameParam, callback: Ajax.OperationRequestCallback): void {
            let folder = this.map.GetFolderItemForPath(param.currentFolderPath);
            if (folder === undefined) {
                throw `No folder info for given path: ${param.currentFolderPath}`;
            }

            let result = new Ajax.RenameResult();

            for (let t of param.targets) {
                if (folder.FileExists(t.name)) {
                    result.errors.push(Utils.getString('.popup.rename.error.exist').Format(t.name));
                } else {
                    folder.GetObject(t.oldName).name = t.name;
                    result.renamedObjects.push(t);
                }
            }

            callback(result);
        }
    }

    export class MockUploadFileRequest extends MockOperationRequest<Ajax.UploadFileParam>{

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.UploadFile];
        }

        public execute(param: Ajax.UploadFileParam, callback: Ajax.OperationRequestCallback): void {
            let interval = Utils.NextInt(50, 150);
            let total: number = 100;
            let current = 0;
            let handlerId = setInterval(() => {
                current += 1;
                if (param.progressChanged) {
                    param.progressChanged(new ProgressEvent('counter', {
                        lengthComputable: true,
                        total: total,
                        loaded: current
                    }));
                }
            }, interval);

            setTimeout(() => {
                clearInterval(handlerId);

                let dir = this.map.GetFolderItemForPath(param.currentFolderPath);
                dir.CreateFile(param.file.name);

                let result = new Ajax.UploadFileResult();
                callback(result);

            }, interval * total);
        }
    }
}