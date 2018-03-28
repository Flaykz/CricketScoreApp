var css = document.createElement('link');
css.rel = 'stylesheet';
css.href = '/styles/style.css';
css.type = 'text/css';
var link = document.getElementsByTagName('link')[0];
link.parentNode.insertBefore(css, link);

var css2 = document.createElement('link');
css2.rel = 'stylesheet';
css2.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
css2.type = 'text/css';
var link2 = document.getElementsByTagName('link')[0];
link2.parentNode.insertBefore(css2, link2);

if (navigator.vendor ==  "Apple Computer, Inc.") {
    document.getElementsByClassName('colour-choice').style.display = "none";
    document.getElementsByClassName('colour-ihm').style.display = "none";
}

if('serviceWorker' in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register('/sw.js').then(function(registration) { 
            console.log("Service Worker Registered with scope: ", registration.scope);
            registration.onupdatefound = function () {
                var instalingWorker = registration.installing;
                instalingWorker.onstatechange = function () {
                    switch (instalingWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                window.showToast('New content available, reload the page to get it', 2);
                            } else {
                                window.showToast('Content is now available offline !', 2);
                            }
                        case 'redundant':
                            console.error('The installing service worker became redundant.');
                            break;
                    }
                };
            };
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
        function updateOnlineStatus(event) {
            if (navigator.onLine) {
                window.showToast('You are online', 1);
            } else {
                window.showToast('You are offline', 1);
            }
        }
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    });
} else {
    //   window.showToast("Your browser doesn't support Service Worker", 0);
    window.showToast("Your browser sucks, get a real one like chrome !", 0);
    if ('applicationCache' in window) {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'views/load-appcache.html';
        document.body.appendChild(iframe);
        //Check if a new cache is available on page load.
        window.addEventListener('load', function( ) {
            window.applicationCache.addEventListener('updateready', function( ) {
                if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                    window.applicationCache.swapCache();
                    window.location.reload( true );
                } else {
                    // Manifest didn't changed. Nothing new to server.
                }
            }, false);
        }, false);
    }
}