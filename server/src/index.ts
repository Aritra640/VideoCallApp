import { Server as BunServer } from "bun";
import { Hono } from "hono";
import { Server } from "socket.io";
import { Server as Engine } from "@socket.io/bun-engine";

const io = new Server();
const engine = new Engine({ path: "/socket.io/" });
io.bind(engine);

io.on("connection" , (socket) => {
  console.log("socket.io connected successfully!")
})

const app = new Hono();
app.get("/hello", (c) => c.text("Hello from bun, hono and socket.io"))

//Get the websocket handler for bun 
const { websocket } = engine.handler();

//Export default Bun server config, (no app.listen) bun uses this 
export default {
  port: 8080,
  idleTimeout: 30,

  fetch(req: Request, server: BunServer) {
    const url = new URL(req.url);
    if(url.pathname.startsWith("/socket.io")) {
      //Websocket upgrade and socket.io request go to engine 
      return engine.handleRequest(req , server);
    }else {
      //other http request go to the hono app 
      return app.fetch(req, server);
    }
  },
  websocket
}
