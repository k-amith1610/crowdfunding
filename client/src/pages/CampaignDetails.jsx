import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { useStateContext } from "../context"
import { CountBox, CustomButton, Loader } from "../components"
import { calculateBarPercentage, daysLeft } from "../utils"
import { thirdweb } from "../assets"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger);

const CampaignDetails = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { donate, getDonations, contract, address, getNumberOfCampaigns } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [noOfCampaigns, setNoOfCampaigns] = useState(0);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    console.log(state);
    const numberOfCampaigns = await getNumberOfCampaigns(state.owner);
    setNoOfCampaigns(numberOfCampaigns);
    setDonators(data);
  }

  useEffect(() => {
    if (contract) {
      fetchDonators();
    }
  }, [contract, address])

  useGSAP(() => {
    const timeline = gsap.timeline({ delay: 0.4 });

    timeline.from("#campaignimage", {
      opacity: 0,
      duration: 1,
      x: -60,
    })

    timeline.from("#countbox", {
      opacity: 0,
      duratoin: 1,
      stagger: 0.2,
      x: 60,
    })

    timeline.from("#campaignbar", {
      opacity: 0,
      duration: 1,
      y: 60,
    })


    timeline.from("#creator", {
      opacity: 0,
      duration: 1,
      y: -30,
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#creator",
        start: "top 67%",
        end: "bottom 50%",
        scrub: 1,
      }
    })
    timeline.from("#story", {
      opacity: 0,
      duration: 1,
      y: -30,
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#story",
        start: "top 77%",
        end: "bottom 65%",
        scrub: 1,
      }
    })
    timeline.from("#donators", {
      opacity: 0,
      duration: 1,
      y: -30,
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#donators",
        start: "top 85%",
        end: "bottom 75%",
        scrub: 1,
      }
    })
    timeline.from("#fund", {
      opacity: 0,
      duration: 1,
      y: -30,
      stagger: 0.5,
      scrollTrigger: {
        trigger: "#fund",
        start: "top 65%",
        end: "bottom 50%",
        scrub: 1,
      }
    })

  }, [])

  const handleDonate = async () => {
    setIsLoading(true);
    await donate(state.pId, amount);
    navigate("/");
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div
        className="w-full flex md:flex-row flex-col mt-10 gap-[30px]"
      >
        <div
          className="flex-1 flex-col"
        >
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
            id="campaignimage"
          />
          <div
            className="relative w-full h-[5px] bg-[#3a3a43] mt-2 rounded-full"
            id="campaignbar"
          >
            <div
              className="absolute h-full bg-[#4acd8d] rounded-full"
              style={{
                width: `${calculateBarPercentage(state.target, state.amountCollected)}%`,
                maxWidth: '100%'
              }}
            >
            </div>
          </div>
        </div>
        <div
          className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]"
        >
          <CountBox
            title="Days Left"
            value={remainingDays}
            id="countbox"
          />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
            id="countbox"
          />
          <CountBox
            title="Total Backer"
            value={donators.length}
            id="countbox"
          />
        </div>
      </div>

      <div
        className="mt-[60px] flex lg:flex-row flex-col gap-5"
      >
        <div
          className="flex-[2] flex flex-col gap-[40px]"
        >
          <div
            className=""
          >
            <h4
              className="font-epilogue font-semibold text-[18px] text-white uppercase"
              id="creator"
            >
              Creator
            </h4>
            <div
              className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]"
            >
              <div
                className="w-[52px] h-[52px] flex items-center justify-center rounded-full 
                          bg-[#2c2f32] cursor-pointer z-10"
                id="creator"
              >
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div
                className=""
              >
                <h4
                  className="font-epilogue font-semibold text-[14px] text-white break-all"
                  id="creator"
                >
                  {state.owner}
                </h4>
                <p
                  className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]"
                  id="creator"
                >
                  {noOfCampaigns > 1 ? noOfCampaigns + " Campaigns" : noOfCampaigns + " Campaign"}
                </p>
              </div>
            </div>
          </div>

          <div
            className=""
          >
            <h4
              className="font-epilogue font-semibold text-[18px] text-white uppercase"
              id="story"
            >
              Story
            </h4>
            <div
              className="mt-[20px]"
            >
              <p
                className="font-epilogue font-normal text-[16px] text-[#808191]
                          leading-[26px] text-justify"
                id="story"
              >
                {state.description}
              </p>
            </div>
          </div>

          <div
            className=""
          >
            <h4
              className="font-epilogue font-semibold text-[18px] text-white uppercase"
              id="donators"
            >
              Donators
            </h4>
            <div
              className="mt-[20px] flex flex-col gap-4"
              id="donators"
            >
              {donators.length > 0 ? donators.map((item, index) => (
                <div
                  key={`${item.donator} - ${index}`}
                  className="flex justify-between items-center gap-4"
                >
                  <p
                    className="font-epilogue font-normal text-[16px]
                              text-[#b2b3bd] leading-[26px] break-all"
                    id="donators"
                  >
                    {index + 1}. {item.donator}
                  </p>
                  <p
                    className="font-epilogue font-normal text-[16px]
                              text-[#808191] leading-[26px] break-all"
                    id="donators"
                  >
                    {item.donation}
                  </p>
                </div>
              )) :
                (
                  <p
                    className="font-epilogue font-normal text-[16px] text-[#808191]
                            leading-[26px] text-justify"
                  >
                    No donators yet. Be the first one to donate!
                  </p>
                )
              }

            </div>
          </div>
        </div>

        <div
          className="flex-1"
        >
          <h4
            className="font-epilogue font-semibold text-[18px] text-white uppercase"
            id="fund"
          >
            Fund
          </h4>

          <div
            className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]"
            id="fund"
          >
            <p
              className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]"
              id="fund"
            >
              Fund the campaign
            </p>
            <div
              className="mt-[30px]"
            >
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] 
                  border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px]
                    leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                id="fund"
              />
              <div
                className="my-[20px] p-4 bg-[#13131a] rounded-[10px]"
                id="fund"
              >
                <h4
                  className="font-epilogue font-semibold text-[14px] leading-[22px]
                          text-white"
                  id="fund"
                >
                  Back it because you believe in it.
                </h4>
                <p
                  className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]"
                  id="fund"
                >
                  Support the project for no reward, just because it
                  speaks to you.
                </p>
              </div>
              <CustomButton
                btnType="button"
                title="Fund Camapaign"
                styles="w-full bg-[#8928ff]"
                handleClick={handleDonate}
                id="fund"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
