import { validationResult } from "express-validator";

export default (req, res, next) => {
  //Вытаскиваем все из запроса и передаем все ошибки
  const errors = validationResult(req);
  //Если все же ошибки есть, то возвращаем ответ 400
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
    }
    
    next();
}