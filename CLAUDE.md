# nexcore

Biblioteca centralizada de regras de negócio e abstrações para projetos Next.js.

## Stack

- **Runtime**: Node.js / Next.js
- **Linguagem**: TypeScript (strict)
- **Package manager**: pnpm
- **Bundler**: tsup (gera ESM + CJS + tipos)
- **Linting/Format**: Biome
- **Testes**: Jest + ts-jest

## Estrutura de pastas

```
src/
  configure/  # Inicialização da lib — Configure() + singleton api
  classes/    # Abstrações de lógicas complexas (HttpClient, TokenService, EnvService)
  hooks/      # React hooks reutilizáveis para Next.js
  modules/    # Regras de negócio por domínio (ex: auth, user, order)
  types/      # Tipos e interfaces compartilhados entre módulos
  utils/      # Funções puras utilitárias (ex: format, date, string)
  index.ts    # API pública — exporta tudo para quem importar a lib
dist/         # Build gerado pelo tsup (não commitar)
```

## Regras da estrutura

- Cada módulo/util/hook/classe fica na sua pasta própria dentro da categoria correta
- Todo módulo deve ter seu próprio `index.ts` controlando o que é público
- Testes ficam **ao lado** do arquivo que testam (`arquivo.test.ts`)
- Nunca exportar diretamente de arquivos internos — sempre passar pelo `index.ts` da pasta
- O `src/index.ts` é a única porta de entrada da lib para projetos externos

## Exemplo de módulo

```
src/utils/format/
  format.ts          # lógica pura
  format.test.ts     # teste ao lado
  index.ts           # exporta só o que é público
```

## Scripts

- `pnpm dev` — executa o entry point via tsx
- `pnpm build` — gera o dist com tsup
- `pnpm test` — roda os testes com Jest
- `pnpm test:watch` — modo watch
- `pnpm test:coverage` — cobertura de código
- `pnpm lint` — analisa o código com Biome
- `pnpm format` — formata o código com Biome
- `pnpm check` — lint + format juntos

## Branches

- `main` — código estável
- `dev` — desenvolvimento ativo
- `feature/*` — features isoladas, sempre saem e voltam para `dev`

## Fluxo de trabalho

```
feature/nome → dev → main
```

## Documentação

Toda a documentação da lib — o que cada util/hook/classe faz, como usar, exemplos e onde aplicar — está centralizada no Obsidian:

```
/home/cosme/Documentos/Obsidian/Pessoal/Trabalho/nexcore/
```

**IMPORTANTE:** Antes de criar qualquer novo util, hook, classe ou módulo, consulte a documentação no Obsidian para:
- Verificar se já existe algo similar implementado
- Entender o padrão de documentação adotado
- Checar o backlog em `01 - Backlog.md` para ver o que está planejado
- Seguir os exemplos de uso já documentados
