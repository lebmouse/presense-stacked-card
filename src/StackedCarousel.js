import React, { useState } from "react";
import styled from "styled-components";
import { layout, color } from "styled-system";
import { AnimateSharedLayout, motion, AnimatePresence } from "framer-motion";
import { range } from "lodash-es";
import { wrap } from "popmotion";
const src1 =
  "http://dejou.co.kr/web/product/medium/201811/303f4886684a5cfb99f9efe06ebcd2ad.gif";
const src2 =
  "http://dailyjou.com/web/product/medium/202009/dad92926ed326872165e983b3e847037.jpg";
const src3 =
  "https://cf.product.s.naunau.jp/product-images/origin-images/17791/3489-20201122-085722551-1.jpeg?size=450";
const src4 =
  "https://cf.product.s.naunau.jp/product-images/origin-images/16783/3168-20201110-102308236-0.jpeg?size=450";
const src5 =
  "https://cf.product.s.naunau.jp/product-images/origin-images/20733/4482-20201228-140234334-1.jpeg?size=450";

const srcs = [src1, src2, src3, src4, src5];
// const srcs = [src1, src2, src3];
const flyMove = 500;

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default function StackedCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    const nextPage = wrap(0, srcs.length, page + newDirection);
    setPage([nextPage, newDirection]);
  };

  console.log(page, direction);
  return (
    <Cotainer height="600px" bg="#374045">
      <AnimatePresence initial={false} custom={direction}>
        <Pannel
          key={page}
          drag="x"
          dragConstraints={{ right: 0, top: 0, left: 0, bottom: 0 }}
          dragElastic={0.5}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <Card>
            <CardImg src={srcs[page]} draggable={false} alt="card" />
          </Card>
        </Pannel>
      </AnimatePresence>
      {/* <AnimateSharedLayout type="switch">
        {range(1, 3).map((index) => {
          // console.log(page, index);
          return (
            <Pannel
              // custom={direction}
              dragConstraints={{ right: 0, top: 0, left: 0, bottom: 0 }}
              dragElastic={0.3}
              // layoutId={1 + index}
              // transition={{
              //   x: { type: "tween" }
              // }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              initial={{
                x: -45 * index * direction
                // opacity: 0
              }}
              animate={{
                scale: 1 - index * 0.1,
                x: 45 * index,
                zIndex: srcs.length - index
              }}
              exit={{
                x: 45 * index * direction
              }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
            >
              <Card>
                <CardImg
                  src={srcs[(page + index) % srcs.length]}
                  draggable={false}
                  alt="card"
                />
              </Card>
            </Pannel>
          );
        })}
      </AnimateSharedLayout> */}
    </Cotainer>
  );
}

const Cotainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding-left: 15px;
  ${layout}
  ${color}
`;

const Pannel = styled(motion.div)`
  position: absolute;
  width: 90%;
  height: 90%;
`;

const Card = styled(motion.div)`
  background: #f8f1f1;
  border-radius: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CardImg = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
`;
