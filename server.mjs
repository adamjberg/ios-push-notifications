import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

let subscriptionData = null;

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_MAILTO}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

app.get('/send-notification', async (req, res) => {
  try {
    await webpush.sendNotification(subscriptionData, JSON.stringify({
      title: "Hello World",
      body: "Notification sent from backend"
    }));
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
})

app.post("/save-subscription", async (req, res) => {
  subscriptionData = req.body;
  res.sendStatus(200);
});

app.use(express.static("./public"));

app.listen(process.env.PORT || 8000);
