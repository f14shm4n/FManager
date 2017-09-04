namespace f14.Memory {

    export class InMemoryNavigationMap {
        private map: IStringMap<Models.DirectoryInfo> = {};

        public GetFolderItemForPath(path: string): Models.DirectoryInfo {
            return this.map[path];
        }

        public CreateMap(root: Models.DirectoryInfo, skipRoot: boolean): void {
            if (!skipRoot) {
                this.map[root.GetFullPath()] = root;
            }
            for (var i of root.Folders) {
                this.map[i.GetFullPath()] = i;
                if (i.Folders.length > 0) {
                    this.CreateMap(i, true);
                }
            }
        }

        public ToString(): string {
            let output = 'NavigationMap:';
            for (var i in this.map) {
                output += '\n' + i;
            }
            return output;
        }
    }

    export class MoveOperationData {
        type: string;
        sourceDirectory: string;
        destinationDirectory: string;
        targets: Ajax.MoveTarget[];
        ddd: string;
    }

    export class AppBuffer {
        MoveOperation: MoveOperationData;
    }
}