import express, { Express, Request, Response } from "express";
import { routes } from "./src/Routes/Routes";
import helmet from "helmet";
import { useCors, checkDbConnection, httpLogger } from "./src/middlewares";
import dotenv from "dotenv";
import { initateDB } from "./src/database";

const app: Express = express();
dotenv.config();
initateDB();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'))

app.use(httpLogger());
app.use(helmet());
app.use(useCors());
app.use(checkDbConnection());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
