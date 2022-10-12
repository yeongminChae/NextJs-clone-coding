import { Query, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import { makeImagePath } from "../../../../../libs/client/utils";
import { getOnTheAirTv, IGetTvResult } from "../../../../api/tvApi";

interface ISlider {
  SliderTitle: string;
}

export default function SliderOnTheAir({ SliderTitle }: ISlider) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [back, setBack] = useState<boolean>(false);
  const { data: OnTheAirData, isLoading: OnTheAirIsLoading } =
    useQuery<IGetTvResult>(["tvs", "OnTheAir"], getOnTheAirTv);
  const onBoxClick = (tvId: number) => {
    router.push(`?tvId=${OnTheAirData}`, `/nomflix/${tvId} `);
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (OnTheAirData) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalTvs = OnTheAirData?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1; // index = page
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (OnTheAirData) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      const totalTvs = OnTheAirData?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const offset = 6;
  const customValue = {
    direction: back,
  };
  return (
    <Slider className="z-0 -mt-20 ">
      <div className="mx-10 mb-2 text-xl text-white/90 ">{SliderTitle}</div>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        mode="sync"
        custom={customValue.direction}
      >
        <Row
          variants={rowVars}
          initial="hidden"
          animate="visible"
          custom={customValue.direction}
          exit="exit"
          key={index}
          transition={{ type: "tween", duration: 1 }}
          className="absolute mx-10 mb-1 grid w-[93.5vw] grid-cols-6 gap-2"
        >
          {OnTheAirData?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((tv) => (
              <Box
                className="h-40 cursor-pointer bg-white bg-cover bg-[center_center] text-3xl 
            text-red-500 first:origin-[center_left] last:origin-[center_right]"
                key={tv.id}
                layoutId={tv.id + ""}
                onClick={() => onBoxClick(tv.id)}
                variants={boxVars}
                initial="normal"
                whileHover="hover"
                bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
              >
                <Info
                  variants={infoVars}
                  className="absolute bottom-0 w-full bg-black/60 p-3 opacity-0"
                >
                  <div className="text-center text-lg text-white">
                    {tv.name}
                  </div>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <div>
        <motion.div
          variants={dirVars}
          initial="initial"
          whileHover={{ scale: 1.4 }}
          onClick={increaseIndex}
          className="relative float-right flex h-40 w-[2.6vw] items-center justify-center bg-transparent text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </motion.div>
        <motion.div
          variants={dirVars}
          initial="initial"
          whileHover={{ scale: 1.4 }}
          onClick={decreaseIndex}
          className="relative float-left flex h-40 w-[2.6vw] items-center justify-center bg-transparent text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </motion.div>
      </div>
    </Slider>
  );
}

const Slider = styled.div``;
const Row = styled(motion.div)``;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0)),
    url(${(props) => props.bgPhoto});
`;
const Info = styled(motion.div)``;

const rowVars = {
  hidden: (isBack: boolean) => ({
    x: isBack ? "-1440px" : "1440px",
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? "1440px" : "-1440px",
  }),
};
const boxVars = {
  normal: {
    scale: 1,
    transition: {
      type: "tween",
    },
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};
const infoVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};
const dirVars = {
  initial: {
    opacity: 1,
  },
};
