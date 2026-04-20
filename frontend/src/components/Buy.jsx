import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Backend_URL } from "../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${Backend_URL}/course/${courseId}`
        );
        setCourse(res.data.course);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load course");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePurchase = async () => {
    if (!token) {
      toast.error("Please login to purchase the course");
      return;
    }

    if (!course) {
      toast.error("Course not loaded");
      return;
    }

    try {
      setLoading(true);


      const { data: order } = await axios.post(
        `${Backend_URL}/payment/create-order`,
        { courseId }
      );

      const options = {
        key: "rzp_test_SbTU3kFbv1m9Lg",
        amount: order.amount,
        currency: "INR",
        name: "EduMart",
        description: "Buy Course",
        order_id: order.id,

        
        handler: async function (response) {
          try {
            await axios.post(
              `${Backend_URL}/order`,
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                courseId,
                amount: course.price,
                currency: "INR",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Course purchased successfully 🎉");
            navigate("/purchases");

          } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Error saving order");
          } finally {
            setLoading(false);
          }
        },

        // ✅ Step 3: Handle Cancel
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">

      {/* Order Details */}
      <div className="bg-gray-200 p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-3">Order Details</h2>

        {course ? (
          <>
            <div className="flex justify-between">
              <span>Course</span>
              <span>{course.title}</span>
            </div>

            <div className="flex justify-between">
              <span>Price</span>
              <span>₹{course.price}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{course.price}</span>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Buy Button */}
      <button
        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-800 duration-300"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}

export default Buy;