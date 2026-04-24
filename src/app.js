import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import authRoutes from "./routes/auth/authRoutes.js";
import { isAuthenticated } from "./middlewares/authMiddleware.js";

dotenv.config();
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirName, "views"));

app.use(express.static(path.join(__dirName, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 jam or 1 hari
    },
  }),
);

app.use("/auth", authRoutes);

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`<h1>Selamat Datang di Dashboard, ${req.user.email}!</h1>
              <p>Role Anda: ${req.user.role}</p>
              <form action="/auth/logout" method="POST">
                  <button type="submit">Logout</button>
              </form>`);
});

app.get("/", (req, res) => {
  res.render("index", { title: "beranda" });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
