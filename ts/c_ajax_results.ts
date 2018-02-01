namespace f14.Ajax {

    export class BaseResult {
        errors: string[] = [];

        public hasErrors(): boolean {
            return this.errors && this.errors.length > 0;
        }
    }

    export class AffectedResult extends BaseResult {
        affected: number;
    }

    export class MoveResult extends BaseResult {

    }

    export class CopyResult extends MoveResult {

    }

    export class DeleteResult extends AffectedResult {

    }

    export class CreateFolderResult extends BaseResult {

    }

    export class FolderStructResult extends BaseResult {
        folderCount: number;
        fileCount: number;
        folders: Models.DirectoryInfo[] = [];
        files: Models.FileInfo[] = []
    }

    export class RenameResult extends AffectedResult {
        renamedObjects: RenameActionTarget[] = [];
    }

    export class UploadFileResult extends BaseResult {

    }
}