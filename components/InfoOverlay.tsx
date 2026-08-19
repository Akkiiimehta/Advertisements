"use client";

import { motion } from "framer-motion";

interface InfoOverlayProps {
  onClose: () => void;
}

// Placeholder copy — edit freely, this is the only place it lives.
// (About used to live here too but is now its own route: app/about/page.tsx)
export default function InfoOverlay({ onClose }: InfoOverlayProps) {
  return (
    <div className="info-overlay-root" id="contact">
      <motion.div
        className="info-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="info-panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <span aria-hidden>&times;</span>
        </button>
        <span className="info-eyebrow">Contact</span>
        <h2 className="info-heading">Let&rsquo;s make something.</h2>
        <div className="info-body">
          <p>Open to new projects, collaborations.</p>
          <div className="contact-details">
  <a className="contact-email" href="mailto:yashmehtaoffice@gmail.com">
    yashmehtaoffice@gmail.com
  </a>
  <span> · </span>
  <a className="contact-phone" href="tel:+917021291405">
    +91 70212 91405
  </a>
</div>
        </div>
      </motion.div>
    </div>
  );
}
