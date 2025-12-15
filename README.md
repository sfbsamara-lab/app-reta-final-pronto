<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1eL49WZmAfeYdEZqur4-Kj9RMQrdZL26o

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Rota secreta de cadastro

Para permitir cadastros apenas a clientes pagantes, existe uma rota secreta que abre o formulário de cadastro diretamente:

- `https://<sua-app>.vercel.app/cadastro-vip` — abre a aba de "Cadastrar" (somente para visitantes não autenticados).

No restante do site (raiz `/`) o modal de autenticação mostra apenas a aba de login.
