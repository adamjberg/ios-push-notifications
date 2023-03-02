self.addEventListener("push", async (event) => {
  const { title, body } = await event.data.json();
  console.log(title, body);
  self.registration.showNotification(title, {
    body,
  });
});
