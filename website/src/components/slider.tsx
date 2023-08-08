import React from "react";

var $ = require("jquery");
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
}

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import styles from "@/styles/slider.module.css";

import dynamic from "next/dynamic";
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});

type SliderProps = {
    children: React.ReactNode;

};

export default function Slider({children} :   SliderProps) {
    return(
        <>
            <OwlCarousel
                className={styles.owlCarousel}
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