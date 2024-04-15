'use strict';

function showNotification(data) {
    var notificationOptions = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        tag: data.tag,
        data: data,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        actions: data.actions
    };
    return self.registration.showNotification(data.title, notificationOptions);
}

self.addEventListener('push', function (event) {
    return showNotification({
        body: 'Push message test',
        title: 'Push message title',
        data: {
            link: '/'
        }
    })
});

self.addEventListener('notificationclick', function (event) {
    switch (event.action) {
        case 'close-all-notifications':
            registration.getNotifications().then(function (notifications) {
                notifications.forEach(function (notification) {
                    if (notification.data.domain == event.notification.data.domain) notification.close();
                });
            });
            break;
        default:
            var url = event.notification.data.link;
            var redirect = 0;
            var promise = new Promise(function (event, clients) {
                self.clients.matchAll().then(function (allClients) {
                    allClients.forEach(function (client) {
                        if (client.visibilityState == 'visible' && client.frameType == 'top-level') {
                            redirect = 1;
                            return client.navigate(url);
                        }
                    });
                    if (redirect == 0) {
                        return self.clients.openWindow(url);
                    }
                })
            });
            event.notification.close();
            event.waitUntil(promise);
            break;
    }
});

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
});

self.addEventListener('message', function (event) {
    return showNotification(event.data);
});


