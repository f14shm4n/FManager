namespace f14.Utils {
    export function getString(key: string): string {
        let l10nProvider = Core.Config.L10NProvider || L10n.Config.L10nProvider;        
        return l10nProvider.GetString(f14.Core.L10NPrefix + key);
    }

    export function NextInt(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }    
}