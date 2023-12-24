import { Router } from "express";

const router = Router();

router.use("/users", (request, response) => {
  return response.json({ message: "Hello World" });
});

export { router };
