import mongoose from "mongoose";


//Создаем МОДЕЛЬ пользователя 

//Все свойства для пользователя 
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  //Указываем, что при создании пользователя прикручивается дата создания
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);