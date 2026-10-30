# Plataforma Elo · Protótipo navegável

Protótipo em HTML, CSS e JavaScript puros com as telas da plataforma:

- **Plataforma do profissional** (computador e celular): início, alunos, anamnese, fichas de treino com versões, biblioteca de vídeos, alimentação, check-ins, financeiro e loja.
- **App do aluno**: início, treino com check em cada exercício, alimentação e água, check-in semanal, loja, perfil e evolução. No computador, pode ser visto ampliado ou dentro de um celular.

Os dois lados usam os mesmos dados: o que o profissional publica aparece para o aluno, e o que o aluno registra chega para o profissional.

É um protótipo para validar a ideia: não tem servidor, login real nem pagamento. Os dados são fictícios e ficam salvos no navegador (localStorage). As telas ainda usam o nome provisório da versão anterior (TeamVechi).

## Como abrir

Abra o `index.html` no navegador e escolha entrar como profissional ou como aluno. Não precisa instalar nada nem estar conectado à internet; as fontes (Barlow, licença SIL OFL) estão em `assets/fonts`.

O botão **Demo**, no canto da tela, troca entre profissional e aluno, avança a data simulada (para testar o check-in do fim de semana) e restaura os dados iniciais.

## Publicar

É um site estático, sem etapa de build. Na Vercel: `npx vercel --prod` dentro desta pasta.

## Estrutura

```
index.html        entrada do protótipo
css/              identidade visual e telas (base, aluno, profissional, fontes)
js/util.js        datas, formatação, ícones e gráficos
js/store.js       estado, armazenamento local e data simulada
js/seed.js        dados de demonstração
js/app.js         rotas, renderização e painel Demo
js/photo.js       foto de perfil
js/aluno.js       telas do aluno
js/personal.js    telas do profissional
```
