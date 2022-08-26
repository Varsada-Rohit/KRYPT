import { useState } from "react";
import logo from "../images/logo.png";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";

const NavbarItem = ({ title, classProp }) => {
  return <li className={`mx-4 cursor-point ${classProp}`}>{title}</li>;
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full p-4 flex md:justify-center justify-between items-center">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="Logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial ">
        {["Market", "Exchange", "Tutorials", "Wallet"].map((i, intex) => (
          <NavbarItem key={i + intex} title={i} />
        ))}
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          login
        </li>
      </ul>
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
            <li className="text-xl w-4 m-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {["Market", "Exchange", "Tutorials", "Wallet"].map((i, intex) => (
              <NavbarItem key={i + intex} title={i} classProp="m-2 text-lg" />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
