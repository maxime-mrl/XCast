const router = require("express").Router();
import { registerUser, loginUser, getUser, deleteUser, updateUser } from "../../controllers/users.controller";
import { protect } from "../../middleware/auth.midleware";

router.get("/infos", protect, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete", protect, deleteUser);
router.put("/update", protect, updateUser);

export default router;
