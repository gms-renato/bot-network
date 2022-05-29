import "dotenv/config";
import { TrafficBandwidthWanOverallInterface } from "./modules/interfaces";
import Peplink from "./modules/peplink";
const express = require("express");
const app = express();
const router = new Peplink(
  process.env.PEPLINK_HOST!,
  process.env.PEPLINK_USER!,
  process.env.PEPLINK_PASS!
);

app.get("/metrics", async (req: any, res: any) => {
  const clients = await router.getWanStatus();
  res.setHeader("content-type", "text/plain");
  let responses = "";
  for (let client of clients) {
    // overall
    responses += `wan_download{name="${client.name}"} ${client.overall.down}\n`;
    responses += `wan_upload{name="${client.name}"} ${client.overall.up}\n`;
    // details
    const keys = Object.keys(client.details);
    for (let key of keys) {
      const value: TrafficBandwidthWanOverallInterface = client.details[key];
      responses += `wan_download_details{name="${client.name}",type="${key}"} ${value.down}\n`;
      responses += `wan_upload_details{name="${client.name}",type="${key}"} ${value.up}\n`;
    }
  }
  return res.send(responses);
});
const port = 9092;
app.listen(port, () => {
  console.log(`Network metrics app listening on port ${port}`);
});
