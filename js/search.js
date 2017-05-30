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
            htmlArticle += '<div class="post-teaser"><header><h1><a class="post-link" href="' + hit.url + '">' + hit.title + '</a></h1><p class="meta">' + date + '</p></header><div class="excerpt">' + hit.excerpt + '<a class="button" href="' + hit.url + '">Lire l\'article</a></div></div>';
          }
        });

        contentSearchId.innerHTML = htmlArticle;
      });
    }
  };
});
