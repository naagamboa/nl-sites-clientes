# NL Sites · Clientes

Doze sites estáticos e um hub de cases, todos em HTML, CSS e JavaScript puro,
com fontes self-hosted e imagens locais.

## Estrutura

```
nl-sites-clientes/
├── index.html              # hub NL Sites · Clientes
├── eleve/                  # Eleve NeoPilates
├── santos/                 # Santos Estética Automotiva
├── trussardi/              # Trussardi Auto Portas
├── artoflife/              # Art of Life Barbershop
├── bravus/                 # Bravus Studio Automotivo
├── call/                   # Call Barber Shop
├── map/                    # MAP Personal Car
├── dulops/                 # Du Lops Estética Automotiva
├── mov/                    # MOV Treinamento Funcional
├── jolie/                  # Jolie Espaço de Vida
├── topsul/                 # Top Sul Lavagem e Higienização
├── zm/                     # ZM Estética Automotiva
├── _hub/
│   ├── hub.css
│   └── assets/
│       ├── fonts.css
│       ├── fonts/
│       └── shots/          # screenshots usados nos cards
├── _motion/                # camada compartilhada de movimento, cursor e mapas
│   ├── motion.css
│   └── motion.js
├── _shots/                 # screenshots de QA
└── _tools/                 # servidor local e helper de screenshots
```

## Como visualizar

O site é estático. Basta servir a pasta `nl-sites-clientes` como raiz:

```powershell
powershell -ExecutionPolicy Bypass -File .\_tools\serve.ps1
```

Depois abra `http://127.0.0.1:4173/`.

O hub usa caminhos relativos (`eleve/`, `santos/`, etc.), então também funciona
publicado em uma subpasta.

## Publicação

Compatível com qualquer hospedagem estática — Netlify, Cloudflare Pages,
GitHub Pages ou Vercel. Publique o conteúdo de `nl-sites-clientes/` como raiz
do site. O hub será o `index.html`.

O arquivo `.nojekyll` já está incluído: ele impede o GitHub Pages de ignorar
as pastas `_hub/` e `_motion/`, que começam com underscore.

## Fontes e verificação

- **Eleve NeoPilates** — Cidade Baixa, Porto Alegre. Serviços, endereço,
  horários, WhatsApp e Instagram confirmados. Sem promessa de aula grátis.
- **Santos Estética Automotiva** — Santo Antônio, Porto Alegre. Serviços,
  endereço, WhatsApp e perfis confirmados. O antes/depois é uma ilustração
  vetorial autoral, não foto de serviço.
- **Trussardi Auto Portas** — Floresta, Porto Alegre. Serviço, endereço,
  telefones, e-mails e horário confirmados; PDF oficial de serviços usado
  como referência.
- **Art of Life Barbershop** — quatro unidades em Porto Alegre. Endereços,
  horários gerais, WhatsApp, Instagram e links do AppBarber confirmados.
  Preços são referência da Unidade Lucas e podem variar por unidade.
  Nenhum número de clientes, prêmio ou avaliação não verificado foi incluído.
- **Bravus Studio Automotivo** — Santa Maria Goretti, Porto Alegre. Endereço,
  WhatsApp, Instagram e serviços confirmados (PPF, envelopamento, películas,
  polimento, vitrificação, higienização, faróis, pinças, vidros, rodas e
  martelinho). Sem preços ou prazos inventados.
- **Call Barber Shop** — Azenha, Porto Alegre. Endereço, telefone, WhatsApp,
  Instagram, horários, serviços e agendamento AppBarber confirmados. As
  informações de prótese capilar vêm do material oficial da própria Call.
- **MAP Personal Car** — São Sebastião, Porto Alegre. Endereço, telefone,
  WhatsApp, Instagram e serviços confirmados. “Desde 2020” consta no perfil
  oficial. Sem avaliações ou preços inventados.
- **Du Lops Estética Automotiva** — Zona Sul, Porto Alegre. WhatsApp,
  Instagram, serviços e atuação na Zona Sul confirmados. O endereço exato não
  é público; o site informa que o endereço e o horário são passados pelo
  WhatsApp, sem inventar localização.
- **MOV Treinamento Funcional** — Bom Fim, Porto Alegre. Endereço, telefone,
  WhatsApp, Instagram, serviços e foco em treinos personalizados confirmados.
  Horários são informados no WhatsApp para evitar divulgar uma grade que pode
  mudar.
- **Jolie Espaço de Vida** — Jardim Planalto, Porto Alegre. Endereço, canais de
  Pilates, Yoga e terapias, Calendly, Instagram e Linktree confirmados. A
  primeira aula é tratada como avaliativa, nunca como gratuita. O site avisa que
  a entrada do prédio deve ser confirmada pelo WhatsApp e não publica telefone
  fixo porque não há um número público confirmado.
- **Top Sul Lavagem e Higienização** — Cristal e Glória, Porto Alegre. WhatsApp,
  Instagram, Linktree, serviços e agenda Lavacar Fácil confirmados. A unidade
  Cristal tem endereço e mapa. A unidade Glória é tratada com cautela: Linktree
  e Instagram publicam endereços diferentes, então o site mostra as duas
  referências e pede confirmação pelo WhatsApp, sem escolher uma versão.
- **ZM Estética Automotiva** — Lomba do Pinheiro, Porto Alegre. Endereço,
  WhatsApp, Instagram, Linktree e serviços confirmados (lavagem detalhada,
  polimento técnico, vitrificação e higienização interna). Horários e preços não
  são publicados porque não há uma tabela oficial confirmada.

## Interação e movimento

As doze páginas usam a camada `_motion/`:

- abertura de página com o nome da marca;
- cursor próprio (desktop, ponteiro fino), com restauração do cursor nativo em
  movimento reduzido ou alto contraste;
- botões magnéticos e tilt 3D nas imagens;
- brilho que acompanha o mouse em cartões e painéis;
- barra de progresso de leitura;
- animações de entrada por scroll já existentes em cada site.

Os cálculos de tilt/magnético usam um retângulo estável para evitar jitter, e o
cursor é ocultado sobre iframes para não congelar sobre os mapas.

## Mapas

- **Eleve**: mapa interativo embutido na seção Visite.
- **Santos** e **Trussardi**: mapa do Google carregado sob demanda.
- **Art of Life**: cada endereço das quatro unidades abre a rota no Google Maps.
- **Bravus**, **Call**, **MAP**, **MOV**, **Top Sul** e **ZM**: mapa carregado
  sob demanda no bloco de contato/endereço.
- **Jolie**: endereço com link para o Google Maps e aviso para confirmar a
  entrada do prédio pelo WhatsApp.
- **Top Sul**: mapa apenas da unidade Cristal; a unidade Glória tem duas
  referências de endereço publicadas e um aviso de confirmação.
- **Du Lops**: sem mapa porque o endereço exato não é público; o contato
  informa endereço e horário.

Endereços, telefones e demais links de localização também apontam direto para o
Google Maps quando há endereço confirmado.

## QA

As doze páginas passaram no Lighthouse com 100 em acessibilidade, boas práticas
e SEO. Também foram verificados:

- links internos, âncoras e assets locais;
- layout em 1440, 390 e 320 px;
- `prefers-reduced-motion` e estados de foco;
- console sem erros.

Screenshots em `_shots/` e nos cards do hub em `_hub/assets/shots/`.
