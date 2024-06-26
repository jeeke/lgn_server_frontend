import React,{useEffect, useState, useLayoutEffect} from 'react';
import { GlobalContext } from '../../Context/Context';
import {Box} from "@chakra-ui/react";
import "./Home.css";
import { MdKeyboardBackspace } from "react-icons/md";
import Layout from '../../Layout/Layout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {useSpring, animated} from "react-spring";
import axios from 'axios';
import Loader from '../../Components/Loader/Loader';

function TotalUserNo({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 }
  });
  return <animated.div>{number.to(n => n.toFixed(0))}</animated.div>
}

function TotalStreamerNo({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 }
  });
  return <animated.div>{number.to(n => n.toFixed(0))}</animated.div>
}

function TotalStreamsNo({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 }
  });
  return <animated.div>{number.to(n => n.toFixed(0))}</animated.div>
}

function TotalPendingStreamsNo({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 100,
    config: { mass: 1, tension: 20, friction: 10 }
  });
  return <animated.div>{number.to(n => n.toFixed(0))}</animated.div>
}

ChartJS.register(ArcElement, Tooltip, Legend);
const Home = () => {
  const {setPageType} = GlobalContext();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(0);
  const [streamers, setStreamers] = useState(0);
  const [pendingStreamers, setPendingStreamers] = useState(0);
  const [activeStreams, setActiveStreams] = useState(0);
  const [pendingStreams, setPendingstreams] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  useLayoutEffect(() => {
    setPageType('home');
  }, []);

  const data = {
    labels: [
      `Users: ${users}`,
      `Streamers: ${streamers}`,
      `Pending Streamers: ${pendingStreamers}`
    ],
    datasets: [
      {
        label: "User",
        data: [users, streamers, pendingStreamers],
        backgroundColor: [
          "rgba(255, 121, 121, 1)",
          "rgba(72, 52, 212, 1)",
          "rgba(240, 147, 43, 1)",
          "rgba(126, 214, 223, 1)",
        ],
        borderColor: [
          "rgba(255, 121, 121, 0.3)",
          "rgba(72, 52, 212, 0.3)",
          "rgba(240, 147, 43, 0.3)",
          "rgba(126, 214, 223, 0.3)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const data1 = {
    labels: [
      `Active Streams: ${activeStreams}`,
      `Total pending streams: ${pendingStreams}`
    ],
    datasets: [
      {
        label: "User",
        data: [activeStreams, pendingStreams],
        backgroundColor: [
          "rgba(240, 147, 43, 1)",
          "rgba(126, 214, 223, 1)",
        ],
        borderColor: [
          "rgba(240, 147, 43, 0.3)",
          "rgba(126, 214, 223, 0.3)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    setLoading(true)
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/v1/analytics`,
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      setAnalytics(response.data.analytics);
      setUsers(response.data.analytics.users);
      setStreamers(response.data.analytics.streamers);
      setPendingStreamers(response.data.analytics.pending_users);
      setActiveStreams(response.data.analytics.active_streams);
      setPendingstreams(response.data.analytics.pending_streams);
      setLoading(false)
    })
    .catch((error) => {
      console.log(error);
    });

  }, [])



  return (
    <Layout page="home">
      {
        loading ? <Box className='home_loader_container'><Loader /></Box> : 
        <>
        {
          analytics ? <Box className='home_container'>
            {/* Header Section */}
            <Box className="header_section">
              <span className='header_title'>Home</span>
            </Box>
            {/* Analytics Section */}
            <Box className='analytics_section'>
              <Box className="analytics_box">
                <Box className="inner_cntainer">
                  <Box className='analytics_text'>Total no. of Users</Box>
                  <Box className='analytics_count'><TotalUserNo n={users} /></Box>
                </Box>
              </Box>

              <Box className="analytics_box">
                <Box className="inner_cntainer">
                  <Box className='analytics_text'>Total active streamers</Box>
                  <Box className='analytics_count'><TotalStreamerNo n={streamers} /></Box>
                </Box>
              </Box>

              <Box className="analytics_box">
                <Box className="inner_cntainer">
                  <Box className='analytics_text'>Total pending streamers</Box>
                  <Box className='analytics_count'><TotalStreamerNo n={streamers} /></Box>
                </Box>
              </Box>

              {/* <Box className="analytics_box">
                <Box className="inner_cntainer">
                  <Box className='analytics_text'>Total Streames</Box>
                  <Box className='analytics_count'><TotalStreamsNo n={pendingStreamers} /></Box>
                </Box>
              </Box> */}

              <Box className="analytics_box">
                <Box className="inner_cntainer">
                  <Box className='analytics_text'>Total no. of active stream</Box>
                  <Box className='analytics_count'><TotalPendingStreamsNo n={activeStreams} /></Box>
                </Box>
              </Box>

              <Box className="analytics_box">
                <Box className="inner_cntainer">
                  <Box className='analytics_text'>Total no. of pending streams</Box>
                  <Box className='analytics_count'><TotalPendingStreamsNo n={pendingStreams} /></Box>
                </Box>
              </Box>
            </Box>

            {/* Graph Details Section */}
            <Box className='pie_container'>
              <Pie data={data} />
              <Pie data={data1} />
            </Box>
          </Box> : 
          <Box className='home_empty_container'>No data found</Box> 
        }
        </>
      }
    </Layout>
  )
}

export default Home;