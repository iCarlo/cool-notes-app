import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from "morgan";
import notesRoutes from './routes/notes';
import usersRoutes from './routes/users';
import createHttpError, { isHttpError } from 'http-errors';
import session from "express-session";
import env from "./utils/validateEnv";
import MongoStore from 'connect-mongo';
import { requiresAuth } from './middleware/auth';

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "PUT", "PATCH", "GET", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
}))
app.use(express.json())

app.use(session({
  secret: env.SESSION_KEY,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: env.MONGO_URI,
  })
}))

app.use(morgan("dev"));

app.use("/api/notes", requiresAuth, notesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  let errMsg = "Unknown error occurred";
  let statusCode = 500;
  if (isHttpError(err)) {
    statusCode = err.status;
    errMsg = err.message;
  }

  res.status(statusCode).json({ error: errMsg });
})

export default app;