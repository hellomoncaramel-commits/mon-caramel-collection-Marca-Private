// "Me tenta" — motor de sugestão local, determinístico, sem LLM/API/rede e
// sem Math.random() puro sobre o catálogo inteiro (auditoria "Desejo + Venda
// Inteligente", seção 4). Regras explicáveis sobre um pool já curado
// (data/meTentaPool.js):
//   - nunca sai do pool recebido;
//   - nunca repete o último produto mostrado (salvo se o pool tiver só 1);
//   - um produto já presente em Minha Seleção não é excluído, só recebe
//     peso menor — "evitar priorizar", não "nunca mostrar" (briefing
//     explícito nesse sentido);
//   - entre os elegíveis, sorteio ponderado — variedade sem ser puramente
//     aleatório sobre tudo.
// Não inventa disponibilidade, popularidade, sazonalidade ou preferência:
// os únicos sinais usados são o pool e o estado real já existente
// (seleção atual, último item mostrado).
const SELECTED_WEIGHT = 0.35;
const DEFAULT_WEIGHT = 1;

export function pickMeTentaCandidate(pool, { lastShownId = null, selectedIds = [] } = {}) {
  if (!pool || pool.length === 0) return null;

  const notLast = pool.filter((p) => p.id !== lastShownId);
  const candidates = notLast.length > 0 ? notLast : pool;

  const weighted = candidates.map((product) => ({
    product,
    weight: selectedIds.includes(product.id) ? SELECTED_WEIGHT : DEFAULT_WEIGHT,
  }));

  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.product;
  }
  return weighted[weighted.length - 1].product;
}

// A mesma marcação que ProductDetailSheet já usa para decidir entre o
// stepper simples ("Eu quero") e o FlavorConfigurator (packageOptions/
// optionGroups/singleItem) — nunca uma heurística nova: um produto só
// exige configuração quando `customizable` está explicitamente marcado.
export function needsConfiguration(product) {
  return product?.customizable === true;
}
