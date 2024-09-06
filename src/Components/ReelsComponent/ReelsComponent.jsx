import React,{useState} from 'react';
import {Box, Button, Input,Menu,
    MenuButton,
    MenuList,
    MenuItem, Textarea} from "@chakra-ui/react";
import AlertModal from "../modalComp/AlertModal";
import FullModal from "../modalComp/FullModal";
import "./ReelsComponent.css";
import { FaRegHeart } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import axios from 'axios';


const ReelsComponent = ({data}) => {
    console.log(data)
    const [title, setTitle] = useState(data.title);
    const [game, setGame] = useState(data.game);
    const [likes, setLikes] = useState(data.likes || []);
    const [video, setVideo] = useState(data.video_link);
    const [isDelete, setIsDelete] = useState(data.status);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [reelsId, setReelsId] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [description, setDescription] = useState(data.description || "");

    const handleOpenDeleteModal = (id) => {
        setReelsId(id);
        setOpenDeleteModal(true)
    }

    const handleDeleteReels = () => {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/v1/reels/update-status/${reelsId}`,
            headers: { 
              'x-access-token': localStorage.getItem("token") }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(response.data)
            setIsDelete(response.data.reels.status);
            setOpenDeleteModal(false)
          })
          .catch((error) => {
            console.log(error);
            setOpenDeleteModal(false)
          });
    }

    const handleOpenEditModal = (id) => {
        setOpenEditModal(true);
        setReelsId(id);
    }

    const handleEditReels = () => {
        let data = JSON.stringify({
            "title": title,
            "game": game,
            "description": description
          });
          
          let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BASE_URL}api/v1/reels/update-details/${reelsId}`,
            headers: { 
              'x-access-token': localStorage.getItem("token"), 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            setOpenEditModal(false)
          })
          .catch((error) => {
            console.log(error);
            setOpenEditModal(false)
          });
    }

  return (
    <>
    <FullModal 
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title={"Edit reels"}
        body={
            <Box className='store_modal_body'>
                <Input
                    type='text'
                    className='store_input'
                    placeholder='Enter reels title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    type='text'
                    className='store_input'
                    placeholder='Enter game title'
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                />
                <Textarea
                    type='text'
                    className='store_input'
                    placeholder='Gift details'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>
        }
        footer={
            <Box className='store_modal_footer'>
              <Button
                className='modal_footer_store_button'
                onClick={handleEditReels}>
                Update
              </Button>
            </Box>
          }
    />
    <AlertModal 
    isOpen={openDeleteModal}
    onClose={() => setOpenDeleteModal(false)}
    title={"Delete reels"}
    body="Do you want to delete reels?"
    footer={
        <Button className='modal_btn' onClick={handleDeleteReels}>Delete</Button>
    }
    />
    {
        isDelete === "active" &&
        <Box className='reels_component'>
        <Menu classNam='currency_menu'>
            <MenuButton className='reels_menu_btn' as={Button}>
                <MdMoreHoriz />
                    {/* <FaAngleDown className='currency_menu_icon' /> */}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      className='menu_item' onClick={() => handleOpenEditModal(data._id)}>
                      Edit
                    </MenuItem>
                    <MenuItem
                    onClick={() => handleOpenDeleteModal(data._id)}
                      className='menu_item delete_text'>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
        <video className='video' controls>
            <source src={video} type="video/mp4" />
        </video>
        <Box className='reels_title'>{title}</Box>
        <span className="game_tag">{game}</span>
        <Box className="reels_description">{description}</Box>
        {
          (data.tags || []).length > 0 &&
          <Box className='tag_container'>
          {
            data.tags.map((tag, index) => (
              <Box className='tag_item' key={index}>{tag}</Box>
            ))
          }
          </Box>
        }
        <Box className='reels_like'><FaRegHeart className='likes_icon' />{" "}<span className='likes_count'>{likes.length}</span></Box>
    </Box>
    }
    </>
  )
}

export default ReelsComponent