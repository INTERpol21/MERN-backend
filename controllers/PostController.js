//Создание, удаления, редактирование, получение одной или всех статей
import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        // Получаем статью и обновляем ее 
        PostModel.findOneAndUpdate({
            //находим по параметру 
            _id: postId,
        }, {
            //Что мы хотим обновить. +1
            $inc: { viewsCount: +1 },
        }, {
            //Вернуть обновленный результат 
            returnDocument: 'after',
        },
            //Возвращаем документ или ошибку 
            (error, doc) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        message: "Не удалось вернуть статью",
                    });
                }
                //Если нет ошибки, проверяем есть ли такой документ 
                if (!doc) {
                    return res.status(404).json({
                      message: "Статья не найдена",
                    });
                }
                res.json(doc);
            },
        );

    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      //находится в CheckAuth
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

      PostModel.findOneAndDelete({
          _id: postId,
      }, (error, doc) => {
          if (error) {
              console.log(error);
              return res.status(500).json({
                  message: "Не удалось удалить статью",
              });
          }

          if (!doc) {
              return res.status(404).json({
                  message: "Статья не найдена",
              });
          }
          res.json({
              success: true,
          });
      });
   
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                //Передаем информацию которую хотим обновить
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                //находится в CheckAuth
                user: req.userId,
            },
        );
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось обновить статью",
        });
    }
};