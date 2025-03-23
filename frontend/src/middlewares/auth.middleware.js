const jwt = require('jsonwebtoken');
const { User, Role, UserRole, AdminRole, UserAdminRole } = require('../models');

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

// Check if user has specific role
const hasRole = (roleName) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.userId, {
                include: [{
                    model: Role,
                    through: UserRole
                }]
            });

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const hasRequiredRole = user.Roles.some(role => role.name === roleName);
            if (!hasRequiredRole) {
                return res.status(403).json({
                    message: `User does not have ${roleName} role`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: 'Error checking user role'
            });
        }
    };
};

// Check if user has admin role
const hasAdminRole = (adminRoleName, serviceId = null, storeId = null) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.userId, {
                include: [{
                    model: AdminRole,
                    through: UserAdminRole,
                    where: {
                        ...(serviceId && { service_id: serviceId }),
                        ...(storeId && { store_id: storeId })
                    }
                }]
            });

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const hasRequiredAdminRole = user.AdminRoles.some(role => role.name === adminRoleName);
            if (!hasRequiredAdminRole) {
                return res.status(403).json({
                    message: `User does not have ${adminRoleName} admin role`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: 'Error checking admin role'
            });
        }
    };
};

// Check if user is verified pharmacist
const isVerifiedPharmacist = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: [{
                model: Role,
                through: UserRole
            }]
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isPharmacist = user.Roles.some(role => role.name === 'PHARMACIST');
        if (!isPharmacist) {
            return res.status(403).json({
                message: 'User is not a pharmacist'
            });
        }

        // Check if pharmacist is verified
        const pharmacist = await user.getPharmacist();
        if (!pharmacist || !pharmacist.is_verified) {
            return res.status(403).json({
                message: 'Pharmacist is not verified'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error checking pharmacist verification'
        });
    }
};

module.exports = {
    verifyToken,
    hasRole,
    hasAdminRole,
    isVerifiedPharmacist
}; 