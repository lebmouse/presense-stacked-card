import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { layout, color } from "styled-system";
import { AnimateSharedLayout, motion, AnimatePresence } from "framer-motion";
import { range } from "lodash-es";
import { wrap } from "popmotion";
const src1 =
  "https://cf.product.s.naunau.jp/age-group-featured-shops/images/20201221-005818294.jpg?size=450";
const src2 =
  "https://cf.product.s.naunau.jp/age-group-featured-shops/images/20201221-005823091.jpg?size=450";
const src3 =
  "https://cf.product.s.naunau.jp/age-group-featured-shops/images/20201221-005829510.jpg?size=450";
const src4 =
  "https://cf.product.s.naunau.jp/age-group-featured-shops/images/20201221-005834651.jpg?size=450";
const src5 =
  "https://cf.product.s.naunau.jp/age-group-featured-shops/images/20201221-005839074.jpg?size=450";

const src6 =
  "https://cf.product.s.naunau.jp/age-group-featured-shops/images/20201221-005842466.jpg?size=450";

const srcs = [src1, src2, src3, src4, src5, src6];
// const srcs = [src1, src2, src3];
const flyMove = 500;

const variants = {
  enter: ({ direction, i }) => {
    return {
      x: direction > 0 ? 3 * 60 - 3 : -flyMove,
      scale: direction > 0 ? 1 - 0.1 * 2 : 0.9
      // transition: {
      //   delayChildren: 1
      // }
    };
  },
  center: ({ direction, i, page }) => ({
    zIndex: srcs.length - i,
    x: i * 60 - i * Math.pow(3, 2),
    scale: 1 - 0.1 * i
    // opacity: 1 - 0.1 * i
  }),
  exit: ({ direction, i }) => {
    return {
      zIndex: srcs.length - i,
      x: direction < 0 ? 3 * 60 - 3 * Math.pow(2, 2) : -flyMove,
      scale: direction < 0 ? 1 - 0.3 : 1,
      opacity: direction < 0 ? 0 : 1
      // transition: {
      //   delayChildren: 1
      // }
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
    <>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => paginate(-1)}>{"<"}</button>
        <button onClick={() => paginate(1)}>{">"}</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {srcs.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: "30px",
              height: "30px",
              margin: "4px",
              background: imageIndex(page) === idx ? "#fff" : "grey",
              borderRadius: "100%"
            }}
            onClick={() =>
              setPage((prev) => {
                const nextDirection = Math.sign(idx - prev[0]);
                console.log(nextDirection);
                return [idx, nextDirection];
              })
            }
          />
        ))}
      </div>
      <Cotainer height="600px" bg="#374045">
        <AnimatePresence initial={false} custom={{ direction, page }}>
          {range(3).map((index) => (
            <Pannel
              key={page + index}
              layout
              layoutId={index + 1}
              drag={index === 0 && "x"}
              dragConstraints={{ right: 0, top: 0, left: 0, bottom: 0 }}
              dragElastic={0.5}
              custom={{ direction, i: index, page }}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween" },
                scale: { type: "tween", elapsed: 0.1 },
                zIndex: { delay: direction > 0 ? 0.25 : 0 }
              }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                console.log(offset.x);
                if (swipe < -swipeConfidenceThreshold || offset.x < -730) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold || offset.x > 730) {
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
    </>
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
