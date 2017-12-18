namespace f14.Models {

    export class ActionButtonInfo {
        icon: string;
        text: string;
        classes?: string;
        action: (e: JQueryEventObject) => void;
        shortcut?: string;
    }

    export enum FileSystemItemType {
        Folder,
        File,
        Back
    }

    export class BaseFileInfo {
        public name: string;
        public properties?: IStringMap<string> = {};

        constructor(name: string, props?: IStringMap<string>) {
            this.name = name;
            if (props) {
                for (let i in props) {
                    this.properties[i] = props[i];
                }
            }
        }  
    }

    export class FileInfo extends BaseFileInfo {
        constructor(name: string, folder: DirectoryInfo, props?: IStringMap<string>) {
            super(name, props);
            this.Directory = folder;
            if (!this.properties['extension']) {
                this.properties['extension'] = name.split('.').pop();
            }
        }

        public Directory: DirectoryInfo;
    }

    export class DirectoryInfo extends BaseFileInfo {
        constructor(name: string, parent?: DirectoryInfo, props?: IStringMap<string>) {
            super(name, props);
            this.Parent = parent;
        }

        public Parent: DirectoryInfo;
        public Folders: DirectoryInfo[] = [];
        public Files: FileInfo[] = [];

        public GetFullPath(): string {
            if (this.Parent !== undefined) {
                return this.Parent.GetFullPath() + '/' + this.name;
            }
            return this.name;
        }

        public CreateFolder(name: string): DirectoryInfo {
            let folder = new DirectoryInfo(name, this);
            this.Folders.push(folder);
            return folder;
        }

        public CreateFile(name: string): FileInfo {
            let file = new FileInfo(name, this);
            this.Files.push(file);
            return file;
        }

        public FileExists(name: string): boolean {
            return this.Files.some(x => x.name === name);
        }

        public FolderExists(name: string): boolean {
            return this.Files.some(x => x.name === name);
        }

        public GetFile(name: string): FileInfo {
            let filtered = this.Files.filter(x => x.name === name);
            if (filtered.length > 0) {
                return filtered[0];
            }
            return undefined;
        }

        public GetFolder(name: string): DirectoryInfo {
            let filtered = this.Folders.filter(x => x.name === name);
            if (filtered.length > 0) {
                return filtered[0];
            }
            return undefined;
        }

        public GetObject(name: string): BaseFileInfo {
            return this.GetFile(name) || this.GetFolder(name);
        }

        public AddObject(obj: BaseFileInfo | BaseFileInfo[]): void {
            if (obj instanceof BaseFileInfo) {
                this._AddObject(obj);
            } else {
                for (let i of obj) {
                    this._AddObject(i);
                }
            }
        }

        private _AddObject(obj: BaseFileInfo): void {
            if (obj instanceof FileInfo) {
                if (this.FileExists(obj.name)) {
                    this.DeleteObject(obj.name);
                }
                this.Files.push(obj);
            } else if (obj instanceof DirectoryInfo) {
                let dir = this.GetFolder(obj.name);
                if (dir) {
                    dir.AddObject(obj.Files);
                    dir.AddObject(obj.Folders);
                } else {
                    this.Folders.push(obj);
                }
            }
        }

        public DeleteObject(name: string): BaseFileInfo {
            return this._DeleteObject(this.Files, name) || this._DeleteObject(this.Folders, name);
        }

        private _DeleteObject(collection: BaseFileInfo[], name: string): BaseFileInfo {
            for (let i = 0; i < collection.length; i++) {
                let o = collection[i];
                if (o.name === name) {
                    collection.splice(i, 1);
                    return o;
                }
            }
            return undefined;
        }
    }
}