---
layout: compress-js
---
(function() {
  'use strict';

  const CACHE_NAME_PREFIX = '{{ site.title | slugify }}-cache-';
  const CACHE_NAME = `${CACHE_NAME_PREFIX}{{ site.time | date: "%s" }}`;

  const filesToCache = [
    {% for page in site.pages %}
    {% if page.url != '/sw.js' %}'{{ page.url | relative_url }}',{% endif %}
    {% endfor %}

    {% for post in site.posts %}
    '{{ post.url | relative_url }}',
    {% endfor %}

    {% for file in site.static_files %}
    '{{ file.path | relative_url }}',
    {% endfor %}
  ];

  self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches
      .open(CACHE_NAME)
      .then(cache => Promise.all(filesToCache.map(file => cache.add(file))))
    );
  });

  self.addEventListener('activate', (e) => {
    e.waitUntil(caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames
        .filter(cacheName => cacheName.startsWith(CACHE_NAME_PREFIX) && cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
      ))
    );
  });

  // Network falling back to the cache strategy
  self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request)
      .catch(() => caches.match(e.request))
    );
  });
})();
