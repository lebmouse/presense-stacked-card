import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { layout, color } from "styled-system";
import {
  AnimateSharedLayout,
  motion,
  AnimatePresence,
  motionValue,
  useMotionValue,
  useTransform
} from "framer-motion";
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
const flyMove = 500;

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const DIFF_X = 40;

export default function WithCamera() {
  const x = useMotionValue(0);
  const fx = useTransform(x, [-flyMove, 0, DIFF_X], [-flyMove, 0, DIFF_X]);
  const fscale = useTransform(x, [-flyMove, 0, DIFF_X], [1, 1, 0.9]);
  const midX = useTransform(x, [-flyMove, 0, DIFF_X], [-DIFF_X, 0, DIFF_X]);
  const scale = useTransform(x, [-flyMove, 0, 50], [1.1, 1, 0.9]);
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
          <Pannel style={{ zIndex: 1200, x: fx, scale: fscale }}>
            <Card>
              <CardImg
                src={srcs[imageIndex(page)]}
                draggable={false}
                alt="card"
              />
            </Card>
          </Pannel>
          {range(1, 5).map((index) => (
            <DPaneel
              key={page + index}
              direction={direction}
              index={index}
              x={midX}
              scale={scale}
            >
              <Card>
                <CardImg
                  src={srcs[imageIndex(page + index)]}
                  draggable={false}
                  alt="card"
                />
              </Card>
            </DPaneel>
          ))}
        </AnimatePresence>
        <Knob
          drag="x"
          style={{ x }}
          dragConstraints={{ right: 0, top: 0, left: 0, bottom: 0 }}
          dragElastic={0.9}
          onDrag={(e, { offset, point, delta, velocity }) => {}}
        />
      </Cotainer>
    </>
  );
}

function DPaneel({ children, index, x, scale, zIndex, onDragEnd, direction }) {
  const px = useTransform(x, (x) => x + DIFF_X * index);
  const pscale = useTransform(scale, (scale) => scale - 0.1 * index);
  // const pzIndex = useTransform(0, () => 1000 - index);

  return (
    <Pannel
      layout
      layoutId={index + 1}
      style={{
        x: px,
        scale: pscale,
        zIndex: 1000 - index
      }}
      transition={{
        x: { type: "tween" },
        scale: { type: "tween", elapsed: 0.1 },
        zIndex: { delay: 0.1 }
      }}
    >
      {children}
    </Pannel>
  );
}

const Cotainer = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding-left: 15px;
  ${layout}
  ${color}
`;

const Knob = styled(motion.div)`
  position: absolute;
  z-index: 2000;
  width: 100%;
  left: 0;
  height: 100%;
`;

const Pannel = styled(motion.div)`
  position: absolute;
  width: 80%;
  height: 90%;
`;

const Card = styled.div`
  background: #f8f1f1;
  border-radius: 16px;
  box-shadow: 0px 0px 15px 0px #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
`;
