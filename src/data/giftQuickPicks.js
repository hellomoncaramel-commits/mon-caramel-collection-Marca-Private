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
//
// Também deliberadamente fora (revisão pós-ChatGPT, rodada 2): Biscoito
// Amanteigado congelado. Cabe matematicamente em $30-50/$50+, mas é
// posicionado comercialmente como massa pra guardar no freezer e assar
// quando quiser — não é uma recomendação forte pra "preciso dar um
// presente". giftQuickPicks.js existe exatamente pra curadoria comercial
// vencer a matemática, não o contrário. Não substituído por outro produto
// só pra manter 3 cards — ver nota em "30-50"/"50-mais" abaixo: 2 (ou, em
// "50-mais", 1) ideias boas valem mais que 3 fracas.
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
  // Só 2 ideias — de propósito. Sem o Biscoito congelado (ver nota acima),
  // Casadinhos 24un e Brigadeiro 24un já são, cada um por si, um presente
  // honesto nessa faixa; nenhum terceiro produto real e "sob medida" pra
  // essa faixa que não fosse ou "Personalizado" sem config (achado P1) ou
  // Sob consulta.
  "30-50": [
    { productId: "casadinho", packageLabel: "24 casadinhos" },
    { productId: "brigadeiro", packageLabel: "24 brigadeiros" },
  ],
  // Só 1 ideia. Avaliação comercial: Brigadeiro 100un ($130) foi
  // descartado junto com o Biscoito congelado — um pacote de 100
  // brigadeiros lê como encomenda de evento/catering, não como "presente"
  // pra uma pessoa ou ocasião; incluí-lo soaria como "você tem mais
  // orçamento, então compre uma quantidade enorme do mesmo doce", exatamente
  // o que a revisão pediu pra evitar. Brigadeiro 50un ($75) fica: na
  // própria posição comercial do produto (packageOptions existe
  // justamente pra presentear/agradar um grupo), 50 unidades ainda lê como
  // um presente generoso, não uma encomenda de festa. A faixa termina
  // numa única ideia + a saída editorial "Quer algo mais montado?" com
  // mais destaque (ver PresenteRapido.jsx) — curadoria honesta em vez de
  // forçar um 2º ou 3º card.
  "50-mais": [{ productId: "brigadeiro", packageLabel: "50 brigadeiros" }],
};
