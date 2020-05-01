const fs = require('fs')
const { parse } = require('twemoji-parser')
const { translate } = require('./theme/utils/translations')
const { renderHeaderWithExplicitAnchor } = require('./theme/utils/markdown')

module.exports = {
  title: 'Ethereum.org',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,maximum-scale=1,maximum-scale=1'
      }
    ],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ethereum.org' }],
    ['meta', { property: 'og:url', content: 'https://ethereum.org' }],
    [
      'meta',
      { property: 'og:image', content: 'https://ethereum.org/og-image.png' }
    ],
    [
      'meta',
      {
        property: 'og:video',
        content: 'https://www.youtube.com/channel/UCNOfzGXD_C9YMYmnefmPH0g'
      }
    ],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:site', content: '@ethereum' }],
    ['meta', { property: 'twitter:creator', content: '@ethereum' }],
    [
      'meta',
      {
        property: 'twitter:image',
        content: 'https://ethereum.org/og-image-twitter.png'
      }
    ],
    // Matomo tracking
    // see https://github.com/vuejs/vuepress/issues/790
    [
      'script',
      {},
      `
        var _paq = window._paq || [];
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        _paq.push(['setCookieDomain', '*.ethereum.org']);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u='//matomo.ethereum.org/piwik/';
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '4']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
        `
    ],
    [
      'noscript',
      {},
      `<p><img src="//matomo.ethereum.org/piwik/matomo.php?idsite=4&amp;rec=1" style="border:0;" alt="" /></p>`
    ],
    [
      'script',
      { type: 'application/ld+json' },

      `{"@context": "https://schema.org", "@type": "Organization", "url": "https://ethereum.org", "email": "press@ethereum.org", "name": "Ethereum", "logo": "https://ethereum.org/og-image.png"}`
    ]
  ],
  markdown: {
    anchor: {
      permalinkSymbol: '↳',
      renderPermalink: renderHeaderWithExplicitAnchor
    }
  },
  extendMarkdown: md => {
    md.use(require('markdown-it-attrs'))
    const r = md.renderer.rules

    const buildTag = (token, slf, classname) => {
      // We need to add our md classes
      const mdClasses = token.attrGet('class') || ''
      token.attrSet('class', classname + ' ' + mdClasses)
      let attrs = slf.renderAttrs(token)
      return `<${token.tag} ${attrs}>`
    }

    r.emoji = (token, idx) => {
      // Get file name from parser
      let file = parse(token[idx].content)
        .find(({ url }) => url)
        .url.split('/')
        .pop()
      // get svg file contents, remove xml tag, and add a class
      let svg = fs.readFileSync('node_modules/twemoji/svg/' + file, 'utf8')
      svg = svg.replace(/\<?[^)]+\?>/im, '')
      svg = svg.replace(/<svg/g, '<svg class="twemoji-svg"')
      return svg
    }

    r.heading_open = (tokens, idx, options, env, slf) => {
      tkn = tokens[idx]
      const anchor =
        tkn.tag == 'h2' || tkn.tag == 'h3' ? 'markdown-heading' : ''
      const classes = [
        // text level class, h1 = l1, h2 = l2, etc
        'l' + tkn.tag.substr(-1),
        anchor,
        // Add classes here
        'tc-text-500'
      ].join(' ')
      return buildTag(tkn, slf, classes)
    }
    r.paragraph_open = (tokens, idx, options, env, slf) =>
      buildTag(tokens[idx], slf, 'l7 tc-text300')
    r.paragraph_close = () => '</p>'
    r.bullet_list_open = (tokens, idx, options, env, slf) =>
      buildTag(tokens[idx], slf, 'l7 tc-text300')
    r.ordered_list_open = (tokens, idx, options, env, slf) =>
      buildTag(tokens[idx], slf, 'l7 tc-text300')
  },

  extendPageData($page) {
    if ($page.path.split('/')[1] == 'translations') {
      $page.path = $page.path.replace('/translations/', '/')
    }
  },
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    /*'/en/': {
      lang: 'en-US',
      label: translate('language'),
      nav: [
        { text: translate('page-home'), link: '/', hideMobile: true },
        {
          text: translate('page-individuals'),
          ariaLabel: translate('page-individuals-aria-label'),
          items: [
            {
              text: translate('page-home-section-individuals-item-one'),
              link: '/what-is-ethereum/'
            },
            {
              text: translate('page-home-section-individuals-item-four'),
              link: '/eth/'
            },
            {
              text: translate('page-home-section-individuals-item-two'),
              link: '/dapps/'
            },
            {
              text: translate('page-home-section-individuals-item-five'),
              link: '/wallets/'
            },
            {
              text: translate('page-home-section-individuals-item-three'),
              link: '/learn/'
            },
            { text: translate('page-community'), link: '/community/' }
          ]
        },
        {
          text: translate('page-developers'),
          ariaLabel: translate('page-developers-aria-label'),
          items: [
            {
              text: translate('get-started'),
              link: '/build/'
            },
            {
              text: 'Ethereum Studio',
              link: 'https://studio.ethereum.org/'
            },
            {
              text: translate('developer-resources'),
              link: '/developers/'
            }
          ]
        },
        { text: translate('page-enterprise'), link: '/enterprise/' }
      ]
    },*/
    '/': {
      lang: 'zh-CN',
      label: translate('language', 'zh-CN'),
      title: translate('ethereum', 'zh-CN'),
      nav: [
        { text: translate('page-home', 'zh-CN'), link: '/' },
        {
          text: translate('page-beginners', 'zh-CN'),
          link: '/zh/what-is-ethereum/'
        },
        { text: translate('page-use', 'zh-CN'), link: '/zh/use/' },
        { text: translate('page-learn', 'zh-CN'), link: '/zh/learn/' },
        { text: translate('page-developers', 'zh-CN'), link: '/zh/developers/' }
      ]
    }
  },
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: timestamp => timestamp
      }
    ],
    [
      'sitemap',
      {
        hostname: 'https://ethereum.org',
        changefreq: 'weekly'
      }
    ],
    ['vuepress-plugin-ipfs'],
    [
      'vuepress-plugin-canonical',
      {
        baseURL: 'https://ethereum.org',
        stringExtension: true
      }
    ]
  ],
  themeConfig: {
    algolia: {
      apiKey: 'f57f4f44f67b48ac256292b74ab0c304',
      indexName: 'ethereum'
    }
  }
}
