import UserModel from '../models/user-model.js'
import bcrypt from 'bcrypt';
import tokenService from './token-service.js';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';


class UserService {
    async registration(email, password) {
        // Перевірка, чи існує користувач з таким email
        const candidate = await UserModel.findOne({ email });
        const usersLength = await (await UserModel.find({})).length;
        if (candidate) {
            throw ApiError.BadRequest(`Користувач з такою поштовою скринькою ${email} вже існує`);
        }
        if(usersLength > 14) {
            throw ApiError.BadRequest(`Максимальна кількість користувачів = 14`);
        }
        // Хешування паролю та генерація посилання активації
        const hashPassword = await bcrypt.hash(password, 3);
        // Створення користувача в базі даних і надсилання листа для активації облікового запису
        const user = await UserModel.create({ email, password: hashPassword, registrationDate: Date.now()}); 
        // Створення об'єкта UserDto та генерація токенів
        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({user});
        console.log(tokens);
        // Збереження refreshToken в базі даних
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        // Повернення об'єкта з токенами та даними користувача
        return {...tokens, user: user };
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        user.lastLoginDate = Date.now();
        await user.save();
        if (!user) {
            throw ApiError.BadRequest('Користувач з таким  email не знайден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Невірний пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
    
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async getUserById(id) {
        const user = await UserModel.findById(id);
        return user;
    }

    async updateUser(id, data) {
        const users = await UserModel.findByIdAndUpdate(id, data);
        return users;
    }

    async deleteUser(id) {
        const users = await UserModel.deleteOne({_id: id});
        return users;
    }
}

export default new UserService();