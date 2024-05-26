import $ from 'jquery';

export class Translator {
    constructor(options = {}) {
        this.settings = {
            css: "trn",
            lang: "en",
            ...options
        };

        if (this.settings.css.lastIndexOf(".", 0) !== 0) {
            this.settings.css = "." + this.settings.css;
        }

        this.t = this.settings.t;
    }

    translate() {
        const elements = $(this.settings.css);
        elements.each((i, element) => {
            const $element = $(element);
            let trnKey = $element.attr("data-trn-key");
            if (!trnKey) {
                trnKey = $element.html();
                $element.attr("data-trn-key", trnKey);
            }
            $element.html(this.get(trnKey));
        });
    }

    lang(newLang) {
        if (newLang) {
            this.settings.lang = newLang;
            this.translate();  // Re-translate everything
        }
        return this.settings.lang;
    }

    get(index) {
        try {
            return this.t[index][this.settings.lang] || index;
        } catch (err) {
            return index;
        }
    }
}
