import Order from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";
import {User} from "../models/user.model.js"; 

export const orderData = async (req, res) => {
  try {
    const { paymentId, orderId, courseId, amount, currency } = req.body;

    // ✅ get userId from middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // ✅ fetch email from DB (since middleware doesn't provide it)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = user.email;

    // ✅ check already purchased
    const alreadyPurchased = await Purchase.findOne({ userId, courseId });

    if (alreadyPurchased) {
      return res.status(400).json({
        message: "Course already purchased",
      });
    }

    // ✅ save order
    const orderInfo = await Order.create({
      email,
      userId,
      courseId,
      paymentId,
      orderId,
      amount,
      currency,
    });

    // ✅ save purchase
    await Purchase.create({
      userId,
      courseId,
    });

    res.status(201).json({
      message: "Order saved successfully",
      orderInfo,
    });

  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.status(500).json({
      message: "Error saving order",
    });
  }
};