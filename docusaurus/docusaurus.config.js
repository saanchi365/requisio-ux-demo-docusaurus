// Settings for the Docusaurus version of the Requisio handbook.
// Same content and colours as the MkDocs Material version, so the comparison is about the tool.

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Requisio handbook',
  tagline: 'How Requisio works: features, flowcharts, issues and use cases',
  url: 'https://saanchi365.github.io',
  baseUrl: '/requisio-ux-demo-docusaurus/',
  organizationName: 'saanchi365',
  projectName: 'requisio-ux-demo-docusaurus',
  trailingSlash: true,
  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'warn'},
  },
  themes: ['@docusaurus/theme-mermaid'],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  ],

  presets: [
    [
      'classic',
      {
        docs: {sidebarPath: './sidebars.js', breadcrumbs: true},
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      },
    ],
  ],

  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    mermaid: {theme: {light: 'neutral', dark: 'dark'}},
    navbar: {
      title: 'Requisio handbook',
      style: 'primary',
      items: [
        {to: '/', label: 'Home', position: 'left', activeBaseRegex: '^/requisio-ux-demo-docusaurus/$'},
        {type: 'docSidebar', sidebarId: 'features', label: 'Features', position: 'left'},
        {type: 'docSidebar', sidebarId: 'users', label: 'Users', position: 'left'},
        {to: '/requirements/', label: 'Requirements', position: 'left'},
        {href: 'https://saanchi365.github.io/requisio-ux-demo/', label: 'Compare: MkDocs version', position: 'right'},
        {href: 'https://github.com/saanchi365/requisio-ux-demo', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'light',
      copyright: 'Requisio is a made-up purchase-request app, used to practise UX documentation. Built with Docusaurus.',
    },
  },
};

module.exports = config;
