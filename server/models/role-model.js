// Імпортуємо необхідні об'єкти з бібліотеки mongoose
import { Schema, model } from 'mongoose';

// Створюємо схему користувача (userSchema) за допомогою mongoose Schema
const Role = new Schema({
    value: {type: String, unique: true, default: 'USER'}
});

// Експортуємо модель 'User', побудовану на основі створеної схеми
export default model('Role', Role);
