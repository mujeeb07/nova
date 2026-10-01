import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import importX from 'eslint-plugin-import-x';

export default tseslint.config(
  {
    // Ignore build output folders immediately
    ignores: ['dist/**', 'build/**', 'node_modules/**']
  },
  
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  
  {
    // Apply explicitly to your development source files
    files: ['**/*.ts', '**/*.mts'],
    plugins: {
      'import-x': importX,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true, // Auto-maps closest tsconfig boundaries
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node, // Exposes Node global variables (process, etc)
      },
    },
    settings: {
      // Teaches ESLint to map alternative '.js' runtime extensions back to development '.ts' files
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off',
      "@typescript-eslint/no-explicit-any": "warn",
      // Validates that all modern module paths match actual file locations
      'import-x/no-unresolved': 'error',
    },
  }
);
