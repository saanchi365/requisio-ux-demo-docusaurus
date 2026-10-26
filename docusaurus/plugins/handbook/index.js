// Makes every page of the handbook from src/data/handbook.json:
// all features and each feature × the five tabs, plus the About users pages.
const path = require('path');
const fs = require('fs');

const TABS = ['overview', 'wireframes', 'flowcharts', 'requirements', 'comments'];

module.exports = function handbookPlugin(context) {
  return {
    name: 'handbook-pages',
    async loadContent() {
      return JSON.parse(fs.readFileSync(path.join(context.siteDir, 'src/data/handbook.json'), 'utf8'));
    },
    async contentLoaded({content, actions}) {
      const add = async (routePath, props) => {
        const file = await actions.createData(`route-${routePath.replace(/\W+/g, '-') || 'home'}.json`, JSON.stringify(props));
        actions.addRoute({path: routePath, component: '@site/src/components/HandbookPage', exact: true, modules: {page: file}});
      };
      await add(context.baseUrl, {scope: 'all', tab: 'overview'});
      for (const tab of TABS) await add(`${context.baseUrl}all/${tab}/`, {scope: 'all', tab});
      for (const f of content.features) {
        await add(`${context.baseUrl}feature-${f.n}/`, {scope: f.n, tab: 'overview'});
        for (const tab of TABS) await add(`${context.baseUrl}feature-${f.n}/${tab}/`, {scope: f.n, tab});
      }
      await add(`${context.baseUrl}not-under-a-feature/`, {orphans: true});
      for (const doc of Object.keys(content.users)) await add(`${context.baseUrl}users/${doc}/`, {doc});
    },
  };
};
