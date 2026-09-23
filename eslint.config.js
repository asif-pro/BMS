import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/semi': 0,
      'multiline-ternary': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/quotes': 'off',
      'implicit-arrow-linebreak': 'off',
      'linebreak-style': 'off',
      'no-console': 2,
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      '@typescript-eslint/indent': 'off',
      'no-confusing-arrow': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state'],
        },
      ],
      'max-len': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-wrap-multilines': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'function-paren-newline': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-key': [
        'warn',
        {
          checkFragmentShorthand: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      'import/no-extraneous-dependencies': 'off',
      'react/jsx-curly-newline': 'off',
      'no-restricted-syntax': ['error'],
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  }
);
