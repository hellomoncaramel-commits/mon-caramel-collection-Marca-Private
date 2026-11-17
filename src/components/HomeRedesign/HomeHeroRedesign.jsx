import { useEffect } from "react";
import { Sparkles, Search, ShoppingBag, ArrowLeft } from "lucide-react";
import { REAL_PHOTOS } from "../../data/photos";
import { PRODUCTS } from "../../data/products";
import { defaultPhotos, cardPriceLine } from "../../utils/products";
import { COLORS } from "../../styles/colors";
import Logo from "../shared/Logo";
import Photo from "../shared/Photo";
import HeroMedia from "../shared/HeroMedia";
import WaveDivider from "./WaveDivider";
import EditorialPathButton from "./EditorialPathButton";
import { useDragScroll } from "../../hooks/useDragScroll";

// Protótipo de redesign visual (Fase 1) — NÃO é a Home de produção.
// Ver App.jsx: só alcançável pelo id de tela "proto-home", sem link em
// nenhuma navegação real — nunca compete com o fluxo existente. A Home
// real (src/components/Home/HomeScreen.jsx) não foi tocada.
//
// Mesma copy já aprovada (rodada "ajustes pontuais de copy"), mesmos dois
// destinos reais (momentos/busca) — só a composição visual muda: fotografia
// e texto deixam de ocupar o mesmo plano (nada de texto sobre a foto com
// gradiente escurecendo tudo embaixo), a foto ganha moldura própria
// (cantos arredondados, margem real, curva orgânica na base) em vez de
// sangrar a tela inteira, e os dois caminhos viram um convite refinado em
// vez de dois blocos sólidos empilhados.
const HERO_FRAMES = [
  { src: REAL_PHOTOS.boloDePoteCamadas, style: { objectPosition: "48% 58%" } },
  { src: REAL_PHOTOS.presenteRosas, style: { objectPosition: "55% 42%" } },
  { src: REAL_PHOTOS.boloDePoteMorango, style: { objectPosition: "48% 58%" } },
  { src: REAL_PHOTOS.pirulitoAlfajor, style: { objectPosition: "50% 40%" } },
  { src: REAL_PHOTOS.brownlitoInteiro, style: { objectPosition: "50% 38%" } },
];

const FAVORITE_PRODUCT_IDS = ["chocobomb", "cone-trufado", "brownlito", "casadinho"];

function FavoriteProductCard({ p, onOpen, className, style }) {
  const photo = defaultPhotos(p)?.[0];
  return (
    <button onClick={() => onOpen?.(p)} className={`text-left transition-transform duration-200 lg:hover:scale-[1.03] active:scale-[0.98] ${className}`} style={style}>
      <div className="relative rounded-2xl overflow-hidden aspect-square">
        <Photo src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <p className="mt-2 text-xs font-display text-brand-ink leading-tight truncate">{p.name}</p>
      <p className="text-3xs font-medium mt-0.5" style={{ color: COLORS.caramelDark }}>
        {cardPriceLine(p)}
      </p>
    </button>
  );
}

