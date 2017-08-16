namespace f14.Tests {

    export class FManagerTest {
        constructor(settings) {
            this.GenerateTestData();
            new FManager(settings);
        }

        private GenerateTestData(): void {
            let navMap = new f14.Memory.InMemoryNavigationMap();

            let root = new f14.Models.DirectoryInfo('C:');
            root.CreateFile('boot.sys');
            root.CreateFile('autorun.exe');
            root.CreateFile('pagefile.sys');

            let myDocs = root.CreateFolder('MyDocs');
            let users = root.CreateFolder('Users');

            let imgs = myDocs.CreateFolder('Images');
            for (var i = 0; i < 30; i++) {
                let name = `image-${i + 1}.jpg`;
                imgs.CreateFile(name);
            }
            let snds = myDocs.CreateFolder('Sounds');
            for (var i = 0; i < 10; i++) {
                let name = `sound-${i + 1}.mp3`;
                snds.CreateFile(name);
            }

            navMap.CreateMap(root, false);
            console.log(navMap.ToString());

            Core.Config.dataService = new Data.InMemoryDataService(navMap);
        }
    }
}