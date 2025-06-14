const CONSTANTS = {
  ACCESS_TOKEN: 'access_token',
  SESSION: {
    // EXPIRATION_TIME: 1000 * 60 * 60 * 24, // 1 day
    EXPIRATION_TIME: 10 * 60 * 1000, // 10 minutes
    REFRESH_TOKEN_EXPIRATION_TIME: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  MESSAGE: {
    SUCCESS: 'Success',
    FAILED: 'Failed',
  },
};

export default CONSTANTS;
