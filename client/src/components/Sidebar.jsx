import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { logo, sun } from "../assets";
import { navlinks } from "../constants";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
// import Pointer from './Pointer';

const Icon = ({ id, styles, name, imgUrl, isActive, disabled, handleClick }) => {
  return (
    <div
      {...(id && { id })}
      className={`w-[48px] h-[48px] rounded-[10px] 
      ${isActive && isActive === name && 'bg-[#2c2f32]'} 
      flex justify-center items-center
      ${!disabled && 'cursor-pointer'} ${styles}`}
      onClick={handleClick}
    >
      {!isActive ? (
        <img
          src={imgUrl}
          alt="fund_logo"
          className="w-1/2 h-1/2"
        />
      ) : (
        <img
          src={imgUrl}
          alt="fund_logo"
          className={`w-1/2 h-1/2 ${isActive != name &&
            'grayscale'}`}
        />
      )}
    </div>
  )
}

const Sidebar = () => {

  useGSAP(() => {
    var tl = gsap.timeline({ delay: 0.5 })
    tl.from("#logo", {
      opacity: 0,
      x: -20,
    }, ">");

    tl.from("#sidebar", {
      opacity: 0,
      x: -20,
    })

    tl.from("#navlinks", {
      opacity: 0,
      y: -20,
      stagger: 0.3,
    }, ">");

    tl.from("#sun", {
      opacity: 0,
      y: -20,
    }, ">")

  }, [])


  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");

  return (
    <div
      className="flex justify-between items-center 
        flex-col sticky top-5 h-[93vh]"
    >
      {/* <Pointer /> */}
      <Link to="/">
        <Icon
          id="logo"
          styles="w-[52px] h-[52px] bg-[#2c2f32]"
          imgUrl={logo}
        />
      </Link>

      <div
        id="sidebar"
        className="flex-1 flex flex-col justify-between items-center
        bg-[#1c1c24] rounded-[20px] w-[70px] py-4 mt-12"
      >
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              id="navlinks"
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon
          id="sun"
          styles="bg-[#1c1c24] shadow-secondary"
          imgUrl={sun}
        />
      </div>

    </div>
  )
}

export default Sidebar
