import React from "react";

function Contact() {
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h2>Contact Us</h2>
      <form className="form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="4" required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Contact;
