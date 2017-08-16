"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        var Popups;
        (function (Popups) {
            //===============================================================//
            //=========================== Popup =============================//
            //===============================================================//
            var Popup = (function () {
                function Popup() {
                    this.FooterButtons = [];
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
                Popup.prototype.SetTitle = function (title) {
                    if (!this.Title) {
                        this.Title = $('<span>').addClass('ui-popup-title');
                        this.Header.append(this.Title);
                    }
                    this.Title.text(title);
                };
                Popup.prototype.AddFooterButton = function (btn) {
                    this.FooterButtons.push(btn);
                    this.Footer.append(btn.$This);
                };
                Popup.prototype.AddErrorSection = function () {
                    this.ErrorSection = $('<div>').addClass('ui-popup-errors').appendTo(this.Body).hide();
                };
                Popup.prototype.PopulatePayloadErrors = function (payload) {
                    var _this = this;
                    this.ErrorSection.empty();
                    var addErrorItem = function (msg) {
                        $('<div>')
                            .addClass('ui-popup-error-message')
                            .text(msg)
                            .appendTo(_this.ErrorSection);
                    };
                    if (payload.data && payload.data.errors) {
                        for (var _i = 0, _a = payload.data.errors; _i < _a.length; _i++) {
                            var i = _a[_i];
                            addErrorItem(i);
                        }
                    }
                    else {
                        addErrorItem(payload.error);
                    }
                    this.ErrorSection.show(200);
                };
                Popup.prototype.GenerateButton = function (text, action) {
                    var btn = new UI.BaseButton();
                    btn.SetText(text);
                    if (action) {
                        btn.$This.on('click', action);
                    }
                    return btn;
                };
                Popup.prototype.CreateCloseBtn = function () {
                    return this.GenerateButton(f14.Utils.getString('.close'), function (e) {
                        UI.HidePopup();
                    });
                };
                return Popup;
            }());
            Popups.Popup = Popup;
            var RenamePopup = (function (_super) {
                __extends(RenamePopup, _super);
                function RenamePopup(item) {
                    var _this = _super.call(this) || this;
                    _this.SetTitle(f14.Utils.getString('.io.rename'));
                    _this.item = item;
                    _this.CreateRenameTextbox(_this.item);
                    var applyBtn = _this.GenerateButton(f14.Utils.getString('.apply'), function (e) {
                        var textBox = _this.Body.find('.tb-rename');
                        var requestData = new f14.Ajax.RenameRequestData(f14.Explorer.NavigationData.GetCurrentPath());
                        var oldName = textBox.attr('data-origin-name');
                        var newName = textBox.val();
                        if (oldName !== newName) {
                            requestData.AddRenameItem(oldName, newName);
                        }
                        if (requestData.HasData()) {
                            f14.Core.Config.dataService.RenameObjects(requestData, function (payload) {
                                _this.updateItemNames(requestData, payload);
                            });
                        }
                        else {
                            UI.HidePopup();
                        }
                    });
                    _this.AddFooterButton(applyBtn);
                    _this.AddFooterButton(_this.CreateCloseBtn());
                    return _this;
                }
                RenamePopup.prototype.CreateRenameTextbox = function (item) {
                    var itemName = item.FileSystemInfo.name;
                    var tb = new UI.TextBox();
                    tb.$This.addClass('tb-rename');
                    tb.$This.attr('data-origin-name', itemName);
                    tb.$This.val(itemName);
                    this.Body.append(tb.$This);
                };
                RenamePopup.prototype.updateItemNames = function (requestData, payload) {
                    if (payload) {
                        if (payload.error) {
                            this.PopulatePayloadErrors(payload);
                        }
                        else {
                            for (var _i = 0, _a = requestData.renames; _i < _a.length; _i++) {
                                var i = _a[_i];
                                this.item.SetItemName(i.newName);
                            }
                            UI.HidePopup();
                        }
                    }
                };
                return RenamePopup;
            }(Popup));
            Popups.RenamePopup = RenamePopup;
            var DeletePopup = (function (_super) {
                __extends(DeletePopup, _super);
                function DeletePopup(folderPath, itemNames) {
                    var _this = _super.call(this) || this;
                    _this.$This.addClass('danger');
                    _this.SetTitle(f14.Utils.getString('.popup.delete.title'));
                    _this.FolderPath = folderPath;
                    _this.ItemNames = itemNames;
                    $('<p>').text(f14.Utils.getString('.popup.delete.desc')).appendTo(_this.Body);
                    var delBtn = _this.GenerateButton(f14.Utils.getString('.io.delete'), function (e) {
                        var rData = new f14.Ajax.DeleteRequestData(_this.FolderPath, _this.ItemNames);
                        f14.Core.Config.dataService.DeleteObjects(rData, function (payload) {
                            if (f14.Core.Config.DEBUG) {
                                console.log(rData);
                            }
                            if (payload.error) {
                                _this.PopulatePayloadErrors(payload);
                            }
                            if (payload.data.affected > 0) {
                                f14.Explorer.ReNavigate();
                                UI.ShowToast({
                                    message: f14.Utils.getString('.toast.delete.count.format').Format(payload.data.affected)
                                });
                                if (payload.success) {
                                    UI.HidePopup();
                                }
                            }
                        });
                    });
                    _this.AddFooterButton(delBtn);
                    _this.AddFooterButton(_this.CreateCloseBtn());
                    return _this;
                }
                return DeletePopup;
            }(Popup));
            Popups.DeletePopup = DeletePopup;
            var UploadFilesPopup = (function (_super) {
                __extends(UploadFilesPopup, _super);
                function UploadFilesPopup() {
                    var _this = _super.call(this) || this;
                    _this.tasksCount = 0;
                    _this.SetTitle(f14.Utils.getString('.popup.upload.title'));
                    _this.$Form = $('<form>').addClass('ui-upload-form').appendTo(_this.Body);
                    _this.$Form.text('No files selected.');
                    _this.AddFooterButton(_this.CreateFileSelectBtn());
                    _this.AddFooterButton(_this.CreateUploadButton());
                    _this.AddFooterButton(_this.CreateCloseBtn());
                    return _this;
                }
                UploadFilesPopup.prototype.AddFilePresenter = function (file) {
                    var fileEntry = $('<div>').addClass('ui-input-group file-container').data('file', file);
                    var fileName = $('<div>')
                        .addClass('ui-input-group-item max')
                        .text(file.name)
                        .appendTo(fileEntry);
                    var fileBtns = $('<div>')
                        .addClass('ui-input-group-item min actions')
                        .append(new UI.BaseButton('', 'mdl2-close', 'icon-transparent close-btn').OnClick(function (e) {
                        $(e.target).closest('.file-container').remove();
                    }).$This)
                        .appendTo(fileEntry);
                    var states = $('<div>').addClass('ui-input-group-item min status')
                        .append($('<i>').addClass('mdl2 status-value'))
                        .appendTo(fileEntry);
                    var progress = $('<div>').addClass('ui-input-group-item min progress')
                        .append($('<div>').addClass('progress-value').text('0%'))
                        .appendTo(fileEntry);
                    this.$Form.append(fileEntry);
                };
                UploadFilesPopup.prototype.CreateFileSelectBtn = function () {
                    var _this = this;
                    var btn = new UI.BaseButton();
                    btn.$This.addClass('btn-file');
                    btn.SetText(f14.Utils.getString('.io.select.files'));
                    var input = $('<input>').attr('type', 'file').attr('multiple', 'multiple');
                    input.on('change', function (e) {
                        var fileSelector = e.target;
                        var files = fileSelector.files;
                        if (files.length > 0) {
                            _this.$Form.empty();
                            for (var i in files) {
                                var f = files[i];
                                if (f instanceof File) {
                                    _this.AddFilePresenter(files[i]);
                                }
                            }
                        }
                    });
                    btn.$This.append(input);
                    return btn;
                };
                UploadFilesPopup.prototype.CreateUploadButton = function () {
                    var _this = this;
                    var btn = this.GenerateButton(f14.Utils.getString('.io.upload'), function (e) {
                        var fileContainers = _this.$Form.find('.file-container:not(.loading,.success,.error)');
                        if (fileContainers.length > 0) {
                            $(_this.Footer.find('.btn-file')).addClass('disabled');
                            btn.$This.addClass('disabled');
                            fileContainers.each(function (i, e) {
                                _this.tasksCount += 1;
                                var container = $(e);
                                var progress = $(container.find('.progress-value')[0]);
                                var file = container.data('file');
                                container.addClass('loading');
                                f14.Core.Config.dataService.UploadFile(file, function (payload) {
                                    container.removeClass('loading');
                                    if (payload.success) {
                                        container.addClass('success');
                                    }
                                    else {
                                        container.addClass('error');
                                    }
                                    _this.tasksCount -= 1;
                                    if (_this.tasksCount === 0) {
                                        $(_this.Footer.find('.btn-file')).removeClass('disabled');
                                        btn.$This.removeClass('disabled');
                                    }
                                }, function (e) {
                                    if (e.lengthComputable) {
                                        var prc = Math.ceil(e.loaded / e.total * 100);
                                        progress.text(prc + '%');
                                    }
                                });
                            });
                        }
                    });
                    btn.$This.addClass('btn-primary btn-upload');
                    return btn;
                };
                return UploadFilesPopup;
            }(Popup));
            Popups.UploadFilesPopup = UploadFilesPopup;
        })(Popups = UI.Popups || (UI.Popups = {}));
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));
