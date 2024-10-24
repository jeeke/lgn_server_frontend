/** @format */

import React, { useEffect, useState, useLayoutEffect } from "react";
import Layout from "../../Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import {
  Box,
  Button,
  Input,
  Image,
  Img,
  useToast,
} from "@chakra-ui/react";
import "./TournamentPage.css";
import FullModal from "../../Components/modalComp/FullModal";
import Inputcomp from "../../Components/InputComp/InputComp";
import ButtonComp from "../../Components/ButtonComp/AuthButton";
import { FiUpload } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import axios from "axios";
import Avatar from "../../Assets/download.jpeg";
import { IoMdClose } from "react-icons/io";
import Loader from "../../Components/Loader/Loader";
import TournamentsComp from "../../Components/TournamentsComp/TournamentsComp";
import InputComp from "../../Components/InputComp/InputComp";
import ListTournament from "./ListTournament";
import SearchTournament from "./SearchTournament";
import { GlobalContext } from "../../Context/Context";
import { FaCheck } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import Pusher from 'pusher-js';

const TournamentPage = () => {
  const toast = useToast();
  const { setPageType } = GlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setuserId] = useState("");
  const [selectUser, setSelectUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [tournament_by, settournament_by] = useState("");
  const [mainLoader, setMainLoader] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(10);
  const [loadPageBtn, setLoadPageBtn] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchtournamentsList, setSearchTournamentsList] = useState([]);
  const [updateTournament, setUpdateTournament] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [userLoading, setUserLoading] = useState(false);
  const [stepperCount, setStepperCount] = useState(1);
  const [forms, setForms] = useState([{ name: '', image: '' }]);
  const [tag, setTag] = useState('');
  const [tagList, setTagList] = useState([]);
  const [gameName, setGameName] = useState("");

  useLayoutEffect(() => {
    setPageType("Tournament");
  });

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_KEY, {
      cluster: process.env.REACT_APP_CLUSTER,
      useTLS: true
    });
    const channel = pusher.subscribe('tournaments');
    channel.bind('status-updated', (data) => {
      console.log('Received tournament update:', data);
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe('tournaments');
    };
  }, []);

  const handleIncrementPage = () => {
    setLoadPageBtn(true);
    setPage((prev) => prev + 1);
  };

  const handleCloseCreateBannerModal = () => {
    setOpenCreateModal(false);
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };
  const handleCloseImage = () => {
    setImage("");
    setPrevImage("");
  };

  useEffect(() => {
    setUserLoading(true);
    let data = JSON.stringify({
      name: name,
      email: "",
      mobile: "",
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/profile/search-streamers?page=1&limit=100`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setUsers(response.data.users);
        setUserLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setUserLoading(false);
      });
  }, [name]);

  const handleAddUser = (data) => {
    setuserId(data._id);
    settournament_by(data.name);
    setSelectUser(data);
    setUsers([]);
    setName("");
  };

  useEffect(() => {
    if (
      !title.trim() ||
      !date.trim() ||
      !time.trim() ||
      !link.trim() ||
      !description.trim() ||
      !image ||
      !userId.trim()
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [title, date, description, time, link, image, userId]);

  const handleCreateTournament = () => {
    setDisable(true);
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("token", "");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("game_name", gameName);
    formdata.append("tags", JSON.stringify(tagList));
    formdata.append("image", image);
    formdata.append("streaming_link", link);
    formdata.append("tournament_by", tournament_by);
    formdata.append("streaming_date", date);
    formdata.append("streaming_time", time);
    formdata.append("userId", userId);
    formdata.append("token", "");
    formdata.append("created_by", "admin");
    forms.forEach((opt, index) => {
      formdata.append(`options[${index}][name]`, opt.name);
      if (opt.image) {
        formdata.append(`options[${index}][image]`, opt.image);
      }
    });

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch(`${process.env.REACT_APP_BASE_URL}api/tournament/create`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setTournaments(prev => [result.tournament, ...prev]);
        setTitle("");
        setDescription("");
        setGameName("");
        setLink("");
        setDate("");
        setTime("");
        setPrevImage("");
        setImage("");
        settournament_by("");
        setuserId("");
        setUsers([]);
        setCurrentStep(1);
        setLoading(false);
        setOpenCreateModal(false);
        setTagList([]);
        setSelectUser("");
        setForms([{ name: '', image: '' }]);
        toast({
          title: "Success",
          description: "You successfully created a new stream.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        setTitle("");
        setDescription("");
        setGameName("");
        setLink("");
        setDate("");
        setTime("");
        setPrevImage("");
        setImage("");
        settournament_by("");
        setuserId("");
        setUsers([]);
        setLoading(false);
        setCurrentStep(1);
        setOpenCreateModal(false);
        setTagList([]);
        setSelectUser("");
        setForms([{ name: '', image: '' }]);
        toast({
          title: "Error",
          description: "something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (searchTitle.trim() !== "") {
      // console.log("SEARCH API call")
      if (page === 1) {
        setMainLoader(true);
      }
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/tournament/search_tournaments?name=${searchTitle}&page=${page}&limit=${limit}`,
        headers: {}
      };

      axios.request(config)
        .then((response) => {
          // console.log((response.data));
          setCount(response.data.tournaments.length);
          if (page === 1) {
            setSearchTournamentsList(response.data.tournaments);
          } else {
            setSearchTournamentsList((prev) => [...prev, ...response.data.tournaments]);
          }
          setMainLoader(false);
          setLoadPageBtn(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (page === 1) {
        setMainLoader(true);
      }
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_BASE_URL}api/tournament/?page=${page}&limit=${limit}`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          // console.log(response.data);
          setCount(response.data.tournaments.length);
          if (page === 1) {
            setTournaments(response.data.tournaments);
          } else {
            setTournaments((prev) => [...prev, ...response.data.tournaments]);
          }
          setMainLoader(false);
          setLoadPageBtn(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [searchTitle, page, setUpdateTournament]);

  const handleChangeName = e => {
    setSearchTitle(e.target.value);
  };

  const stepperIndicator = [
    { id: 1, title: "Basic Information" },
    { id: 2, title: "Select streamer" },
    { id: 3, title: "Create leaderboard gift" },
  ];


  const handleAddForm = () => {
    setForms([...forms, { position: '', name: '', image: '' }]);
  };

  const handleChange = (index, e) => {
    const newForms = [...forms];
    newForms[index][e.target.name] = e.target.value;
    setForms(newForms);
  };

  const handleGiftImageChange = (index, e) => {
    const newForms = [...forms];
    newForms[index].image = e.target.files[0];
    setForms(newForms);
  };

  const handleRemoveForm = (index) => {
    const newForms = forms.filter((_, i) => i !== index);
    setForms(newForms);
  };

  const handleChangeTags = (e) => {
    if (tagList.length < 3) {
      if (e.key === ' ' || e.key === 'Enter') {
        setTagList(prev => [...prev, tag]);
        setTag("");
      }
    } else {
      if (e.key === ' ' || e.key === 'Enter') {
        toast({
          title: "Warning",
          description: "You can add maximum 3 tags",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setTag("");
      }
    }
  };

  const removeTag = (value) => {
    const temp = tagList;
    const arr = temp.filter(data => data !== value);
    setTagList(arr);
  };

  return (
    <Layout>
      {/* Create a new stream */}
      <FullModal
        isOpen={openCreateModal}
        onClose={handleCloseCreateBannerModal}
        title={<Box className='banner_create_title'>Create new tournament</Box>}
        body={
          <Box className='create_tour_body'>
            <Box className="stepper_form_section">
              {
                stepperIndicator.map(data => (
                  <Box key={data.id} className="stepper_box">
                    {
                      currentStep < data.id ? <Box className="stepper_position">{data.id}</Box> :
                        <Box className="stepper_position complete_step">
                          <FaCheck className="tick_stepper" />
                        </Box>
                    }
                    <Box className="stepper_name">{data.title}</Box>
                  </Box>
                ))
              }
              <Box className="stepper_indicator" style={{ width: `${(currentStep - 1) * 40}%` }}></Box>
            </Box>

            {
              currentStep === 1 ? <>
                {/* Stream Title */}
                <Inputcomp
                  type='text'
                  placeholder='Stream title'
                  className='banner_input'
                  value={title}
                  handleChange={(e) => setTitle(e.target.value)}
                />

                {/* Stream Game name */}
                <Inputcomp
                  type='text'
                  placeholder='Stream game name'
                  className='banner_input'
                  value={gameName}
                  handleChange={(e) => setGameName(e.target.value)}
                />

                {/* Stream Description */}
                <Inputcomp
                  type='text'
                  placeholder='Stream description'
                  className='banner_input'
                  value={description}
                  handleChange={(e) => setDescription(e.target.value)}
                />

                {/* Stream Tags */}
                <Box className="tournament_tag_container">
                  {
                    tagList.map((value, index) => (
                      <Box key={index} className="tournament_tag" onClick={() => removeTag(value)}>
                        {value}
                      </Box>
                    ))
                  }
                </Box>
                <Input
                  type='text'
                  placeholder='Stream tags'
                  className='banner_input'
                  value={tag}
                  onChange={(e) => setTag(e.target.value.slice(0, 10))}
                  onKeyDown={e => handleChangeTags(e)}
                />

                {/* Stream Link */}
                <Inputcomp
                  type='text'
                  placeholder='provide Stream link'
                  className='banner_input'
                  value={link}
                  handleChange={(e) => setLink(e.target.value)}
                />
                {
                  link &&
                  <iframe
                    title="YouTube video player"
                    src={link}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                }
                <Inputcomp
                  type='date'
                  placeholder='provide Streaming date'
                  className='banner_input'
                  value={date}
                  handleChange={(e) => setDate(e.target.value)}
                />

                {/* Stream Time */}
                <Inputcomp
                  type='time'
                  placeholder='provide Streaming time'
                  className='banner_input'
                  value={time}
                  handleChange={(e) => setTime(e.target.value)}
                />
                {/* stream Image */}
                {
                  prevImage ? (
                    <Box className='banner_image_preview_setion'>
                      <Image src={prevImage} className='preview_image' />
                      <Button className='close_prev_btn' onClick={handleCloseImage}>
                        <MdClose />
                      </Button>
                    </Box>
                  ) : (
                    <Box className='banner_image_section'>
                      <label htmlFor='banner_image'>
                        <FiUpload className='banner_file_icon' />
                      </label>
                      <Input
                        type='file'
                        id='banner_image'
                        className='file_input'
                        onChange={(e) => handleImageChange(e)}
                      />
                    </Box>
                  )}
              </> :
                <>
                  {
                    currentStep === 2 ?
                      <>
                        {/* Select User */}
                        {selectUser && (
                          <Box
                            className='select_user_section'
                            onClick={() => setSelectUser("")}>
                            <span className='select_user_name'>{selectUser.name}</span>
                            <IoMdClose className='cancel_icon' />
                          </Box>
                        )}
                        {/* Search input form */}
                        <Inputcomp
                          type='text'
                          placeholder='Search user...'
                          className='banner_input'
                          value={name}
                          handleChange={(e) => setName(e.target.value)}
                        />
                        {/* Rendering user list */}
                        <Box className="modal_search_list">
                          {
                            userLoading ? <Box className="modal_search_loading">
                              <Loader />
                            </Box> :
                              <>
                                {(users || []).length > 0 ? (
                                  <Box className='user_list_section'>
                                    {users.map((data) => (
                                      <Box
                                        key={data._id}
                                        className='user_card'
                                        data={data._id}
                                        onClick={() => handleAddUser(data)}>
                                        <Img
                                          src={selectUser.profile_img || Avatar}
                                          className='user_avatar'
                                        />
                                        <span className='user_name'>{data.name}</span>
                                      </Box>
                                    ))}
                                  </Box>
                                ) : null}</>
                          }
                        </Box>
                      </> :
                      <Box className="form_groups_container">
                        {forms.map((form, index) => (
                          <Box key={index} className="form_group">
                            <Box className="form_control">
                              <Input
                                name="name"
                                placeholder="Enter gift title"
                                className='banner_input'
                                value={form.name}
                                onChange={(e) => handleChange(index, e)}
                              />
                            </Box>

                            <Box className="form_control">
                              <Input
                                type="file"
                                className='banner_input'
                                placeholder="Gift Image"
                                accept="image/*"
                                onChange={(e) => handleGiftImageChange(index, e)}
                              />
                            </Box>
                            {forms.length > 1 && (
                              <Button
                                className="remove_btn"
                                onClick={() => handleRemoveForm(index)}>
                                <FaRegTrashAlt />
                              </Button>
                            )}
                          </Box>
                        ))}
                        <Box className="add_more_btn_container">
                          <Button className="add_more_modal_btn" onClick={handleAddForm}>Add More</Button>
                        </Box>
                      </Box>
                  }
                </>
            }
          </Box>
        }
        footer={
          <Box className='create_banner_footer'>
            {
              currentStep === 3 ? <>
                {
                  currentStep !== 1 ? <Button className="modal_btn prev_stepper_btn" onClick={() => setCurrentStep(prev => prev - 1)}>Previous</Button> : <Button className="modal_btn disable_prev_stepper_btn">Previous</Button>
                }
                <ButtonComp
                  loading={loading}
                  disable={disable}
                  className='banner_create_btn'
                  disableClassName='disable_banner_create_btn'
                  text='Save'
                  handleClick={handleCreateTournament}
                />
              </>
                : <>
                  {
                    currentStep !== 1 ? <Button className="modal_btn prev_stepper_btn" onClick={() => setCurrentStep(prev => prev - 1)}>Previous</Button> : <Button className="modal_btn disable_prev_stepper_btn">Previous</Button>
                  }
                  <Button className="modal_btn" onClick={() => setCurrentStep(prev => prev + 1)}>Next</Button>
                </>
            }
          </Box>
        }
      />

      <Box className='banner_page_container'>
        {/* Header Section */}
        <Box className='header_section'>
          <Box className='header_back_section'>
            <Button className='back_button' onClick={() => navigate(-1)}>
              <MdKeyboardBackspace />
            </Button>
            <span className='header_title'>Tournament Management</span>
          </Box>
          {/* Name */}
          <InputComp
            type='name'
            placeholder={"Search tournament by title"}
            className={"search_input"}
            value={searchTitle}
            handleChange={(e) => handleChangeName(e)}
          />
          <Button
            className='create_banner_btn'
            onClick={() => setOpenCreateModal(true)}>
            Create stream
          </Button>
        </Box>

        <Box className='banner_section'>
          {
            !searchTitle.trim() ?
              <ListTournament
                tournaments={tournaments}
                handleIncrementPage={handleIncrementPage}
                count={count}
                limit={limit}
                mainLoader={mainLoader}
                loadPageBtn={loadPageBtn}
                setUpdateTournament={setUpdateTournament}
              /> :
              <SearchTournament
                tournaments={searchtournamentsList}
                handleIncrementPage={handleIncrementPage}
                count={count}
                limit={limit}
                mainLoader={mainLoader}
                loadPageBtn={loadPageBtn}
                setUpdateTournament={setUpdateTournament}
              />
          }

        </Box>
      </Box>
    </Layout>
  );
};

export default TournamentPage;
