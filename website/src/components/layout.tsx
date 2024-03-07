import React, {useEffect} from "react";
import HtmlHeader from "@/components/html_header";
import Navbar from "@/components/navbar";
import Section from "@/components/section";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll_to_top";
import PageHeader from "@/components/page_header";
import styles from "@/styles/pages/account/index.module.css";
import {Loading} from "@/components/loading";
import {Error} from "@/components/error";
import {globalStyles} from "@/lib/global_css";
import {signIn, useSession} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPerson} from "@fortawesome/free-solid-svg-icons";
import {checkUserPermissions, RongoaUser} from "@/lib/users";


interface LayoutProps{
   children: React.ReactNode;
   pageName: string;
   loadingMessage?: string;
   header?: string | React.ReactNode;
   headerSize?: "small" | "medium" | "large";
   loginRequired?: boolean;
   permissionRequired?: string;
   error?: string;
}
export function Layout({children, pageName, loadingMessage, header, headerSize, loginRequired, permissionRequired, error}: LayoutProps) {

    const [loginNeeded, setLoginNeeded] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const { data: session } = useSession();

    useEffect(() => {

        // Check if this page requires the user to be logged in
        if(!loginRequired){
            setLoginNeeded(false)
            return;
        }

        // Check if the user is logged in
        if(!session?.user){
            setLoginNeeded(true);
            return;
        }

        // Check if the user has the required permission
        if(!permissionRequired){
            setLoginNeeded(false)
            return;
        }


        if(checkUserPermissions(session.user as RongoaUser, permissionRequired)){
            setLoginNeeded(false)
            return;
        }

        // If the user does not have the required permission, display an error message
        setErrorMessage("You do not have permission to view this page")
        setLoginNeeded(false);

    }, [session, loginRequired, permissionRequired]);

    // If there is an error message, display the error message
    useEffect(() => {
        if(error)
            setErrorMessage(error);
    }, [error]);


    return (
       <>

           {/* Loading message */}
           {loadingMessage && <Loading progressMessage={loadingMessage}/>}

           {/* Set up the page header and navbar */}
           <HtmlHeader currentPage={pageName}/>
           <Navbar currentPage={pageName}/>

           {/* Header for the page */}
           <Section>
               <PageHeader size={headerSize}>
                   {typeof header === "string" ? <h1>{header}</h1> : header}
               </PageHeader>
           </Section>

           {/* Content */}
           {loginNeeded ?
               <Section autoPadding>
               <div className={globalStyles.gridCentre}>
                   <button className={styles.signInButton} onClick={() => signIn()}><FontAwesomeIcon
                       icon={faPerson}/> Sign in / Sign Up
                   </button>
               </div>
              </Section>
           :
            errorMessage ? <Error error={errorMessage}/> : children
           }

           {/* Page footer */}
           <Section>
               <Footer/>
           </Section>

           {/* Allow the user to scroll to the top of the page easily*/}
           <ScrollToTop/>
       </>
   )
}