namespace f14.Ajax {

    export class BaseParam {
        currentFolderPath: string;
    }

    export class TargetCollectionParam<T> extends BaseParam {
        targets: T[] = [];

        constructor(targets: T[]) {
            super();

            if (targets) {
                this.targets = targets;
            }
        }
    }

    export class MoveParam extends TargetCollectionParam<BaseActionTarget>{
        sourceDirectory: string;
        destinationDirectory: string;
        overwrite: boolean = false;

        constructor(srcDir: string, destDir: string, targets: BaseActionTarget[]) {
            super(targets);

            this.sourceDirectory = srcDir;
            this.destinationDirectory = destDir;
        }
    }

    export class CopyParam extends MoveParam {
        constructor(srcDir: string, destDir: string, targets: BaseActionTarget[]) {
            super(srcDir, destDir, targets);
        }
    }

    export class DeleteParam extends TargetCollectionParam<string> {
        constructor(folderPath: string, targets: string[]) {
            super(targets);

            this.currentFolderPath = folderPath;
        }
    }

    export class CreateFolderParam extends BaseParam {
        name: string;

        constructor(workFolder: string, newObjectName: string) {
            super();

            this.currentFolderPath = workFolder;
            this.name = newObjectName;
        }
    }

    export class RenameParam extends TargetCollectionParam<RenameActionTarget> {

        constructor(folderPath: string, targets?: RenameActionTarget[]) {
            super(targets);

            this.currentFolderPath = folderPath;
        }

        public AddRenameItem(oldName: string, newName: string, isFile: boolean): void {
            this.targets.push(new RenameActionTarget(oldName, newName, isFile));
        }

        public HasData(): boolean {
            return this.targets.length > 0;
        }
    }

    export class FolderStructParam extends BaseParam {
        fileExtensions: string[] = [];

        constructor(folderPath: string, fileExtensions?: string[]) {
            super();

            this.currentFolderPath = folderPath;
            this.fileExtensions = fileExtensions;
        }
    }

    export class UploadFileParam extends BaseParam {
        public file: File;
        public progressChanged: (e: ProgressEvent) => any;

        constructor(folderPath: string, file: File, progress: (e: ProgressEvent) => any) {
            super();

            this.currentFolderPath = folderPath;
            this.file = file;
            this.progressChanged = progress;
        }

        public makeFormData(): FormData {
            let data = new FormData();
            data.append('currentFolderPath', this.currentFolderPath);
            data.append('file', this.file);
            return data;
        }
    }
}