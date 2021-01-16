import React, { useMemo, useState } from "react";
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
  enter: ({ direction, i }) => {
    return {
      x: direction > 0 ? flyMove : -flyMove,
      scale: direction > 0 ? 1 - 0.1 * 3 : 1,
      transition: {
        delayChildren: 1
      }
    };
  },
  center: ({ direction, i }) => ({
    zIndex: srcs.length - i,
    x: i * 40,
    scale: 1 - 0.1 * i,
    opacity: 1 - 0.1 * i
  }),
  exit: ({ direction, i }) => {
    return {
      zIndex: srcs.length - i,
      x: direction < 0 ? flyMove : -flyMove,
      transition: {
        delayChildren: 1
      }
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default function StackedCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);

  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = (page) => wrap(0, srcs.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  console.log(page, direction);
  return (
    <Cotainer height="600px" bg="#374045">
      <Pannel id="camera" />
      <AnimatePresence initial={false} custom={direction}>
        {range(3).map((index) => (
          <Pannel
            key={page + index}
            // drag="x"
            dragConstraints={{ right: 0, top: 0, left: 0, bottom: 0 }}
            dragElastic={0.5}
            custom={{ direction, i: index }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween" },
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
              <CardImg
                src={srcs[imageIndex(page + index)]}
                draggable={false}
                alt="card"
              />
            </Card>
          </Pannel>
        ))}
      </AnimatePresence>
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
  width: 80%;
  height: 90%;
`;

const Card = styled(motion.div)`
  background: #f8f1f1;
  border-radius: 16px;
  box-shadow: 0px 0px 15px 0px #fff;
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
