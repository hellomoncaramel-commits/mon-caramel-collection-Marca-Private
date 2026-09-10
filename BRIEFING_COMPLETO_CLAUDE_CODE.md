# Mon Caramel Collection — Briefing completo para o Claude Code

Sou dona da Mon Caramel, uma confeitaria artesanal em Oshawa, Ontario. Venho
desenvolvendo o site/app de pedidos da marca ("Mon Caramel Collection") num
protótipo React dentro do Claude.ai, e agora quero migrar isso pra um projeto
de verdade aqui no Claude Code, com um design system consistente baseado na
nossa identidade visual real.

Anexei o arquivo `mon-caramel-collection.jsx` — é o protótipo atual completo,
com toda a estrutura de produtos, categorias e o fluxo de seleção já
funcionando. Use-o como referência de conteúdo/comportamento; a implementação
em si pode (e deve) ser refeita do zero, organizada como projeto de verdade.

---

## 1. Sobre a marca

- **Nome:** Mon Caramel
- **Local:** Oshawa, Ontario, Canadá
- **Dona:** Naia (naia.ozorio@gmail.com)
- **Instagram:** @by_moncaramel
- **Retirada:** grátis, cruzamento Ritson x Adelaide
- **Entrega:** disponível, com taxa
- **Linhas de negócio:** dia a dia, festa, presente

**Posicionamento:**
> "Mon Caramel doesn't sell sweets. It creates personalized experiences that
> bring people together and turn special moments into unforgettable memories."

A marca vende sentimento, não sobremesa. Cada interação deve reforçar isso —
o site não é uma vitrine de e-commerce, é uma ferramenta de descoberta e
personalização que termina numa conversa de verdade pelo WhatsApp.

**Slogan:** "Not your average sweet."

---

## 2. Identidade visual (do Brand Kit oficial no Canva)

**Paleta de cores:**
| Nome | Hex |
|---|---|
| Dark Caramel | `#AB6233` |
| Light Caramel | `#ECC15C` |
| Yellow Cream | `#EFC970` |
| Light Beige (fundo) | `#FFFCF5` |
| Whipping Cream | `#FFFFFF` |
| Basic Black | `#000000` |

**Tipografia:**
- **Títulos:** "Sunday" (fonte display do Canva — não é Google Font. Ou
  localizamos o arquivo da fonte, ou substituímos por algo serifado/display
  com o mesmo clima artesanal-elegante — o protótipo atual usa "Fraunces"
  como aproximação, o que funcionou bem visualmente)
- **Subtítulos:** Cormorant Garamond, itálico (Google Font, disponível direto)
- **Corpo de texto:** Roboto (Google Font, disponível direto)

**Logo:** wordmark "MON ♥ CARAMEL" com um coraçãozinho no lugar do "O" do
meio. Existe também uma versão ícone só com "MC". Tem 3 variações: colorida
(fundo claro), colorida com foto de fundo, e P&B (fundo escuro/claro). Posso
exportar os PNGs do Canva se precisar.

**Padrão de fotografia:** só fotos reais, luz natural, estilo caseiro —
nunca fotos geradas por IA ou banco de imagens. Toda foto de produto no site
vem de fotos reais que eu tirei e mandei.

---

## 3. Tom de voz

**Se a Mon Caramel fosse uma pessoa, ela seria:**
Calorosa e acolhedora, um pouco espirituosa (nunca sarcástica), aconchegante,
caseira e humana, confiante sem ser pomposa.

**Sensação-chave:** inesperadamente encantador, feito com carinho.

**Como deve soar:** leve (fácil, nunca pesado), brincalhão (humor suave,
pequenas reviravoltas), conversacional (como uma pessoa de verdade
falando), caloroso (amigável, inclusivo, confortante), confiante (a gente
sabe que nossos doces são especiais).

**Regras de escrita:**
- Frases curtas e diretas
- Voz ativa ("a gente assa", "a gente compartilha", "a gente esconde")
- Casual (contrações bem-vindas)
- Humano (escreva como você falaria)
- Linguagem simples, humor gentil, palavras sensoriais (morno, grudento)

**Estilo de humor:** aconchegante ("Feito pra confortar.") e engraçado
("Pra presentear... ou pra não dividir com ninguém.")

