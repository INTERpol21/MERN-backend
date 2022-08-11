import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
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

    //Генерируем токен и удаление его через 30 дней
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
};

export const login = async (req, res) => {
  try {
    //Ищем зарегистрированного пользователя в БД
    const user = await UserModel.findOne({ email: req.body.email });
    //Если пользователь отсутствует, то выдаем ошибку 404
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    //генерируем токен
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
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: " Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Нет доступа",
    });
  }
};
