/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./localization/en.json";
import pt from "./localization/pt.json";

export const namespace = "default";

export const initAppI18n = () => {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      fallbackLng: "en",
      detection: { order: ["navigator"] },
      resources: {},
      defaultNS: namespace,
    });
  i18next.addResourceBundle("en", namespace, en);
  i18next.addResourceBundle("pt", namespace, pt);
};
