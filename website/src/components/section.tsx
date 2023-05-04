import React from "react";

type SectionProps = {
    children: React.ReactNode;
    autoPadding: boolean
};
export default function Section({ children, autoPadding = false }: SectionProps){
    return(
        <>
            <div className={autoPadding ? "p-10" : ""}>
                {children}
            </div>
        </>
    )
}