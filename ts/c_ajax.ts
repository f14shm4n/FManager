namespace f14.Ajax {

    export class ResponseData {
        code: number | string;
        error: string = undefined;
        success: string = undefined;
        data: any;
    }

    export class RenameFileInfo {
        oldName: string;
        newName: string;
        isFile: boolean;

        constructor(oldName: string, newName: string, isFile: boolean) {
            this.oldName = oldName;
            this.newName = newName;
            this.isFile = isFile;
        }
    }

    export class MoveTarget {
        name: string;
        isFile: boolean;

        constructor(name: string, isFile: boolean) {
            this.name = name;
            this.isFile = isFile;
        }
    }

    export interface IRequestData {
        type: string;
    }

    export abstract class BaseRequestData implements IRequestData {
        public type: string;

        constructor(type: string) {
            this.type = type;
        }
    }

    export class FileSystemRequestData extends BaseRequestData {
        path: string;
        constructor(folderPath: string) {
            super('struct');
            this.path = folderPath;
        }
    }

    export class RenameRequestData extends BaseRequestData {
        path: string;
        renames: RenameFileInfo[] = [];

        constructor(folderPath: string) {
            super('rename');
            this.path = folderPath;
        }

        public AddRenameItem(oldName: string, newName: string, isFile: boolean): void {
            this.renames.push(new RenameFileInfo(oldName, newName, isFile));
        }

        public HasData(): boolean {
            return this.renames.length > 0;
        }
    }

    export class DeleteRequestData extends BaseRequestData {
        path: string;
        objectNames: string[] = [];

        constructor(folderPath: string, items?: string[]) {
            super('delete');

            this.path = folderPath;

            if (items && items.length > 0) {
                items.forEach(x => this.objectNames.push(x));
            }
        }

        public Add(name: string): void {
            this.objectNames.push(name);
        }
    }

    export class MoveRequestData extends BaseRequestData {
        sourceDirectory: string;
        destinationDirectory: string;
        overwrite: boolean = false;
        targets: MoveTarget[];

        constructor(type: string, srcDir: string, destDir: string, targets: MoveTarget[]) {
            super(type);
            this.sourceDirectory = srcDir;
            this.destinationDirectory = destDir;
            this.targets = targets;
        }

        public static From(data: Memory.MoveOperationData): MoveRequestData {
            return new MoveRequestData(data.type, data.sourceDirectory, data.destinationDirectory, data.targets);
        }
    }

    export class CreateRequestData extends BaseRequestData {
        constructor(type: string) {
            super(type);
        }
    }
}