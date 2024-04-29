import React from "react";

type SectionProps = {
    children: React.ReactNode;
    autoPadding?: boolean
};


/**
 * Section component. Renders a section with the given children. This is usefully for splitting up the page into sections to make it easier to read the code.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The children of the section.
 * @param {boolean} props.autoPadding - If true, the section will have padding around it.
 *
 * @returns {JSX.Element} The rendered section component.
 */
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