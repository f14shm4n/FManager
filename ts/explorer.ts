namespace f14.Explorer {

    export var NavigationData: Navigation.NavigationStack = new Navigation.NavigationStack();

    function Navigate(): void {
        let path = NavigationData.GetCurrentPath();

        let config = Core.Config;

        if (config.DEBUG) {
            console.log('Navigate => ' + path);
        }

        config.ajaxRequestMap[Ajax.AjaxActionTypes.FolderStruct].execute(new Ajax.FolderStructParam(path), payload => {
            if (payload.hasErrors()) {
                UI.DisplayPayloadError(payload);
            } else {
                let result = payload as Ajax.FolderStructResult;
                UI.RenderFileStruct(result.folders, result.files);
            }
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
     * Navigate to the current location. Used for redraw the file struct section.
     */
    export function ReNavigate(): void {
        Navigate();
    }

    export function OpenFile(fileName: string): void {
        // TODO: Open file
    }
}