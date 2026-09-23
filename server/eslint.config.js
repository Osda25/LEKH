import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['src/generated/**']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node
    }
  }
])