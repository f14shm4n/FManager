namespace f14.Ajax {

    export abstract class BaseOperationRequest<T extends BaseParam> implements IOperationRequest<T>{
        protected config: f14.Core.Configuration;

        constructor(config: f14.Core.Configuration) {
            this.config = config;
        }

        public abstract getUrl(): string;

        public execute(param: T, callback: OperationRequestCallback): void {
            var data = this.makeAjaxData(this.getUrl(), param, callback);
            $.ajax(data);
        }

        protected makeAjaxData(url: string, param: T, callback: OperationRequestCallback): any {
            var ajaxSettings = {
                url: url,
                type: 'POST',
                contentType: 'application/json charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(param),
                beforeSend: this.config.xhrBeforeSend,
                success: payload => {
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
    }

    export class CopyRequest extends BaseOperationRequest<CopyParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Copy];
        }
    }

    export class MoveRequest extends BaseOperationRequest<MoveParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Move];
        }
    }

    export class CreateFolderRequest extends BaseOperationRequest<CreateFolderParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.CreateFolder];
        }
    }

    export class DeleteRequest extends BaseOperationRequest<DeleteParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Delete];
        }
    }

    export class FolderStructRequest extends BaseOperationRequest<FolderStructParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.FolderStruct];
        }
    }

    export class RenameRequest extends BaseOperationRequest<RenameParam>{

        constructor(config: f14.Core.Configuration) {
            super(config);
        }

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.Rename];
        }
    }

    export class UploadFileRequest extends BaseOperationRequest<UploadFileParam>{

        public getUrl(): string {
            return this.config.endPointUrlMap[Ajax.AjaxActionTypes.UploadFile];
        }

        protected makeAjaxData(url: string, param: Ajax.UploadFileParam, callback: OperationRequestCallback): any {
            let ajaxSettings = {
                url: url,
                type: 'POST',
                cache: false,
                contentType: false,
                processData: false,
                data: param.makeFormData(),
                dataType: 'json',
                beforeSend: this.config.xhrBeforeSend,
                xhr: () => {
                    let xhr = $.ajaxSettings.xhr();
                    if (xhr.upload && param.progressChanged) {
                        xhr.upload.addEventListener('progress', param.progressChanged, false);
                    }
                    return xhr;
                },
                success: payload => {
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

    }
}