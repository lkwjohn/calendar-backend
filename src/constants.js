let exports = module.exports = {};
const QE_CODE = '#qe';
const STABLE_CODE = '#stable';
const STAGING_CODE = '#staging';

exports.WHITELIST_CORS_URLS = ["http://localhost:3000"];
exports.CALENDAR_ID = "primary";
exports.ENV_LIST = [QE_CODE, STABLE_CODE, STAGING_CODE];