import express, { type Request, type Response } from "express";
import cors from "cors";
import { z } from "zod";
import db from "./db.js";

const ticketSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  ticketType: z.enum(["pista", "vip", "camarote"]),
  quantity: z.number().int().min(1).max(10),
  eventDate: z.iso.date(),
  session: z.enum(["manha", "tarde", "noite"]),
  terms: z.literal(true),
});

const loginSchema = z.object({
  user_email: z.email(),
  user_pass: z.string().min(1),
});

const signupSchema = z.object({
  user_name: z.string().min(1),
  user_email: z.email(),
  user_birthday: z.iso.date(),
  user_pass: z.string().min(6),
});

const app = express();
const PORT = 9999;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login-info", (req: Request, res: Response) => {
  console.log("--- POST /login (form urlencoded) ---");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body recebido:", req.body);

  res.json({
    origem: "formulário HTML (x-www-form-urlencoded)",
    contentType: req.headers["content-type"],
    dados: { ...req.body },
  });
});

app.get("/", (_req: Request, res: Response) => {
  const users = db
    .prepare("SELECT user_name, createdAt FROM users ORDER BY createdAt DESC")
    .all();
  res.json(users);
});

app.post("/login", (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }

  const { user_email, user_pass } = parsed.data;

  const user = db
    .prepare(
      "SELECT id, user_name, user_email, user_birthday, createdAt FROM users WHERE user_email = ? AND user_pass = ?",
    )
    .get(user_email, user_pass);

  if (!user) {
    res.status(401).json({ error: "E-mail ou senha inválidos" });
    return;
  }

  res.json(user);
});

app.post("/forgot", (req: Request, res: Response) => {
  const parsed = z.object({ user_email: z.email() }).safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }

  const user = db
    .prepare("SELECT user_email, user_pass FROM users WHERE user_email = ?")
    .get(parsed.data.user_email);

  if (!user) {
    res.status(404).json({ error: "E-mail não encontrado" });
    return;
  }

  res.json(user);
});

app.post("/signup", (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }

  const { user_name, user_email, user_birthday, user_pass } = parsed.data;

  const existing = db
    .prepare("SELECT id FROM users WHERE user_email = ?")
    .get(user_email);

  if (existing) {
    res.status(409).json({ error: "E-mail já cadastrado" });
    return;
  }

  const stmt = db.prepare(`
    INSERT INTO users (user_name, user_email, user_birthday, user_pass)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(user_name, user_email, user_birthday, user_pass);

  const user = db
    .prepare(
      "SELECT id, user_name, user_email, user_birthday, createdAt FROM users WHERE id = ?",
    )
    .get(result.lastInsertRowid);

  res.status(201).json(user);
});

app.post("/tickets", (req: Request, res: Response) => {
  const parsed = ticketSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.issues });
    return;
  }

  const { name, email, ticketType, quantity, eventDate, session, terms } =
    parsed.data;

  const stmt = db.prepare(`
    INSERT INTO tickets (name, email, ticketType, quantity, eventDate, session, terms)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name,
    email,
    ticketType,
    quantity,
    eventDate,
    session,
    terms ? 1 : 0,
  );

  const ticket = db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(ticket);
});

app.get("/tickets", (_req: Request, res: Response) => {
  const tickets = db
    .prepare("SELECT * FROM tickets ORDER BY eventDate, session, ticketType")
    .all();
  res.json(tickets);
});

const server = app.listen(PORT, () => {
  const addr = server.address();
  const realPort = typeof addr === "object" && addr ? addr.port : PORT;
  console.log(`Servidor rodando em http://localhost:${realPort}`);
});
