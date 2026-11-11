import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Módulo de orçamento em descontinuação — não recebe lint/melhorias
    "app/solicitar-projeto/**",
    "app/api/simulacao/**",
    "app/api/admin/orcamento/**",
    "app/admin/dashboard/solicitacoes-manager.tsx",
    "lib/orcamento-types.ts",
    "lib/email-template.ts",
  ]),
]);
