class FManager {
    constructor(settings: f14.Core.Configuration) {
        f14.Localization.Init(); // Initialize localization
        f14.Core.Configure(settings); // Apply config        
        f14.UI.Render(); // Render ui        
        f14.Explorer.NavigateTo(f14.Core.Config.rootFolder); // Navigate to root folder
    }
}