import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';

const router = Router();

router.post( '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 5, max: 32 }),
    // body('role').isIn(['USER', 'MANAGER', 'ADMIN']),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.patch('/user/:id', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)
export default router;
