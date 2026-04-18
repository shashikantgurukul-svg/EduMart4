import Razorpay from "razorpay";
import {Course} from "../models/course.model.js";

const razorpay = new Razorpay({
  key_id: "rzp_test_SbTU3kFbv1m9Lg",
  key_secret: "SuPlSKFZs5ez2BNNIqiCVd1e",
});

export const createOrder = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 ADD THIS

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "CourseId missing" });
    }

    const course = await Course.findById(courseId);

    console.log("COURSE:", course); // 👈 ADD THIS

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.log("RAZORPAY ERROR:", error); // 👈 VERY IMPORTANT
    res.status(500).json({ message: "Error creating order" });
  }
};
