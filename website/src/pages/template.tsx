import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function Template() {
    // Constants
    const CURRENT_PAGE = "Template";

    return (
        <>
            <Header currentPage={CURRENT_PAGE}/>
            <Navbar currentPage={CURRENT_PAGE}/>
        </>
    );
}