**Palavras que a marca ama:** sweet, cozy, warm, little, happy, comforting,
bite, grab, break, share, sneak, savour, unwrap, small-batch, homemade,
slow-baked, gooey, golden, extra.

**Palavras que a marca evita:** artisanal, luxury/premium, decadent,
indulgence, "best-in-class" (rígido demais, não é a nossa cara).

**Exemplos de voz em ação:**
- "Made with love. Crumb-approved."
- "Warning: disappears fast."
- "Baked for sharing, or not."
- "One box. Many 'just one more' moments."
- "Love in every bite."

**Antes de publicar qualquer texto, pergunte:** Isso soa natural e humano,
como algo que um amigo diria? A gente diria isso pra um amigo? Está
caloroso, leve e um pouquinho engraçado?

---

## 4. Arquitetura do site

O site é organizado por **momento/humor**, não por categoria de produto
tradicional — a pessoa entra dizendo como está se sentindo ou o que precisa,
não procurando um item específico. O mesmo produto pode aparecer em vários
momentos diferentes.

### As 5 categorias da Home (título — subtítulo, aparecem direto no card):

1. **☕ "Hmm... isso aqui com um café..."**
   *"Sempre tem um bom motivo para colocar um docinho na mesa."*

2. **💛 "Dias de luta. Doces de glória."**
   *"Seja TPM, segunda-feira ou um dia difícil. Nem todo problema tem
   solução, mas um docinho sempre ajuda."*

3. **❄️ "Seu eu do futuro agradece."**
   *"Guarde no freezer e tenha sempre à mão opções low sugar para a
   lancheira das crianças ou para aquela vontade de um doce de última
   hora."*

4. **🎁 "É só uma lembrancinha."**
   *"Pra gente, é muito mais que isso. Cada caixa é única, pensada e
   personalizada para que quem a receba se sinta realmente especial."*

5. **🎉 "Não vai ter festa... só um bolinho."**
   *"A gente conhece essa história... foi assim que muita festa começou."*

Clicar num card vai direto pra grade de produtos daquele momento — sem tela
repetida de título/foto/subtítulo no meio do caminho.

### Categoria 🎁 Lembrancinha — estrutura especial

Diferente das outras, essa categoria **não é um catálogo de produtos com
preço fixo**. É organizada em 3 carrosséis horizontais de fotos de
inspiração, todos com preço "Sob consulta 💬":

- **Caixas Personalizadas** — fotos de caixas de presente já montadas,
  mostrando estilos/combinações possíveis
- **Cestas para Todos os Momentos** — bandejas maiores de celebração, com
  balão/decoração/topper (chá de bebê, aniversário, formatura, Dia dos
  Pais, cidadania canadense, etc.)
- **Mimos que Encantam** — itens pequenos pra qualquer ocasião (maçãs
  personalizadas com nome, cone de agradecimento, pirulito com laço,
  mix numa caneca)

A ideia: mostrar que cada caixa/cesta é única e personalizada, sem virar um
formulário rígido de e-commerce. Inspiração + personalização, não catálogo.

---

## 5. Fluxo de seleção (o "carrinho")

Existem **dois fluxos independentes**, que nunca se misturam:

### ❤️ "Minha Seleção" (Café, Dias de Luta, Freezer, Lembrancinha)
- Carrinho normal com preços visíveis
- Produtos com sabor fixo: um clique em "♡ Adicionar à minha seleção" já
  adiciona
- Produtos personalizáveis (ex: Brigadeiros): abre um mini configurador
  inline no próprio card — chips de sabor (multi-seleção), chips de
  quantidade (extraídos do texto "6, 12 ou 24 unidades"), divisão
  automática e visível da quantidade por sabor escolhido (ex: 12 = 4
  Tradicional + 4 Ninho + 4 Pistache)
- Um botão flutuante "♡ Minha Seleção (N)" aparece assim que tem item
  selecionado, em qualquer categoria, e leva pra uma tela dedicada com
  tudo detalhado, opção de remover item, e "Finalizar pelo WhatsApp" que
  monta a mensagem organizada automaticamente
- Cada card de produto mostra um selo: "Sabor fixo" (cinza) ou "Escolha
  seus sabores ✨" (dourado) — pra deixar claro de cara o que dá pra
  personalizar

