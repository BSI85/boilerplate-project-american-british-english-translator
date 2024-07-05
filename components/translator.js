const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  translateAmericanToBritish(text) {
    let translation = text;
    for (const [americanWord, britishWord] of Object.entries(americanOnly)) {
      const regex = new RegExp(`\\b${americanWord}\\b`, "gi");
      translation = translation.replace(
        regex,
        `<span class="highlight">${britishWord}</span>`,
      );
    }
    for (const [americanWord, britishWord] of Object.entries(
      americanToBritishSpelling,
    )) {
      const regex = new RegExp(`\\b${americanWord}\\b`, "gi");
      translation = translation.replace(
        regex,
        `<span class="highlight">${britishWord}</span>`,
      );
    }
    for (const [americanTitle, britishTitle] of Object.entries(
      americanToBritishTitles,
    )) {
      if (americanTitle.endsWith(".")) {
        const regex = new RegExp(
          `\\b${americanTitle.slice(0, -1)}\\b`,
          "gi",
        );
        translation = translation.replace(
          regex,
          `<span class="highlight">${this.capitalise(britishTitle)}</span>.`,
        ).replace('..', '');
      }
    }
    let timeRegex = /([1-9]|1[0-2]):([0-5][0-9])/g;
    translation = translation.replace(
      timeRegex,
      `<span class="highlight">$1.$2</span>`,
    );

    return translation;
  }
  translaneBritisOnly(input, dictionary){
    let counter = 0;
    let sentence = input;
    const dictionaryEntries = Object.entries(dictionary);
    // Массив для хранения временных и окончательных замен
    const replacements = [];

    for (const [britishWord, americanWord] of dictionaryEntries) {
      const regex = new RegExp(`\\b${britishWord}\\b`, "gi");

        sentence = sentence.replace(regex, (match) => {
        // Создаем уникальный маркер
        const marker = `__MARKER_${counter}__`;
        counter++;

        // Сохраняем маркер и окончательную замену
        replacements.push({
          marker,
          replacement: `<span class="highlight">${americanWord}</span>`
        });

        // Возвращаем маркер вместо окончательной замены
        return marker;
      });
    }
    // Заменяем маркеры на окончательные значения
    replacements.forEach(({ marker, replacement }) => {
      const markerRegex = new RegExp(marker, "g");
        sentence = sentence.replace(markerRegex, replacement);
    });
    return sentence;
  }
  
  translateBritishToAmerican(text) {
    let translation = text;
    translation = this.translaneBritisOnly(translation, britishOnly)

    
    for (const [americanWord, britishWord] of Object.entries(
      americanToBritishSpelling,
    )) {
      const regex = new RegExp(`\\b${britishWord}\\b`, "gi");
      translation = translation.replace(
        regex,
        `<span class="highlight">${americanWord}</span>`,
      );
    }
    for (const [americanTitle, britishTitle] of Object.entries(
      americanToBritishTitles,
    )) {
      const regex = new RegExp(`\\b${britishTitle}\\b`, "gi");
      translation = translation.replace(
        regex,
        `<span class="highlight">${this.capitalise(americanTitle)}</span>`,
      );
    }
    let timeRegex = /([1-9]|1[0-2]).([0-5][0-9])/g;
    translation = translation.replace(
      timeRegex,
      `<span class="highlight">$1:$2</span>`,
    );

    return translation;
  }

capitalise(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}
  
  translate(text, locale) {
    let translation;
    if (locale === "american-to-british") {
      translation = this.translateAmericanToBritish(text);
    } else if (locale === "british-to-american") {
      translation = this.translateBritishToAmerican(text);
    }
    return translation;
  }
}

module.exports = Translator;
