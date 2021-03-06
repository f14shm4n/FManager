namespace f14.Ajax {

    export class AjaxActionTypes {
        public static FolderStruct: string = 'folder_struct';
        public static Rename: string = 'rename';
        public static Delete: string = 'delete';
        public static Move: string = 'move';
        public static Copy: string = 'copy';
        public static CreateFolder: string = 'create_folder';
        public static UploadFile: string = "upload_file";
    }

    export type OperationRequestCallback<R extends BaseResult> = (payload: R) => void;

    export interface IOperationRequest<T extends BaseParam, R extends BaseResult> {
        execute(param: T, callback: OperationRequestCallback<R>): void;
    }

    export class BaseActionTarget {
        name: string;
        isFile: boolean;

        constructor(name: string, isFile: boolean) {
            this.name = name;
            this.isFile = isFile;
        }
    }

    export class RenameActionTarget extends BaseActionTarget {
        oldName: string;

        constructor(oldName: string, newName: string, isFile: boolean) {
            super(newName, isFile);

            this.oldName = oldName;
        }
    }
}