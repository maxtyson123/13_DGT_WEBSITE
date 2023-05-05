import React, { forwardRef, useMemo } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'


// Define the page transition component
type PageTransitionProps = {
    children: HTMLMotionProps<'div'>
}

// Define the page transition ref
type PageTransitionRef = React.ForwardedRef<HTMLDivElement>

function PageTransition({ children, ...rest }: PageTransitionProps, ref: PageTransitionRef) {

    // For now dont do anything TODO: Add page transitions
    return (<>  {children} </>)

    const variants = {
        hidden: { opacity: 0 },
        enter: { opacity: 1},
        exit: { opacity: 0},
    }


    return (
        <>
            {/* Use the frame motion component to animate the page transition */}
            <motion.div
                variants={variants} // Pass the variant object into Framer Motion
                initial="hidden" // Set the initial state to variants.hidden
                animate="enter" // Animated state to variants.enter
                exit="exit" // Exit state (used later) to variants.exit
                transition={{ type: 'linear' }} // Set the transition to linear
                className=""
            >
                {/* Render the children */}
                {children}
            </motion.div>
        </>
    )
}

// Create a forward ref for the page transition component
export default forwardRef(PageTransition)