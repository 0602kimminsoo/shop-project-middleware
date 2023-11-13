//모델
//jwt
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// function authMiddleware

module.exports = async (req, res, next) => {
  console.log("여기는 미들웨어 입니다~");
  const { authorization } = req.headers;
  console.log(req.headers);
  const [authType, authToken] = authorization.split(" ");
  //authType에는 Bearer
  //authToken에는 실제 jwt 값이 들어온다

  console.log(authType, authToken);

  if (authToken !== "Bearer" || !authToken) {
    res.status(400).json({
      errorMessage: "로그인 후 사용이 가능한 API입니다.",
    });
    return;
  }
  //복호화 및 검증
  try {
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    User.findById(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    s;
    res.status(400).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
