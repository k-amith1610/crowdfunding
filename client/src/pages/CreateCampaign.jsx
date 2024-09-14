import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true)
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) })
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }

  useEffect(() => {


    gsap.from("#heading", {
      delay: 0.5,
      opacity: 0,
      y: -20,
      duration: 1,
    })

    gsap.from("#field", {
      delay: 0.5,
      opacity: 0,
      y: -20,
      duration: 1,
      stagger: 0.2,
      // scrollTrigger: {
      //   trigger: "#form",
      //   start: "top 80%",
      //   end: "bottom 20%",
      //   scrub: 1,
      // }
    })

    gsap.from("#quote", {
      opacity: 0,
      y: -20,
      scrollTrigger: {
        trigger: "#quote",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    })

    gsap.from("#quoteimg", {
      opacity: 0,
      x: -100,
      scrollTrigger: {
        trigger: "#quote",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    })

    gsap.from("#quotesentence", {
      opacity: 0,
      x: 100,
      scrollTrigger: {
        trigger: "#quote",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    })


  }, [])


  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div id="heading" className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 id="heading" className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
            id="field"
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
            id="field"
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
          id="field"
        />

        <div className="w-full flex justify-center items-center p-4 bg-[#8928ff] h-[120px] rounded-[10px]" id="quote">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" id="quoteimg" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]" id="quotesentence">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
            id="field"
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
            id="field"
          />
        </div>

        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
          id="field"
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign