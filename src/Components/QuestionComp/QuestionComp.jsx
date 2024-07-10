/** @format */

import React, { useEffect, useState } from "react";
import {
  Box,
  Tr,
  Td,
  Img,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch, FormControl, FormLabel,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import AlertModal from "../modalComp/AlertModal";
import FullModal from "../modalComp/FullModal";
import Inputcomp from "../../Components/InputComp/InputComp";
import { useSocket, socket } from "../../socket/socket";
import getRemaingTime from "../../utils/getRemainTime";
import { MdAccessTime } from "react-icons/md";
import { useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";
import { TfiInfinite } from "react-icons/tfi";

const QuestionComp = ({ data, index, setUpdateQuestions, questions }) => {
  const {id} = useParams();
  const toast = useToast();
  useSocket();
  const [status, setStatus] = useState(data.status);
  const [openStatusModal, setOpenstatusModal] = useState(false);
  const [questionId, setQuestionId] = useState("");
  const [updateValue, setupdateValue] = useState("");
  const [correctOption, setcorrectOption] = useState(data.correctOption || "");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDelete, setIsDelete] = useState(data.isDelete || false);
  const [validUntil, setvalidUntil] = useState(data.validUntil)
  const [timeRemaining, setTimeRemaining] = useState(getRemaingTime(data.validUntil));
  const [updateTimeModal, setUpdateTimeModal] = useState(false);
  const [counter, setCounter] = useState(3);
  const [isInfiniteTime, setIsInfiniteTime] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  

  const handleChangestatus = (id, value) => {
    const containsIsInfinteTrue = questions.some(item => item.isInfinte === true);
    setQuestionId(id);
    setupdateValue(value);
    setUpdateTimeModal(true);
    if (containsIsInfinteTrue) {
      setConfirmModal(true);
    }
  };

  const handlechangeOption = () => {
    let data = JSON.stringify({
      status: updateValue,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/questions/update-status/${questionId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setStatus(response.data.question.status);
        setOpenstatusModal(false);
        toast({
          title: "Success.",
          description: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setUpdateQuestions(response.data.question)
        // socket.emit("tournament notification", response.data.question);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlechangeAnswerOption = (value, questionId) => {
    let data = JSON.stringify({
      "option": value,
      "tournamentId": id
    });


    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/questions/update-answer/${questionId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setUpdateQuestions(response.data.question)
        setcorrectOption(response.data.question.correctOption);
        toast({
          title: "Success.",
          description: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        socket.emit("tournament notification", response.data.question);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setQuestionId(id);
  };

  const handleDeleteQuestion = () => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/questions/delete-question/${questionId}`,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setIsDelete(response.data.question.isDelete);
        setOpenDeleteModal(false);
        toast({
          title: "Success.",
          description: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getRemaingTime(validUntil));
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [timeRemaining, validUntil]);

  const handleUpdatequestionTime = () => {
    // alert(counter)
    let data = JSON.stringify({
      "time": counter,
      "isInfiniteTime": isInfiniteTime
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
      toast({
        title: "Success.",
        description: `${response.data.message}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setUpdateTimeModal(false);
      handlechangeOption()
    })
    .catch((error) => {
      console.log(error);
    });
  }

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

  return (
    <>
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
      {
        confirmModal &&
        <AlertModal 
          isOpen={confirmModal}
          onClose={() => setConfirmModal(false)}
          title={"Update question validity time"}
          body={
            <Box className="question_time_modal_body">
              Some of the question has set infinite time duartion do you want to inactive all those questions?
            </Box>
          }
          footer={
            <Button className='modal_btn' onClick={() => setConfirmModal(false)}>
                Yes
            </Button>
          }
        />
      }
      {openStatusModal && (
        <AlertModal
          isOpen={openStatusModal}
          onClose={() => setOpenstatusModal(false)}
          title={<>Question status</>}
          body={<Box>Do you want to change question status?</Box>}
          footer={
            <Box>
              <Button className='modal_btn' onClick={handlechangeOption}>
                Okay
              </Button>
            </Box>
          }
        />
      )}

      {openDeleteModal && (
        <AlertModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          title={<>Question Delete</>}
          body={<Box>Do you want to delete this question?</Box>}
          footer={
            <Box>
              <Button
                className='modal_btn delete'
                onClick={handleDeleteQuestion}>
                Delete
              </Button>
            </Box>
          }
        />
      )}
      {!isDelete && (
        <Tr>
          <Td className='td'>{index}</Td>
          <Td className='td'>{data.question}</Td>
          <Td className='td'>{data.optionA.text}</Td>
          <Td className='td'>
            <Img src={data.optionA.image} className='option_image' />
          </Td>
          <Td className='td'>{data.optionB.text}</Td>
          <Td className='td'>
            <Img src={data.optionB.image} className='option_image' />
          </Td>
          <Td className='td'>{data.optionC.text ? data.optionC.text : "NA"}</Td>
          <Td className='td'>
            {
              data.optionC.image ? <Img src={ data.optionC.image} className='option_image' /> : "NA"
            }
            
          </Td>
          <Td className='td'>{data.optionD.text ? data.optionD.text : "NA"}</Td>
          <Td className='td'>
          {
            data.optionD.image ? <Img src={data.optionD.image} className='option_image' /> : "NA"
          }
          </Td>
          <Td className="td">
            {
              data.isInfinte ? <TfiInfinite /> : 
              <>
              {timeRemaining.minutes>=0 ? 
<>{timeRemaining.minutes}:{timeRemaining.seconds>= 10 ? timeRemaining.seconds : `0${timeRemaining.seconds}`}</> : "0"
}
              </>
            }
          </Td> 
          {/* <Td className="td">{data.createdAt}</Td> */}
          <Td className='td'>
            {status === "Initialised" ? (
              <Button
                className={`table_btn active ${status}`}
                onClick={() => handleChangestatus(data._id, "Active")}>
                Initialised
              </Button>
            ) : (
              <Button className='table_btn active'>
                {data.status}
              </Button>
            )}
          </Td>
          <Td className='td'>
            {correctOption.trim() ? (
              <>{correctOption}</>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  className={
                    status === "active"
                      ? `active_btn user`
                      : "active_btn pending"
                  }>
                  {data.correctOption.toUpperCase() || <>Option</>}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    className='menu_item'
                    onClick={() =>
                      handlechangeAnswerOption("optionA", data._id)
                    }>
                    Option A
                  </MenuItem>

                  <MenuItem
                    className='menu_item'
                    onClick={() =>
                      handlechangeAnswerOption("optionB", data._id)
                    }>
                    Option B
                  </MenuItem>

                  {data.optionC.text && <MenuItem
                    className='menu_item'
                    onClick={() =>
                      handlechangeAnswerOption("optionC", data._id)
                    }>
                    Option C
                  </MenuItem>}

                  {data.optionD.text && <MenuItem
                    className='menu_item'
                    onClick={() =>
                      handlechangeAnswerOption("optionD", data._id)
                    }>
                    Option D
                  </MenuItem>}
                </MenuList>
              </Menu>
            )}
          </Td>

          <Td className='td'>
            {
              status === "Initialised"  && <Button
              className='table_delete_btn'
              onClick={() => handleOpenDeleteModal(data._id)}>
              <AiOutlineDelete />
            </Button>
            }

            {/* {
              status !== "active" && <Button
              className='table_delete_btn'
              onClick={() => handleOpenDeleteModal(data._id)}>
              <MdAccessTime />
            </Button>
            } */}

            {
              status === "Initialised" && <Button className='table_edit_btn'>
              <FaRegEdit />
            </Button>
            }
            
          </Td>
        </Tr>
      )}
    </>
  );
};

export default QuestionComp;
