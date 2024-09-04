import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginTs from "@typescript-eslint/eslint-plugin";

const tsPlugin = pluginTs;
const reactPlugin = pluginReact;

const recommendedReactConfig = {
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "warn",
  },
};

const recommendedTsConfig = {
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};

export default [
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: globals.browser,
    },
  },
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
    },
    rules: {
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: [
        "error",
        2,
        {
          MemberExpression: "off",
          SwitchCase: 1,
        },
      ],
      "jsx-quotes": ["error", "prefer-double"],
      "no-use-before-define": "off",
      "no-control-regex": 0,
      "no-unused-vars": ["warn"],
      "no-param-reassign": "off",
      "linebreak-style": 0,
      "object-curly-newline": "off",
      eqeqeq: ["error", "always"],
      "function-paren-newline": "off",
      "implicit-arrow-linebreak": "off",
      "operator-linebreak": "off",
      "prefer-const": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "react/jsx-indent": ["error", 2],
      "react/jsx-one-expression-per-line": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "import/extensions": 0,
      "import/no-unresolved": 0,
      "import/prefer-default-export": 0,
      "import/no-extraneous-dependencies": "off",
      "import/no-mutable-exports": "off",
    },
  },
  recommendedReactConfig,
  recommendedTsConfig,
];
