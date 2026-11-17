// Protótipo de redesign visual (Fase 1, QA pós-publicação 2026-11) — NÃO
// usado por nenhuma tela de produção. Ver App.jsx: só é alcançado pelos
// ids de tela "proto-home"/"proto-momentos", que não têm link em nenhuma
// navegação real (DesktopNav/BottomNav/HomeScreen) — só por URL direta,
// propositalmente, pra não afetar o comportamento do site existente.
//
// Uma curva orgânica simples entre seções — SVG puro, um único path
// desenhado à mão (nenhuma imagem, nenhum gerador externo), reproduzível
// em qualquer build React/Vite/Tailwind. `fill` recebe a cor da seção
// SEGUINTE (a que "avança" por cima da seção anterior), criando o efeito
// de página virando em vez de um corte reto entre blocos.
export default function WaveDivider({ fill, flip = false, height = 56, className = "" }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full ${flip ? "-scale-y-100" : ""} ${className}`}
      style={{ height }}
    >
      <path d="M0,24 C 240,90 480,0 740,36 C 1000,72 1220,10 1440,46 L1440,120 L0,120 Z" fill={fill} />
    </svg>
  );
}
