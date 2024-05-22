import UserService from '../service/user-service.js'
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api-error.js';
import tokenService from '../service/token-service.js';

const sevenDays = 7 * 24 * 60 * 60 * 1000;
class UserController {
    // Метод для реєстрації користувача
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка при валідації', errors.array()))
            }
            const { email, password } = req.body;
            const userData = await UserService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    // Метод для авторизації користувача
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: sevenDays, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    // Метод для виходу користувача з системи
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    // Метод для оновлення токена (refreshToken)
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: sevenDays, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    // Метод для отримання списку всіх користувачів
    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    // Метод для update user
    async updateUser(req, res, next) {
        const userData = tokenService.validateAccessToken(req.headers['authorization'].split(' ')[1]);
        try {
            const getUserById = await UserService.getUserById(userData.id);
            if (getUserById.role !== 'admin' && userData.role !== 'manager') {
                return res.status(423).json({ message: 'Недостатньо прав для виконання цієї' })
            } else {
                const users = await UserService.updateUser(req.params.id, req.body);
                return res.json(users);
            }
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
    async deleteUser(req, res, next) {
        const userData = tokenService.validateAccessToken(req.headers['authorization'].split(' ')[1]);
        try {
            const getUserById = await UserService.getUserById(userData.id);
            if (getUserById.role !== 'admin') {
                return res.status(423).json({ message: 'Недостатньо прав для виконання цієї дії' })
            } else {

                const users = await UserService.deleteUser(req.params.id);
                return res.json(users);
            }
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}


export default new UserController();
