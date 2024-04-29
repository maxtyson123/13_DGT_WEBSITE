export default function Wrapper({children}){

    return(
        <>
            {/* Show the page */}
            <div className={"pageWrapper"}>
                <div className={"content"}>
                    {children}
                </div>
            </div>
        </>
    )
}