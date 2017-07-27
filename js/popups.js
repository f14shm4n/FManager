; (function ($, ns) {

    class Popup {
        constructor() {
            this.popup = $('<div>').addClass('ui-popup');
            this._container = $('<div>').addClass('container').appendTo(this.popup);

            this.header = $('<div>').addClass('ui-popup-header');
            this.body = $('<div>').addClass('ui-popup-body');
            this.footer = $('<div>').addClass('ui-popup-footer');

            this._container
                .append(this.header)
                .append(this.body)
                .append(this.footer);
        }

        get getHeader() { return this.header; }
        get getBody() { return this.body; }
        get getFooter() { return this.footer; }
        get getContainer() { return this.popup; }

        setTitle(title) {
            var titleElement = $('<span>').addClass('ui-popup-title');
            titleElement.text(title);
            this.header.empty().append(titleElement);
        }
        addButton(btn) {
            this.footer.append(btn);
        }
    }

    //function Popup() {
    //    var popup = $('<div>').addClass('ui-popup');
    //    var _container = $('<div>').addClass('container').appendTo(popup);

    //    var header = $('<div>').addClass('ui-popup-header');
    //    var body = $('<div>').addClass('ui-popup-body');
    //    var footer = $('<div>').addClass('ui-popup-footer');

    //    _container.append(header).append(body).append(footer);

    //    return {
    //        header: header,
    //        body: body,
    //        footer: footer,
    //        container: popup,
    //        setTitle: function (title) {
    //            var titleElement = $('<span>').addClass('ui-popup-title');
    //            titleElement.text(title);
    //            header.empty().append(titleElement);
    //        },
    //        addButton: function (btn) {
    //            footer.append(btn);
    //        }
    //    };
    //}

    //function RenamePopup(items) {
    //    Popup.call(this);
    //}

    function createCloseBtn() {
        var btn = ns.html.generateButton();
        btn.text(ns.getString('.close'));
        btn.on('click', function () {
            ns.hidePopup();
        });
        return btn;
    }

    function createRenameTextbox(value) {
        var tb = ns.html.generateTextbox();
        tb.data('origin-name', value);
        tb.val(value);
        return tb;
    }

    ns.createRenamePopup = function (itemsToRename) {
        var popup = new Popup();
        popup.setTitle(ns.getString('.io.rename'));

        for (var i in itemsToRename) {
            popup.getBody.append(createRenameTextbox(itemsToRename[i]));
        }

        popup.addButton(createCloseBtn());

        return popup.getContainer;
    };

})(jQuery, window.f14fm = window.f14fm || {});