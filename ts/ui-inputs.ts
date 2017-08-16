namespace f14.UI {
    export class TextBox implements IJQueryObject {
        constructor() {
            this.$This = $('<input>').addClass('ui-textbox');
        }

        public $This: JQuery;
    }
}