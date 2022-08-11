import e from "express";
import jwt from "jsonwebtoken";
//Проверка авторизации 
export default (req, res, next) => {
    
    //парсим токен
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
          //С помощью jwt.verify расшифруем токен и ключ по которому будет расшифровка secret123
            const decoded = jwt.verify(token, "secret123");
            //вытаскиваем и определяем юзера по ID 
            req.userId = decoded._id;
            //Если все нормально выполняем следующую функцию через next()
            next();
        } catch (error) {
            return res.status(403).json({
              message: "Нет доступа",
            });
        }
        
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
};