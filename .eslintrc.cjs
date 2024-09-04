export default {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
    "airbnb",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "tailwindcss", "prettier"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "tailwindcss/no-custom-classname": "off", //Tuỳ chỉnh các quy tắc của Tailwind CSS
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "react/react-in-jsx-scope": "off",
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
    "no-param-reassign": ["off"],
    "linebreak-style": 0,
    "object-curly-newline": ["off"],
    eqeqeq: ["error", "always"],
    "function-paren-newline": ["off"],
    "implicit-arrow-linebreak": ["off"],
    "operator-linebreak": ["off"],
    "prefer-const": ["off"],
    "jsx-a11y/label-has-associated-control": ["off"],
    "react/jsx-indent": ["error", 2],
    "react/jsx-file-extension": [
      1,
      {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
      },
    ],
    "react/jsx-one-expression-per-line": ["off"],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": ["off"],
    "import/no-mutable-exports": ["off"],
    "prettier/prettier": [
      "error",
      {
        usePrettier: true,
      },
    ],
  },
};
