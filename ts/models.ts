namespace f14.Models {

    import core = f14.Core;

    export enum FileSystemItemType {
        Folder,
        File,
        Back
    }

    export interface IFileSystemInfo {
        name: string;
    }

    abstract class BaseFileSystemInfo implements IFileSystemInfo {
        constructor(name: string) {
            this.name = name;
        }
        public name: string;
    }

    export class FileInfo extends BaseFileSystemInfo {
        constructor(name: string, extension: string) {
            super(name);
            this.extension = extension;
        }
        public extension: string;
    }

    export class FolderInfo extends BaseFileSystemInfo {
        constructor(name: string) {
            super(name);
        }
    }
}