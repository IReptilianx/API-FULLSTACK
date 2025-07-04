import { Request, Response } from "express";
import ParkingSpot from "../models/ParkingSpot.model";

export const updateParkingSpot = async (req: Request, res: Response) => {
  const { spotId, occupied } = req.body;

  try {
    const spot = await ParkingSpot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    spot.occupied = occupied;
    await spot.save();

    return res.status(200).json({ message: "Parking spot updated successfully" });
  } catch (error) {
    console.error("Error updating parking spot:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
