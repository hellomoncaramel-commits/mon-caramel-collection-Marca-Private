// "Destaques Sazonais" — Fase 2 (pós-revisão ChatGPT, 2026-10). A
// infraestrutura mínima pra Naiá (ou um dev, a seu pedido) destacar uma
// campanha temporária sem CMS/admin/backend — editar este array e dar
// push é o mecanismo inteiro, mesma convenção de src/data/giftOptions.js.
//
// Vazio por padrão, de propósito: este PR entrega a infraestrutura, não
// uma campanha real. Nenhuma campanha é inventada só pra demonstrar (nada
// de "Dia dos Professores"/Thanksgiving/Natal aqui) — ver utils/campaigns.js
// e seus testes pra fixtures usadas só em teste, nunca neste array.
//
// Cada campanha, cadastrada manualmente, um objeto:
//   id           string, único.
//   name         string — rótulo interno (ex. "Dia das Mães 2027"), nunca
//                renderizado na UI.
//   startDate    "YYYY-MM-DD" — primeiro dia (inclusive) em que a campanha
//                aparece, no calendário local da operação (Oshawa, ON —
//                ver MON_CARAMEL_TIMEZONE em utils/campaigns.js).
//   endDate      "YYYY-MM-DD" — último dia (inclusive) em que ainda aparece.
//   priority     number — menor vence se duas campanhas estiverem ativas
//                ao mesmo tempo (nunca duas faixas simultâneas).
//   photo        REAL_PHOTOS.x — uma foto real já existente no catálogo,
//                nunca uma nova/stock/gerada.
//   line         string curta — a única frase visível na faixa.
//   destination  { type: "screen", screen: "<id em ALLOWED_CAMPAIGN_SCREENS>" }
//                | { type: "product", productId: "<id real em products.js>" }
//                | { type: "whatsapp", message: "<mensagem pronta>" }
//                Validado em utils/campaigns.js (getActiveCampaign) antes
//                de aparecer — uma campanha com destino inválido (screen
//                fora da allowlist, productId que não existe, mensagem
//                vazia) nunca chega a renderizar, pra nunca criar um CTA
//                quebrado. `screen` aceita só os ids comerciais reais
//                listados em ALLOWED_CAMPAIGN_SCREENS (utils/campaigns.js)
//                — nunca qualquer screen que o app reconheça.
//
// Nunca inferido por calendário (dezembro não vira "Natal" sozinho), nunca
// com produto/preço/desconto/estoque/urgência inventados.
export const CAMPAIGNS = [];
