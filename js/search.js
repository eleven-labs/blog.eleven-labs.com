document.addEventListener("DOMContentLoaded", function(event) {
  var client = algoliasearch('Y0KZQHR2II', 'c640339fddbd925dafa8321e21646e4a');
  var index = client.initIndex('blog_eleven');

  var searchInput = document.getElementById('js-algolia__input');
  searchInput.addEventListener("keyup", onQueryChange);

  function onQueryChange() {
    var contentId = document.getElementById('js-content');
    var contentSearchId = document.getElementById('js-content-search');
    contentId.style.display = 'none';
    contentSearchId.style.display = 'block';

    if (searchInput.value == '') {
      contentId.style.display = 'block';
      contentSearchId.style.display = 'none';
    } else {
      index.search(searchInput.value, function(err, content) {

        var htmlArticle = '';

        Object.keys(content.hits).map(function(key){
          var hit = content.hits[key];

          if (hit.type == 'document') {
            var date = new Date(hit.date);
            date = moment(date).format("MMMM DD, YYYY");

            htmlArticle += '<div class="posts-teaser slice">';
            htmlArticle += '    <div class="container">';
            htmlArticle += '        <h2 class="posts-title">';
            htmlArticle += '            <a class="no-link-style" href="' + hit.url + '">';
            htmlArticle += '                ' + hit.title;
            htmlArticle += '            </a>';
            htmlArticle += '        </h2>';
            htmlArticle += '        <time class="posts-date meta">';
            htmlArticle += '            <span class="meta-content">';
            htmlArticle += '                 ' + date;
            htmlArticle += '            </span>';
            htmlArticle += '        </time>';
            htmlArticle += '        <p class="excerpt">';
            htmlArticle += '            ' + hit.excerpt;
            htmlArticle += '        </p>';
            htmlArticle += '        <a class="button" href="' + hit.url + '">';
            htmlArticle += '            Lire l\'article';
            htmlArticle += '        </a>';
            htmlArticle += '    </div>';
            htmlArticle += '</div>';
          }
        });


        htmlArticle += '<div class="container search-logo">';
        htmlArticle += '   powered by';
        htmlArticle += '   <span class="search-logo-bg"></span>';
        htmlArticle += '</div>';

        contentSearchId.innerHTML = htmlArticle;
      });
    }
  };
});
