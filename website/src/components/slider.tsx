import React from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import styles from "@/styles/components/slider.module.css";

import dynamic from "next/dynamic";

var $ = require("jquery");
if (typeof window !== "undefined") {
    // @ts-ignore   -  This is a hack to get around the fact that the window object doesn't like jquery in nextjs
    window.$ = window.jQuery = require("jquery");
}

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

type SliderProps = {
    children: React.ReactNode;

};

const Responsive = {
    0: {
        items: 1,
    },
    700: {
        items: 1.5,
    },
    950: {
        items: 2,
    },
    1100: {
        items: 2.5,
    },
    1500: {
        items: 3.5,
    }
}

export default function Slider({children} :   SliderProps) {
    return(
        <>
            <OwlCarousel
                responsive={Responsive}
                className={styles.slider}
                autoplay={true}
                autoplayTimeout={5000}
                autoplayHoverPause={true}
                rewind={true}
                autoplaySpeed={1000}
            >
                {children}
            </OwlCarousel>
        </>
        )
}