### 🎉 "Minha Festa" (só na categoria Festa)
- **Sem preços em lugar nenhum** dentro de Festa
- Botão "🎈 Adicionar à Minha Festa" abre um modal com quantidade +
  tema/observações opcionais (compartilhados pra seleção toda)
- Painel próprio ("planner") com gradiente, cópia diferente quando vazio
  vs. preenchido, toast discreto que some sozinho ao adicionar item
- Botão flutuante "🎉 Minha Festa (N)" no canto inferior direito
- Mensagem própria de WhatsApp: "Solicitar orçamento"

---

## 6. Catálogo de produtos (estado atual)

**☕ Café:** Brigadeiro (personalizável — sabores ainda não cadastrados, só
a estrutura pronta), Alfajor, Pão de Mel, Biscoito Amanteigado, Casadinhos
Goiabada, Bolo de Cenoura, Chocobomb, Sequilhos

**💛 Dias de Luta:** Bala de Coco → Chocobomb → Cone Trufado → Mini Cake
Donuts (ordem fixa nessa categoria), Brigadeiros, Alfajor, Pão de Mel,
Bolo de Cenoura

**❄️ Freezer:** Brigadeiros, Bala de Coco, Mini Donuts (simples, sem
recheio), Biscoito Amanteigado

**🎁 Lembrancinha:** ver seção 4 acima (3 carrosséis de inspiração)

**🎉 Festa:** Brigadeiros Personalizados, Briganinhos Personalizados,
Pirulitos Decorados, Cones Trufados, Mini Cake Donuts Decorados, Bolo no
Palito, Pirâmide de Bala de Coco, Pirulito de Alfajor, Casadinhos, Mon DUO
Flor

Produtos removidos do catálogo: Sequilho de Fubá com Goiabada, Casadinho
Flor (duplicado), Bala Baiana.

**Nota sobre preços:** ainda estou fazendo a precificação final em Excel —
o site deve ficar preparado pra eu adicionar/ajustar preços facilmente,
sem virar trabalho de programador toda vez.

---

## 7. Lições técnicas já aprendidas no protótipo (evitar repetir)

- **Não usar valores arbitrários do Tailwind entre colchetes**
  (`aspect-[4/3]`, `w-[48%]`, `max-h-[85vh]`) — dependendo de como o CSS é
  compilado no ambiente final, essas classes podem simplesmente não
  funcionar e a foto/elemento fica sem nenhum limite de tamanho. Usar
  `style={{ aspectRatio: "4 / 3" }}` etc. em vez disso, ou configurar o
  Tailwind corretamente pra reconhecer esses valores.
- Fotos de produto sempre em proporção 4:3, cortadas na hora do preparo
  (nunca deixar o browser cortar via `object-cover` sem crop prévio
  cuidadoso — perde conteúdo importante tipo laço, potinho, canto da
  caixa).
- Carrossel de fotos (quando o produto tem mais de uma) deve **rodar
  sozinho automaticamente** (a cada ~3s), pausando se a pessoa interagir
  manualmente — muitos clientes não percebem que dá pra arrastar/ver mais
  fotos.
- Cards usam layout flex com altura igual dentro da mesma fileira
  (`h-full`, descrição com `flex-grow`) pra grade ficar alinhada mesmo com
  textos de tamanhos diferentes.

---

## 8. O que eu preciso que você faça primeiro

1. Leia o `mon-caramel-collection.jsx` anexo pra entender toda a estrutura
   de produtos/categorias/fluxos já construída
2. Monte a estrutura de pastas de um projeto Vite + React + Tailwind de
   verdade (configurado corretamente pra não ter o problema de classes
   arbitrárias acima)
3. Crie um arquivo de design tokens (cores, tipografia, espaçamento,
   raios de borda) baseado na identidade visual da seção 2
4. Migre os componentes principais (Home, tela de categoria, card de
   produto, configurador de sabores, Minha Seleção, Minha Festa) pra
   arquivos separados e organizados
5. Extraia as fotos de produto do base64 embutido no protótipo pra
   arquivos de imagem de verdade dentro de `/public` ou `/src/assets`
6. Mantenha todo o texto/copy em português, no tom de voz descrito na
   seção 3

Pode ir em etapas e me perguntar sempre que precisar de uma decisão de
design ou negócio que não esteja coberta aqui. Prefiro que você pergunte a
que invente informação (preço, sabor, nome de produto) que eu não passei.
