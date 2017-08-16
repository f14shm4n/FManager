"use strict";
var f14;
(function (f14) {
    var Localization;
    (function (Localization) {
        function Init() {
            l10n.addLocaleMap({
                'ru': {
                    'f14fm.io.accept': 'Принять',
                    'f14fm.io.select-all': 'Выбрать все',
                    'f14fm.io.clear-selection': 'Снять выделение',
                    'f14fm.io.inverse-selection': 'Обратить выделение',
                    'f14fm.io.upload': 'Загрузить файлы',
                    'f14fm.io.select.files': 'Выбрать файлы',
                    'f14fm.io.delete': 'Удалить',
                    'f14fm.io.create': 'Создать',
                    'f14fm.io.rename': 'Переименовать',
                    'f14fm.io.move': 'Переместить',
                    'f14fm.io.copy': 'Копировать',
                    'f14fm.io.paste': 'Вставить',
                    'f14fm.apply': 'Применить',
                    'f14fm.close': 'Закрыть',
                    'f14fm.cancel': 'Отмена',
                    'f14fm.popup.delete.title': 'Удалить файлы и папки...',
                    'f14fm.popup.delete.desc': 'Вы уверены что хотите удалить эти файлы\\папки?',
                    'f14fm.popup.upload.title': 'Загрузка файлов',
                    'f14fm.popup.rename.error.exist': "\u0424\u0430\u0439\u043B \u0441 \u0442\u0430\u043A\u0438\u043C \u0438\u043C\u0435\u043D\u0435\u043C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442! \u0418\u043C\u044F \u0444\u0430\u0439\u043B\u0430: {0}",
                    'f14fm.toast.msg.selection.empty': 'Ни один файл не выбран.',
                    'f14fm.toast.msg.same.folder': 'Папка назначения совпадает с исходной папкой.',
                    'f14fm.toast.delete.count.format': 'Удалено {0} объектов.',
                },
                'en': {
                    'f14fm.io.accept': 'Done',
                    'f14fm.io.select-all': 'Select All',
                    'f14fm.io.clear-selection': 'Clear Selection',
                    'f14fm.io.inverse-selection': 'Inverse Selection',
                    'f14fm.io.upload': 'Upload Files',
                    'f14fm.io.select.files': 'Select files',
                    'f14fm.io.delete': 'Delete',
                    'f14fm.io.create': 'Create',
                    'f14fm.io.rename': 'Rename',
                    'f14fm.io.move': 'Move',
                    'f14fm.io.copy': 'Copy',
                    'f14fm.io.paste': 'Paste',
                    'f14fm.io.apply': 'Apply',
                    'f14fm.close': 'Close',
                    'f14fm.cancel': 'Cancel',
                    'f14fm.popup.delete.title': 'Delete files and folders...',
                    'f14fm.popup.delete.desc': 'Are you sure you want to delete this files\\folders?',
                    'f14fm.popup.upload.title': 'File uploader',
                    'f14fm.popup.rename.error.exist': "A File with this name already exists! File name: {0}",
                    'f14fm.toast.msg.selection.empty': 'No selected files.',
                    'f14fm.toast.msg.same.folder': 'Destination folder coincides with the source folder.',
                    'f14fm.toast.delete.count.format': '{0} items deleted.',
                }
            });
        }
        Localization.Init = Init;
    })(Localization = f14.Localization || (f14.Localization = {}));
})(f14 || (f14 = {}));
