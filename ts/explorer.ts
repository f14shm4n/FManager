namespace f14.Explorer {    

    export var NavigationData: Navigation.NavigationStack = new Navigation.NavigationStack();

    function Navigate(): void {
        let path = NavigationData.GetCurrentPath();

        if (Core.Config.DEBUG) {
            console.log('Navigate => ' + path);
        }

        Core.Config.dataService.LoadFileSystemInfo(path, payload => {            
            UI.RenderFileStruct(payload.data.folders, payload.data.files);
        });
    }

    export function NavigateTo(folderPath: string): void {
        if (folderPath === undefined) {
            throw "Folder path must be set.";
        }

        // Clear current navigation stack.
        NavigationData.Clear();
        NavigationData.Add(folderPath);
        Navigate();
    }

    export function GoForward(folderName?: string): void {
        if (folderName) {
            NavigationData.Add(folderName);
            Navigate();
        } else {
            // TODO: Move to last forward history.
        }
    }

    export function GoBack(): void {
        NavigationData.Pop();
        Navigate();
    }

    /**
     * Navigate to the current location. Using for redraw file struct section.
     */
    export function ReNavigate(): void {
        Navigate();
    }

    export function OpenFile(fileName: string): void {
        // TODO: Open file
    }
}