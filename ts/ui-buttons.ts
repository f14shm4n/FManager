namespace f14.UI {

    export interface IShortcutCommand {
        shortcut: string;
        Execute(): void;
    }

    /**
     * The button base element.
     */
    export class BaseButton implements IJQueryObject {
        constructor(text?: string, icon?: string, classes?: string) {
            this.$This = $('<div>').addClass('ui-btn');
            if (classes && classes.length > 0) {
                this.$This.addClass(classes);
            }
            this.SetIcon(icon);
            this.SetText(text);
        }

        $This: JQuery;
        private $Icon: JQuery;
        private $Text: JQuery;

        SetText(text: string): IJQueryObject {
            if (!this.$Text) {
                this.$Text = $('<span>').addClass('ui-btn-text').appendTo(this.$This);
            }
            if (!text) {
                text = '';
            }
            this.$Text.text(text);
            this.$This.attr('title', text);
            return this;
        }

        SetIcon(iconCls: string): IJQueryObject {
            if (iconCls !== undefined && iconCls.length > 0) {
                if (!this.$Icon) {
                    this.$Icon = $('<i>').addClass('ui-btn-icon').addClass(iconCls).prependTo(this.$This);
                } else {
                    this.$Icon.removeClass();
                    this.$Icon.addClass(iconCls);
                }
            } else {
                if (this.$Icon) {
                    this.$Icon.remove();
                    this.$Icon = undefined;
                }
            }
            return this;
        }

        OnClick(handler: (e: JQueryEventObject) => any): IJQueryObject {
            if (handler) {
                this.$This.on('click', handler);
            } else {
                this.$This.off('click');
            }
            return this;
        }
    }

    export class ActionButton extends BaseButton implements IShortcutCommand {
        shortcut: string;

        constructor() {
            super();
            this.$This.addClass('ui-action-btn');
        }

        SetText(text: string): IJQueryObject {
            return super.SetText(text);
        }

        SetIcon(iconCls: string): IJQueryObject {
            return super.SetIcon(iconCls);
        }

        Execute(): void {
            this.$This.trigger('click');
        }

        static Create(data: Models.ActionButtonInfo): ActionButton {
            let btn = new ActionButton();
            if (data.classes) {
                btn.$This.addClass(data.classes);
            }
            btn.SetText(data.text);
            btn.SetIcon(data.icon);
            btn.OnClick(data.action);
            btn.shortcut = data.shortcut;

            return btn;
        }
    }

    export class LogoButton implements IJQueryObject {
        private $Text: JQuery;
        constructor() {
            this.$This = $('<div>').addClass('ui-logo-button');

            this.$Text = $('<span>')
                .text(Core.Title)
                .appendTo(this.$This);

            this.$This.on('click', e => {
                let panel = GetUIContainer().ContentPanel.FileActionPanel;
                if (panel.$This.hasClass('collapsed')) {
                    panel.$This.removeClass('collapsed');
                    this.$Text.text(Core.Title);
                } else {
                    panel.$This.addClass('collapsed');
                    this.$Text.text('');
                }
            });
        }

        public $This: JQuery;
    }
}