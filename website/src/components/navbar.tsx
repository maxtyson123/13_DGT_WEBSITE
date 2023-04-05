export default function Navbar(props: any) {
    const currentPage = props.currentPage;

    return(
        <>
            <h1 className="text-3xl font-bold underline">
                {currentPage}
            </h1>
        </>
    )
}