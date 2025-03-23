const jwt = require('jsonwebtoken');
const { User, Role, UserRole } = require('../models');

// JWT 토큰 생성
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// 소셜 로그인 성공 후 처리
const handleSocialLogin = async (req, res) => {
    try {
        const user = req.user;
        const token = generateToken(user);

        // 사용자 역할 정보 조회
        const userWithRoles = await User.findByPk(user.id, {
            include: [{
                model: Role,
                through: UserRole
            }]
        });

        res.json({
            token,
            user: {
                id: userWithRoles.id,
                email: userWithRoles.email,
                name: userWithRoles.name,
                roles: userWithRoles.Roles.map(role => role.name)
            }
        });
    } catch (error) {
        console.error('Social login error:', error);
        res.status(500).json({
            message: '소셜 로그인 처리 중 오류가 발생했습니다.'
        });
    }
};

// 현재 사용자 정보 조회
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: [
                {
                    model: Role,
                    through: UserRole
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.Roles.map(role => role.name)
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            message: '사용자 정보 조회 중 오류가 발생했습니다.'
        });
    }
};

// 로그아웃
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                message: '로그아웃 중 오류가 발생했습니다.'
            });
        }
        res.json({
            message: '로그아웃되었습니다.'
        });
    });
};

module.exports = {
    handleSocialLogin,
    getCurrentUser,
    logout
}; 