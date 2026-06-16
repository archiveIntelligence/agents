// Central registry of every language dictionary. English is canonical; the
// translator falls back to English per-key for anything a language omits.

import type { Messages } from "./types";
import { en } from "./en";
import { de } from "./de";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { pt } from "./pt";
import { nl } from "./nl";
import { pl } from "./pl";
import { sv } from "./sv";
import { el } from "./el";
import { uk } from "./uk";
import { ru } from "./ru";
import { tr } from "./tr";
import { ar } from "./ar";
import { fa } from "./fa";
import { ur } from "./ur";
import { hi } from "./hi";
import { bn } from "./bn";
import { zh } from "./zh";
import { ja } from "./ja";
import { ko } from "./ko";
import { vi } from "./vi";
import { th } from "./th";
import { id } from "./id";

export const messages = {
  en, de, es, fr, it, pt, nl, pl, sv, el, uk, ru, tr,
  ar, fa, ur, hi, bn, zh, ja, ko, vi, th, id,
} satisfies Record<string, Messages>;

export type { Messages };
