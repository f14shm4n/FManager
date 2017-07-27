namespace f14.Utils {
    export function getString(key: string): string {
        return l10n.getString(f14.Core.L10NPrefix + key);
    }
}