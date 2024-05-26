import $ from 'jquery';
import { Translator } from './translate.js';
import { saveToLocalStorage, getFromLocalStorage } from './storage.js';

const EXPIRATION_DAYS = 1;

function setExpirationDate() {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
    saveToLocalStorage("dictExpiration", expirationDate.toISOString());
}

function isExpired() {
    const expirationDate = getFromLocalStorage("dictExpiration");
    if (!expirationDate) {
        return true;
    }
    const now = new Date();
    return now > new Date(expirationDate);
}

async function fetchDictionary(url) {
    try {
        const response = await $.ajax({
            url: url,
            method: 'GET',
        });
        saveToLocalStorage("dict", JSON.stringify(response, null, 2));
        setExpirationDate();
        return response;
    } catch (error) {
        throw new Error(`Failed to fetch dictionary: ${error}`);
    }
}

export async function initializeTranslator(translationServerUrl, defaultLang = 'en') {
    let dict;
    if (getFromLocalStorage("dict") && !isExpired()) {
        dict = JSON.parse(getFromLocalStorage("dict"));
    } else {
        dict = await fetchDictionary(translationServerUrl);
    }

    const idioma = getFromLocalStorage("idioma") || defaultLang;
    const translator = new Translator({ lang: idioma, t: dict });
    translator.translate();

    $(document).ready(function () {
        $('H1, H2, H3, H4, H5, H6, P, A, OL, UL, LI, TH, TD, TITLE, SMALL, ADDRESS, FOOTER, DD, DT, FIGCAPTION, ABBR, BDI, BDO, CITE, CODE, DATA, DFN, EM, I, KBD, MARK, Q, RT, S, SAMP, SPAN, STRONG, SUB, SUP, TIME, U, VAR, BUTTON, LABEL, LEGEND, OPTION, TEXTAREA, INPUT, BIG, CENTER').addClass('trn');
        
        $('#idioma').val(idioma);
        $('#idioma').change(function () {
            const newLang = $(this).val();
            translator.lang(newLang);
            saveToLocalStorage("idioma", newLang);
        });
    });
}
