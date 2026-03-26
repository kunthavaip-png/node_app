const { createClient } = require("redis");

//const client = createClient();
const client = createClient({
  url: "redis://default:ORzaZxEnwV4fS5cpkXtSeylyo4ey6WaM@redis-16534.crce295.us-east-1-1.ec2.cloud.redislabs.com:16534"
});
client.on("error", (err) => {
  console.log("Redis Error:", err);
});

(async () => {
  await client.connect();
})();

module.exports = client;