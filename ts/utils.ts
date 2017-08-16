namespace f14.Utils {
    export function getString(key: string): string {
        return l10n.getString(f14.Core.L10NPrefix + key);
    }

    export function NextInt(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}