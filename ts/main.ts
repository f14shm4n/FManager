import core = f14.Core;
import localization = f14.Localization;
import ui = f14.UI;
import explorer = f14.Explorer;

class FManager {
    constructor(settings) {
        localization.Init(); // Initialize localization
        core.Configure(settings); // Apply config
        ui.Render(); // Render ui

        if (!f14.Core.Config.IS_TEST) {
            // Navigate to root folder
            explorer.Navigate();
        }
    }
}

class FManagerTest extends FManager {
    constructor(settings) {
        super(settings);
        this.GenerateTestData();
    }

    private GenerateTestData(): void {
        let folders: f14.Models.FolderInfo[] = [];
        let files: f14.Models.FileInfo[] = [];

        for (var i = 0; i < 5; i++) {
            folders.push({ name: 'folder_' + i });
        }
        for (var i = 0; i < 50; i++) {
            files.push({ name: 'file_' + i + '.txt', extension: '.txt' });
        }

        f14.UI.RenderFileStruct(folders, files);
    }
}