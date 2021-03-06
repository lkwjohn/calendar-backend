let exports = module.exports = {};
const QE_CODE = '#qe';
const STABLE_CODE = '#stable';
const STAGING_CODE = '#staging';
const RC_CODE = '#rc';

exports.PORT = 3001;
exports.WHITELIST_CORS_URLS = ["http://localhost:3000"];
exports.CALENDAR_ID = "primary";
exports.ENV_LIST = [QE_CODE, STABLE_CODE, STAGING_CODE, RC_CODE];