import arcjet,{tokenBucket, shield, detectBot} from "@arcjet/node";
import "dotenv/config";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({mode:"LIVE"}), //shield blocks requests that are identified as malicious    
    detectBot({mode:"LIVE", allow:["CATEGORY:SEARCH_ENGINE"]}), //detectBot identifies bots and marks them with a bot characteristic
    tokenBucket({mode:"LIVE", capacity:10, interval:10, refillRate:5}) //tokenBucket rate limits requests based on the defined capacity and refill rate
]
});