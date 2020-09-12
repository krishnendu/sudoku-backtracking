this.addEventListener('install' , e => {
    e.waitUntil(
        caches.open('static').then(cache => {
            return cache.addAll(["./","./global.css","./sudoku.svg"]);
        })
    );
});

this.addEventListener('fetch' , e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
    console.log(`Intercwpting fetch requet for : ${e.request.url}`);
});