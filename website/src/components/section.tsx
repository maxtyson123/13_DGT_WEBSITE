import React from "react";

type SectionProps = {
    children: React.ReactNode;
    autoPadding?: boolean
};


//TODO: This may be used later idk
export default function Section({ children, autoPadding = false }: SectionProps){
    return(
        <>
            {/* Add padding to the top of the page if autoPadding is true */}
            <div className={autoPadding ? "p-10" : ""}>
                {children}
            </div>
        </>
    )
}