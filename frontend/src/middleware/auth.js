const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: '인증 토큰이 필요합니다.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(401).json({
                message: '유효하지 않은 사용자입니다.'
            });
        }

        req.userId = user.id;
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: '유효하지 않은 토큰입니다.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: '만료된 토큰입니다.'
            });
        }
        next(error);
    }
};

// 역할 기반 접근 제어 미들웨어
const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: '인증이 필요합니다.'
                });
            }

            const userRoles = req.user.Roles.map(role => role.name);
            const hasRole = roles.some(role => userRoles.includes(role));

            if (!hasRole) {
                return res.status(403).json({
                    message: '접근 권한이 없습니다.'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// 약사 권한 확인 미들웨어
const checkPharmacistRole = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: '인증이 필요합니다.'
            });
        }

        const userRoles = req.user.Roles.map(role => role.name);
        const isPharmacist = userRoles.includes('pharmacist');

        if (!isPharmacist) {
            return res.status(403).json({
                message: '약사 권한이 필요합니다.'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

// 관리자 권한 확인 미들웨어
const checkAdminRole = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: '인증이 필요합니다.'
            });
        }

        const userRoles = req.user.Roles.map(role => role.name);
        const isAdmin = userRoles.includes('admin');

        if (!isAdmin) {
            return res.status(403).json({
                message: '관리자 권한이 필요합니다.'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authenticateToken,
    checkRole,
    checkPharmacistRole,
    checkAdminRole
}; 