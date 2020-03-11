namespace f14.UI.Popups {

    //===============================================================//
    //=========================== Popup =============================//
    //===============================================================//

    export class Popup implements UI.IJQueryObject {

        public $This: JQuery;
        protected Header: JQuery;
        protected Body: JQuery;
        protected Footer: JQuery;
        protected Container: JQuery;
        protected ErrorSection: JQuery;

        protected Title: JQuery;
        protected FooterButtons: UI.BaseButton[] = [];

        constructor() {
            this.$This = $('<div>').addClass('ui-popup');
            this.Container = $('<div>').addClass('container').appendTo(this.$This);

            this.Header = $('<div>').addClass('ui-popup-header');
            this.Body = $('<div>').addClass('ui-popup-body');
            this.Footer = $('<div>').addClass('ui-popup-footer');

            this.AddErrorSection();

            this.Container
                .append(this.Header)
                .append(this.Body)
                .append(this.Footer);
        }

        protected SetTitle(title: string): void {
            if (!this.Title) {
                this.Title = $('<span>').addClass('ui-popup-title');
                this.Header.append(this.Title);
            }
            this.Title.text(title);
        }

        protected AddFooterButton(btn: UI.BaseButton): void {
            this.FooterButtons.push(btn);
            this.Footer.append(btn.$This);
        }

        protected AddErrorSection(): void {
            this.ErrorSection = $('<div>').addClass('ui-popup-errors').appendTo(this.Body).hide();
        }

        protected PopulatePayloadErrors(payload: Ajax.BaseResult): void {
            this.ErrorSection.empty();
            let addErrorItem = (msg: string) => {
                $('<div>')
                    .addClass('ui-popup-error-message')
                    .text(msg)
                    .appendTo(this.ErrorSection);
            };
            if (payload.hasErrors()) {
                for (let i of payload.errors) {
                    addErrorItem(i);
                }
            }
            this.ErrorSection.show(200);
        }

        protected GenerateButton(text: string, action?: (e: JQueryEventObject) => any): UI.BaseButton {
            let btn = new UI.BaseButton();
            btn.SetText(text);
            if (action) {
                btn.$This.on('click', action);
            }
            return btn;
        }

        protected CreateCloseBtn(): UI.BaseButton {
            return this.GenerateButton(Utils.getString('.close'), e => {
                UI.HidePopup();
            });
        }
    }

    export class RenamePopup extends Popup {

        private item: UI.FileStructItem;

        constructor(item: UI.FileStructItem) {
            super();

            this.SetTitle(Utils.getString('.io.rename'));

            this.item = item;
            this.CreateRenameTextbox(this.item);

            let applyBtn = this.GenerateButton(Utils.getString('.apply'), (e) => {
                let textBox: JQuery = this.Body.find('.tb-rename');
                let requestParam = new Ajax.RenameParam(f14.Explorer.NavigationData.GetCurrentPath());

                let oldName = textBox.attr('data-origin-name');
                let newName = textBox.val();
                if (oldName !== newName) {
                    requestParam.AddRenameItem(oldName, newName, textBox.data('io-type') == Models.FileSystemItemType.File);
                }

                if (requestParam.HasData()) {
                    Core.Config.ajaxRequestMap[Ajax.AjaxActionTypes.Rename].execute(requestParam, payload => this.updateItemNames(payload));
                } else {
                    UI.HidePopup();
                }
            });

            this.AddFooterButton(applyBtn);
            this.AddFooterButton(this.CreateCloseBtn());
        }

        private CreateRenameTextbox(item: UI.FileStructItem) {
            let itemName = item.FileSystemInfo.name;
            let tb = new UI.TextBox();
            tb.$This.addClass('tb-rename');
            tb.$This.attr('data-origin-name', itemName);
            tb.$This.data('io-type', item.Type);
            tb.$This.val(itemName);

            this.Body.append(tb.$This);
        }

        private updateItemNames(payload: Ajax.BaseResult) {
            if (payload.hasErrors()) {
                this.PopulatePayloadErrors(payload);
            } else {
                let result = payload as Ajax.RenameResult;
                this.item.SetItemName(result.renamedObjects[0].name); // TODO: multiple renames
                UI.HidePopup();
            }
        }
    }

    export class DeletePopup extends Popup {

        private FolderPath: string;
        private ItemNames: Ajax.BaseActionTarget[];

        constructor(folderPath: string, itemNames: Ajax.BaseActionTarget[]) {
            super();

            this.$This.addClass('danger');

            this.SetTitle(Utils.getString('.popup.delete.title'));

            this.FolderPath = folderPath;
            this.ItemNames = itemNames;

            $('<p>').text(Utils.getString('.popup.delete.desc')).appendTo(this.Body);

            let delBtn = this.GenerateButton(Utils.getString('.io.delete'), e => {
                let param = new Ajax.DeleteParam(this.FolderPath, this.ItemNames.map((v, i, arr) => v.name));
                Core.Config.ajaxRequestMap[Ajax.AjaxActionTypes.Delete].execute(param, payload => {
                    if (Core.Config.DEBUG) {
                        console.log(param);
                    }

                    if (payload.hasErrors()) {
                        this.PopulatePayloadErrors(payload);
                    }

                    let result = payload as Ajax.DeleteResult;
                    if (result.affected > 0) {
                        Explorer.ReNavigate();
                        UI.ShowToast({
                            message: Utils.getString('.toast.delete.count.format').Format(result.affected.toString())
                        });
                        if (!result.hasErrors()) {
                            UI.HidePopup();
                        }
                    }
                });
            });

            this.AddFooterButton(delBtn);
            this.AddFooterButton(this.CreateCloseBtn());
        }
    }

    export class UploadFilesPopup extends Popup {

        private $Form: JQuery;

        constructor() {
            super();

            this.SetTitle(Utils.getString('.popup.upload.title'));

            this.$Form = $('<form>').addClass('ui-upload-form').appendTo(this.Body);
            this.$Form.text('No files selected.');


            this.AddFooterButton(this.CreateFileSelectBtn());
            this.AddFooterButton(this.CreateUploadButton());
            this.AddFooterButton(this.CreateCloseBtn());
        }

        private AddFilePresenter(file: File) {
            let fileEntry = $('<div>').addClass('ui-input-group file-container').data('file', file);

            let fileName = $('<div>')
                .addClass('ui-input-group-item max')
                .text(file.name)
                .appendTo(fileEntry);
            let fileBtns = $('<div>')
                .addClass('ui-input-group-item min actions')
                .append(new UI.BaseButton('', 'mdl2-close', 'icon-transparent close-btn').OnClick(e => {
                    $(e.target).closest('.file-container').remove();
                }).$This)
                .appendTo(fileEntry);
            let states = $('<div>').addClass('ui-input-group-item min status')
                .append($('<i>').addClass('mdl2 status-value'))
                .appendTo(fileEntry);
            let progress = $('<div>').addClass('ui-input-group-item min progress')
                .append($('<div>').addClass('progress-value').text('0%'))
                .appendTo(fileEntry);

            this.$Form.append(fileEntry);
        }

        private CreateFileSelectBtn(): UI.BaseButton {
            let btn = new UI.BaseButton();
            btn.$This.addClass('btn-file');
            btn.SetText(Utils.getString('.io.select.files'));

            let input = $('<input>')
                .attr('type', 'file')
                .attr('multiple', 'multiple')
                .attr('accept', Core.Config.uploadFileFilter || '*');
            input.on('change', e => {
                let fileSelector = e.target as HTMLInputElement;
                let files = fileSelector.files;

                if (files.length > 0) {
                    this.$Form.empty();
                    for (let i in files) {
                        let f = files[i];
                        if (f instanceof File) {
                            this.AddFilePresenter(files[i]);
                        }
                    }
                }
            });

            btn.$This.append(input);
            return btn;
        }

        private tasksCount: number = 0;

        private CreateUploadButton(): UI.BaseButton {
            let btn = this.GenerateButton(Utils.getString('.io.upload'), e => {
                let fileContainers = this.$Form.find('.file-container:not(.loading,.success,.error)');
                if (fileContainers.length > 0) {
                    $(this.Footer.find('.btn-file')).addClass('disabled');
                    btn.$This.addClass('disabled');

                    fileContainers.each((i, e) => {
                        this.tasksCount += 1;

                        let container = $(e);
                        let progress = $(container.find('.progress-value')[0]);
                        let file: File = container.data('file');

                        container.addClass('loading');

                        let param = new Ajax.UploadFileParam(Explorer.NavigationData.GetCurrentPath(), file, e => {
                            if (e.lengthComputable) {
                                var prc = Math.ceil(e.loaded / e.total * 100);
                                progress.text(prc + '%');
                            }
                        });

                        Core.Config.ajaxRequestMap[Ajax.AjaxActionTypes.UploadFile].execute(param,
                            payload => {
                                container.removeClass('loading');
                                if (payload.hasErrors()) {
                                    container.addClass('error');
                                } else {
                                    container.addClass('success');
                                }

                                this.tasksCount = Math.max(0, this.tasksCount - 1);
                                if (this.tasksCount === 0) {
                                    $(this.Footer.find('.btn-file')).removeClass('disabled');
                                    btn.$This.removeClass('disabled');
                                    Explorer.ReNavigate();
                                }
                            });
                    });
                }
            });
            btn.$This.addClass('btn-primary btn-upload');
            return btn;
        }
    }
}