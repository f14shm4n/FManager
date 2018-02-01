namespace f14.Ajax {

    export abstract class BaseOperationRequest<T extends BaseParam, R extends BaseResult> implements IOperationRequest<T, R>{
        protected config: f14.Core.Configuration;
        protected callback: OperationRequestCallback<R>;

        constructor(config: f14.Core.Configuration) {
            this.config = config;
        }

        public abstract getUrl(): string;

        protected abstract makeResultFrom(data: any): R;

        public execute(param: T, callback: OperationRequestCallback<R>): void {
            var data = this.makeAjaxData(this.getUrl(), param, callback);
            $.ajax(data);
        }

        private makeAjaxData(url: string, param: T, callback: OperationRequestCallback<R>): any {
            this.callback = callback;
            var ajaxSettings: JQueryAjaxSettings = {
                url: url,
                type: 'POST',
                contentType: 'application/json charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(param),
                beforeSend: this.config.xhrBeforeSend,
                success: (data) => this.ajaxSuccess(data),
                error: (xhr, status, error) => this.ajaxError(xhr, status, error)
            };
            this.extendAjaxData(ajaxSettings, param);
            return ajaxSettings;
        }

        protected extendAjaxData(ajaxSettings: JQueryAjaxSettings, param: T) {
        }

        protected ajaxSuccess(data: any): void {
            if (this.config.DEBUG) {
                console.log(data);
            }
            if (this.callback) {
                this.callback(this.makeResultFrom(data));
            }
        }

        protected ajaxError(xhr: JQueryXHR, textStatus: string, errorThrown: string): void {
            console.log("Status: %s\nError: %s", textStatus);
        }
    }

    export class CopyRequest extends BaseOperationRequest<CopyParam, CopyResult>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Copy];
        }

        protected makeResultFrom(data: any): CopyResult {
            let r = new CopyResult();
            $.extend(true, r, data);
            return r;
        }
    }

    export class MoveRequest extends BaseOperationRequest<MoveParam, MoveResult>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Move];
        }

        protected makeResultFrom(data: any): MoveResult {
            let r = new MoveResult();
            $.extend(true, r, data);
            return r;
        }
    }

    export class CreateFolderRequest extends BaseOperationRequest<CreateFolderParam, CreateFolderResult>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.CreateFolder];
        }

        protected makeResultFrom(data: any): CreateFolderResult {
            let r = new CreateFolderResult();
            $.extend(true, r, data);
            return r;
        }
    }

    export class DeleteRequest extends BaseOperationRequest<DeleteParam, DeleteResult>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Delete];
        }

        protected makeResultFrom(data: any): DeleteResult {
            let r = new DeleteResult();
            $.extend(true, r, data);
            return r;
        }
    }

    export class FolderStructRequest extends BaseOperationRequest<FolderStructParam, FolderStructResult>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.FolderStruct];
        }

        protected makeResultFrom(data: any): FolderStructResult {
            let r = new FolderStructResult();
            $.extend(true, r, data);
            return r;
        }
    }

    export class RenameRequest extends BaseOperationRequest<RenameParam, RenameResult>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Rename];
        }

        protected makeResultFrom(data: any): RenameResult {
            let r = new RenameResult();
            $.extend(true, r, data);
            return r;
        }
    }

    export class UploadFileRequest extends BaseOperationRequest<UploadFileParam, UploadFileResult>{

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.UploadFile];
        }

        protected extendAjaxData(ajaxSettings: JQueryAjaxSettings, param: UploadFileParam){
            $.extend(true, ajaxSettings, {
                cache: false,
                contentType: false,
                processData: false,
                data: param.makeFormData(),
                xhr: () => {
                    let xhr = $.ajaxSettings.xhr();
                    if (xhr.upload && param.progressChanged) {
                        xhr.upload.addEventListener('progress', param.progressChanged, false);
                    }
                    return xhr;
                }
            });
        }

        protected makeResultFrom(data: any): UploadFileResult {
            let r = new UploadFileResult();
            $.extend(true, r, data);
            return r;
        }
    }
}