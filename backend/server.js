import express, { request } from "express";
import helmet from "helmet"; //helmet is a security middleware that help protect by setting http headers
import morgan from "morgan"; //logs the requests
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, //each request counts as 1 request
    });
    if (decision.isDenied) {
      if (decision.isRateLimit()) {
        res
          .status(429)
          .json({ message: "Too many requests - Rate limit exceeded" });
      } else if (decision.isBot()) {
        res
          .status(403)
          .json({ message: "Access denied - Bots are not allowed" });
      } else {
        res
          .status(403)
          .json({ message: "Access denied - Suspicious activity detected" });
      }
      return;
    }

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.IsSpoofed
      )
    ) {
      res
        .status(403)
        .json({ message: "Access denied - Spoofed bot activity detected" });
      return;
    }
    next();
  } catch (error) {
    console.log("the error is :", error);
    res.status(500).json({ message: "server error" });
    next(error);
  }
});
app.use("/api/products", productRoutes);

async function initDB() {
  try {
    await sql`
        create table if not exists products(
        id serial primary key,
        name varchar(255) not null,
        image varchar(255) not null,
        price decimal(10,2) not null,
        created_at timestamp default current_timestamp
        )
        `;
    console.log("db initialised");
  } catch (error) {
    console.log(error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("server runnning on port " + PORT);
  });
});
