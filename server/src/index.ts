import { Hono } from 'hono'
import { parseBody } from 'hono/utils/body';
import { Server } from "socket.io"

const app = new Hono();
const io = new Server();

app.use(parseBody);

app.get('/hello' , (c) => c.text("Hello World"))

//start the server 
Bun.serve({
  fetch(req) {
    return app.fetch(req)
  },
  port: 8080,
});

io.listen(8081);
