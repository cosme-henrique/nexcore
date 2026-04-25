# nexcore

Biblioteca centralizada de regras de negócio e abstrações para projetos Next.js.

## Stack

- **Runtime**: Node.js / Next.js
- **Linguagem**: TypeScript (strict)
- **Package manager**: pnpm

## Estrutura

```
src/
  index.ts        # Entry point principal
dist/             # Build gerado (não commitar)
```

## Scripts

- `pnpm dev` — executa o entry point via tsx (desenvolvimento)
- `pnpm build` — compila TypeScript para dist/

## Convenções

- Todo código em TypeScript strict
- Lógicas de negócio ficam em `src/`
- Componentes e classes devem abstrair complexidade — expor interfaces limpas
- Compartilhável entre múltiplos projetos Next.js via import direto ou futuramente como pacote npm privado
