import { plugin } from '@jabworks/eslint-plugin';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    plugins: {
      '@jabworks/eslint-plugin': plugin,
    },
  },
  ...plugin.configs.next,
];
