const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
//jsonwebtoken, 줄여서 jwt

mongoose
  .connect("mongodb://127.0.0.1:27017/shopping-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((value) => console.log("MongoDB 연결에 성공하였습니다."))
  .catch((reason) => console.log("MongoDB 연결에 실패하였습니다."));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

const User = require("./models/user.js");

//회원가입란
router.post("/users", async (req, res) => {
  //변수로 불러와야해서 {} 써야하는데 ()으로 불러버려서 오류가 떴다
  const { nickname, email, password, confirmPassword } = req.body;

  // 1. 패스웓, 패스워드 검증 값이 일치하는가 <완료
  // 2. email 에 해당하는 사용자가 있는가
  // 3. nickname에 해당하는 사용자가 있는가 <2&3번 한번에 해결
  // 4. DB에 데이터를 삽입 <기본구조 숙지 ok

  //1번 문항
  // 비번과 재확인란이 동일한지 확인, 틀릴 시 출력하면 안되니까.. 이걸 머라고 정의하지
  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "password와 confirmPassword가 일치하지 않습니다~",
    });
    //return으로 위에서 아래로 흘러가지 않게 한 번 잡아줌
    return;
  }

  //2&3번 문항
  const existUser = await User.findOne({
    //$or은 여기있는 값들 중 하나라도 맞으면 보여준다는 의미
    $or: [{ email: email }, { nickname: nickname }],
    // 그러니 이메일과 닉네임 중 하나라도 중복이 되면 회원가입을 반려시킨다
  });
  if (existUser) {
    res.status(400).json({
      errorMessage: "Email이나 Nickname이 이미 사용 중입니다.",
    });
    return;
  }
  //4번
  //confirmPassword가 들어가지 않는 이유는 password의 검증을 위한거라 제외
  const user = new User({ nickname, email, password });
  await user.save();

  res.status(201).json({});
});

//로그인
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  //유저를 찾는다.어떻게? 일단 이메일로~↓
  const user = await User.findOne({ email });

  // 1.사용자가 존재하지 않거나
  // 2. 입력받은 password와 사용자의 password가 다를 때 에러메세지가 발생
  if (!user || password !== user.password) {
    res.status(400).json({
      errorMessage:
        "사용자가 존재하지 않거나, 사용자의 비밀번호나 입력받은 비밀번호가 일치하지 않습니다~",
    });
    return; //return 을 써서 더이상 아래로 내려가지 않게 멈춰둠
  }

  const token = jwt.sign({ userId: user.userId }, "sparta-secret-key");
  res.status(200).json({
    token: token,
  });
});

const authMiddleware = require("./middlewares/auth-middleware.js");
router.get("/users/me", async (req, res) => {});

// urlencoded을 사용하려고↑바로 위의 코드 만듦
app.use(
  "/api",
  express.urlencoded({ extended: false }),
  authMiddleware,
  router
);
app.use(express.static("assets"));

app.listen(8070, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
