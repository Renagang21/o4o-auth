const { User, Role, UserRole, Pharmacist } = require('../models');

// 사용자 프로필 조회
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
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
            phone_number: user.phone_number,
            roles: user.Roles.map(role => role.name)
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            message: '사용자 프로필 조회 중 오류가 발생했습니다.'
        });
    }
};

// 사용자 프로필 업데이트
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone_number } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        // 권한 검사: 자신의 프로필만 수정 가능
        if (user.id !== req.userId) {
            return res.status(403).json({
                message: '자신의 프로필만 수정할 수 있습니다.'
            });
        }

        await user.update({ name, phone_number });

        res.json({
            message: '프로필이 업데이트되었습니다.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone_number: user.phone_number
            }
        });
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            message: '프로필 업데이트 중 오류가 발생했습니다.'
        });
    }
};

// 사용자 역할 할당
const assignRole = async (req, res) => {
    try {
        const { roleId } = req.body;
        const user = await User.findByPk(req.params.id);
        const role = await Role.findByPk(roleId);

        if (!user || !role) {
            return res.status(404).json({
                message: '사용자 또는 역할을 찾을 수 없습니다.'
            });
        }

        await UserRole.create({
            user_id: user.id,
            role_id: role.id
        });

        res.json({
            message: '역할이 할당되었습니다.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: role.name
            }
        });
    } catch (error) {
        console.error('Assign role error:', error);
        res.status(500).json({
            message: '역할 할당 중 오류가 발생했습니다.'
        });
    }
};

// 사용자 역할 제거
const removeRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const role = await Role.findByPk(req.params.roleId);

        if (!user || !role) {
            return res.status(404).json({
                message: '사용자 또는 역할을 찾을 수 없습니다.'
            });
        }

        await UserRole.destroy({
            where: {
                user_id: user.id,
                role_id: role.id
            }
        });

        res.json({
            message: '역할이 제거되었습니다.'
        });
    } catch (error) {
        console.error('Remove role error:', error);
        res.status(500).json({
            message: '역할 제거 중 오류가 발생했습니다.'
        });
    }
};

// 약사 등록
const registerPharmacist = async (req, res) => {
    try {
        const { license_number } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: '사용자를 찾을 수 없습니다.'
            });
        }

        // 권한 검사: 자신의 계정만 약사 등록 가능
        if (user.id !== req.userId) {
            return res.status(403).json({
                message: '자신의 계정만 약사 등록이 가능합니다.'
            });
        }

        // 이미 약사로 등록되어 있는지 확인
        const existingPharmacist = await Pharmacist.findOne({
            where: { user_id: user.id }
        });

        if (existingPharmacist) {
            return res.status(400).json({
                message: '이미 약사로 등록되어 있습니다.'
            });
        }

        // 약사 정보 생성
        await Pharmacist.create({
            user_id: user.id,
            license_number
        });

        // PHARMACIST 역할 할당
        const pharmacistRole = await Role.findOne({
            where: { name: 'PHARMACIST' }
        });

        await UserRole.create({
            user_id: user.id,
            role_id: pharmacistRole.id
        });

        res.json({
            message: '약사 등록이 완료되었습니다. 관리자 승인을 기다려주세요.'
        });
    } catch (error) {
        console.error('Register pharmacist error:', error);
        res.status(500).json({
            message: '약사 등록 중 오류가 발생했습니다.'
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    assignRole,
    removeRole,
    registerPharmacist
}; 