const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { validateToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get available services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   is_active:
 *                     type: boolean
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/', validateToken, serviceController.getServices);

/**
 * @swagger
 * /api/services/{serviceId}/request:
 *   post:
 *     summary: Request service access
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
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
 *               - request_reason
 *             properties:
 *               request_reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service access request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [pending, approved, rejected]
 *                 request_reason:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.post('/:serviceId/request', validateToken, serviceController.requestServiceAccess);

/**
 * @swagger
 * /api/services/{serviceId}/request-status:
 *   get:
 *     summary: Get service access request status
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, approved, rejected]
 *                 request_reason:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.get('/:serviceId/request-status', validateToken, serviceController.getRequestStatus);

/**
 * @swagger
 * /api/services/{serviceId}/access:
 *   get:
 *     summary: Check service access permission
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Access permission checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasAccess:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 reason:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/:serviceId/access', validateToken, serviceController.checkServiceAccess);

module.exports = router; 