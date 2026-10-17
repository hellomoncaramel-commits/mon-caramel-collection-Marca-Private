// "Me tenta" — motor de sugestão local sobre um pool já curado
// (data/meTentaPool.js), sem LLM/API/rede (auditoria "Desejo + Venda
// Inteligente", seção 4). Math.random() É usado aqui — o que a auditoria
// proibia era Math.random() puro/livre sobre o catálogo inteiro. Neste
// motor, o sorteio só acontece DEPOIS de filtrar os candidatos pelas regras
// abaixo, nessa ordem de prioridade:
//   1. não é o último produto mostrado (lastShownId) — salvo se isso
//      zerar os candidatos (pool com 1 produto só);
//   2. ainda não está em Minha Seleção — salvo se isso zerar os
//      candidatos (todo o pool já foi escolhido pela cliente);
//   3. pertence ao pool curado recebido (garantido: é o próprio parâmetro).
// Com um pool de só 4 produtos, um scoring ponderado era complexidade
// desnecessária para o V1 — um produto já selecionado simplesmente não
// participa do sorteio enquanto houver qualquer outro candidato elegível.
// Não inventa disponibilidade, popularidade, sazonalidade ou preferência:
// os únicos sinais usados são o pool e o estado real já existente (seleção
// atual, último item mostrado).
export function pickMeTentaCandidate(pool, { lastShownId = null, selectedIds = [] } = {}) {
  if (!pool || pool.length === 0) return null;

  const notLast = pool.filter((p) => p.id !== lastShownId);
  const base = notLast.length > 0 ? notLast : pool;

  const notSelected = base.filter((p) => !selectedIds.includes(p.id));
  const candidates = notSelected.length > 0 ? notSelected : base;

  return candidates[Math.floor(Math.random() * candidates.length)];
}
