import NavBarComponent from "./NavBar";

import { Outlet } from "react-router-dom";
import Footer from "./footer";
function Layout(){
    return (
    <>
       <NavBarComponent/>
       <main>
                <Outlet /> {/* This is where child routes will render */}
            </main>
            <Footer/>

       </>
    )


}
export default Layout;