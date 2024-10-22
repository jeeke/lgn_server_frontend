/** @format */

import React, {useEffect, useRef, useState} from "react";
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
  useToast, Checkbox,
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import {FaRegEdit, FaSave} from "react-icons/fa";
import axios from "axios";
import AlertModal from "../modalComp/AlertModal";
import FullModal from "../modalComp/FullModal";
import Inputcomp from "../../Components/InputComp/InputComp";
import getRemaingTime from "../../utils/getRemainTime";
import { MdAccessTime } from "react-icons/md";
import { useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";
import { TfiInfinite } from "react-icons/tfi";
import Pusher from 'pusher-js';
import { FaAngleDown } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import {arraysEqual} from "../../utils/helper";

const QuestionComp = ({ data, index, setUpdateQuestions, questions }) => {
  // console.log(data)
  const {id} = useParams();
  const toast = useToast();
  const [status, setStatus] = useState(data.status);
  const [openStatusModal, setOpenstatusModal] = useState(false);
  const [questionId, setQuestionId] = useState("");
  const [updateValue, setupdateValue] = useState("");
  const [correctOption, setcorrectOption] = useState(data.correctOptions || []);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDelete, setIsDelete] = useState(data.isDelete || false);
  const [validUntil, setvalidUntil] = useState(data.validUntil)
  const [timeRemaining, setTimeRemaining] = useState(getRemaingTime(data.validUntil));
  const [updateTimeModal, setUpdateTimeModal] = useState(false);
  const [counter, setCounter] = useState(3);
  const [isInfiniteTime, setIsInfiniteTime] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [openRemoveOptionModal, setOpenRemoveOptionModal] = useState(false);
  const [optionId, setOptionId] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(data.correctOptions || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOptionMenuToggle = () => {
    data.status !== 'ResultsAnnounced' && setIsMenuOpen((prev) => !prev);
  };

  const handleChangestatus = (id, value) => {
    // const containsIsInfinteTrue = questions.some(item => item.isInfinte === true);
    // setQuestionId(id);
    // setupdateValue(value);
    // setUpdateTimeModal(true);
    // if (containsIsInfinteTrue) {
    //   setConfirmModal(true);
    // }
    //************************************ */
    setOpenstatusModal(true);
    setQuestionId(id);
    setupdateValue(value);
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
        console.log(response.data.question.status)
        setStatus(response.data.question.status);
        setOpenstatusModal(false);
        if(response.data.question.status === "Active") {
          setUpdateTimeModal(true)
        }
        else if(response.data.question.status === "Expired") {
          setTimeRemaining(getRemaingTime(response.data.question.validUntil))
        }
        toast({
          title: "Success.",
          description: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        // setUpdateQuestions(response.data.question);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSelectAnswerOption = (item) => {
    if(item.status === "Inactive") return;
    setSelectedOptions((prevSelected) => {
      // Toggle selection
      if (prevSelected.includes(item._id.toString())) {
        return prevSelected.filter((id) => id !== item._id.toString());
      } else {
        return [...prevSelected, item._id.toString()];
      }
    });
  };

  const handleUpdateAnswerOptions = () => {
    const question = data;
    setIsMenuOpen(false);
    let body = JSON.stringify({
      "optionIds": selectedOptions,
      "tournamentId": question.tourId
    });
    
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/questions/update-answer/${question._id}`,
      headers: { 
        'x-access-token': localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      data : body
    };
    
    axios.request(config)
    .then((response) => {
      console.log(response.data);
      setUpdateQuestions(response.data.question)
      setcorrectOption(response.data.question.correctOptions);
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
    
    /*let data = JSON.stringify({
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
      })
      .catch((error) => {
        console.log(error);
      });*/
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

  /*
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
  */

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

  /* PUSHER CODE IMPLEMENTATION */
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_KEY, {
      cluster: process.env.REACT_APP_CLUSTER,
      useTLS: true
    });

    const channel = pusher.subscribe('expire-tournament-question');
    channel.bind('expire-tournament-question-notification', function(data) {
      // console.log("#Updated question data",data);
      // Handle the notification data as needed;
      if(data.length === 0) {
        console.log("Question expire")
        // setUpdateQuestions(data);
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const handleRemoveOption = () => {
    let data = JSON.stringify({
      "optionId": optionId,
      "status": "Inactive"
    });
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/questions/update-question-status/${questionId}`,
      headers: { 
        'x-access-token': localStorage.getItem("token"), 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      setUpdateQuestions(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleOpenCloseOptionModal = (questionId, option) => {
    setOpenRemoveOptionModal(true);
    setQuestionId(questionId);
    setOptionId(option._id);
  }

  const handleUpdatequestionTime = () => {
    let data = JSON.stringify({
      "isInfiniteTime": isInfiniteTime,
      "time": counter
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
      console.log("****************",response.data.question);
      setUpdateTimeModal(false)
      setUpdateQuestions(response.data.question);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
    {updateTimeModal && (
        <AlertModal
          isOpen={updateTimeModal}
          onClose={() => setUpdateTimeModal(false)}
          title={"Update question validity time"}
          body={
            <Box className="question_time_modal_body">
              <Box className="update_time_section">
                <Box className="counter_section">
                  <Button className={counter > 1 ? "counter_btn" : "disable_counter_btn"} onClick={handleDecrement}>
                    <FaMinus />
                  </Button>
                  <span className="counter">{counter}</span>
                  <Button className="counter_btn" onClick={() => setCounter((prev) => prev + 1)}>
                    <FiPlus />
                  </Button>
                </Box>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="infinite-time" mb="0">
                    Enable infinite time for question?
                  </FormLabel>
                  <Switch id="infinite-time" isChecked={isInfiniteTime} onChange={(e) => setIsInfiniteTime(e.target.checked)} />
                </FormControl>
              </Box>
            </Box>
          }
          footer={<Button className="modal_btn" onClick={handleUpdatequestionTime}>Update</Button>}
        />
      )}
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

      {
        openRemoveOptionModal &&
        <AlertModal 
          isOpen={openRemoveOptionModal}
          onClose={() => setOpenRemoveOptionModal(false)}
          title={"Remove option"}
          body={
            <Box className="question_time_modal_body">
              Do you want to remove this option
            </Box>
          }
          footer={
            <Button className='modal_btn' onClick={handleRemoveOption}>
                Remove
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
          {/* Question Index */}
          <Td className='td'>{index}</Td>

          {/* Tournament question */}
          <Td className='td'>{data.question}</Td>

          {/* Tournament question type */}
          <Td className='td'>{data.type}</Td>

          {/* Tournament options */}
          <Td className='td'>
            {
              (data.options || []).length > 0 ? 
              <Menu>
                <MenuButton as={Button} className="question_option_list" rightIcon={<FaAngleDown />}>
                  Question options
                </MenuButton>
                <MenuList className="question_options_menu_list">
                  {
                    data.options.map((item, index) => (
                      <MenuItem
                        className={item.status === "Inactive" ? 'question_menu_item line_through' : 'question_menu_item'}
                        >
                        <Box className="question_info_box">
                          <Img src={item.image} className="question_option_image" />
                          <span className={data.correctOption === item._id.toString() ? "question_option_text selected_question_option_text" : "question_option_text"}>
                            {item.text}
                          </span>
                        </Box>
                        <Button className="question_remove_btn" 
                          onClick={() => handleOpenCloseOptionModal(data._id, item, index)}
                        >
                          <AiOutlineClose />
                        </Button>
                      </MenuItem>
                    ))
                  }
                </MenuList>
              </Menu>
               : <Box>No option available</Box>
            }
          </Td>

          {/* Question remaing time */}
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

          {/* Question status */}
          <Td className='td'>
            {/* {status === "Initialised" ? (
              <Button
                className={`table_btn active ${status}`}
                onClick={() => handleChangestatus(data._id, "Active")}>
                Initialised
              </Button>
            ) : (
              <Button className='table_btn active'>
                {data.status}
              </Button>
            )} */}
            {
              status === 'Initialised' ? 
              <Menu>
                <MenuButton className={`table_btn active ${status}`} as={Button} rightIcon={<FaAngleDown />}>
                  {status}
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    onClick={() => handleChangestatus(data._id, "Active")}
                    className="question_status_menu_item"
                  >
                    Active
                  </MenuItem>
                </MenuList>
              </Menu> :
              <Menu>
                <MenuButton className={`table_btn ${status}`} as={Button} rightIcon={<FaAngleDown />}>
                  {status}
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    onClick={() => handleChangestatus(data._id, "Active")}
                    className="question_status_menu_item"
                  >
                    Active
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleChangestatus(data._id, "Expired")}
                    className="question_status_menu_item"
                  >
                    Expired
                  </MenuItem>
                </MenuList>
              </Menu>
            }
          </Td>

          {/* Question correct option */}
          <Td className='td'>
          <Menu isOpen={isMenuOpen}>
            <MenuButton as={Button} className="question_option_list" rightIcon={<FaAngleDown />} onClick={handleOptionMenuToggle}>
              {
                data.type === "SINGLE" && selectedOptions.length === 0 && "Select Correct Option"
              }
              {
                  data.type === "MULTIPLE" && selectedOptions.length === 0 && "Select Correct Options"
              }
              {
                  selectedOptions.length > 0 && (
                      <span>
                        {
                          selectedOptions
                              .map((optionId) => data.options.findIndex(option => option._id === optionId))
                              .filter((index) => index !== -1)
                              .sort((a, b) => a - b)
                              .map(index => index + 1)
                              .join(', ')
                      }
                      </span>
                  )
              }
            </MenuButton>
            <MenuList className="question_options_menu_list">
              {
                data.options.map((item, index) => (
                    <MenuItem
                        className={item.status === "Inactive" ? 'question_menu_item line_through' : 'question_menu_item'}
                        onClick={(e) => {
                          handleSelectAnswerOption(item);
                        }}
                    >
                      <Checkbox
                          isChecked={selectedOptions.includes(item._id.toString())}
                          onChange={() => handleSelectAnswerOption(item)}
                          size="lg"
                          ml={2}
                          mr={2}
                      />
                      <Img src={item.image} className="question_option_image"/>
                      <span
                          className={selectedOptions.includes(item._id.toString()) ? "question_option_text selected_question_option_text" : "question_option_text"}>
                          {item.text}
                      </span>
                    </MenuItem>
                ))
              }
            </MenuList>
          </Menu>
            {
              selectedOptions.length > 0 && !arraysEqual(data.correctOptions, selectedOptions) &&
                <Button leftIcon={<FaSave />} onClick={handleUpdateAnswerOptions} ml={2}>
                  Save
                </Button>
            }
          </Td>

          {/* Question Action button */}
          <Td className='td'>
            {
            status === "Initialised"  && <Button
              className='table_delete_btn'
              onClick={() => handleOpenDeleteModal(data._id)}>
              <AiOutlineDelete />
            </Button>
            }
            {/*{*/}
            {/*  status === "Initialised" && <Button className='table_edit_btn'>*/}
            {/*  <FaRegEdit />*/}
            {/*</Button>*/}
            {/*}*/}
            
          </Td>
        </Tr>
      )}
    </>
  );
};

export default QuestionComp;
