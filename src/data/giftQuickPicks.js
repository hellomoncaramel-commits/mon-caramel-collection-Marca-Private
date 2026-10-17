// "Presente Rápido" — Fase 2 (pós-revisão ChatGPT, 2026-10). Curadoria
// explícita por faixa de orçamento — nunca um algoritmo escolhendo
// automaticamente qualquer produto cujo preço mínimo caiba na faixa. Cada
// entrada aponta pra um productId real de products.js + (quando aplicável)
// uma quantidade ou pacote comercialmente real:
//   - `packageLabel`: deve bater exatamente com um label de
//     product.packageOptions (Brigadeiro/Casadinho) — o preço/qty reais
//     vêm de lá, nunca recalculados aqui.
//   - `qty`: para produtos unitários, sempre a quantidade mínima real do
//     produto (minimumQuantity) ou uma quantidade de product.quantityOptions
//     (Biscoito Amanteigado congelado) — nunca um número inventado.
//   - nem `packageLabel` nem `qty`: produto `singleItem` (Bolo de Cenoura),
//     um preço fixo, uma unidade só.
// Máximo 3 ideias por faixa. Nenhum combo/embalagem/desconto/personalização
// é inventado — utils/giftQuickPicks.js recusa qualquer entrada que não
// resolva pra um preço real (ver resolveGiftPick).
//
// Deliberadamente fora do V1 (achado P1 da auditoria "Desejo + Venda
// Inteligente"): Briganinhos Personalizados e Brigadeiro Personalizado —
// o nome promete uma personalização que não existe como `optionGroups`
// real nos dados; entrar aqui prometeria uma escolha que não existe no
// momento em que a cliente decide comprar. Também fora: qualquer produto
// "Sob consulta" (sem preço real pra ancorar uma sugestão honesta).
export const GIFT_QUICK_PICKS = {
  "ate-15": [
    // Pirulito de Alfajor já é vendido com copy própria de "lembrancinha
    // de última hora" — a ideia que menos precisa de justificativa aqui.
    { productId: "pirulito-alfajor", qty: 1 },
    { productId: "alfajor", qty: 3 },
    { productId: "brigadeiro", packageLabel: "6 brigadeiros" },
  ],
  "15-30": [
    { productId: "pao-de-mel", qty: 4 },
    { productId: "casadinho", packageLabel: "12 casadinhos" },
    { productId: "bolo-cenoura" },
  ],
  "30-50": [
    { productId: "casadinho", packageLabel: "24 casadinhos" },
    { productId: "brigadeiro", packageLabel: "24 brigadeiros" },
    { productId: "butter-cookies-congelado", qty: 50 },
  ],
  "50-mais": [
    { productId: "brigadeiro", packageLabel: "50 brigadeiros" },
    { productId: "butter-cookies-congelado", qty: 75 },
    { productId: "brigadeiro", packageLabel: "100 brigadeiros" },
  ],
};
