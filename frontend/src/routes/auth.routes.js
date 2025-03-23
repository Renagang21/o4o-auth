const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Generate JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/token', authController.generateToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
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
router.get('/me', validateToken, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', validateToken, authController.logout);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login page
 */
router.get('/google', authController.googleLogin);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Google login failed
 */
router.get('/google/callback', authController.googleCallback);

/**
 * @swagger
 * /api/auth/kakao:
 *   get:
 *     summary: Kakao OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Kakao login page
 */
router.get('/kakao', authController.kakaoLogin);

/**
 * @swagger
 * /api/auth/kakao/callback:
 *   get:
 *     summary: Kakao OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Kakao login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Kakao login failed
 */
router.get('/kakao/callback', authController.kakaoCallback);

/**
 * @swagger
 * /api/auth/naver:
 *   get:
 *     summary: Naver OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Naver login page
 */
router.get('/naver', authController.naverLogin);

/**
 * @swagger
 * /api/auth/naver/callback:
 *   get:
 *     summary: Naver OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Naver login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         description: Naver login failed
 */
router.get('/naver/callback', authController.naverCallback);

module.exports = router; 