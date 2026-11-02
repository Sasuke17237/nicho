# VIP Store • Loja Digital com Efeito de Vidro Apple & Painel Secreto

Uma plataforma moderna de catálogo e vendas para produtos digitais (templates, presets, packs, e-books, designs e cursos), desenvolvida com design sofisticado em **Apple Liquid Glass** (*glassmorphism* refinado nas barras e botões), pré-visualização instantânea e fechamento de pedidos direto no Telegram.

---

## 🚀 Funcionalidades

- **Design Apple Liquid Glass:**
  - Acabamento translúcido premium nas barras de navegação flutuantes e nos botões.
  - Bolhas líquidas animadas no fundo (*animated fluid blobs*) que proporcionam reflexos e refrações sutis.
  - Sem sobreposição pesada de vidros, mantendo legibilidade total e visual limpo.
- **Redirecionamento Direto para o Telegram:**
  - Link oficial configurado: `https://t.me/SPIDERSELLER7`
  - Ao clicar em "Comprar", o cliente seleciona a forma de pagamento (Pix, Cripto, Cartão, PayPal) e o sistema gera automaticamente uma mensagem pré-formatada pronta para envio no chat privado.
- **Painel Administrativo Oculto (`/kakashi`):**
  - **Invisível para os clientes:** Nenhum botão ou link da loja pública aponta para o painel.
  - Acesso direto e discreto pelo navegador: `seusite.vercel.app/kakashi`.
  - Proteção por PIN de segurança (PIN padrão: `7777`).
  - Cadastro, edição e exclusão de produtos em tempo real com prévia visual da foto.
  - Guia integrado de onde hospedar fotos e vídeos gratuitamente (ImgBB, PostImages, etc.).
  - Botão de 1 clique para baixar o `products.json` atualizado.

---

## 📁 Estrutura de Arquivos

```text
├── index.html            # Loja pública visível para os clientes
├── kakashi/
│   └── index.html        # Painel secreto de administração (/kakashi)
├── css/
│   └── glass.css         # Efeito Apple Liquid Glass e layout responsivo
├── js/
│   └── store.js          # Motor da loja, filtros, modais e integração com Telegram
├── data/
│   └── products.json     # Catálogo de produtos padrão
├── vercel.json           # Configuração de rotas limpas para Vercel
└── README.md             # Guia de publicação e uso
```

---

## 🌐 Como Publicar no GitHub e na Vercel

### 1. Criar Repositório no GitHub
1. Acesse [github.com](https://github.com) e crie um novo repositório (ex: `minha-loja-vip`).
2. No seu terminal dentro desta pasta (`w:\Project`), execute:
   ```bash
   git init
   git add .
   git commit -m "feat: inicializar loja com design liquid glass e painel secreto"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/minha-loja-vip.git
   git push -u origin main
   ```

### 2. Conectar na Vercel (Gratuito)
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Selecione o repositório `minha-loja-vip` e clique em **"Deploy"**.
4. Em menos de 1 minuto, seu site estará no ar com domínio grátis (ex: `nicho.vercel.app`):
   - **Loja para os clientes:** `https://nicho.vercel.app/`
   - **Seu painel secreto:** `https://nicho.vercel.app/kakashi` (PIN padrão: `7777`).

---

## 📸 Onde Hospedar Fotos e Vídeos Gratuitamente?

Como você não precisa de documentos confidenciais, apenas de fotos de capa e demonstrações para seus produtos, use qualquer um destes serviços gratuitos:

1. **[ImgBB](https://imgbb.com):**
   - Não requer cadastro.
   - Faça upload da imagem e copie o **Link Direto** (terminado em `.jpg` ou `.png`).
2. **[PostImages.org](https://postimages.org):**
   - Muito rápido e gratuito. Escolha "Link direto".
3. **[Unsplash](https://unsplash.com):**
   - Banco de fotos profissionais gratuitas de alta qualidade.
4. **Vídeos de Demonstração:**
   - Pode hospedar vídeos curtos em plataformas de CDN público, Streamable ou qualquer link direto `.mp4`.
