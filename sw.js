self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Sami's Daily Word";
  const options = {
    body: data.body || "A new word is waiting for you!",
    icon: "/apple-touch-icon.png",
    badge: "/apple-touch-icon.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((list) => {
      for (const client of list) {
        if (client.url === "/" && "focus" in client) return client.focus();
      }
      return clients.openWindow("/");
    })
  );
});
