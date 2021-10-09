import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express(); // express application 생성해줌
const logger = morgan("dev");

const handleHome = (req, res) => {
    return res.send("I love middlewares!");
    // return res.end();
};
const handleLogin = (req, res) => {

    return res.send({message: "Login here"});
}

app.use(logger);
app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening); // 서버에서 어떤 port를 listening할지 말해줘야 함