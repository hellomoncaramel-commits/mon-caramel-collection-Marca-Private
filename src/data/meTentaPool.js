import { PRODUCTS } from "./products.js";

// "Me tenta" — Fase 1 (pós-auditoria "Desejo + Venda Inteligente", 2026-10).
// Curadoria explícita, nunca inferida: só estes 4 ids participam. Critério
// usado na auditoria — nota A/B de fotografia + fricção estrutural baixa
// (sem configuração obrigatória ou, no máximo, uma escolha) + preço real
// mostrado (nunca "Sob consulta", que sempre sai do app para o WhatsApp em
// vez de permitir "toquei, já pedi"). Sem pool secundário nesta rodada —
// só isto participa até uma próxima curadoria.
//
// Brownlito ficou de fora desta rodada: a auditoria apontou
// brownlito-recheio.jpg como a melhor foto do catálogo, mas a inspeção
// visual direta (não só a legenda da auditoria) mostrou um doce de formato
// diferente (cubo cortado, não barra em palito) com recheio creme branco +
// morango — incompatível com o Brownlito Prestígio realmente vendido hoje.
// Nenhuma das 3 fotos do Brownlito sustenta uma entrada honesta no pool sem
// usar essa foto incompatível (ver também o fix em products.js que remove
// essa mesma foto do photosByMoment do Brownlito, pelo mesmo motivo).
const ME_TENTA_IDS = ["alfajor", "pao-de-mel", "casadinho", "bala-de-coco"];

export const ME_TENTA_PRODUCTS = ME_TENTA_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
