/** @format */

import React, { useEffect, useState } from "react";
import { Box, Textarea, useToast, Input, Button, Switch, FormControl, FormLabel } from "@chakra-ui/react";
import InputComp from "../../Components/InputComp/InputComp";
import ButtonComp from "../../Components/ButtonComp/AuthButton";
import axios from "axios";
import AlertModal from "../../Components/modalComp/AlertModal";
import { update } from "react-spring";
import { FiPlus } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";

const QuestionForm = ({ id }) => {
  const toast = useToast();
  const [question, setQuestion] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt1Img, setOpt1Img] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt2Img, setOpt2Img] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt3Img, setOpt3Img] = useState("");
  const [opt4, setOpt4] = useState("");
  const [opt4Img, setOpt4Img] = useState("");
  const [disable, setdisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [updateTimeModal, setUpdateTimeModal] = useState(false);
  const [selectTime, setSelectTime] = useState();
  const [counter, setCounter] = useState(3);
  const [isInfiniteTime, setIsInfiniteTime] = useState(false);
  const [questionId, setquestionId] = useState("")

  useEffect(() => {
    if (
      !question.trim() ||
      !opt1.trim() ||
      !opt2.trim()) {
      setdisable(true);
    } else {
      setdisable(false);
    }
  }, [question, opt1, opt2]);

  const handleImageChange1 = (e) => {
    setOpt1Img(e.target.files[0]);
  };

  const handleImageChange2 = (e) => {
    setOpt2Img(e.target.files[0]);
  };

  const handleImageChange3 = (e) => {
    setOpt3Img(e.target.files[0]);
  };

  const handleImageChange4 = (e) => {
    setOpt4Img(e.target.files[0]);
  };

  const handleAskQuestion = () => {
    setdisable(true);
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));
    const formdata = new FormData();
    formdata.append("question", question);
    formdata.append("tourId", id);
    formdata.append("opt1", opt1);
    formdata.append("image1", opt1Img);
    formdata.append("opt2", opt2);
    formdata.append("image2", opt2Img);
    formdata.append("opt3", opt3);
    formdata.append("image3", opt3Img);
    formdata.append("opt4", opt4);
    formdata.append("image4", opt4Img);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    fetch(`${process.env.REACT_APP_BASE_URL}api/v1/questions/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 201) {
          const now = new Date();
          const expirationDate = new Date(result.question.validUntil);
          const distance = expirationDate.getTime() - now.getTime();

          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          console.log("M:", minutes);
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          console.log("S:", seconds);
          setSelectTime(minutes)
          toast({
            title: "Account created.",
            description: "Question has been created",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setQuestion("")
          setOpt1("");
          setOpt1Img("");
          setOpt2("");
          setOpt2Img("");
          setOpt3("");
          setOpt3Img("");
          setOpt4("");
          setOpt4Img("");
          setQuestion("");
          setLoading(false);
          setquestionId(result.question._id)
          // setUpdateTimeModal(true);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDecrement = () => {
    if(counter > 1) {
      setCounter(prev => prev - 1)
    } else {
      toast({
        title: "Warning",
        description: "Timer value cannot be Zero or negative",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleChange = (event) => {
    setIsInfiniteTime(event.target.checked);
  };

  const handleUpdatequestionTime = () => {
    let data = JSON.stringify({
      "time": isInfiniteTime ? null : counter
    });
    
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/questions/update-time/${questionId}`,
      headers: { 
        'x-access-token': localStorage.getItem("token"), 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log((response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <Box className='question_form_section'>
      {
        updateTimeModal &&
        <AlertModal 
          isOpen={updateTimeModal}
          onClose={() => setUpdateTimeModal(false)}
          title={"Update question validity time"}
          body={
            <Box className="question_time_modal_body">
              <Box className="update_time_section">
                <Box className="counter_section">
                <Button className={counter > 1 ? "counter_btn" : "disable_counter_btn"} onClick={handleDecrement}><FaMinus /></Button>
                  <span className="counter">{counter}</span>
                  <Button className="counter_btn" onClick={() => setCounter(prev => prev + 1)}><FiPlus /></Button>
                </Box>
                <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor='infinite-time' mb='0'>
                      Enable infinite time for question?
                    </FormLabel>
                    <Switch id='infinite-time' isChecked={isInfiniteTime} onChange={handleChange} />
                </FormControl>
              </Box>
            </Box>
          }
          footer={
            <Button className='modal_btn' onClick={handleUpdatequestionTime}>
                Update
            </Button>
          }
        />
      }
      <Textarea
        type='text'
        placeholder='Ask question?'
        className='textarea_input_form'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Options */}
      <Box className='option_box'>
        <Box className='option_header'>Option A</Box>
        <InputComp
          type='text'
          placeholder={"Enter first option"}
          className={"option_input"}
          value={opt1}
          handleChange={(e) => setOpt1(e.target.value)}
        />
        <br />
        <Input
          type='file'
          className={"option_input"}
          onChange={(e) => handleImageChange1(e)}
        />
      </Box>

      <Box className='option_box'>
        <Box className='option_header'>Option B</Box>
        <InputComp
          type='text'
          placeholder={"Enter second option"}
          className={"option_input"}
          value={opt2}
          handleChange={(e) => setOpt2(e.target.value)}
        />
        <br />
        <Input
          type='file'
          className={"option_input"}
          onChange={(e) => handleImageChange2(e)}
        />
      </Box>

      <Box className='option_box'>
        <Box className='option_header'>Option C</Box>
        <InputComp
          type='text'
          placeholder={"Enter third option"}
          className={"option_input"}
          value={opt3}
          handleChange={(e) => setOpt3(e.target.value)}
        />
        <br />
        <Input
          type='file'
          className={"option_input"}
          onChange={(e) => handleImageChange3(e)}
        />
      </Box>

      <Box className='option_box'>
        <Box className='option_header'>Option D</Box>
        <InputComp
          type='text'
          placeholder={"Enter fourth option"}
          className={"option_input"}
          value={opt4}
          handleChange={(e) => setOpt4(e.target.value)}
        />
        <br />
        <Input
          type='file'
          className={"option_input"}
          onChange={(e) => handleImageChange4(e)}
        />
      </Box>

      <ButtonComp
        disable={disable}
        loading={loading}
        className={"create_question_btn"}
        disableClassName={"disable_create_question_btn"}
        text={"Create Question"}
        handleClick={handleAskQuestion}
      />
    </Box>
  );
};

export default QuestionForm;
