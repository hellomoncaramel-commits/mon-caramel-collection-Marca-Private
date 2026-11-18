import { ChevronRight } from "lucide-react";
import { MOMENTS, MOMENT_TAGLINE } from "../../data/moments";
import { REAL_PHOTOS } from "../../data/photos";
import { COLORS } from "../../styles/colors";
import SiteHeader from "../shared/SiteHeader";
import Photo from "../shared/Photo";

// Protótipo de redesign visual (Fase 1) — NÃO é a tela de Momentos de
// produção. Ver App.jsx: só alcançável pelo id de tela "proto-momentos",
// sem link em nenhuma navegação real. A tela real
// (src/components/Home/MomentPicker.jsx) não foi tocada.
//
// Mesmos 3 momentos, mesmas fotos, mesma tagline, mesmo destino real ao
// clicar (onSelectMoment(m.id) — abre a MESMA MomentScreen que a versão de
// produção abre) — só a composição muda: em vez de três cards idênticos
// lado a lado (ou num carrossel), cada momento vira uma "matéria" própria,
// com a foto grande e o texto alternando de lado a cada linha (desktop) ou
// empilhados em sequência, como uma página de revista (mobile) — sem
// nenhum cartão fechado com borda/sombra separando um do outro.
const MOMENT_PHOTO = {
  "dia-dificil": REAL_PHOTOS.diasDeLuta,
  presente: REAL_PHOTOS.lembrancinha,
  festa: REAL_PHOTOS.naoVaiTerFesta,
};

// Mesmo ajuste de enquadramento já validado e aprovado na rodada QA
// pós-publicação (ver MomentPicker.jsx) — reaproveitado aqui, não
// recalculado, porque é a mesma foto real com a mesma necessidade de
// recorte (parede de fundo).
const MOMENT_PHOTO_STYLE = {
  festa: { objectPosition: "50% 100%", transform: "scale(2.1)", transformOrigin: "50% 100%" },
  presente: { objectPosition: "50% 38%" },
};

const MOMENT_CTA = {
  "dia-dificil": "Quero escolher",
  presente: "Ver inspirações",
  festa: "Quero planejar",
};

// Divisor leve entre as "matérias" — mesmo fundo bege dos dois lados (não
// há cor pra "virar" como no herói da Home), então uma curva cheia aqui
// ficaria sem função; um traço fino e orgânico marca o ritmo da leitura
// sem fingir uma transição de seção que não existe.
function SectionSquiggle() {
  return (
    <svg viewBox="0 0 200 16" className="mx-auto" style={{ width: 120, height: 16 }} aria-hidden="true">
      <path d="M2,8 C 40,-4 70,20 100,8 C 130,-4 160,20 198,8" fill="none" stroke={COLORS.caramelLight} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function MomentFeature({ moment, index, onSelect }) {
  const lines = moment.titleLines ?? [moment.label];
  const photoStyle = MOMENT_PHOTO_STYLE[moment.id];
  // Alterna o lado da foto a cada linha, só no desktop — no mobile tudo
  // empilha na mesma ordem (foto sempre em cima).
  const photoRight = index % 2 === 1;

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
      <div
        className={`relative overflow-hidden rounded-[28px] lg:rounded-[36px] ${photoRight ? "lg:order-2" : ""}`}
        style={{ height: 300 }}
      >
        <Photo src={MOMENT_PHOTO[moment.id]} alt="" className="absolute inset-0 w-full h-full object-cover" style={photoStyle} loading={index === 0 ? "eager" : "lazy"} />
      </div>

      <div className={`mt-6 lg:mt-0 px-1 ${photoRight ? "lg:order-1" : ""}`}>
        <span className="inline-flex items-center gap-1.5 text-2xl" aria-hidden="true">
          {moment.emoji}
        </span>
        <h2 className="font-display font-medium text-brand-ink mt-2" style={{ fontSize: "clamp(26px,6vw,34px)", lineHeight: 1.1 }}>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="text-brand-inkSoft mt-3" style={{ fontSize: 15.5, lineHeight: 1.5, maxWidth: 440 }}>
          {MOMENT_TAGLINE[moment.id]}
        </p>
        <button
          onClick={onSelect}
          className="mt-5 inline-flex items-center gap-1.5 font-medium h-12 pl-5 pr-4 text-[14.5px] text-white transition-transform active:scale-95 lg:hover:-translate-y-0.5"
          style={{ backgroundColor: COLORS.caramelDark, borderRadius: 999, boxShadow: "0 4px 14px rgba(61,36,24,0.16)" }}
        >
          {MOMENT_CTA[moment.id]}
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function MomentsEditorialRedesign({ onBack, onSelectMoment }) {
  return (
    <div className="w-full fade-up">
      <div className="px-5 lg:px-16 pt-2">
        <SiteHeader onBack={onBack} logoSize="heroLogo" rowHeight={92} />
      </div>

      <div className="px-6 lg:px-16 text-center lg:max-w-2xl lg:mx-auto">
        <h1 className="font-display italic font-medium text-brand-ink" style={{ fontSize: "clamp(30px,7vw,46px)", lineHeight: 1.08 }}>
          O que o seu dia está pedindo?
        </h1>
        <p className="text-brand-inkSoft mt-3" style={{ fontSize: 16, lineHeight: 1.45 }}>
          Encontre as delícias perfeitas para hoje.
        </p>
      </div>

      {/* Uma "matéria" editorial por momento, não um grid — cada bloco
          respira com sua própria margem vertical generosa; a curva entre
          um bloco e o próximo é só decorativa, marca o ritmo da leitura
          sem precisar de uma borda/linha reta separando os dois. */}
      <div className="mt-9 lg:mt-14 px-5 lg:px-16 flex flex-col gap-12 lg:gap-16" style={{ maxWidth: 1240, marginInline: "auto" }}>
        {MOMENTS.map((m, i) => (
          <div key={m.id}>
            <MomentFeature moment={m} index={i} onSelect={() => onSelectMoment(m.id)} />
            {i < MOMENTS.length - 1 && (
              <div className="mt-12 lg:mt-16 flex justify-center">
                <SectionSquiggle />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-12 lg:h-20" />
    </div>
  );
}
