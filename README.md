## Funcionamento do aplicativo:

### Instalação e configuração inicial:

- Ao instalar o aplicativo, uma pasta chamada "note-liber-vault" é criada automaticamente na pasta "Documentos" do usuário.
- Essa pasta armazenará os arquivos de notas em .json e futuras configurações do aplicativo.

### Inicialização e interface:

- A janela principal exibirá selecionada a última nota criada pelo usuário.

### Gerenciamento de notas:

- Uma barra lateral permite navegar entre as notas existentes e adicionar novas onde elas são organizadas com a última nota criada sendo a primeira.
- Ao clicar para adicionar uma nova nota, um popover mostra um input solicitando um nome (máximo de 10 caracteres).
- A nota é salva como um arquivo ".json" dentro da pasta "note-liber-vault", com o nome fornecido e um cabeçalho "H1" correspondente ao nome fornecido.

### Edição de notas (O aplicativo oferece um editor de texto simples):

- Estilos: texto normal, H1, H2, H3.
- Formatação: negrito, itálico, sublinhado, tachado.
- Blocos: links e código.
- Listas: marcadores, numeração, tarefas (to-do).

### Layout e funcionalidades adicionais:

- Dois botões flutuantes no canto inferior direito permitem: Excluir a nota atual. Alternar entre dois tamanhos de exibição: Tamanho padrão: 800x600 pixels, com barra lateral. Tamanho reduzido: 600x464 pixels, sem barra lateral.
- O usuário só pode ter um máximo de 15 notas, para reforçar que é um aplicativo de nota diário.

### Objetivo do aplicativo:

- O aplicativo foi projetado para anotações rápidas e diárias, não para armazenamento extenso de notas.

## Directory

```
|—— public
|    |—— tauri.svg
|—— src
|    |—— assets
|    |—— components
|        |—— tiptap
|            |—— index.tsx
|            |—— styles.css
|            |—— tiptap.type.ts
|        |—— index.tsx
|    |—— schemas
|        |—— form.schema.tsx
|        |—— index.tsx
|    |—— app.tsx
|    |—— main.tsx
|    |—— vite-env.d.ts
|—— src-tauri
|    |—— capabilities
|        |—— default.json
|    |—— gen
|        |—— schemas
|            |—— acl-manifests.json
|            |—— capabilities.json
|            |—— desktop-schema.json
|            |—— linux-schema.json
|    |—— icons
|        |—— 128x128.png
|        |—— 128x128@2x.png
|        |—— 32x32.png
|        |—— Square107x107Logo.png
|        |—— Square142x142Logo.png
|        |—— Square150x150Logo.png
|        |—— Square284x284Logo.png
|        |—— Square30x30Logo.png
|        |—— Square310x310Logo.png
|        |—— Square44x44Logo.png
|        |—— Square71x71Logo.png
|        |—— Square89x89Logo.png
|        |—— StoreLogo.png
|        |—— icon.icns
|        |—— icon.ico
|        |—— icon.png
|    |—— src
|        |—— lib.rs
|        |—— main.rs
|    |—— target
|    |—— .gitignore
|    |—— Cargo.toml
|    |—— Cargo.lock
|    |—— build.rs
|    |—— tauri.conf.json
|—— .gitignore
|—— index.html
|—— package.json
|—— tsconfig.json
|—— tsconfig.node.json
|—— vite.config.ts
```
