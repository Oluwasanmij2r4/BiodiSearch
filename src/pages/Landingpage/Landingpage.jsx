import styles from "./landingpage.module.css";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, color } from "framer-motion";
import { image, text } from "motion/react-client";
import image3 from "../../assets/bg-img3.jpg";
import HomeNav from "../../components/Homenav/Homenav";
import Searchbox from "../../components/Searchbox/Searchbox";


const Landingpage = () => {

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1669338301909-ef7424917c38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbGRsaWZlJTIwZWNvc3lzdGVtfGVufDB8fDB8fHww",
      text: "Explore Life on Earth",
      subtitle:
        "Search real-time species data for your next research or school project",
      textClass: styles.text,
      subtitleClass: styles.subtitle,
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1706401147779-4ca3aeb409b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJhY3RlcmlhJTIwdW5kZXIlMjBtaWNyb3Njb3BlfGVufDB8fDB8fHww",
      text: "From Curiosity to Research",
      subtitle: "Discover, save, and cite species using open biodiversity data",
      textClass: styles.text,
    },
    {
      image: image3,
      text: "Biodiversity, Simplified",
      subtitle:
        "Turn your questions into scientific insights with just a few clicks",
      textClass: styles.text,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // change slide every 30 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 10000); // 30 seconds

    return () => clearInterval(interval);
  }, [slides.length]);


  return (
    <div className={styles.carouselContainer}>
      <div className={styles.fixedNav}>
        <HomeNav />
      </div>
      <div className={styles.backgroundContainer}>
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            className={styles.backgroundImage}
            style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className={styles.overlay} />
      </div>

      <div className={styles.contentWrapper}>
        {/* Animated text that changes with each slide */}

        <div className={styles.textContainer}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={`text-${currentIndex}`}
              className={`${styles.heading} ${slides[currentIndex].textClass}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              {slides[currentIndex].text}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`subtitle-${currentIndex}`}
              className={`${styles.subtitle} ${slides[currentIndex].textClass}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {slides[currentIndex].subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        <div>
            <Searchbox />
        </div>

        <p className={styles.formText}>
          Example: "Birds │ Lion │ Agaricus | Mushrooms"
        </p>
      </div>

      {/* Indicators */}
      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.indicatorActive : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Landingpage;
