// Settings for the Docusaurus version of the Requisio handbook (same design and data as the Hugo version).

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Requisio handbook',
  url: 'https://saanchi365.github.io',
  baseUrl: '/requisio-ux-demo-docusaurus/',
  organizationName: 'saanchi365',
  projectName: 'requisio-ux-demo-docusaurus',
  trailingSlash: true,
  onBrokenLinks: 'warn',
  markdown: {mermaid: true},
  themes: ['@docusaurus/theme-mermaid'],
  stylesheets: ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'],
  presets: [
    ['classic', {docs: false, blog: false, pages: false, theme: {customCss: './src/css/custom.css'}}],
  ],
  // Makes one page per feature and tab (plus the About users pages) from src/data/handbook.json
  plugins: ['./plugins/handbook'],
  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    mermaid: {theme: {light: 'neutral', dark: 'dark'}},
    navbar: {title: 'Requisio handbook', items: []},
  },
};

module.exports = config;
