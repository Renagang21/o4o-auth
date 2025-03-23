const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const hasAdminRole = req.user.roles.some(role => role.name === 'admin');
    if (!hasAdminRole) {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const isPharmacist = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const hasPharmacistRole = req.user.roles.some(role => role.name === 'pharmacist');
    if (!hasPharmacistRole) {
      return res.status(403).json({ message: '약사 권한이 필요합니다.' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAdmin,
  isPharmacist
}; 