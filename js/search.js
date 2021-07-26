---
layout: compress-js
---
(function() {
  'use strict';

  const client = algoliasearch('5IGTHBX5JS', '7f7511d659569fcede7653d568b3206c');
  const index = client.initIndex('blog_eleven');

  const searchInput = document.getElementById('js-algolia__input');
  const searchForm = document.getElementById('js-algolia__form');

  console.log(searchInput, searchForm);
  const baseurl = window.site && window.site.baseurl;
  const contentId = document.getElementById('js-content');
  const contentSearchId = document.getElementById('js-content-search');
  const lang = window.site && window.site.lang;

  document.getElementById('js-algolia__input').focus();

  function onQueryChange(e) {
    e.preventDefault();

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

        const url = baseurl + hit.url;
        const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';

        const formatAlgoliaDateString = (dateString) => {
          const [date, hour, timezone] = dateString.split(' ');
          return `${date}T${hour}${timezone}`;
        };

        const hitDate = new Date(formatAlgoliaDateString(hit.date)).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

        return article + `
          <div class="article-container">
            <div class="article-preview">
              <div class="article-preview__header">
                <h2 class="article-preview__title">
                    <a class="article-preview__title-link" href="${url}">
                    ${hit.title}
                    </a>
                </h2>
              </div>
              <div class="article-preview__metadatas">
                  <time class="article-preview__post-reading">
                      <span class="article-preview__post-date">
                        <i class="far fa-fw fa-calendar-plus"></i> ${hitDate}
                      </span>
                  </time>
              </div>
              <div class="article-preview__excerpt">
                  <p>${hit.excerpt}</p>
              </div>
              <hr class="separator-line" />
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

  searchForm.addEventListener('submit', onQueryChange);
  searchInput.addEventListener('keyup', onQueryChange);
})();
