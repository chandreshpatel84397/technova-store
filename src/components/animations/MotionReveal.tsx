"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/utils/classNames";

export const premiumEase = [0.22, 1, 0.36, 1] as const;
export const revealViewport = { once: true, amount: 0.2 } as const;

const sectionEnter = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const textEnter = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const imageEnter = {
  hidden: { opacity: 0, scale: 1.06, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const gridEnter = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const gridItemEnter = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const baseTransition = { duration: 0.7, ease: premiumEase } as const;

export const MotionSection = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      transition={{ ...baseTransition, delay }}
      variants={sectionEnter}
      viewport={revealViewport}
    >
      {children}
    </motion.section>
  );
};

export const MotionText = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      transition={{ ...baseTransition, delay }}
      variants={textEnter}
      viewport={revealViewport}
    >
      {children}
    </motion.div>
  );
};

export const MotionImage = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      transition={{ duration: 0.85, ease: premiumEase, delay }}
      variants={imageEnter}
      viewport={revealViewport}
    >
      {children}
    </motion.div>
  );
};

export const MotionGrid = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.06 + delay,
          },
        },
      }}
      viewport={revealViewport}
    >
      {children}
    </motion.div>
  );
};

export const MotionGridItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={reduceMotion ? undefined : gridItemEnter}
    >
      {children}
    </motion.div>
  );
};

export const getStaggerDelay = (index: number, step = 0.08, baseDelay = 0) =>
  baseDelay + index * step;

// Animated skeleton loader
const skeletonEnter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const AnimatedSkeleton = ({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 ${className}`}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      transition={{ duration: 0.6, ease: premiumEase, delay }}
      variants={skeletonEnter}
      viewport={revealViewport}
    />
  );
};

// Container for multiple skeletons
export const SkeletonGroup = ({
  count = 6,
  className = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      variants={gridEnter}
      viewport={revealViewport}
    >
      {Array.from({ length: count }, (_, i) => `skeleton-${i}`).map(
        (key, index) => (
          <motion.div
            key={key}
            variants={reduceMotion ? undefined : gridItemEnter}
          >
            <AnimatedSkeleton
              className="h-96"
              delay={getStaggerDelay(index, 0.08)}
            />
          </motion.div>
        ),
      )}
    </motion.div>
  );
};

// Main container wrapper for page content
export const MotionContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.main
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      transition={baseTransition}
      variants={sectionEnter}
      viewport={revealViewport}
    >
      {children}
    </motion.main>
  );
};
