import express from "express";
import { showGuest, updateGuestName } from "../controllers/guest_controller";

export const guestRoutes = express.Router();

guestRoutes.get("/:guestId", showGuest);
guestRoutes.patch("", updateGuestName);
