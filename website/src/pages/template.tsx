import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";

export default function Template() {
    // Constants
    const CURRENT_PAGE = "Template";

    return (
        <>
            <HtmlHeader currentPage={CURRENT_PAGE}/>
            <Navbar currentPage={CURRENT_PAGE}/>
        </>
    );
}