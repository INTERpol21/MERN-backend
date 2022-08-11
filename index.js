import express from "express";
import mongoose from "mongoose";
import fs from "fs";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import checkAuth from './utils/checkAuth.js';


import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";


mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.tqalqqr.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));



const app = express();
//создаем использования логики express в формате json
app.use(express.json());


app.post("/auth/login",loginValidation, UserController.login);
//Регистрация пользователя с ловлей ошибок  
app.post('/auth/register', registerValidation, UserController.register);
//функция checkAuth решает, нужно ли проходить дальше, если да, то с помощью next, переходит к (req,res) => ......
app.get('/auth/me', checkAuth, UserController.getMe);

// app.get("/posts", checkAuth, PostController.getAll); //Запрос на передачу всех статей
// app.get("/posts/:id", checkAuth, PostController.getOne); //Запрос на передачу одной статьи
app.post("/posts", checkAuth, postCreateValidation, PostController.create); //Запрос на создание
// app.delete("/posts", checkAuth, PostController.remove); //Запрос на удаление
// app.patch("/posts", checkAuth, PostController.update); //Запрос на обновление


app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});

