module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    plugins: ['@typescript-eslint', 'prettier', 'import-x', 'unused-imports'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import-x/errors',
        'plugin:import-x/warnings',
        'plugin:import-x/typescript',
    ],
    rules: {
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
            },
        ],
        '@typescript-eslint/no-unused-expressions': [
            'error',
            { allowShortCircuit: true, allowTernary: true },
        ],
        '@typescript-eslint/adjacent-overload-signatures': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-misused-new': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-require-imports': 'warn',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: false }],
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/no-use-before-define': [
            'error',
            { variables: false, functions: false, classes: false, typedefs: false },
        ],
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit' }],
        'import-x/namespace': 'off',
        'import-x/no-named-as-default': 'off',
        'import-x/no-unresolved': 'off',
        'import-x/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['index', 'sibling', 'parent', 'object', 'unknown']],
                pathGroupsExcludedImportTypes: ['builtin'],
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                semi: true,
                useTabs: false,
                bracketSpacing: true,
                bracketSameLine: true,
                tabWidth: 2,
                printWidth: 120,
                trailingComma: 'all',
            },
        ],
    },
    settings: {
        'import-x/resolver': {
            node: {
                extensions: ['.ts', '.js', '.d.ts'],
                moduleDirectory: ['node_modules', 'src/'],
            },
            typescript: {
                project: './tsconfig.json',
                alwaysTryTypes: true,
            },
        },
        'import-x/external-module-folders': ['node_modules'],
    },
};
