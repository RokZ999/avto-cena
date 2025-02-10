import axios from "axios";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "";


export async function fetchCarData(slug: string) {
  try {
    const token = jwt.sign({ user: "test_user" }, JWT_SECRET, { expiresIn: "1h" });

    const response = await axios.get(
      `http://go-backend:4000/carHistory/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching car data:", error);
    return null;
  }
}