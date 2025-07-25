import {UserConfig} from '@11ty/eleventy';
import {slugify} from './utils/slugify.js';
import {fromHtml} from 'hast-util-from-html';
import {selectAll} from 'hast-util-select';
import {toHtml} from 'hast-util-to-html';
import {escapeHtml} from 'markdown-it/lib/common/utils.mjs';

export function registerShortcodes(eleventyConfig: UserConfig): void {
  _setupCards(eleventyConfig);
  _setupMedia(eleventyConfig);
  _setupTabs(eleventyConfig);
}

function _setupCards(eleventyConfig: UserConfig): void {
  eleventyConfig.addPairedShortcode('card', function (content: string, title: string, link?: string | null) {
    let cardBuilder = link ? `<a class="card filled-card" href="${link}">` : '<div class="card">';

    cardBuilder += `<div class="card-header"><header class="card-title">${title}</header></div>`;
    cardBuilder += `<div class="card-content">

${content}

</div>
`;

    cardBuilder += link ? '</a>' : '</div>';

    return cardBuilder;
  });
}

function _setupMedia(eleventyConfig: UserConfig): void {
  eleventyConfig.addShortcode('ytEmbed', function (id: string, title: string, playlistId: string | null = null) {
    const escapedTitle = title && title.length > 0 ? escapeHtml(title) : '';

    let startTime = 0;
    if (id.includes('?')) {
      id = id.split('?')[0];

      const idAndStartTime = id.split('start=');
      if (idAndStartTime.length > 1) {
        const startTimeString = idAndStartTime[1];
        startTime = Number.parseInt(startTimeString);
      }
    }

    return `
<lite-youtube videoid="${id}" videotitle="${escapedTitle}" videoStartAt="${startTime}" ${playlistId ? `playlistid="${playlistId}"` : ''}>
  <p><a class="lite-youtube-fallback" href="https://www.youtube.com/watch/${id}" target="_blank" rel="noopener">在新标签页中打开 YouTube："${title}"</a></p>
</lite-youtube>`;
  });

  eleventyConfig.addPairedShortcode('videoWrapper', function (content: string, intro = '') {
    let wrapperMarkup = '<div class="video-wrapper">';
    if (intro && intro !== '') {
      wrapperMarkup += `<span class="video-intro">${intro}</span>`;
    }

    wrapperMarkup += content;
    wrapperMarkup += '</div>';
    return wrapperMarkup;
  });
}

function _setupTabs(eleventyConfig: UserConfig) {
  // Counter shared between all tabs and wrappers to
  // ensure each has a unique ID.
  let currentTabWrapperId = 0;
  let currentTabPaneId = 0;

  eleventyConfig.addPairedShortcode('tabs', function (content: string, saveKey: string, wrapped: boolean = false) {
    const tabWrapperId = currentTabWrapperId++;
    let tabMarkup = `<div id="${tabWrapperId}" class="tabs-wrapper${wrapped ? " wrapped" : ""}" ${saveKey ? `data-tab-save-key="${slugify(saveKey)}"` : ''}><ul class="nav-tabs" role="tablist">`;

    // Only select child tab panes that don't already have a parent wrapper.
    const tabPanes = selectAll(
        '.tab-pane[data-tab-wrapper-id="undefined"]',
        fromHtml(content, {'fragment': true}),
    );
    if (tabPanes.length <= 1) {
      throw new Error(`Tabs with save key of ${saveKey} needs more than one tab!`);
    }

    let setTabToActive = true;
    for (const tabPane of tabPanes) {
      // Keep track of the tab wrapper ID to avoid including
      // a duplicate of this tab's contents in a parent wrapper.
      tabPane.properties.dataTabWrapperId = tabWrapperId;

      // The tab pane children are non-rendered Markdown still,
      // so we need to convert them to raw nodes to prevent
      // hast-util-to-html from re-escaping their content.
      tabPane.children.forEach(child => {
        if (child.type === 'text') {
          // @ts-ignore
          child.type = 'raw';
        }
      });

      const tabId = tabPane.properties.dataTabId! as string;
      const tabPanelId = `${tabId}-panel`;
      const tabName = tabPane.properties.dataTabName! as string;
      const tabIsActive = setTabToActive;

      // Only set the first tab of a wrapper to active initially.
      if (tabIsActive) {
        tabPane.properties['className'] += ' active';
        setTabToActive = false;
      }

      const tabSaveId = slugify(tabName);
      tabMarkup += `<li class="nav-item">
  <a class="nav-link ${tabIsActive ? "active" : ""}" tabindex="0" data-tab-save-id="${tabSaveId}" id="${tabId}" href="#${tabPanelId}" role="tab" aria-controls="${tabPanelId}" aria-selected="${tabIsActive ? "true" : "false"}">${tabName}</a>
</li>`;
    }

    tabMarkup += '</ul><div class="tab-content">\n';
    // The content is Markdown and controlled by us,
    // so specify allowDangerousHtml to avoid double escaping.
    tabMarkup += toHtml(tabPanes, {allowDangerousHtml: true});
    tabMarkup += '\n</div></div>';

    return tabMarkup;
  });

  eleventyConfig.addPairedShortcode('tab', function (content: string, tabName: string) {
    const tabIdNumber = currentTabPaneId++;
    const tabId = `${tabIdNumber}-tab`;
    const tabPanelId = `${tabId}-panel`;
    return `<div class="tab-pane" id="${tabPanelId}" role="tabpanel" aria-labelledby="${tabId}" data-tab-id="${tabId}" data-tab-name="${tabName}" data-tab-wrapper-id="undefined">

${content}

</div>
`;
  });
}