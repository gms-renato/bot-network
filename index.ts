import 'dotenv/config'
import Peplink from "./modules/peplink"
const express = require('express')
const app = express()
const router = new Peplink(process.env.PEPLINK_HOST!, process.env.PEPLINK_USER!, process.env.PEPLINK_PASS!)

app.get('/metrics', async (req: any, res: any) => {
    const clients = await router.getClientStatus()
    res.setHeader('content-type', 'text/plain')
    let responses = ""
    for (let client of clients) {
        const name = client.name ? client.name : "";
        responses += `network_download{ip="${client.ip}",name="${name}"} ${client.speed.download}\n`
        responses += `network_upload{ip="${client.ip}",name="${name}"} ${client.speed.upload}\n`
    }
    return res.send(responses)
})
const port = 9091
app.listen(port, () => {
    console.log(`Network metrics app listening on port ${port}`)
})