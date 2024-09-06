import React, { useEffect, useState } from "react";
import {
  Box,
  Textarea,
  useToast,
  Input,
  Button,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import InputComp from "../../Components/InputComp/InputComp";
import ButtonComp from "../../Components/ButtonComp/AuthButton";
import axios from "axios";
import AlertModal from "../../Components/modalComp/AlertModal";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";

const MAX_OPTIONS = 16;

const QuestionForm = ({ id }) => {
  const toast = useToast();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", image: "" }, { text: "", image: "" }]); // Starting with 2 options
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [updateTimeModal, setUpdateTimeModal] = useState(false);
  const [selectTime, setSelectTime] = useState();
  const [counter, setCounter] = useState(3);
  const [isInfiniteTime, setIsInfiniteTime] = useState(false);
  const [questionId, setQuestionId] = useState("");

  useEffect(() => {
    if (!question.trim() || options.some(opt => !opt.text.trim())) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [question, options]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleImageChange = (index, e) => {
    handleOptionChange(index, "image", e.target.files[0]);
  };

  const handleAddOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, { text: "", image: "" }]);
    } else {
      toast({
        title: "Maximum Options Reached",
        description: "You cannot add more than 16 options.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, optIndex) => optIndex !== index);
      setOptions(newOptions);
    } else {
      toast({
        title: "Minimum Options Required",
        description: "You must have at least 2 options.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
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
      console.log((response.data));
      setUpdateTimeModal(false)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleAskQuestion = () => {
    setDisable(true);
    setLoading(true);
    console.log("** Options:", options)
    const myHeaders = new Headers();
    myHeaders.append("x-access-token", localStorage.getItem("token"));
    const formdata = new FormData();
    formdata.append("question", question);
    formdata.append("tourId", id);
    options.forEach((opt, index) => {
      formdata.append(`options[${index}][text]`, opt.text);
      if (opt.image) {
        formdata.append(`options[${index}][image]`, opt.image);
      }
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    fetch(`${process.env.REACT_APP_BASE_URL}api/v1/questions/create`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 201) {
          const now = new Date();
          const expirationDate = new Date(result.question.validUntil);
          const distance = expirationDate.getTime() - now.getTime();

          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setSelectTime(minutes);
          toast({
            title: "Question created.",
            description: "Your question has been created successfully.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setQuestion("");
          setOptions([{ text: "", image: "" }, { text: "", image: "" }]);
          setLoading(false);
          setQuestionId(result.question._id);
          // setUpdateTimeModal(true)
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box className="question_form_section">
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
      <Textarea
        type="text"
        placeholder="Ask question?"
        className="textarea_input_form"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, index) => (
        <Box key={index} className="option_box">
          <Box className="option_header">
            Option {String.fromCharCode(65 + index)}
            {
              index>1 && <Button
              onClick={() => handleRemoveOption(index)}
              size="sm"
              ml="2"
              className="remove_option_btn"
              leftIcon={<FiTrash2 />}
            >
            </Button>
            }
          </Box>
          <InputComp
            type="text"
            placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
            className="option_input"
            value={option.text}
            handleChange={(e) => handleOptionChange(index, "text", e.target.value)}
          />
          <br />
          <Input
            type="file"
            className="option_input"
            onChange={(e) => handleImageChange(index, e)}
          />
        </Box>
      ))}
      {options.length < MAX_OPTIONS && (
        <Box className="option_form_btn">
          <Button 
            onClick={handleAddOption} 
            className="add_more_options_btn" 
            leftIcon={<FiPlus />}>
            Add Option
          </Button>
        </Box>
      )}
      <ButtonComp
        disable={disable}
        loading={loading}
        className="create_question_btn"
        disableClassName="disable_create_question_btn"
        text="Create Question"
        handleClick={handleAskQuestion}
      />
    </Box>
  );
};

export default QuestionForm;
