import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'rules-tests'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // rules-of-hooks and exhaustive-deps are the hook rules this app was
      // written against. The React Compiler rules added in later
      // eslint-plugin-react-hooks releases flag existing data-loading effects;
      // leave those off so lint does not force behavior changes.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
    },
  },
);