export default function HomeHeroRedesign({ onSelect, onOpenProduct, selection, onExitPrototype }) {
  const favoriteProducts = FAVORITE_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const selectionCount = selection?.length ?? 0;
  const dragScroll = useDragScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full fade-up">
      {/* Barra de revisão — só existe nesta rodada de protótipo, pra quem
          está avaliando conseguir voltar ao site real sem digitar URL.
          Não faz parte da proposta visual em si (ver item F da entrega). */}
      <div className="flex items-center justify-between px-5 lg:px-8 pt-3">
        <button onClick={onExitPrototype} className="inline-flex items-center gap-1 text-xs text-brand-muted underline underline-offset-2">
          <ArrowLeft size={13} /> Site atual
        </button>
        <span className="text-3xs lg:text-xs font-medium tracking-kicker uppercase" style={{ color: COLORS.caramelDark }}>
          Protótipo · Fase 1
        </span>
      </div>

      {/* ============================= MOBILE/TABLET (<lg) ============================= */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-5 mt-2" style={{ height: 64 }}>
          <div className="w-11" />
          <Logo size="home" />
          <button onClick={() => onSelect("selecao")} aria-label="Ver seleção" className="relative w-11 h-11 flex items-center justify-center">
            <ShoppingBag size={20} className="text-brand-caramelDark" />
            {selectionCount > 0 && (
              <span
                className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full text-white text-3xs font-medium flex items-center justify-center"
                style={{ backgroundColor: COLORS.caramelDark }}
              >
                {selectionCount}
              </span>
            )}
          </button>
        </div>

        {/* Texto fora da foto — nunca precisa de scrim pra ser legível,
            porque nunca compete com a imagem pelo mesmo espaço. */}
        <div className="px-6 pt-7 text-center">
          <span className="block text-3xs font-semibold uppercase tracking-kicker" style={{ color: COLORS.caramelDark }}>
            Mon Caramel · Oshawa
          </span>
          <h1 className="font-display italic font-medium text-brand-ink mt-2" style={{ fontSize: "clamp(30px,8.5vw,36px)", lineHeight: 1.08 }}>
            O que a gente vai adoçar hoje?&nbsp;<span className="not-italic">💛</span>
          </h1>
          <p className="text-brand-inkSoft mt-3" style={{ fontSize: 15.5, lineHeight: 1.4 }}>
            Tem sempre um docinho que combina com o seu momento.
          </p>
        </div>

        {/* Foto com moldura própria — margem real nas laterais (não sangra
            a tela), cantos bem arredondados, curva orgânica recortando a
            base pra fazer a transição de volta ao bege da página em vez de
            uma borda reta. */}
        <div className="relative mt-6 mx-5" style={{ height: 380 }}>
          <div className="absolute inset-0 rounded-[32px] overflow-hidden">
            <HeroMedia frames={HERO_FRAMES} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ height: 46 }}>
            <WaveDivider fill={COLORS.beige} height={46} />
          </div>
        </div>

        <div className="px-5 mt-7 flex flex-col gap-3">
          <EditorialPathButton icon={Sparkles} title="Ainda não sei o que quero" subtitle="Vou explorar as delícias." onClick={() => onSelect("proto-momentos")} />
          <EditorialPathButton icon={Search} title="Já sei o que quero" subtitle="Me leva direto ao meu docinho." onClick={() => onSelect("busca")} />
        </div>

        <div className="mt-10 px-5">
          <h2 className="font-display font-medium text-brand-ink whitespace-nowrap mb-3.5" style={{ fontSize: 24 }}>
            Nossos doces favoritos&nbsp;💛
          </h2>
          <div
            ref={dragScroll.ref}
            onPointerDown={dragScroll.onPointerDown}
            onPointerMove={dragScroll.onPointerMove}
            onPointerUp={dragScroll.onPointerUp}
            onPointerLeave={dragScroll.onPointerLeave}
            onClickCapture={dragScroll.onClickCapture}
            className={`flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 ${dragScroll.className}`}
          >
            {favoriteProducts.map((p) => (
              <FavoriteProductCard key={p.id} p={p} onOpen={onOpenProduct} className="shrink-0 snap-start" style={{ width: 136 }} />
            ))}
          </div>
        </div>
      </div>

      {/* ============================= DESKTOP (>=lg) ============================= */}
      {/* Faixa com fundo brand.subtle (não o bege padrão da página) — é o
          que faz a curva orgânica no rodapé da faixa ficar visível,
          "virando a página" de volta pro bege normal onde o resto do
          conteúdo (favoritos) já mora hoje. */}
      <div className="hidden lg:block" style={{ backgroundColor: COLORS.subtle }}>
        <div className="mx-auto px-16 pt-10 pb-16 grid grid-cols-2 gap-16 items-center" style={{ maxWidth: 1400 }}>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-kicker" style={{ color: COLORS.caramelDark }}>
              Mon Caramel · Oshawa
            </span>
            <h1 className="font-display italic font-medium text-brand-ink mt-3" style={{ fontSize: 58, lineHeight: 1.05 }}>
              O que a gente vai
              <br />
              adoçar hoje?&nbsp;<span className="not-italic">💛</span>
            </h1>
            <p className="text-brand-inkSoft mt-5" style={{ fontSize: 19, lineHeight: 1.5, maxWidth: 430 }}>
              Tem sempre um docinho que combina com o seu momento.
            </p>
            <div className="flex flex-col gap-3.5 mt-9" style={{ maxWidth: 400 }}>
              <EditorialPathButton icon={Sparkles} title="Ainda não sei o que quero" subtitle="Vou explorar as delícias." onClick={() => onSelect("proto-momentos")} size="lg" />
              <EditorialPathButton icon={Search} title="Já sei o que quero" subtitle="Me leva direto ao meu docinho." onClick={() => onSelect("busca")} size="lg" />
            </div>
          </div>

          <div className="relative overflow-hidden" style={{ height: 560, borderRadius: 40 }}>
            <HeroMedia frames={HERO_FRAMES} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        <WaveDivider fill={COLORS.beige} height={64} />
      </div>

      <div className="hidden lg:block px-16" style={{ marginTop: 8, paddingBottom: 48 }}>
        <h2 className="font-display font-medium text-brand-ink mb-5" style={{ fontSize: 32 }}>
          Nossos doces favoritos&nbsp;💛
        </h2>
        <div className="grid grid-cols-4 gap-5" style={{ maxWidth: 1400 }}>
          {favoriteProducts.map((p) => (
            <button key={p.id} onClick={() => onOpenProduct?.(p)} className="text-left group">
              <div className="relative rounded-2xl overflow-hidden aspect-square transition-transform duration-200 group-hover:scale-[1.02]">
                <Photo src={defaultPhotos(p)?.[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="mt-2.5 text-base font-display text-brand-ink leading-tight">{p.name}</p>
              <p className="text-sm font-medium mt-0.5" style={{ color: COLORS.caramelDark }}>
                {cardPriceLine(p)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
