import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/vue2-essential'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  },
]
