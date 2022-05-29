const NodeCache = require("node-cache");
import * as superagent from "superagent";
import {
  StatusClientInterface,
  TrafficBandwidthWanInterface,
} from "./interfaces";
const qs = require("qs");

class Peplink {
  private _baseUrl;
  private _user;
  private _pass;
  private myCache: any;
  private async getCookie(): Promise<string> {
    let _tempCookie = this.myCache.get("cookie");
    if (!_tempCookie) {
      _tempCookie = await this.login();
    }
    return _tempCookie;
  }
  public async login(): Promise<string> {
    const url = `${this._baseUrl}/login`;
    const rawResult = await superagent
      .post(url)
      .send({
        username: this._user,
        password: this._pass,
      })
      .set("Content-Type", "application/x-www-form-urlencoded");
    const cookieResult: string = rawResult.headers["set-cookie"][0];
    this.myCache.set("cookie", cookieResult);
    return cookieResult;
  }
  public async getWanStatus(): Promise<TrafficBandwidthWanInterface[]> {
    const cookie = await this.getCookie();
    console.log("Cookie", cookie);
    const url = `${this._baseUrl}/status.traffic`;
    const payload = {
      fetch_delay: 1,
    };
    const rawResult = await superagent
      .get(url)
      .query(payload)
      .set("Cookie", cookie)
      .withCredentials();
    const result = rawResult.body.response.bandwidth;
    const ids = result.order; // ambil daftar WAN
    const wanObjects: TrafficBandwidthWanInterface[] = [];
    for (let id of ids) {
      wanObjects.push(result[id]);
    }
    return wanObjects;
  }
  public async getClientStatus(): Promise<StatusClientInterface[]> {
    const cookie = await this.getCookie();
    console.log("Cookie", cookie);
    const url = `${this._baseUrl}/status.client`;
    const payload = {
      outputWeight: "full",
      activeOnly: "yes",
    };
    const rawResult = await superagent
      .get(url)
      .query(payload)
      .set("Cookie", cookie)
      .withCredentials();
    const result = rawResult.body.response.list;
    return result;
  }
  constructor(host: string, user: string, pass: string) {
    this._baseUrl = host + "/api";
    this._user = user;
    this._pass = pass;
    this.myCache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 60 * 40 });
  }
}

export default Peplink;
