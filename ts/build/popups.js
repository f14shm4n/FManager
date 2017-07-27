"use strict";
var f14;
(function (f14) {
    var UI;
    (function (UI) {
        var Popups;
        (function (Popups) {
            var ui = f14.UI;
            var Popup = (function () {
                function Popup() {
                    this.FooterButtons = [];
                    this.$This = $('<div>').addClass('ui-popup');
                    this.Container = $('<div>').addClass('container').appendTo(this.$This);
                    this.Header = $('<div>').addClass('ui-popup-header');
                    this.Body = $('<div>').addClass('ui-popup-body');
                    this.Footer = $('<div>').addClass('ui-popup-footer');
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
                return Popup;
            }());
            Popups.Popup = Popup;
            var RenamePopup = (function (_super) {
                __extends(RenamePopup, _super);
                function RenamePopup(items) {
                    var _this = _super.call(this) || this;
                    _this.SetTitle(f14.Utils.getString('.io.rename'));
                    items.forEach(function (x) {
                        var iName = x.$This.data('name');
                        var tb = new ui.TextBox();
                        tb.$This.data('origin-name', iName);
                        tb.$This.val(iName);
                        _this.Body.append(tb.$This);
                    });
                    _this.AddFooterButton(new CloseButton());
                    return _this;
                }
                return RenamePopup;
            }(Popup));
            Popups.RenamePopup = RenamePopup;
            var CloseButton = (function (_super) {
                __extends(CloseButton, _super);
                function CloseButton() {
                    var _this = _super.call(this) || this;
                    _this.SetText(f14.Utils.getString('.close'));
                    _this.$This.on('click', function () {
                        ui.HidePopup();
                    });
                    return _this;
                }
                return CloseButton;
            }(ui.BaseButton));
        })(Popups = UI.Popups || (UI.Popups = {}));
    })(UI = f14.UI || (f14.UI = {}));
})(f14 || (f14 = {}));
