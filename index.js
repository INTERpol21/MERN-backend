import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";



import { registerValidation } from "./validations/auth.js";

import UserModel from './models/User.js'

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.tqalqqr.mongodb.net/?retryWrites=true&w=majority"
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

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});

//Отправляем запрос на '/auth/register' проверяем есть ли там registerValidation, если есть то выполняем функцию дальше 
app.post('/auth/register', registerValidation,async (req, res) => {
    //Вытаскиваем все из запроса и передаем все ошибки 
    const errors = validationResult(req);
    //Если все же ошибки есть, то возвращаем ответ 400
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash,
    });

    res.json({
        success: true,
    });
});