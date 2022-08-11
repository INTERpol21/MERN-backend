import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import fs from "fs";


import { registerValidation } from "./validations/auth.js";

import UserModel from './models/User.js'

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.tqalqqr.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));





const app = express();
//создаем использования логики express в формате json
app.use(express.json());

// //req то что прислал клиент //res возвращаем клиенту
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });




//Регистрация пользователя с ловлей ошибок  
app.post('/auth/register', registerValidation, async (req, res) =>
{
  //Отправляем запрос на '/auth/register' проверяем есть ли там registerValidation, если есть то выполняем функцию дальше
  try {
    //Вытаскиваем все из запроса и передаем все ошибки
    const errors = validationResult(req);
    //Если все же ошибки есть, то возвращаем ответ 400
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    //шифровка пароля и соль
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    //Сохраняем документ
    const user = await doc.save();

    //Пишем токен и удаление его через 30 дней
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    //С помощью деструктиризации вытаскиваем и не используем хеш пароля
    const { passwordHash, ...userData } = user._doc;

    //вытаскиваем только документ без пароля из БД
    res.json({
      ...userData,
      token,
    });

    //Выдаем 500 ошибку
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось зарегистрироваться",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});