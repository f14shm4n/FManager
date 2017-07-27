namespace f14.UI.Popups {

    import ui = f14.UI;

    export class Popup implements ui.IJQueryObject {
        constructor() {
            this.$This = $('<div>').addClass('ui-popup');
            this.Container = $('<div>').addClass('container').appendTo(this.$This);

            this.Header = $('<div>').addClass('ui-popup-header');
            this.Body = $('<div>').addClass('ui-popup-body');
            this.Footer = $('<div>').addClass('ui-popup-footer');

            this.Container
                .append(this.Header)
                .append(this.Body)
                .append(this.Footer);
        }

        public $This: JQuery;
        public Header: JQuery;
        public Body: JQuery;
        public Footer: JQuery;
        public Container: JQuery;

        private Title: JQuery;
        private FooterButtons: ui.BaseButton[] = [];

        public SetTitle(title: string): void {
            if (!this.Title) {
                this.Title = $('<span>').addClass('ui-popup-title');
                this.Header.append(this.Title);
            }
            this.Title.text(title);
        }

        public AddFooterButton(btn: ui.BaseButton): void {
            this.FooterButtons.push(btn);
            this.Footer.append(btn.$This);
        }
    }

    export class RenamePopup extends Popup {
        constructor(items: ui.FileStructItem[]) {
            super();

            this.SetTitle(f14.Utils.getString('.io.rename'));

            items.forEach((x) => {
                let iName = x.$This.data('name');
                let tb = new ui.TextBox();
                tb.$This.data('origin-name', iName);
                tb.$This.val(iName);

                this.Body.append(tb.$This);
            });

            this.AddFooterButton(new CloseButton());
        }

        private _items: ui.FileStructItem[];
    }

    class CloseButton extends ui.BaseButton {
        constructor() {
            super();

            this.SetText(Utils.getString('.close'));
            this.$This.on('click', function () {
                ui.HidePopup();
            });
        }
    }
}