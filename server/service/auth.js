const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

function setUser(user) {
  const payload = { ...user };
  return jwt.sign(payload, secret_key);
}

function getUser(token) {
  if (!token) return null;
  try {
    const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
    return verifiedUser._doc;
  } catch (error) {
    return null;
  }
}

function setAuthorization(user, allowedRoles) {
  if (!user || !Array.isArray(user.roles)) {
    return 401;
  }

  const isAuthorized = user.roles.some(role =>
    allowedRoles.includes(role)
  );

  if (!isAuthorized) {
    return 401;
  }

  return 0; // authorized
}


module.exports = {
  setUser,
  getUser,
  setAuthorization,
};
