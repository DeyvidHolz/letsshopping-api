import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.URL + (process.env.PORT ? ":" + process.env.PORT : "");

test("Should authenticate user", (done) => {
  axios
    .post(`${URL}/api/auth`, { username: "deyvidholz", password: "123456" })
    .then((res) => {
      expect(res.status).toBe(200);
      done();
    });
});
