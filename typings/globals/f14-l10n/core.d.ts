declare namespace f14.L10n {
    /**
     * The key-value object.
     */
    interface IMap<V> {
        [key: string]: V;
    }
    /**
     * Provides commons methods to add and get the localized strings.
     */
    interface IL10NProvider {
        /**
         * Adds the localized data for the specified locale name.
         * @param localeKey A String, representing the language version of the browser. ("en", "en-US", "de", "fr", etc.)
         * @param localeData The localized map. Key is string key; Value is localized string value.
         */
        AddLocale(localeKey: string, localeData: IMap<string>): void;
        /**
         * Returns a localized string for the given key.
         * @param stringKey A String key.
         */
        GetString(stringKey: string): string;
        /**
         * Returns a localized string for the given key and the specified locale.
         * @param localeKey A String, representing the language version of the browser. ("en", "en-US", "de", "fr", etc.)
         * @param stringKey A String key.
         */
        GetStringForLocale(localeKey: string, stringKey: string): string;
        /**
         * Returns the locales map.
         */
        GetLocales(): IMap<IMap<string>>;
    }
    /**
     * Configuration for f14-l10n.
     */
    class Configuration {
        /**
         * Trun on\off debug mode. Default: false.
         */
        DEBUG?: boolean;
        /**
         * Setup default locale name.
         * If a localized string is not found for the current locale, it will search in the default locale.
         */
        DefaultLocale?: string;
        /**
         * Sets the IL10NProvider as window property with property name WindowPartProperty. Default: true.
         */
        AsWindowPart?: boolean;
        /**
         * This name using if AsWindowPart is true. Default: l10nProvider.
         */
        WindowPartProperty?: string;
        /**
         * Specifed IL10NProvider. Default: DefaultL10NProvider.
         */
        L10nProvider?: IL10NProvider;
    }
    /**
     * Configuration instance.
     */
    var Config: Configuration;
    /**
     * Setup the L10NProvider.
     * @param settings User configuration.
     */
    function Setup(settings?: Configuration): void;
    /**
     * Returns configured IL10NProvider or throws exception.
     */
    function Localizer(): IL10NProvider;
}
