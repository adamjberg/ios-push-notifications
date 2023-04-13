function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function run() {
  // A service worker must be registered in order to send notifications on iOS
  const registration = await navigator.serviceWorker.register(
    "serviceworker.js",
    {
      scope: "./",
    }
  );

  const button = document.getElementById("subscribe");
  button.addEventListener("click", async () => {
    // Triggers popup to request access to send notifications
    const result = await window.Notification.requestPermission();

    // If the user rejects the permission result will be "denied"
    if (result === "granted") {
      const subscription = await registration.pushManager.subscribe({
        applicationServerKey: urlBase64ToUint8Array(
          "[[INSERT YOUR PUBLIC VAPID KEY HERE]]"
        ),
        userVisibleOnly: true,
      });

      await fetch("/save-subscription", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
    }
  });
}

run();
