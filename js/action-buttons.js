; (function ($, ns) {

    ns.generateBaseActionButtons = function () {
        ns.addActionButton(createAcceptBtn());
        ns.addActionButton(createUploadBtn());
        ns.addActionButton(createCreateBtn());
        ns.addActionButton(createRenameBtn());
        ns.addActionButton(createDeleteBtn());
        ns.addActionButton(createMoveBtn());
        ns.addActionButton(createSelectAllBtn());
        ns.addActionButton(createInverseSelectBtn());
    };

    /* Generators */

    function createAcceptBtn() {
        var btn = ns.html.generateActionButton();
        btn.addClass('btn-done');
        btn.text(ns.getString('.io.accept'));

        btn.on('click', function () {
            ns.showPopup();
            setTimeout(function () {
                ns.hidePopup();
            }, 1500);
        });

        return btn;
    }

    function createCreateBtn() {
        var btn = ns.html.generateActionButton();
        btn.text(ns.getString('.io.create'));
        return btn;
    }

    function createRenameBtn() {
        var btn = ns.html.generateActionButton();
        btn.text(ns.getString('.io.rename'));
        btn.on('click', function () {
            var items = ns.html.getCheckedItems();
            var names = [];
            $.each(items, function (i, v) {
                names.push(v.data('name'));
            });
            var popup = ns.createRenamePopup(names);
            ns.showPopup(popup);
        });
        return btn;
    }

    function createDeleteBtn() {
        var btn = ns.html.generateActionButton();
        btn.text(ns.getString('.io.delete'));
        return btn;
    }

    function createUploadBtn() {
        var btn = ns.html.generateActionButton();
        btn.addClass('btn-upload');
        btn.text(ns.getString('.io.upload'));
        return btn;
    }

    function createSelectAllBtn() {
        var btn = ns.html.generateActionButton();
        btn.text(ns.getString('.io.select-all'));
        return btn;
    }

    function createInverseSelectBtn() {
        var btn = ns.html.generateActionButton();
        btn.text(ns.getString('.io.inverse-selection'));
        return btn;
    }

    function createMoveBtn() {
        var btn = ns.html.generateActionButton();
        btn.text(ns.getString('.io.move'));
        return btn;
    }
})(jQuery, window.f14fm = window.f14fm || {});