import React from "react";

type SectionProps = {
    children: React.ReactNode;
};
export default function Section({ children }: SectionProps){
    return(
        <>
           {children}
        </>
    )
}