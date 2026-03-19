import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/public/contact", formData);
      toast.success("Message sent! Our team will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Unable to send message right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-74px)] bg-bg-subtle px-4">
      <div className="bg-bg-surface p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-border-subtle transition-all duration-300 hover:shadow-xl">

        <h1 className="text-h1 font-semibold mb-2 text-text-main">
          Contact Us
        </h1>

        <p className="text-text-muted mb-6 text-body">
          We'd love to hear from you! Send us a message and we'll get back to you.
        </p>

        <form onSubmit={onSubmitHandler} className="space-y-5">

          <div className="text-left">
            <label className="block text-sm font-medium text-text-main mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg bg-bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-text-main mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg bg-bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-text-main mb-1">
              Message
            </label>
            <textarea
              rows="4"
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border border-border-subtle rounded-lg bg-bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-body font-semibold text-white shadow-sm transition-all duration-150 hover:scale-[1.02] hover:bg-primary-hover hover:shadow-md active:scale-[0.98]"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ContactPage;