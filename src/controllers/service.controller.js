const { Service, ServiceAccessControl, ServiceMembershipRequest, AccessControlLog } = require('../models');

// 사용 가능한 서비스 목록 조회
const getAvailableServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            where: { is_active: true }
        });

        res.json(services);
    } catch (error) {
        console.error('Get available services error:', error);
        res.status(500).json({
            message: '사용 가능한 서비스 목록 조회 중 오류가 발생했습니다.'
        });
    }
};

// 서비스 접근 요청
const requestServiceAccess = async (req, res) => {
    try {
        const { service_id, request_reason } = req.body;
        const service = await Service.findByPk(service_id);

        if (!service) {
            return res.status(404).json({
                message: '서비스를 찾을 수 없습니다.'
            });
        }

        // 이미 접근 권한이 있는지 확인
        const existingAccess = await ServiceAccessControl.findOne({
            where: {
                user_id: req.userId,
                service_id
            }
        });

        if (existingAccess) {
            return res.status(400).json({
                message: '이미 서비스 접근 권한이 있습니다.'
            });
        }

        // 이미 대기 중인 요청이 있는지 확인
        const existingRequest = await ServiceMembershipRequest.findOne({
            where: {
                user_id: req.userId,
                service_id,
                status: 'pending'
            }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: '이미 서비스 접근 요청이 대기 중입니다.'
            });
        }

        // 서비스 접근 요청 생성
        const request = await ServiceMembershipRequest.create({
            user_id: req.userId,
            service_id,
            request_reason,
            status: 'pending',
            created_by: req.userId
        });

        res.status(201).json({
            message: '서비스 접근 요청이 생성되었습니다.',
            request
        });
    } catch (error) {
        console.error('Request service access error:', error);
        res.status(500).json({
            message: '서비스 접근 요청 중 오류가 발생했습니다.'
        });
    }
};

// 서비스 접근 요청 상태 조회
const getServiceRequestStatus = async (req, res) => {
    try {
        const request = await ServiceMembershipRequest.findOne({
            where: {
                user_id: req.userId,
                service_id: req.params.serviceId
            }
        });

        if (!request) {
            return res.status(404).json({
                message: '서비스 접근 요청을 찾을 수 없습니다.'
            });
        }

        res.json({
            status: request.status,
            request_reason: request.request_reason,
            response_reason: request.response_reason,
            created_at: request.created_at,
            updated_at: request.updated_at
        });
    } catch (error) {
        console.error('Get service request status error:', error);
        res.status(500).json({
            message: '서비스 접근 요청 상태 조회 중 오류가 발생했습니다.'
        });
    }
};

// 서비스 접근 이력 조회
const getServiceAccessLogs = async (req, res) => {
    try {
        const logs = await AccessControlLog.findAll({
            where: {
                user_id: req.userId,
                service_id: req.params.serviceId
            },
            order: [['created_at', 'DESC']]
        });

        res.json(logs);
    } catch (error) {
        console.error('Get service access logs error:', error);
        res.status(500).json({
            message: '서비스 접근 이력 조회 중 오류가 발생했습니다.'
        });
    }
};

// 서비스 접근 권한 확인
const checkServiceAccess = async (req, res) => {
    try {
        const accessControl = await ServiceAccessControl.findOne({
            where: {
                user_id: req.userId,
                service_id: req.params.serviceId
            }
        });

        if (!accessControl) {
            return res.json({
                hasAccess: false,
                message: '서비스 접근 권한이 없습니다.'
            });
        }

        res.json({
            hasAccess: accessControl.is_active,
            message: accessControl.is_active ? '서비스 접근이 가능합니다.' : '서비스 접근이 제한되었습니다.',
            reason: accessControl.reason
        });
    } catch (error) {
        console.error('Check service access error:', error);
        res.status(500).json({
            message: '서비스 접근 권한 확인 중 오류가 발생했습니다.'
        });
    }
};

module.exports = {
    getAvailableServices,
    requestServiceAccess,
    getServiceRequestStatus,
    getServiceAccessLogs,
    checkServiceAccess
}; 