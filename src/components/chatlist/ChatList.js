import "./ChatListStyle.scss";
import SearchComponent from "./SearchComponent";
import ChatCard from "./ChatCard";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import SearchList from "./SearchList";
import Contex from "../../store/Context";
import ChatCardGroup from "./ChatCardGroup";
import ListFriend from "../friend/ListFriend";
import conversationApi from "../../api/conversationApi";
// import {socket} from '../../store/socketClient';
import Skeleton from "@mui/material/Skeleton";
import { BsInbox } from "react-icons/bs";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const [listConversation, setListConversation] = React.useState([]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ChatList = ({ socket }) => {
  // console.log(socket);
  const [conversations, setConversations] = React.useState([]);
  // console.log(conversations);
  const { state, depatch } = React.useContext(Contex);
  //detructering...
  const { showTabHistorySearch, indexTab, user } = state;
  //console.log("chatlist " + user);
  const [value, setValue] = React.useState(0);

  const [loading, setLoading] = React.useState(true);

  const [panigation, setPanigation] = React.useState({ page: 0, size: 10 });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (socket.current) {
      // console.log(conversations);
      const ids = conversations.map((ele) => ele.conversations._id);
      socket.current.emit("join-conversations", ids);
      socket.current.on("get-last-message", (data) => {
        // console.log(data);
        // setConversations(data);
        const { listSender, listReceiver } = data;
        if (listSender[0].inFo.userIdFriend !== user.uid) {
          setConversations(listSender);
          console.log(listSender);
        } else if (listReceiver[0].inFo.userIdFriend !== user.uid) {
          setConversations(listReceiver);
          console.log(listReceiver);
        }
      });
    }
  }, [user, conversations]);

  //   React.useEffect(() => {
  //     if(socket.current){
  //       const ids = conversations.map((ele) => ele.conversations._id);
  //       console.log(ids);
  //       socket.current.emit("join-conversations", ids);
  //     }
  // }, []);

  React.useEffect(() => {
    //get api set list conversation
    //fetch product in wishlist
    const fetchConversations = async () => {
      try {
        const response = await conversationApi.getConversations(
          user.uid,
          panigation.page,
          panigation.size
        );

        const { data, page, size, totalPages } = response;
        console.log(data);
        if (response) {
          setConversations(data);
          setLoading(false);
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    fetchConversations();
  }, [user]);

  return (
    <div className="chatlist">
      <SearchComponent />
      {showTabHistorySearch ? (
        <SearchList />
      ) : (
        <React.Fragment>
          {indexTab === 0 ? (
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Tất cả" {...a11yProps(0)} />
                  <Tab label="Chưa đọc" {...a11yProps(1)} />
                </Tabs>
              </Box>

              <TabPanel value={value} index={0}>
                <div className="listChatCard">
                  {loading ? (
                    <>
                      <Box sx={{ padding: "12px" }}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                      </Box>
                      <Box sx={{ padding: "12px" }}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                      </Box>
                    </>
                  ) : (
                    <>
                      {conversations.length > 0 ? (
                        conversations?.map((conversation) => {
                          console.log(conversation);
                          if (conversation?.conversations?.type) {
                            return (
                              <ChatCardGroup
                                conversation={conversation}
                                key={Math.random()}
                                socket={socket}
                              />
                            );
                          } else {
                            return (
                              <ChatCard
                                conversation={conversation}
                                key={Math.random()}
                                socket={socket}
                                setConversations={setConversations}
                              />
                            );
                          }
                        })
                      ) : (
                        <div className="box_empty">
                          <span>
                            <BsInbox />
                          </span>
                          <p style={{ fontWeight: "500" }}>
                            Chưa có cuộc trò chuyện
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {/* <ChatCardGroup /> */}
                  {/* <ChatCardGroup />
                  <ChatCard />
                  <ChatCard status />
                  <ChatCard status />
                  <ChatCard />
                  <ChatCard /> */}
                  {/* <ChatCardGroup />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard />
                  <ChatCard /> */}
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="listChatCard">
                  {conversations ? (
                    conversations?.map((conversation) => {
                      if (conversation.conversations.mb.numberUnread > 0) {
                        return (
                          <ChatCard
                            conversation={conversation}
                            key={Math.random()}
                          />
                        );
                      }
                    })
                  ) : (
                    <p style={{ fontWeight: "500" }}>Không có</p>
                  )}
                </div>
              </TabPanel>
            </Box>
          ) : (
            <ListFriend />
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default ChatList;
