---
layout: compress-js
---
(function() {
  'use strict';

  const client = algoliasearch('5IGTHBX5JS', '7f7511d659569fcede7653d568b3206c');
  const index = client.initIndex('blog_eleven');

  const searchInput = document.getElementById('js-algolia__input');
  const baseurl = window.site && window.site.baseurl;
  const lang = window.site && window.site.lang;
  moment.locale(lang || 'en');

  function onQueryChange() {
    const contentId = document.getElementById('js-content');
    const contentSearchId = document.getElementById('js-content-search');
    contentId.style.display = 'none';
    contentSearchId.style.display = 'block';

    if (!searchInput.value) {
      contentId.style.display = 'block';
      contentSearchId.style.display = 'none';
      return;
    }

    index.search(searchInput.value, (err, content) => {
      if (err) {
        console.error(err.message);
        return;
      }

      let htmlArticle = Object.keys(content.hits).reduce((article, key) => {
        const hit = content.hits[key];

        if (hit.type !== 'document' || hit.layout === 'author' || hit.lang !== lang) {
          return article;
        }

        const dateFormat = lang === 'fr' ? 'DD MMMM YYYY' : 'MMMM DD, YYYY';
        const hitDate = moment(hit.date, 'YYYY-MM-DD HH:mm:ss ZZ');

        const url = baseurl + hit.url;

        return article + `
          <div class="posts-teaser slice">
            <div class="container">
              <h2 class="posts-title">
                <a class="no-link-style" href="${url}">${hit.title}</a>
              </h2>
              <time class="posts-date meta">
                <span class="meta-content">${hitDate.format(dateFormat)}</span>
              </time>
              <p class="excerpt">${hit.excerpt}</p>
              <a class="button" href="${url}">${window.site.translations.global.continue_reading}</a>
            </div>
          </div>
        `;
      }, '');

      htmlArticle += `
        <div class="container search-logo">
          search by
          <a href="https://algolia.com" target="_blank">
            <span class="search-logo-bg"></span>
          </a>
        </div>
      `;

      contentSearchId.innerHTML = htmlArticle;
    });
  }

  searchInput.addEventListener('keyup', onQueryChange);
})();
