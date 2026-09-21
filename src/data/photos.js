/**
 * Real Mon Caramel product photos, extracted from the original prototype's
 * embedded base64 into real files under /public/images/products.
 *
 * Photos not yet organized per product fall back to <ProductArt /> in
 * src/components/shared/ProductArt.jsx (illustrated placeholder).
 */
const BASE = "/images/products";
const MOMENTS_BASE = "/images/moments";

export const REAL_PHOTOS = {
  brigadeiroDiaDificil: `${BASE}/brigadeiro-dia-dificil.jpg`,
  biscoitoAmanteigadoCafe: `${BASE}/biscoito-amanteigado-cafe.jpg`,
  donutFreezer: `${BASE}/donut-freezer.jpg`,
  biscoitoAmanteigadoFreezer: `${BASE}/biscoito-amanteigado-freezer.jpg`,
  chocobomb: `${BASE}/chocobomb.jpg`,
  coneTrufadoNovo: `${BASE}/cone-trufado-novo.jpg`,
  alfajorCoco: `${BASE}/alfajor-coco.jpg`,
  alfajorClassico: `${BASE}/alfajor-classico.jpg`,
  casadinhoGoiabada: `${BASE}/casadinho-goiabada.jpg`,
  boloCenouraTray: `${BASE}/bolo-cenoura-tray.jpg`,
  boloCenouraFatias: `${BASE}/bolo-cenoura-fatias.jpg`,
  donutBellaIs6: `${BASE}/donut-bella-is6.jpg`,
  donutEmmaHotelT: `${BASE}/donut-emma-hotel-t.jpg`,
  donutGabriellySweet16: `${BASE}/donut-gabrielly-sweet16.jpg`,
  presentinhoMacas: `${BASE}/presentinho-macas.jpg`,
  presentinhoObrigada: `${BASE}/presentinho-obrigada.jpg`,
  presentinhoPirulito: `${BASE}/presentinho-pirulito.jpg`,
  presentinhoVariedade: `${BASE}/presentinho-variedade.jpg`,
  bandejaBabyShower: `${BASE}/bandeja-baby-shower.jpg`,
  bandejaMario: `${BASE}/bandeja-mario.jpg`,
  bandejaFormatura: `${BASE}/bandeja-formatura.jpg`,
  bandejaDiaDosPais: `${BASE}/bandeja-dia-dos-pais.jpg`,
  bandejaCidadania: `${BASE}/bandeja-cidadania.jpg`,
  presenteChaDeBebe: `${BASE}/presente-cha-de-bebe.jpg`,
  presenteMix: `${BASE}/presente-mix.jpg`,
  presenteRosas: `${BASE}/presente-rosas.jpg`,
  presenteFlor: `${BASE}/presente-flor.jpg`,
  presenteNamorados: `${BASE}/presente-namorados.jpg`,
  presentePaoMel: `${BASE}/presente-pao-mel.jpg`,
  presenteFlex1: `${BASE}/presente-flex1.jpg`,
  presenteFlex2: `${BASE}/presente-flex2.jpg`,
  presenteButterCookies: `${BASE}/presente-butter-cookies.jpg`,
  sequilhoRosa: `${BASE}/sequilho-rosa.jpg`,
  sequilhoNatural: `${BASE}/sequilho-natural.jpg`,
  paodemel2: `${BASE}/pao-de-mel-2.jpg`,
  criancas: `${BASE}/moment-criancas.jpg`,
  "dia-dificil": `${BASE}/moment-dia-dificil.jpg`,
  saudade: `${BASE}/moment-saudade.jpg`,
  surpreenda: `${BASE}/moment-surpreenda.jpg`,
  visita: `${BASE}/moment-visita.jpg`,
  cafe: `${BASE}/moment-cafe.jpg`,
  freezer: `${BASE}/moment-freezer.jpg`,
  presente: `${BASE}/moment-presente.jpg`,
  festaOptions: [
    `${BASE}/festa-opcao-1.jpg`,
    `${BASE}/festa-opcao-2.jpg`,
    `${BASE}/festa-opcao-3.jpg`,
    `${BASE}/festa-opcao-4.jpg`,
    `${BASE}/festa-opcao-5.jpg`,
    `${BASE}/festa-opcao-6.jpg`,
    `${BASE}/festa-opcao-7.jpg`,
  ],
  briganinhoPersonalizado: [
    `${BASE}/briganinho-personalizado-3.jpg`,
    `${BASE}/briganinho-personalizado-4.jpg`,
    `${BASE}/briganinho-personalizado-5.jpg`,
  ],
  brigadeiroPersonalizado: [
    `${BASE}/brigadeiro-personalizado-1.jpg`,
    `${BASE}/brigadeiro-personalizado-2.jpg`,
    `${BASE}/brigadeiro-personalizado-3.jpg`,
    `${BASE}/brigadeiro-personalizado-4.jpg`,
  ],
  miniDonutDecorado: [`${BASE}/mini-donut-decorado-1.jpg`],
  pirulitoDecorado: [
    `${BASE}/pirulito-decorado-1.jpg`,
    `${BASE}/pirulito-decorado-2.jpg`,
    `${BASE}/pirulito-decorado-3.jpg`,
    `${BASE}/pirulito-decorado-4.jpg`,
    `${BASE}/pirulito-decorado-5.jpg`,
    `${BASE}/pirulito-decorado-6.jpg`,
    `${BASE}/pirulito-decorado-7.jpg`,
    `${BASE}/pirulito-decorado-8.jpg`,
    `${BASE}/pirulito-decorado-9.jpg`,
    `${BASE}/pirulito-decorado-10.jpg`,
  ],
  boloPalito: [
    `${BASE}/bolo-palito-1.jpg`,
    `${BASE}/bolo-palito-2.jpg`,
    `${BASE}/bolo-palito-3.jpg`,
    `${BASE}/bolo-palito-4.jpg`,
    `${BASE}/bolo-palito-5.jpg`,
    `${BASE}/bolo-palito-6.jpg`,
  ],
  piramide: [`${BASE}/piramide-1.jpg`, `${BASE}/piramide-2.jpg`],
  pirulitoAlfajor: `${BASE}/pirulito-alfajor-1.jpg`,
  balaDeCoco: `${BASE}/bala-de-coco-1.jpg`,
  // MomentPicker carousel covers — real Mon Caramel photography.
  lembrancinha: `${MOMENTS_BASE}/lembrancinha.jpg`,
  diasDeLuta: `${MOMENTS_BASE}/dias-de-luta.jpg`,
  naoVaiTerFesta: `${MOMENTS_BASE}/nao-vai-ter-festa.jpg`,
  // Freezer carousel cover only — distinct from REAL_PHOTOS.freezer, which
  // the Brigadeiro product card also uses (see data/products.js) and must
  // stay untouched.
  freezerDonuts: `${MOMENTS_BASE}/freezer-donuts.jpg`,
  // New real photos — catalog additions.
  biscoitoVariedade: `${BASE}/biscoito-variedade.jpg`,
  boloDePoteCamadas: `${BASE}/bolo-de-pote-camadas.jpg`,
  boloDePoteMorango: `${BASE}/bolo-de-pote-morango.jpg`,
  brownlitoInteiro: `${BASE}/brownlito-inteiro.jpg`,
  brownlitoRecheio: `${BASE}/brownlito-recheio.jpg`,
};
