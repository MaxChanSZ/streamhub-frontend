import React from 'react';
// import { Link } from 'react-router-dom';
import {Button} from "@/components/shadcn/ui/button.tsx";
import {Link} from "react-router-dom";


const Navbar = () => {

    return (
        <div className="h-[12.5vh] bg-black flex justify-center items-center">

            {/*<Button variant="secondary" asChild>*/}
            {/*    /!*Button*!/*/}
            {/*    <Link to={`/`}>Homepage</Link>*/}
            {/*</Button>*/}
            <Button variant="secondary" asChild>
                <Link to={`/watch/one-piece`}>Test</Link>
            </Button>

        </div>
    );
};

export default Navbar;