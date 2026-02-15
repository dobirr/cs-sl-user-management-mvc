import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// USER ROUTES

/**
 * @route GET /users/new
 * @desc Show form to create a new user
 * @access Public
 */
router.get('/new', userController.renderCreateForm);

/**
 * @route POST /users
 * @desc Handle form submission to create a new user
 * @access Public
 */
router.post('/', userController.createUser);

/**
 * @route GET /users
 * @desc List all users
 * @access Public
 */
router.get('/', userController.listUsers);

/**
 * @route GET /users/edit/:id
 * @desc Show form to edit an existing user
 * @access Public
 */
router.get('/edit/:id', userController.renderEditForm);

/**
 * @route POST /users/edit/:id
 * @desc Handle form submission to update an existing user
 * @access Public
 */
router.post('/edit/:id', userController.updateUser);


/**
 * @route POST /users/delete/:id
 * @desc Handle request to delete a user
 * @access Public
 */
router.post('/delete/:id', userController.deleteUser);

export default router;
