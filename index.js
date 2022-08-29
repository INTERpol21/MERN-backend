import express from "express";
import mongoose from "mongoose";
import multer from "multer";
//импорт библиотеки для исправления ошибки CORS получения данных с сервера localhost3000 на localhost4000 !!!!
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:123@cluster0.5ehvepf.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

//Создаем хранилище для работы с картинками
const storage = multer.diskStorage({
  //путь для сохранения
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  //перед сохранениям, называем файл
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//создаем использования логики express в формате json
app.use(express.json());
//библиотеки для исправления ошибки CORS получения данных с сервера localhost3000 на localhost4000 !!!!
app.use(cors());
//Показываем express как искать файлы
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
//Регистрация пользователя с ловлей ошибок
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
//функция checkAuth решает, нужно ли проходить дальше, если да, то с помощью next, переходит к (req,res) => ......
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get("/tags", PostController.getLastTags);
app.get("/posts", PostController.getAll); //Запрос на передачу всех статей
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne); //Запрос на передачу одной статьи
//Запрос на создание
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
//Запрос на удаление
app.delete("/posts/:id", checkAuth, PostController.remove);
//Запрос на обновление
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
