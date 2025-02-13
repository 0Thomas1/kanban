const jwt = require("jsonwebtoken");

const cookieJWTAuth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.MY_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    res.redirect("/");
  }
};

module.exports = cookieJWTAuth;


