import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Nutritional info per 100g in Romanian label format
// Data sourced from Romanian nutrition databases (klorii.ro, eatntrack.ro, valorinutritionale.ro)
const updates: Array<{ ids: string[]; nutrition: string }> = [
  // ─── BURTA VITA ───────────────────────────────────────────────────────────
  {
    ids: [
      "burta-fideluta-cas-1kg",
      "burta-vita-fideluta-pg-germania",
      "burta-vita-fideluta-pg-12kg",
      "burta-vita-fideluta-pg-16kg",
    ],
    nutrition: `Proteine: 14,1g
Total lipide (grăsimi): 1,3g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,4g
Acizi graşi nesaturaţi: 0,8g
Colesterol: 100mg
Calciu: 15mg
Sodiu: 85mg`,
  },

  // ─── ARIPI PUI (fara varf) ────────────────────────────────────────────────
  {
    ids: [
      "aripi-pui-caserola-oncos",
      "aripi-pui-fara-varf-pg-sectionate-ro-cls-b",
      "aripi-pui-fara-varf-pg-2-5kg-slovacia",
      "aripi-pui-fara-varf-prime-pg-1kg",
      "aripi-pui-fara-varf-vrac-sectionate-ylw",
      "aripi-pui-fara-varf-vrac-ylw-ge",
      "aripi-pui-fara-varfuri-vrac-moy-park",
    ],
    nutrition: `Proteine: 18,5g
Total lipide (grăsimi): 13,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 4,0g
Acizi graşi nesaturaţi: 7,5g
Colesterol: 75mg
Calciu: 12mg
Sodiu: 75mg`,
  },

  // ─── ARIPI CURCAN ─────────────────────────────────────────────────────────
  {
    ids: ["aripi-curcan-pg-vid"],
    nutrition: `Proteine: 18,0g
Total lipide (grăsimi): 12,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 3,5g
Acizi graşi nesaturaţi: 7,0g
Colesterol: 72mg
Calciu: 12mg
Sodiu: 72mg`,
  },

  // ─── IT ARIPI CU SPATE (heavier in fat - back included) ──────────────────
  {
    ids: [
      "it-aripi-cu-spate-pg-yellow",
      "it-aripi-pui-cu-spate-vrac-ylw-bax-10kg",
      "it-aripi-pui-cu-spate-vrac-ylw-ladite-13kg",
    ],
    nutrition: `Proteine: 16,0g
Total lipide (grăsimi): 18,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 5,0g
Acizi graşi nesaturaţi: 10,0g
Colesterol: 75mg
Calciu: 12mg
Sodiu: 75mg`,
  },

  // ─── FICAT PUI ────────────────────────────────────────────────────────────
  {
    ids: ["ficat-pui-pg-0-5-kg-brz", "ficat-pui-pg-0-5-kg-hu"],
    nutrition: `Proteine: 19,0g
Total lipide (grăsimi): 4,2g
Carbohidraţi: 1,0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 1,2g
Acizi graşi nesaturaţi: 2,0g
Colesterol: 375mg
Calciu: 8mg
Sodiu: 90mg`,
  },

  // ─── GAINA RASA ───────────────────────────────────────────────────────────
  {
    ids: ["gaina-rasa-grea-cong-slov-bg"],
    nutrition: `Proteine: 20,0g
Total lipide (grăsimi): 13,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 4,0g
Acizi graşi nesaturaţi: 7,5g
Colesterol: 80mg
Calciu: 12mg
Sodiu: 80mg`,
  },

  // ─── IT PULPE CU SPATE ────────────────────────────────────────────────────
  {
    ids: ["it-pulpe-cu-spate-vrac-italia"],
    nutrition: `Proteine: 17,0g
Total lipide (grăsimi): 14,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 4,0g
Acizi graşi nesaturaţi: 8,0g
Colesterol: 75mg
Calciu: 12mg
Sodiu: 75mg`,
  },

  // ─── IT PULPE INFERIOARE / INTREGI ────────────────────────────────────────
  {
    ids: [
      "it-pulpe-inferioare-de-pui-bax-10kg",
      "it-pulpe-inferioare-pg-italia",
      "it-pulpe-intregi-italia-pg",
    ],
    nutrition: `Proteine: 18,5g
Total lipide (grăsimi): 8,3g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 2,5g
Acizi graşi nesaturaţi: 4,5g
Colesterol: 78mg
Calciu: 12mg
Sodiu: 78mg`,
  },

  // ─── PIEPT CURCAN ─────────────────────────────────────────────────────────
  {
    ids: ["piept-curcan-dezosat-pg-vid"],
    nutrition: `Proteine: 22,0g
Total lipide (grăsimi): 1,6g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,5g
Acizi graşi nesaturaţi: 0,8g
Colesterol: 60mg
Calciu: 12mg
Sodiu: 70mg`,
  },

  // ─── PIEPT PUI DEZOSAT ────────────────────────────────────────────────────
  {
    ids: [
      "piept-dezosat-cas-banat-bun",
      "piept-dezosat-cas-oncos",
      "piept-pui-dezosat-pg-oncos",
      "piept-pui-jumatati-dezosat-iqf-2-5kg-pg",
    ],
    nutrition: `Proteine: 21,5g
Total lipide (grăsimi): 2,5g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,7g
Acizi graşi nesaturaţi: 1,2g
Colesterol: 65mg
Calciu: 11mg
Sodiu: 75mg`,
  },

  // ─── PIPOTA + INIMI PUI ───────────────────────────────────────────────────
  {
    ids: [
      "pipota-cu-inimi-pg-medas",
      "pipota-pui-pg-0-5kg",
      "pipota-pui-pg-0-5kg-10kg-bax",
      "pipota-si-inimi-cas-transavia",
    ],
    nutrition: `Proteine: 17,5g
Total lipide (grăsimi): 2,7g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,8g
Acizi graşi nesaturaţi: 1,5g
Colesterol: 230mg
Calciu: 10mg
Sodiu: 80mg`,
  },

  // ─── PUI GRILL INTREG ─────────────────────────────────────────────────────
  {
    ids: [
      "pui-grill-fermierului-ylw-cas",
      "pui-grill-agricola-ylw-pui-fericit-cas",
      "pui-grill-pg-transavia",
      "pui-grill-pg-vid-crasna",
      "pui-grill-qualico-1-3kg",
    ],
    nutrition: `Proteine: 18,0g
Total lipide (grăsimi): 15,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 4,5g
Acizi graşi nesaturaţi: 8,5g
Colesterol: 80mg
Calciu: 12mg
Sodiu: 80mg`,
  },

  // ─── PULPE CU SPATE ───────────────────────────────────────────────────────
  {
    ids: ["pulpe-cu-spate-vrac-h", "pulpe-cu-spate-vrac-pl"],
    nutrition: `Proteine: 17,0g
Total lipide (grăsimi): 14,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 4,0g
Acizi graşi nesaturaţi: 8,0g
Colesterol: 75mg
Calciu: 12mg
Sodiu: 75mg`,
  },

  // ─── PULPE DEZOSTATE INTREGI ──────────────────────────────────────────────
  {
    ids: ["pulpe-dez-intregi-fp-cas-onc"],
    nutrition: `Proteine: 18,5g
Total lipide (grăsimi): 10,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 3,0g
Acizi graşi nesaturaţi: 5,5g
Colesterol: 80mg
Calciu: 12mg
Sodiu: 75mg`,
  },

  // ─── PULPE INFERIOARE PUI ─────────────────────────────────────────────────
  {
    ids: [
      "pulpe-inferioare-cas-hyzza",
      "pulpe-inferioare-cas-transavia",
      "pulpe-inferioare-pg-1kg-hu",
      "pulpe-inferioare-pg-1kg-ro",
      "pulpe-inferioare-pg-2-5kg",
      "pulpe-inferioare-vrac-2x5kg",
      "pulpe-inferioare-vrac-10kg-cocorico",
      "pulpe-inferioare-vrac-10kg-hu",
      "pulpe-inferioare-vrac-10kg-iqf-a",
      "pulpe-inferioare-vrac-iqf-ylw-5kg",
    ],
    nutrition: `Proteine: 18,5g
Total lipide (grăsimi): 8,3g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 2,5g
Acizi graşi nesaturaţi: 4,5g
Colesterol: 78mg
Calciu: 12mg
Sodiu: 78mg`,
  },

  // ─── PULPE INFERIOARE CURCAN ──────────────────────────────────────────────
  {
    ids: ["pulpe-inferioare-curcan-pg"],
    nutrition: `Proteine: 19,0g
Total lipide (grăsimi): 7,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 2,0g
Acizi graşi nesaturaţi: 4,0g
Colesterol: 72mg
Calciu: 12mg
Sodiu: 72mg`,
  },

  // ─── PULPE INTREGI / SUPERIOARE ───────────────────────────────────────────
  {
    ids: [
      "pulpe-intregi-fara-sp-vrac-hyzza-bax-12-04kg",
      "pulpe-superioare-fara-spate-vrac-ylw-au",
    ],
    nutrition: `Proteine: 19,0g
Total lipide (grăsimi): 10,5g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 3,0g
Acizi graşi nesaturaţi: 6,0g
Colesterol: 78mg
Calciu: 12mg
Sodiu: 78mg`,
  },

  // ─── TACAM PUI (spate + aripi, bony, fatty) ───────────────────────────────
  {
    ids: [
      "tacam-cu-aripi-avi-top",
      "tacam-pui-fara-aripi-oncos-pg",
      "tacam-spate-cu-aripi-pg-pui-regal",
    ],
    nutrition: `Proteine: 14,5g
Total lipide (grăsimi): 18,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 5,0g
Acizi graşi nesaturaţi: 10,0g
Colesterol: 75mg
Calciu: 12mg
Sodiu: 75mg`,
  },

  // ─── LEGUME: BROCCOLI ─────────────────────────────────────────────────────
  {
    ids: ["broccoli-400g-gradena", "broccoli-buchete-400-g-agrosp", "dfn-brocoli-400g"],
    nutrition: `Proteine: 2,8g
Total lipide (grăsimi): 0,4g
Carbohidraţi: 4,0g
Fibre alimentare: 2,5g
Zaharuri: 1,2g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,3g
Colesterol: 0mg
Calciu: 47mg
Sodiu: 30mg`,
  },

  // ─── LEGUME: MAZARE VERDE congelata ───────────────────────────────────────
  {
    ids: [
      "mazare-verde-2-5kg-gradena",
      "mazare-verde-400g-agr",
      "mazare-verde-400g-gradena",
      "mix-primavara-400g-agro",
    ],
    nutrition: `Proteine: 5,7g
Total lipide (grăsimi): 0,9g
Carbohidraţi: 8,6g
Fibre alimentare: 4,5g
Zaharuri: 3,5g
Acizi graşi saturaţi: 0,2g
Acizi graşi nesaturaţi: 0,6g
Colesterol: 0mg
Calciu: 22mg
Sodiu: 5mg`,
  },

  // ─── LEGUME: MAZARE VERDE conserva (Bond) ─────────────────────────────────
  {
    ids: ["mazare-verde-bond-210ml", "mazare-verde-bond-425-ml"],
    nutrition: `Proteine: 4,2g
Total lipide (grăsimi): 0,6g
Carbohidraţi: 10,0g
Fibre alimentare: 3,8g
Zaharuri: 4,0g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,4g
Colesterol: 0mg
Calciu: 20mg
Sodiu: 280mg`,
  },

  // ─── LEGUME: FASOLE VERDE / GALBENA congelata ─────────────────────────────
  {
    ids: [
      "fasole-galbena-2-5kg-gradena",
      "fasole-galbena-400-g-gradena",
      "fasole-galbena-agro-400g",
      "fasole-verde-2-5kg-gradena",
      "fasole-verde-400g-gradena",
    ],
    nutrition: `Proteine: 2,0g
Total lipide (grăsimi): 0,3g
Carbohidraţi: 5,0g
Fibre alimentare: 3,0g
Zaharuri: 2,0g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,2g
Colesterol: 0mg
Calciu: 30mg
Sodiu: 4mg`,
  },

  // ─── LEGUME: FASOLE ALBA conserva ─────────────────────────────────────────
  {
    ids: ["fasole-alba-bond-425ml"],
    nutrition: `Proteine: 5,3g
Total lipide (grăsimi): 0,6g
Carbohidraţi: 16,0g
Fibre alimentare: 5,7g
Zaharuri: 0,5g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,4g
Colesterol: 0mg
Calciu: 55mg
Sodiu: 400mg`,
  },

  // ─── LEGUME: FASOLE BOABE PESTRITA congelata ──────────────────────────────
  {
    ids: ["fasole-boabe-pestrita-400-g"],
    nutrition: `Proteine: 7,0g
Total lipide (grăsimi): 0,5g
Carbohidraţi: 18,0g
Fibre alimentare: 6,5g
Zaharuri: 0,5g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,3g
Colesterol: 0mg
Calciu: 50mg
Sodiu: 350mg`,
  },

  // ─── LEGUME: CARTOFI congelati (frites / wedges / steakhouse) ─────────────
  {
    ids: [
      "cartofi-wedges-gradena-1kg",
      "cartofi-1-kg-10x10mm-gradena",
      "cartofi-1-kg-ricardo",
      "cartofi-2-5kg-ricardo",
      "cartofi-pati-parts-ust-600g",
      "cartofi-prajiti-zig-zag-750g",
      "cartofi-roasti-triunghi-1kg",
      "cartofi-steakhouse-2-5kg",
      "cartofi-sunny-fries-10-mm-1kg",
    ],
    nutrition: `Proteine: 2,2g
Total lipide (grăsimi): 3,5g
Carbohidraţi: 22,0g
Fibre alimentare: 2,0g
Zaharuri: 0,5g
Acizi graşi saturaţi: 0,5g
Acizi graşi nesaturaţi: 2,5g
Colesterol: 0mg
Calciu: 10mg
Sodiu: 20mg`,
  },

  // ─── LEGUME: CARTOFI GRATINATI ────────────────────────────────────────────
  {
    ids: ["cartofi-gratinati-cu-sm-si-cascaval-1-kg"],
    nutrition: `Proteine: 3,5g
Total lipide (grăsimi): 8,0g
Carbohidraţi: 14,0g
Fibre alimentare: 1,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 4,5g
Acizi graşi nesaturaţi: 2,5g
Colesterol: 20mg
Calciu: 90mg
Sodiu: 350mg`,
  },

  // ─── LEGUME: SPANAC congelat ──────────────────────────────────────────────
  {
    ids: [
      "spanac-400g-agro",
      "spanac-tocat-2-5kg-gradena",
      "spanac-tocat-400g-gradena",
      "dfn-spanac-frunze-400g",
    ],
    nutrition: `Proteine: 3,0g
Total lipide (grăsimi): 0,3g
Carbohidraţi: 1,5g
Fibre alimentare: 2,5g
Zaharuri: 0,5g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,2g
Colesterol: 0mg
Calciu: 100mg
Sodiu: 70mg`,
  },

  // ─── LEGUME: CIUPERCI feliate congelate ───────────────────────────────────
  {
    ids: ["ciuperci-feliate-400g-agro"],
    nutrition: `Proteine: 2,7g
Total lipide (grăsimi): 0,2g
Carbohidraţi: 0,7g
Fibre alimentare: 1,2g
Zaharuri: 0,4g
Acizi graşi saturaţi: 0,0g
Acizi graşi nesaturaţi: 0,1g
Colesterol: 0mg
Calciu: 4mg
Sodiu: 15mg`,
  },

  // ─── LEGUME: VINETE COAPTE congelate ──────────────────────────────────────
  {
    ids: ["vinete-coapte-agro-400g", "vinete-coapte-congelate-2-5kg"],
    nutrition: `Proteine: 1,4g
Total lipide (grăsimi): 0,8g
Carbohidraţi: 2,9g
Fibre alimentare: 2,0g
Zaharuri: 1,2g
Acizi graşi saturaţi: 0,2g
Acizi graşi nesaturaţi: 0,5g
Colesterol: 0mg
Calciu: 12mg
Sodiu: 45mg`,
  },

  // ─── LEGUME: AMESTEC MEXICAN / ITALIAN / LEGUME GRADINA ──────────────────
  {
    ids: [
      "amestec-mexican-400-g-gradena",
      "amestec-mexican-2-5kg-gradena",
      "amestec-italian-2-5-kg",
      "amestec-leg-gradina-2-5kg",
      "amestec-leg-tigaie-20kg-agrosp",
      "amestec-leg-tigaie-400g-agrosp",
    ],
    nutrition: `Proteine: 3,0g
Total lipide (grăsimi): 0,5g
Carbohidraţi: 9,0g
Fibre alimentare: 3,5g
Zaharuri: 2,0g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,3g
Colesterol: 0mg
Calciu: 25mg
Sodiu: 20mg`,
  },

  // ─── LEGUME: AMESTEC MEXICAN CU OREZ ─────────────────────────────────────
  {
    ids: ["amestec-mexican-cu-orez-400g-gradena"],
    nutrition: `Proteine: 2,8g
Total lipide (grăsimi): 0,5g
Carbohidraţi: 14,0g
Fibre alimentare: 2,5g
Zaharuri: 2,0g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,3g
Colesterol: 0mg
Calciu: 20mg
Sodiu: 20mg`,
  },

  // ─── LEGUME: AMESTEC 4 ANOTIMPURI ────────────────────────────────────────
  {
    ids: ["amestec-4-anot-gradena-400-g"],
    nutrition: `Proteine: 3,2g
Total lipide (grăsimi): 0,4g
Carbohidraţi: 8,5g
Fibre alimentare: 3,5g
Zaharuri: 3,0g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,2g
Colesterol: 0mg
Calciu: 28mg
Sodiu: 15mg`,
  },

  // ─── LEGUME: AMESTECURI CIORBA ────────────────────────────────────────────
  {
    ids: [
      "amestec-ciorba-400gr",
      "amestec-ciorba-fasole-400g-agrosp",
      "amestec-ciorba-vacuta-400g-agrosp",
      "amestec-legume-ciorba-perisoare-400g",
      "amestec-legume-ciorba-vacuta-400g",
      "bors-romanesc-400gr-agrosp",
      "hajdu-mix-agro-400-g",
    ],
    nutrition: `Proteine: 2,0g
Total lipide (grăsimi): 0,2g
Carbohidraţi: 7,5g
Fibre alimentare: 3,0g
Zaharuri: 2,5g
Acizi graşi saturaţi: 0,0g
Acizi graşi nesaturaţi: 0,1g
Colesterol: 0mg
Calciu: 28mg
Sodiu: 15mg`,
  },

  // ─── LEGUME: DFN MIX MAZARE + MORCOV ─────────────────────────────────────
  {
    ids: ["dfn-mix-mazare-morcov-400g"],
    nutrition: `Proteine: 4,0g
Total lipide (grăsimi): 0,6g
Carbohidraţi: 9,5g
Fibre alimentare: 4,0g
Zaharuri: 4,0g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,4g
Colesterol: 0mg
Calciu: 25mg
Sodiu: 10mg`,
  },

  // ─── LEGUME: DFN MIX MEXICAN ──────────────────────────────────────────────
  {
    ids: ["dfn-mix-mexican-fasole-mazare-morcovi-porumb"],
    nutrition: `Proteine: 3,0g
Total lipide (grăsimi): 0,5g
Carbohidraţi: 9,5g
Fibre alimentare: 3,5g
Zaharuri: 2,5g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,3g
Colesterol: 0mg
Calciu: 22mg
Sodiu: 15mg`,
  },

  // ─── LEGUME: MIX RADACINOASE ──────────────────────────────────────────────
  {
    ids: ["mix-radacinoase-400g-agro"],
    nutrition: `Proteine: 1,5g
Total lipide (grăsimi): 0,2g
Carbohidraţi: 8,5g
Fibre alimentare: 2,5g
Zaharuri: 3,5g
Acizi graşi saturaţi: 0,0g
Acizi graşi nesaturaţi: 0,1g
Colesterol: 0mg
Calciu: 25mg
Sodiu: 25mg`,
  },

  // ─── LEGUME: PORUMB conserva (Bond) ───────────────────────────────────────
  {
    ids: ["porumb-bond-425ml", "porumb-bond-easy-open", "porumb-bond-gold-425ml"],
    nutrition: `Proteine: 3,0g
Total lipide (grăsimi): 1,3g
Carbohidraţi: 20,5g
Fibre alimentare: 2,0g
Zaharuri: 6,5g
Acizi graşi saturaţi: 0,3g
Acizi graşi nesaturaţi: 0,8g
Colesterol: 0mg
Calciu: 5mg
Sodiu: 300mg`,
  },

  // ─── PATISERIE: CROISSANT CIOCOLATA ───────────────────────────────────────
  {
    ids: [
      "pat-croissant-ciocolata-100g-32-buc-bax",
      "pat-croissant-ciocolata-95g-36-buc-bax",
    ],
    nutrition: `Proteine: 6,2g
Total lipide (grăsimi): 23,0g
Carbohidraţi: 52,0g
Fibre alimentare: 1,5g
Zaharuri: 22,0g
Acizi graşi saturaţi: 12,0g
Acizi graşi nesaturaţi: 9,0g
Colesterol: 25mg
Calciu: 45mg
Sodiu: 280mg`,
  },

  // ─── PATISERIE: CROISSANT CU UNT ──────────────────────────────────────────
  {
    ids: ["croissant-cu-unt-60g-100-buc-bax"],
    nutrition: `Proteine: 6,0g
Total lipide (grăsimi): 20,0g
Carbohidraţi: 48,0g
Fibre alimentare: 1,5g
Zaharuri: 12,0g
Acizi graşi saturaţi: 11,0g
Acizi graşi nesaturaţi: 7,0g
Colesterol: 25mg
Calciu: 40mg
Sodiu: 350mg`,
  },

  // ─── PATISERIE: GOMBOTI CU PRUNE ──────────────────────────────────────────
  {
    ids: ["gomboti-cu-prune-pg-1kg"],
    nutrition: `Proteine: 4,0g
Total lipide (grăsimi): 0,8g
Carbohidraţi: 32,0g
Fibre alimentare: 1,5g
Zaharuri: 10,0g
Acizi graşi saturaţi: 0,2g
Acizi graşi nesaturaţi: 0,5g
Colesterol: 0mg
Calciu: 25mg
Sodiu: 100mg`,
  },

  // ─── PATISERIE: PLACINTA CU MERE ──────────────────────────────────────────
  {
    ids: ["placinta-cu-mere-100g-50-buc-bax"],
    nutrition: `Proteine: 3,5g
Total lipide (grăsimi): 7,0g
Carbohidraţi: 30,0g
Fibre alimentare: 1,5g
Zaharuri: 10,0g
Acizi graşi saturaţi: 3,0g
Acizi graşi nesaturaţi: 3,5g
Colesterol: 15mg
Calciu: 20mg
Sodiu: 150mg`,
  },

  // ─── PESTE: MERLUCIUS ─────────────────────────────────────────────────────
  {
    ids: [
      "peste-merlucius-200-300-pg-art",
      "peste-merlucius-pg-0-9-kg-alf",
      "peste-merlucius-vrac-200-300gr-hubbsi-cca-13kg",
      "peste-merlucius-vrac-300-500gr-iwp-amb-indiv",
      "peste-merlucius-vrac-iqf-200-300gr-16-kg",
    ],
    nutrition: `Proteine: 16,7g
Total lipide (grăsimi): 1,9g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,4g
Acizi graşi nesaturaţi: 1,2g
Colesterol: 50mg
Calciu: 25mg
Sodiu: 110mg`,
  },

  // ─── PESTE: COD intreg / file ─────────────────────────────────────────────
  {
    ids: ["peste-cod-cu-cap-pg", "peste-file-cod-pg-600gr"],
    nutrition: `Proteine: 18,7g
Total lipide (grăsimi): 0,6g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,1g
Acizi graşi nesaturaţi: 0,3g
Colesterol: 45mg
Calciu: 16mg
Sodiu: 80mg`,
  },

  // ─── PESTE: FILE COD PANE ─────────────────────────────────────────────────
  {
    ids: ["peste-file-cod-pane-pg-uk"],
    nutrition: `Proteine: 13,0g
Total lipide (grăsimi): 5,0g
Carbohidraţi: 14,0g
Fibre alimentare: 0,5g
Zaharuri: 0,5g
Acizi graşi saturaţi: 1,0g
Acizi graşi nesaturaţi: 3,5g
Colesterol: 35mg
Calciu: 25mg
Sodiu: 350mg`,
  },

  // ─── PESTE: FISH FINGERS ──────────────────────────────────────────────────
  {
    ids: ["peste-fish-fingers-250g"],
    nutrition: `Proteine: 11,5g
Total lipide (grăsimi): 8,0g
Carbohidraţi: 16,0g
Fibre alimentare: 0,5g
Zaharuri: 0,5g
Acizi graşi saturaţi: 1,5g
Acizi graşi nesaturaţi: 5,5g
Colesterol: 30mg
Calciu: 20mg
Sodiu: 380mg`,
  },

  // ─── PESTE: FILE MACROU ───────────────────────────────────────────────────
  {
    ids: ["peste-file-macrou-pg-600g"],
    nutrition: `Proteine: 18,5g
Total lipide (grăsimi): 13,5g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 3,5g
Acizi graşi nesaturaţi: 8,0g
Colesterol: 70mg
Calciu: 12mg
Sodiu: 100mg`,
  },

  // ─── PESTE: MACROU intreg ─────────────────────────────────────────────────
  {
    ids: ["peste-macrou-pg-400-600-rdn-med", "peste-macrou-vrac-300-500-gr"],
    nutrition: `Proteine: 16,0g
Total lipide (grăsimi): 10,0g
Carbohidraţi: 1,0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 2,5g
Acizi graşi nesaturaţi: 6,0g
Colesterol: 70mg
Calciu: 12mg
Sodiu: 120mg`,
  },

  // ─── PESTE: FILE PANGASIUS ────────────────────────────────────────────────
  {
    ids: ["peste-file-pangasius-800gr"],
    nutrition: `Proteine: 11,5g
Total lipide (grăsimi): 4,9g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 1,2g
Acizi graşi nesaturaţi: 2,8g
Colesterol: 45mg
Calciu: 14mg
Sodiu: 75mg`,
  },

  // ─── PESTE: FILE SALAU ────────────────────────────────────────────────────
  {
    ids: ["peste-file-salau-300-500-vrac-6kg-tnz"],
    nutrition: `Proteine: 19,0g
Total lipide (grăsimi): 0,8g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,2g
Acizi graşi nesaturaţi: 0,5g
Colesterol: 55mg
Calciu: 18mg
Sodiu: 75mg`,
  },

  // ─── PESTE: PASTRAV EVISCERAT ─────────────────────────────────────────────
  {
    ids: [
      "peste-pastrav-eviscerat-250-300-pg",
      "peste-pastrav-eviscerat-250-300-bax-5kg",
    ],
    nutrition: `Proteine: 20,8g
Total lipide (grăsimi): 6,6g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 1,5g
Acizi graşi nesaturaţi: 4,0g
Colesterol: 60mg
Calciu: 20mg
Sodiu: 65mg`,
  },

  // ─── PRODUSE LACTATE: DELACO BT FELII SMANTANA ───────────────────────────
  {
    ids: ["del-bt-felii-smantana-140g"],
    nutrition: `Proteine: 7,0g
Total lipide (grăsimi): 15,0g
Carbohidraţi: 3,0g
Fibre alimentare: 0g
Zaharuri: 2,5g
Acizi graşi saturaţi: 10,0g
Acizi graşi nesaturaţi: 4,0g
Colesterol: 40mg
Calciu: 120mg
Sodiu: 550mg`,
  },

  // ─── PRODUSE LACTATE: CASCAVAL tip galben (Sofia, Koliba) ─────────────────
  {
    ids: ["del-cascaval-sofia-450g"],
    nutrition: `Proteine: 25,0g
Total lipide (grăsimi): 25,0g
Carbohidraţi: 0,5g
Fibre alimentare: 0g
Zaharuri: 0,5g
Acizi graşi saturaţi: 16,0g
Acizi graşi nesaturaţi: 7,0g
Colesterol: 80mg
Calciu: 700mg
Sodiu: 600mg`,
  },

  // ─── PRODUSE LACTATE: UNT 82% (Jaeger/Koliba) ────────────────────────────
  {
    ids: ["del-jaeger-unt-82-250g", "unt-koliba-82-200g"],
    nutrition: `Proteine: 0,9g
Total lipide (grăsimi): 82,0g
Carbohidraţi: 0,1g
Fibre alimentare: 0g
Zaharuri: 0,1g
Acizi graşi saturaţi: 55,0g
Acizi graşi nesaturaţi: 22,0g
Colesterol: 220mg
Calciu: 15mg
Sodiu: 500mg`,
  },

  // ─── PRODUSE LACTATE: UNT 83% Parmareggio ────────────────────────────────
  {
    ids: ["unt-83-parmareggio-400g-mira"],
    nutrition: `Proteine: 0,8g
Total lipide (grăsimi): 83,0g
Carbohidraţi: 0,1g
Fibre alimentare: 0g
Zaharuri: 0,1g
Acizi graşi saturaţi: 57,0g
Acizi graşi nesaturaţi: 22,0g
Colesterol: 230mg
Calciu: 15mg
Sodiu: 15mg`,
  },

  // ─── PRODUSE LACTATE: UNT KOLIBA 65% ─────────────────────────────────────
  {
    ids: ["unt-koliba-65-200g"],
    nutrition: `Proteine: 0,9g
Total lipide (grăsimi): 65,0g
Carbohidraţi: 2,5g
Fibre alimentare: 0g
Zaharuri: 2,5g
Acizi graşi saturaţi: 42,0g
Acizi graşi nesaturaţi: 18,0g
Colesterol: 150mg
Calciu: 12mg
Sodiu: 350mg`,
  },

  // ─── PRODUSE LACTATE: MOZZARELLA Horeca ──────────────────────────────────
  {
    ids: ["del-mozzarella-horeca-1-5kg"],
    nutrition: `Proteine: 22,0g
Total lipide (grăsimi): 17,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 11,0g
Acizi graşi nesaturaţi: 5,0g
Colesterol: 55mg
Calciu: 350mg
Sodiu: 600mg`,
  },

  // ─── PRODUSE LACTATE: KOLIBA KARPATSKY ───────────────────────────────────
  {
    ids: ["koliba-karpatsky-bloc"],
    nutrition: `Proteine: 25,0g
Total lipide (grăsimi): 25,9g
Carbohidraţi: 1,0g
Fibre alimentare: 0g
Zaharuri: 1,0g
Acizi graşi saturaţi: 16,5g
Acizi graşi nesaturaţi: 7,5g
Colesterol: 85mg
Calciu: 680mg
Sodiu: 620mg`,
  },

  // ─── PRODUSE LACTATE: SPECIALITATEA PIZZARULUI ───────────────────────────
  {
    ids: ["specialitatea-pizzarului"],
    nutrition: `Proteine: 26,0g
Total lipide (grăsimi): 27,0g
Carbohidraţi: 0,5g
Fibre alimentare: 0g
Zaharuri: 0,5g
Acizi graşi saturaţi: 17,0g
Acizi graşi nesaturaţi: 8,0g
Colesterol: 85mg
Calciu: 750mg
Sodiu: 650mg`,
  },

  // ─── SEMIPREPARATE: ALUAT FOITAJ ─────────────────────────────────────────
  {
    ids: ["aluat-foitaj-bella-800g"],
    nutrition: `Proteine: 6,6g
Total lipide (grăsimi): 19,0g
Carbohidraţi: 38,0g
Fibre alimentare: 1,0g
Zaharuri: 2,0g
Acizi graşi saturaţi: 9,0g
Acizi graşi nesaturaţi: 9,0g
Colesterol: 0mg
Calciu: 15mg
Sodiu: 350mg`,
  },

  // ─── SEMIPREPARATE: ARIPI MARINATE / PREGATITE ────────────────────────────
  {
    ids: ["aripi-pregatite-pui-800g", "aripi-marinate-cong-800g"],
    nutrition: `Proteine: 16,0g
Total lipide (grăsimi): 12,0g
Carbohidraţi: 3,0g
Fibre alimentare: 0g
Zaharuri: 2,5g
Acizi graşi saturaţi: 3,5g
Acizi graşi nesaturaţi: 7,0g
Colesterol: 70mg
Calciu: 15mg
Sodiu: 600mg`,
  },

  // ─── SEMIPREPARATE: ARIPI PUI CRUSTA ─────────────────────────────────────
  {
    ids: [
      "aripi-pui-crusta-nepicant-1kg-pl",
      "aripi-pui-crusta-pic-1kg-pl",
      "aripi-pui-crusta-putin-pic-1kg-pl",
    ],
    nutrition: `Proteine: 16,0g
Total lipide (grăsimi): 14,0g
Carbohidraţi: 12,0g
Fibre alimentare: 0,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 4,0g
Acizi graşi nesaturaţi: 8,0g
Colesterol: 65mg
Calciu: 20mg
Sodiu: 650mg`,
  },

  // ─── SEMIPREPARATE: BULETE CASCAVAL ──────────────────────────────────────
  {
    ids: ["bulete-cascaval-1kg"],
    nutrition: `Proteine: 14,0g
Total lipide (grăsimi): 16,0g
Carbohidraţi: 22,0g
Fibre alimentare: 0,5g
Zaharuri: 2,0g
Acizi graşi saturaţi: 8,0g
Acizi graşi nesaturaţi: 6,0g
Colesterol: 35mg
Calciu: 300mg
Sodiu: 550mg`,
  },

  // ─── SEMIPREPARATE: CARNATI AFUMATI CURCAN ───────────────────────────────
  {
    ids: ["carnati-afumati-curcan"],
    nutrition: `Proteine: 13,0g
Total lipide (grăsimi): 17,5g
Carbohidraţi: 3,5g
Fibre alimentare: 0g
Zaharuri: 1,0g
Acizi graşi saturaţi: 6,0g
Acizi graşi nesaturaţi: 9,0g
Colesterol: 65mg
Calciu: 15mg
Sodiu: 950mg`,
  },

  // ─── SEMIPREPARATE: CARNE TOCATA CURCAN ──────────────────────────────────
  {
    ids: ["carne-tocata-curcan-1kg"],
    nutrition: `Proteine: 19,0g
Total lipide (grăsimi): 6,2g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 1,8g
Acizi graşi nesaturaţi: 3,2g
Colesterol: 65mg
Calciu: 12mg
Sodiu: 80mg`,
  },

  // ─── SEMIPREPARATE: CARNE TOCATA PIEPT PUI ───────────────────────────────
  {
    ids: ["carne-tocata-piept-pui-500g"],
    nutrition: `Proteine: 21,4g
Total lipide (grăsimi): 2,0g
Carbohidraţi: 0,4g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 0,5g
Acizi graşi nesaturaţi: 1,0g
Colesterol: 60mg
Calciu: 10mg
Sodiu: 75mg`,
  },

  // ─── SEMIPREPARATE: CARNE TOCATA PUI mixt ────────────────────────────────
  {
    ids: ["carne-tocata-pui-500g"],
    nutrition: `Proteine: 18,0g
Total lipide (grăsimi): 7,0g
Carbohidraţi: 0g
Fibre alimentare: 0g
Zaharuri: 0g
Acizi graşi saturaţi: 2,0g
Acizi graşi nesaturaţi: 3,5g
Colesterol: 70mg
Calciu: 12mg
Sodiu: 80mg`,
  },

  // ─── SEMIPREPARATE: CASCAVAL PANE ────────────────────────────────────────
  {
    ids: [
      "cascaval-pane-1kg",
      "cascaval-pane-inele-500g",
      "cascaval-pane-tri-1-kg",
    ],
    nutrition: `Proteine: 13,0g
Total lipide (grăsimi): 14,0g
Carbohidraţi: 24,0g
Fibre alimentare: 0,5g
Zaharuri: 2,0g
Acizi graşi saturaţi: 7,0g
Acizi graşi nesaturaţi: 6,0g
Colesterol: 35mg
Calciu: 280mg
Sodiu: 550mg`,
  },

  // ─── SEMIPREPARATE: CASCAVAL TRAPIST PANE ────────────────────────────────
  {
    ids: ["cascaval-trapist-pane-460g"],
    nutrition: `Proteine: 14,0g
Total lipide (grăsimi): 15,5g
Carbohidraţi: 22,0g
Fibre alimentare: 0,5g
Zaharuri: 2,0g
Acizi graşi saturaţi: 8,0g
Acizi graşi nesaturaţi: 6,0g
Colesterol: 40mg
Calciu: 300mg
Sodiu: 520mg`,
  },

  // ─── SEMIPREPARATE: CHIFTELE ─────────────────────────────────────────────
  {
    ids: ["chiftele-ardelenesti-rumenite-pg-1kg-trans"],
    nutrition: `Proteine: 13,5g
Total lipide (grăsimi): 17,5g
Carbohidraţi: 10,0g
Fibre alimentare: 0,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 7,0g
Acizi graşi nesaturaţi: 8,5g
Colesterol: 60mg
Calciu: 20mg
Sodiu: 550mg`,
  },

  // ─── SEMIPREPARATE: CHIFTELE PANE PUI CU CASCAVAL ───────────────────────
  {
    ids: ["chiftele-pane-din-piept-pui-cu-casc-0-5kg"],
    nutrition: `Proteine: 15,8g
Total lipide (grăsimi): 18,7g
Carbohidraţi: 10,2g
Fibre alimentare: 0,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 5,0g
Acizi graşi nesaturaţi: 10,0g
Colesterol: 55mg
Calciu: 60mg
Sodiu: 600mg`,
  },

  // ─── SEMIPREPARATE: CRISPY STRIPS ────────────────────────────────────────
  {
    ids: ["crispy-strips-curcan-500g-kinga"],
    nutrition: `Proteine: 16,0g
Total lipide (grăsimi): 11,0g
Carbohidraţi: 18,0g
Fibre alimentare: 0,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 3,0g
Acizi graşi nesaturaţi: 7,0g
Colesterol: 55mg
Calciu: 20mg
Sodiu: 600mg`,
  },
  {
    ids: ["crispy-strips-piept-pui-nepicante-1kg"],
    nutrition: `Proteine: 17,0g
Total lipide (grăsimi): 10,0g
Carbohidraţi: 18,0g
Fibre alimentare: 0,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 2,5g
Acizi graşi nesaturaţi: 6,5g
Colesterol: 55mg
Calciu: 20mg
Sodiu: 550mg`,
  },

  // ─── SEMIPREPARATE: MEDALION PUI ─────────────────────────────────────────
  {
    ids: [
      "medalion-pui-h-1kg",
      "medalion-pui-hu-festino-1kg",
      "medalion-pui-hu-pg-1kg",
    ],
    nutrition: `Proteine: 16,0g
Total lipide (grăsimi): 7,2g
Carbohidraţi: 12,0g
Fibre alimentare: 0,5g
Zaharuri: 0,6g
Acizi graşi saturaţi: 0,8g
Acizi graşi nesaturaţi: 5,5g
Colesterol: 50mg
Calciu: 18mg
Sodiu: 500mg`,
  },

  // ─── SEMIPREPARATE: NUGGETS PUI ──────────────────────────────────────────
  {
    ids: ["nuggets-pui-pg-1-kg"],
    nutrition: `Proteine: 14,0g
Total lipide (grăsimi): 7,5g
Carbohidraţi: 18,0g
Fibre alimentare: 0,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 2,0g
Acizi graşi nesaturaţi: 4,5g
Colesterol: 40mg
Calciu: 20mg
Sodiu: 580mg`,
  },

  // ─── SEMIPREPARATE: PASTA MICI ───────────────────────────────────────────
  {
    ids: ["pasta-mici-porc-vita-800g"],
    nutrition: `Proteine: 13,0g
Total lipide (grăsimi): 20,0g
Carbohidraţi: 5,0g
Fibre alimentare: 0g
Zaharuri: 0,5g
Acizi graşi saturaţi: 8,0g
Acizi graşi nesaturaţi: 10,0g
Colesterol: 65mg
Calciu: 15mg
Sodiu: 750mg`,
  },
  {
    ids: ["pasta-mici-porc-comtim-1kg"],
    nutrition: `Proteine: 12,5g
Total lipide (grăsimi): 22,0g
Carbohidraţi: 4,0g
Fibre alimentare: 0g
Zaharuri: 0,5g
Acizi graşi saturaţi: 9,0g
Acizi graşi nesaturaţi: 11,0g
Colesterol: 70mg
Calciu: 12mg
Sodiu: 800mg`,
  },

  // ─── SEMIPREPARATE: PARIZER PUI ──────────────────────────────────────────
  {
    ids: ["perutnina-parizer-pui-350-g"],
    nutrition: `Proteine: 11,2g
Total lipide (grăsimi): 18,5g
Carbohidraţi: 1,2g
Fibre alimentare: 0g
Zaharuri: 1,0g
Acizi graşi saturaţi: 7,0g
Acizi graşi nesaturaţi: 9,5g
Colesterol: 50mg
Calciu: 15mg
Sodiu: 800mg`,
  },

  // ─── SEMIPREPARATE: PIEPT PUI CRISPY ─────────────────────────────────────
  {
    ids: [
      "piept-crispy-pui-pg-1-kg",
      "piept-crispy-pui-pg-500-gr-zizu",
      "piept-pui-crispy-1kg",
    ],
    nutrition: `Proteine: 12,0g
Total lipide (grăsimi): 10,0g
Carbohidraţi: 29,0g
Fibre alimentare: 0,5g
Zaharuri: 2,0g
Acizi graşi saturaţi: 2,5g
Acizi graşi nesaturaţi: 6,5g
Colesterol: 40mg
Calciu: 20mg
Sodiu: 600mg`,
  },

  // ─── SEMIPREPARATE: PIZZA ROSSA ──────────────────────────────────────────
  {
    ids: ["pizza-rossa-capricciosa-320g"],
    nutrition: `Proteine: 8,0g
Total lipide (grăsimi): 8,5g
Carbohidraţi: 27,0g
Fibre alimentare: 1,5g
Zaharuri: 4,0g
Acizi graşi saturaţi: 3,5g
Acizi graşi nesaturaţi: 4,0g
Colesterol: 20mg
Calciu: 120mg
Sodiu: 600mg`,
  },
  {
    ids: ["pizza-rossa-pepperoni-salami-320gr"],
    nutrition: `Proteine: 9,0g
Total lipide (grăsimi): 10,0g
Carbohidraţi: 27,0g
Fibre alimentare: 1,5g
Zaharuri: 4,0g
Acizi graşi saturaţi: 4,5g
Acizi graşi nesaturaţi: 4,5g
Colesterol: 25mg
Calciu: 120mg
Sodiu: 700mg`,
  },
  {
    ids: ["pizza-rossa-speciale-352g"],
    nutrition: `Proteine: 9,5g
Total lipide (grăsimi): 10,5g
Carbohidraţi: 27,0g
Fibre alimentare: 1,5g
Zaharuri: 4,0g
Acizi graşi saturaţi: 4,5g
Acizi graşi nesaturaţi: 5,0g
Colesterol: 25mg
Calciu: 130mg
Sodiu: 680mg`,
  },

  // ─── SEMIPREPARATE: SNITEL PUI ───────────────────────────────────────────
  {
    ids: ["snitel-din-piept-de-pui"],
    nutrition: `Proteine: 14,0g
Total lipide (grăsimi): 9,5g
Carbohidraţi: 14,2g
Fibre alimentare: 0,5g
Zaharuri: 1,0g
Acizi graşi saturaţi: 2,5g
Acizi graşi nesaturaţi: 6,0g
Colesterol: 45mg
Calciu: 20mg
Sodiu: 450mg`,
  },
];

async function main() {
  let total = 0;
  for (const { ids, nutrition } of updates) {
    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { nutritionInfo: nutrition },
    });
    total += result.count;
    console.log(`Updated ${result.count}/${ids.length} products`);
  }
  console.log(`\nTotal updated: ${total} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
