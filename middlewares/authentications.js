const { validateToken } = require('../services/authentications'); // adjust path

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      req.user = null;
      return next(); // exit early if no token
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      console.error("Invalid token:", error.message);
      req.user = null; // fallback to null user
    }

    return next(); // always call next exactly once
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
