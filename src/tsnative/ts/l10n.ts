namespace f14.Localization {
    export function Init(): void {
        let l10nProvider = Core.Config.L10NProvider || L10n.Config.L10nProvider;
        l10nProvider.AddLocale("ru", {
            "f14fm.io.accept": "Принять",
            "f14fm.io.select-all": "Выбрать все",
            "f14fm.io.clear-selection": "Снять выделение",
            "f14fm.io.inverse-selection": "Обратить выделение",
            "f14fm.io.upload": "Загрузить файлы",
            "f14fm.io.select.files": "Выбрать файлы",
            "f14fm.io.delete": "Удалить",
            "f14fm.io.create-folder": "Создать папку",
            "f14fm.io.rename": "Переименовать",
            "f14fm.io.move": "Переместить",
            "f14fm.io.copy": "Копировать",
            "f14fm.io.paste": "Вставить",
            "f14fm.apply": "Применить",
            "f14fm.close": "Закрыть",
            "f14fm.cancel": "Отмена",
            "f14fm.popup.delete.title": "Удалить файлы и папки...",
            "f14fm.popup.delete.desc": "Вы уверены что хотите удалить эти файлы\\папки?",
            "f14fm.popup.upload.title": "Загрузка файлов",
            "f14fm.popup.rename.error.exist": `Файл с таким именем уже существует! Имя файла: {0}`,
            "f14fm.toast.msg.selection.empty": "Ни один файл не выбран.",
            "f14fm.toast.msg.same.folder": "Папка назначения совпадает с исходной папкой.",
            "f14fm.toast.msg.dir.created": "Новая папка создана.",
            "f14fm.toast.delete.count.format": "Удалено {0} объектов.",
        });
        l10nProvider.AddLocale("en", {
            "f14fm.io.accept": "Done",
            "f14fm.io.select-all": "Select All",
            "f14fm.io.clear-selection": "Clear Selection",
            "f14fm.io.inverse-selection": "Inverse Selection",
            "f14fm.io.upload": "Upload Files",
            "f14fm.io.select.files": "Select files",
            "f14fm.io.delete": "Delete",
            "f14fm.io.create-folder": "Create folder",
            "f14fm.io.rename": "Rename",
            "f14fm.io.move": "Move",
            "f14fm.io.copy": "Copy",
            "f14fm.io.paste": "Paste",
            "f14fm.io.apply": "Apply",
            "f14fm.close": "Close",
            "f14fm.cancel": "Cancel",
            "f14fm.popup.delete.title": "Delete files and folders...",
            "f14fm.popup.delete.desc": "Are you sure you want to delete this files\\folders?",
            "f14fm.popup.upload.title": "File uploader",
            "f14fm.popup.rename.error.exist": `A File with this name already exists! File name: {0}`,
            "f14fm.toast.msg.selection.empty": "No selected files.",
            "f14fm.toast.msg.same.folder": "Destination folder coincides with the source folder.",
            "f14fm.toast.msg.dir.created": "A new directory has been created.",
            "f14fm.toast.delete.count.format": "{0} items deleted.",
        });
    }
}