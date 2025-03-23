const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { validateToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/users', validateToken, isAdmin, adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/pharmacists/pending:
 *   get:
 *     summary: Get pending pharmacist verifications
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending pharmacists retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   license_number:
 *                     type: string
 *                   pharmacy_name:
 *                     type: string
 *                   pharmacy_address:
 *                     type: string
 *                   is_verified:
 *                     type: boolean
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/pharmacists/pending', validateToken, isAdmin, adminController.getPendingPharmacists);

/**
 * @swagger
 * /api/admin/pharmacists/{pharmacistId}/verify:
 *   put:
 *     summary: Verify pharmacist
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pharmacistId
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
 *               - is_verified
 *             properties:
 *               is_verified:
 *                 type: boolean
 *               verification_note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pharmacist verification updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.put('/pharmacists/:pharmacistId/verify', validateToken, isAdmin, adminController.verifyPharmacist);

/**
 * @swagger
 * /api/admin/services:
 *   get:
 *     summary: Get all services
 *     tags: [Admin]
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
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/services', validateToken, isAdmin, adminController.getServices);

/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     summary: Create new service
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Service created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post('/services', validateToken, isAdmin, adminController.createService);

/**
 * @swagger
 * /api/admin/services/{serviceId}:
 *   put:
 *     summary: Update service
 *     tags: [Admin]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.put('/services/:serviceId', validateToken, isAdmin, adminController.updateService);

/**
 * @swagger
 * /api/admin/services/{serviceId}/access:
 *   post:
 *     summary: Manage service access
 *     tags: [Admin]
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
 *               - user_id
 *               - is_active
 *             properties:
 *               user_id:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service access updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post('/services/:serviceId/access', validateToken, isAdmin, adminController.manageServiceAccess);

module.exports = router; 