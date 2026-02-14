/** @type {import('lint-staged').Configuration} */
const config = {
  '*.{ts,tsx}': filenames => [`eslint ${filenames.join(' ')} --fix --max-warnings=0`, 'prettier  --write'],
  '*.{json,md}': ['prettier --write'],
  '*.css': [`stylelint --fix`, 'prettier --write'],
};

export default config;
