import { Application } from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import "https://deno.land/x/denv/mod.ts";
import {
  fetchAllDeliverers,
  createDeliverer,
  fetchOneDeliverer,
  updateDeliverer,
  deleteDeliverer,
} from "./controllers/deliverers.ts";
import { ErrorMiddleware } from "./utils/middlewares.ts";

const app = new Application();

app.use(ErrorMiddleware);

app.get("/deliverers", fetchAllDeliverers)
  .post("/deliverers", createDeliverer)
  .get("/deliverers/:id", fetchOneDeliverer)
  .put("/deliverers/:id", updateDeliverer)
  .delete("/deliverers/:id", deleteDeliverer)
  .start({ port: 5000 });

console.log(`server listening on http://localhost:5000`);