export const dotDrop = {
  hidden: {
    y: -80,
    opacity: 0,
    scale: 0.3,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
    },
  }),
};



export const cardReveal = {
  hidden: {
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  visible: {
    backgroundColor: "rgba(255,255,255,1)",
    transition: {
      delay: 0.6,
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

