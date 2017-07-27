namespace f14.Explorer {

    import core = f14.Core;
    import config = core.Config;
    import ajax = f14.Ajax;
    import ui = f14.UI;

    export function Navigate(folderPath?: string): void {
        if (folderPath === undefined) {
            folderPath = config.rootFolder;
        }
        if (config.DEBUG) {
            console.log("Navigate to: " + folderPath);
        }

        core.currentFolderPath = folderPath;
        let renderFileStruct = (payload): void => ui.RenderFileStruct(payload.folders, payload.files);

        if (config.IS_TEST) {
            console.log('Test mode navigation.');
        } else {
            ajax.GetFileSystemInfo(folderPath, renderFileStruct);
        }
    }
}