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

        constructor(oldName: string, newName: string) {
            this.oldName = oldName;
            this.newName = newName;
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

    export class RenameRequestData extends BaseRequestData {
        folderPath: string;
        renames: RenameFileInfo[] = [];

        constructor(folderPath: string) {
            super('rename');
            this.folderPath = folderPath;
        }

        public AddRenameItem(oldName: string, newName: string): void {
            this.renames.push(new RenameFileInfo(oldName, newName));
        }

        public HasData(): boolean {
            return this.renames.length > 0;
        }
    }

    export class DeleteRequestData extends BaseRequestData {
        folderPath: string;
        objectNames: string[] = [];

        constructor(folderPath: string, items?: string[]) {
            super('delete');

            this.folderPath = folderPath;

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
        targets: string[];

        constructor(type: string, srcDir: string, destDir: string, targets: string[]) {
            super(type);
            this.sourceDirectory = srcDir;
            this.destinationDirectory = destDir;
            this.targets = targets;
        }

        public static From(data: Memory.MoveOperationData): MoveRequestData {
            return new MoveRequestData(data.type, data.sourceDirectory, data.destinationDirectory, data.targets);
        }
    }
}