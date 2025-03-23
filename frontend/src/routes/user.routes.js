const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', validateToken, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', validateToken, userController.updateProfile);

/**
 * @swagger
 * /api/users/pharmacist:
 *   post:
 *     summary: Register as pharmacist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - license_number
 *               - pharmacy_name
 *               - pharmacy_address
 *             properties:
 *               license_number:
 *                 type: string
 *               pharmacy_name:
 *                 type: string
 *               pharmacy_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pharmacist registration successful
 *       401:
 *         description: Unauthorized
 */
router.post('/pharmacist', validateToken, userController.registerPharmacist);

/**
 * @swagger
 * /api/users/{userId}/roles:
 *   post:
 *     summary: Assign role to user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *             properties:
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post('/:userId/roles', validateToken, isAdmin, userController.assignRole);

/**
 * @swagger
 * /api/users/{userId}/roles/{roleId}:
 *   delete:
 *     summary: Remove role from user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.delete('/:userId/roles/:roleId', validateToken, isAdmin, userController.removeRole);

module.exports = router; 