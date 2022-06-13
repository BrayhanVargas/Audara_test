require("dotenv").config();
const http = require("http");
const { pingDatabase } = require("./helpers/serverTools");
const app = require("./server");
const server = http.createServer(app);
const PORT = process.env.PORT || 8443;

server.listen(PORT, async () => {
  try {
    const result = await pingDatabase();
    result &&
      console.log(
        "Connection has been established successfully. Server is running on port: " +
          PORT
      );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
