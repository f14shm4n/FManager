; (function ($, ns) {

    var uiClasses = {
        UIContainer: 'ui-container',
        Toolbox: 'ui-toolbox',
        ContentPanel: 'ui-content-panel',
        FileStructPanel: 'ui-file-struct-panel',
        FileActionPanel: 'ui-file-action-panel',
        LogoButton: 'ui-logo-button',
        ActionButtonsPanel: 'ui-action-buttons-panel',
        FileStructItem: 'ui-file-struct-item',
        Folder: 'ui-folder',
        File: 'ui-file',
        ItemCheck: 'ui-item-check',
        ItemIcon: 'ui-item-icon',
        ItemName: 'ui-item-name',
        PopupContainer: 'ui-popup-container',
        Popup: 'ui-popup'
    };

    var uiObjects = {
        UIContainer: undefined,
        Toolbox: undefined,
        ContentPanel: undefined,
        FileStructPanel: undefined,
        FileActionPanel: undefined,
        LogoButton: undefined,
        ActionButtonsPanel: undefined,
        PopupContainer: undefined,
        Popup: undefined
    };

    ns.renderUI = function () {
        var $body = $('body');
        var $scripts = $body.find('script');
        // Clear ui.
        if (uiObjects.UIContainer) {
            uiObjects.UIContainer.remove();
        }        
        // Draw ui
        // Create ui objects
        createUIContainer();
        createContentPanel();
        // Add base action buttons
        if (ns.generateBaseActionButtons) {
            ns.generateBaseActionButtons();
        }
        // Add to main container
        uiObjects.UIContainer.append(uiObjects.ContentPanel);

        $body.prepend(uiObjects.UIContainer);
    };

    ns.renderFileStruct = function (folders, files) {
        if (ns.config.DEBUG) {
            console.log('Folders: ' + folders.length + ' Files: ' + files.length);            
        }

        if (ns.currentFolderPath !== ns.config.rootFolder) {
            uiObjects.FileStructPanel.append(createFileStructItem('folder', { name: 'up' }, true));
        }

        for (var i in folders) {
            var $item = createFileStructItem('folder', folders[i]);
            uiObjects.FileStructPanel.append($item);
        }

        for (var i in files) {
            var $item = createFileStructItem('file', files[i]);
            uiObjects.FileStructPanel.append($item);
        }
    };

    ns.addActionButton = function (btn) {
        uiObjects.ActionButtonsPanel.append(btn);
    }

    ns.showPopup = function (popup) {
        if (uiObjects.PopupContainer) {
            if (uiObjects.PopupContainer.children().length > 0) {
                ns.hidePopup();
                setTimeout(function () {
                    ns.showPopup(popup);
                }, 500);
            } else {
                uiObjects.PopupContainer.append(popup);
                uiObjects.PopupContainer.css('display', 'flex');
                uiObjects.PopupContainer.fadeTo(150, 1);
            }
        }
    };

    ns.hidePopup = function () {
        if (uiObjects.PopupContainer) {
            uiObjects.PopupContainer.fadeTo(150, 0, function () {
                uiObjects.PopupContainer.css('display', 'none');
                uiObjects.PopupContainer.empty();
            });
        }
    };

    // Html utils

    ns.html = {
        generateActionButton: function () {
            var btn = this.generateButton().addClass('ui-action-btn');
            return btn;
        },
        generateButton: function () {
            var btn = $('<div>').addClass('ui-btn');
            return btn;
        },
        generateTextbox: function () {
            var tb = $('<input>').addClass('ui-textbox');
            return tb;
        },
        getCheckedItems: function () {
            var items = $('.' + uiClasses.FileStructItem);
            var results = [];
            $.each(items, function (i, e) {
                var $element = $(e);
                if ($element.data('check-state')) {
                    results.push($element);
                }
            });
            return results;
        }
    };

    /* Private API */

    function createUIContainer() {
        uiObjects.UIContainer = $('<div>').addClass(uiClasses.UIContainer);

        uiObjects.PopupContainer = $('<div>').addClass(uiClasses.PopupContainer);
        uiObjects.UIContainer.append(uiObjects.PopupContainer);

        uiObjects.PopupContainer.css('opacity', '0');
        uiObjects.PopupContainer.css('display', 'none');
    }

    function createToolbox() {
        uiObjects.Toolbox = $('<div>').addClass(uiClasses.Toolbox);
    }

    function createContentPanel() {
        uiObjects.ContentPanel = $('<div>').addClass(uiClasses.ContentPanel);

        uiObjects.FileStructPanel = $('<div>').addClass(uiClasses.FileStructPanel);
        uiObjects.FileActionPanel = $('<div>').addClass(uiClasses.FileActionPanel);

        generateLogoButton();
        uiObjects.ActionButtonsPanel = $('<div>').addClass(uiClasses.ActionButtonsPanel);

        uiObjects.FileActionPanel.append(uiObjects.ActionButtonsPanel);

        uiObjects.ContentPanel
            .append(uiObjects.FileActionPanel)
            .append(uiObjects.FileStructPanel);
    }

    function generateLogoButton() {
        uiObjects.LogoButton = $('<div>').addClass(uiClasses.LogoButton);

        var text = $('<span>').text(ns.Title);
        uiObjects.LogoButton.append(text);

        uiObjects.FileActionPanel.append(uiObjects.LogoButton);
    }

    function createFileStructItem(type, data, backButton) {
        var container = $('<div>')
            .addClass(uiClasses.FileStructItem)
            .data('type', type)
            .data('name', data.name);

        container.on('click', function () {
            var $this = $(this);
            if ($this.data('type') === 'folder') {
                if ($this.data('move-back')) {
                    var lastSlash = ns.currentFolderPath.lastIndexOf('/');
                    var path = ns.currentFolderPath.slice(0, lastSlash);
                    ns.browse(path);
                } else {
                    ns.browse(`${ns.currentFolderPath}/${data.name}`);
                }
            } else {
                checkBox.trigger('click');
            }
        });
        // Content
        var checkBox;
        var iconContainer = $('<div>').addClass(uiClasses.ItemIcon);
        var nameContainer;
        var icon = $('<i>');
        iconContainer.append(icon);

        // If current item is move back btn.
        if (backButton) {
            container.data('move-back', true);
            icon.addClass('mdl2-more');
        } else {
            checkBox = $('<div>').addClass(uiClasses.ItemCheck);
            checkBox.on('click', function (e) {
                var $this = $(this);
                if ($this.hasClass('checked')) {
                    $this.removeClass('checked');
                    container.removeData('check-state');
                } else {
                    $this.addClass('checked');
                    container.data('check-state', true);
                }
                if (ns.config.DEBUG) {
                    console.log('ItemContainerCheckState: ' + container.data('check-state'));
                }
                e.stopPropagation();
            });

            switch (type) {
                case 'file':
                    icon.addClass('mdl2-file');
                    break;
                case 'folder':
                    icon.addClass('mdl2-folder');
                    break;
            }

            nameContainer = $('<div>').addClass(uiClasses.ItemName).text(data.name);
        }

        if (checkBox) {
            container.append(checkBox);
        }
        container.append(iconContainer);
        if (nameContainer) {
            container.append(nameContainer);
        }
        return container;
    }

})(jQuery, window.f14fm = window.f14fm || {});