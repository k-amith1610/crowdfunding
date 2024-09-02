import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React from 'react'

const Pointer = () => {

    useGSAP(() => {
        const handleMouseMove = (dets) => {
            // console.log(dets);
            gsap.to("#pointer", {
                x: dets.clientX,
                y: dets.clientY,
                duration: 0.8,
                ease: "power4",
                zIndex: 0,
            });
        }
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [])

    return (
        <>
            <div
                id="pointer"
                className="top-0 left-0 bg-green-500 w-[15px] h-[15px] rounded-full
                        fixed z-10 blur-[0.5px] shadow-secondary shadow-green-300"
            >

            </div>

            {/* <img
                id="pointer"
                className="w-[50px] h-[50px] fixed"
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/ethereum-eth-icon.png"
                alt=""
            /> */}
        </>
    )
}

export default Pointer
