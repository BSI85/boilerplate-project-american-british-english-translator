"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const text = req.body.text;
    const locale = req.body.locale;

    if (!text || !locale) {
      res.json({ error: "Required field(s) missing" });
      return;
    }
    if (locale !== "american-to-british" && locale !== "british-to-american") {
      res.json({ error: "Invalid value for locale field" });
      return;
    }
    if (text.trim() === ""){
      res.json({ error: "No text to translate" });
      return;
    }
    const translation = translator.translate(text, locale);
    if (translation === text) {
      res.json({ text, translation: "Everything looks good to me!" });
      return;
    }
    res.json({ text, translation });
  });
};
