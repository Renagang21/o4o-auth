const { User, Role, UserRole, Pharmacist, Service, ServiceAccessControl, AccessControlLog } = require('../models');

// 모든 사용자 목록 조회
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    through: UserRole
                }
            ]
        });

        res.json(users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            phone_number: user.phone_number,
            roles: user.Roles.map(role => role.name)
        })));
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            message: '사용자 목록 조회 중 오류가 발생했습니다.'
        });
    }
};

// 약사 인증 대기 목록 조회
const getPendingPharmacists = async (req, res) => {
    try {
        const pendingPharmacists = await Pharmacist.findAll({
            where: { is_verified: false },
            include: [{
                model: User,
                attributes: ['id', 'email', 'name', 'phone_number']
            }]
        });

        res.json(pendingPharmacists.map(pharmacist => ({
            id: pharmacist.id,
            license_number: pharmacist.license_number,
            user: pharmacist.User
        })));
    } catch (error) {
        console.error('Get pending pharmacists error:', error);
        res.status(500).json({
            message: '약사 인증 대기 목록 조회 중 오류가 발생했습니다.'
        });
    }
};

// 약사 인증 처리
const verifyPharmacist = async (req, res) => {
    try {
        const pharmacist = await Pharmacist.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['id', 'email', 'name']
            }]
        });

        if (!pharmacist) {
            return res.status(404).json({
                message: '약사 정보를 찾을 수 없습니다.'
            });
        }

        await pharmacist.update({
            is_verified: true,
            verification_date: new Date()
        });

        res.json({
            message: '약사 인증이 완료되었습니다.',
            pharmacist: {
                id: pharmacist.id,
                license_number: pharmacist.license_number,
                user: pharmacist.User
            }
        });
    } catch (error) {
        console.error('Verify pharmacist error:', error);
        res.status(500).json({
            message: '약사 인증 처리 중 오류가 발생했습니다.'
        });
    }
};

// 서비스 목록 조회
const getServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            message: '서비스 목록 조회 중 오류가 발생했습니다.'
        });
    }
};

// 새 서비스 생성
const createService = async (req, res) => {
    try {
        const { name, description } = req.body;
        const service = await Service.create({
            name,
            description,
            is_active: true
        });

        res.status(201).json({
            message: '서비스가 생성되었습니다.',
            service
        });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            message: '서비스 생성 중 오류가 발생했습니다.'
        });
    }
};

// 서비스 정보 업데이트
const updateService = async (req, res) => {
    try {
        const { name, description, is_active } = req.body;
        const service = await Service.findByPk(req.params.id);

        if (!service) {
            return res.status(404).json({
                message: '서비스를 찾을 수 없습니다.'
            });
        }

        await service.update({
            name,
            description,
            is_active
        });

        res.json({
            message: '서비스 정보가 업데이트되었습니다.',
            service
        });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({
            message: '서비스 정보 업데이트 중 오류가 발생했습니다.'
        });
    }
};

// 서비스 접근 권한 관리
const manageServiceAccess = async (req, res) => {
    try {
        const { user_id, service_id, is_active, reason } = req.body;
        const user = await User.findByPk(user_id);
        const service = await Service.findByPk(service_id);

        if (!user || !service) {
            return res.status(404).json({
                message: '사용자 또는 서비스를 찾을 수 없습니다.'
            });
        }

        // 서비스 접근 제어 정보 생성 또는 업데이트
        const [accessControl, created] = await ServiceAccessControl.findOrCreate({
            where: {
                user_id,
                service_id
            },
            defaults: {
                is_active,
                reason,
                created_by: req.userId
            }
        });

        if (!created) {
            await accessControl.update({
                is_active,
                reason
            });
        }

        // 접근 제어 이력 기록
        await AccessControlLog.create({
            user_id,
            service_id,
            action: is_active ? 'grant' : 'revoke',
            reason,
            created_by: req.userId
        });

        res.json({
            message: '서비스 접근 권한이 업데이트되었습니다.',
            accessControl
        });
    } catch (error) {
        console.error('Manage service access error:', error);
        res.status(500).json({
            message: '서비스 접근 권한 관리 중 오류가 발생했습니다.'
        });
    }
};

module.exports = {
    getAllUsers,
    getPendingPharmacists,
    verifyPharmacist,
    getServices,
    createService,
    updateService,
    manageServiceAccess
}; 