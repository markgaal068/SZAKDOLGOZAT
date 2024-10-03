import Link from "next/link"
import {Button} from "./ui/button"

//COMPONENTS
import Nav from "./Nav"
import MobileNav from "./MobileNav"


const Header = () =>{
return(
    <header className="py-4 xl:py-6 text-white bg-sndbg">
        <div className="container mx-auto flex justify-between items-center">
            
            <Link href="/">
                <h1 className="text-3xl font-bold">Ácsi <span className="text-accent">Kinizsi</span> SC</h1>
            </Link>

            
            <div className="hidden xl:flex items-center gap-8">
                <Nav/>

            </div>

            
            <div className="xl:hidden">
                <MobileNav/>
            </div>

        </div>
    </header>
    )
}

export default Header