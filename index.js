import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import multer from "multer";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import {UserController,PostController} from "./controllers/index.js";




mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.tqalqqr.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));



const app = express();
//создаем использования логики express в формате json
app.use(express.json());
//Показываем express как искать файлы
app.use('/uploads', express.static('uploads'))

//Создаем хранилище для работы с картинками 
const storage = multer.diskStorage({
    //путь для сохранения 
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    //перед сохранениям, называем файл
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });



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
app.get('/auth/me', checkAuth, UserController.getMe);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`,
    });
});

app.get("/posts", PostController.getAll); //Запрос на передачу всех статей
app.get("/posts/:id", PostController.getOne); //Запрос на передачу одной статьи
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
); //Запрос на создание
app.delete("/posts/:id", checkAuth, PostController.remove); //Запрос на удаление
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
); //Запрос на обновление


app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});

