import * as React from "react";
import Avatar from "@mui/material/Avatar";
import avt from "../../images/av.jpg";
import "./ChatCardStyle.scss";
import { BsThreeDots } from "react-icons/bs";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RiArrowRightSLine } from "react-icons/ri";
import {
  SetGroupChatting,
  SetIdConversation,
  SetUserChatting,
} from "../../store/Actions";
import Contex from "../../store/Context";
import UserService from "../../services/UserService";
import { differenceInHours } from "date-fns";
import useDateLogic from "../../hooks/useDateLogic";
import useCheckFile from "../../hooks/useCheckFile";

const ChatCard = ({ conversation, socket, setConversations }) => {
  const { state, depatch } = React.useContext(Contex);
  //custom hook
  const { handleDate } = useDateLogic();
  const { checkUrlIsImage, checkUrlIsDocx, checkUrlIsVideo } = useCheckFile();
  //detructering...
  const { user, userSearched, idConversation, userChatting } = state;

  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [isChatting, setIsChatting] = React.useState(false);

  const open = Boolean(anchorEl);
  // console.log(conversation);

  const { inFo, conversations } = conversation;
  console.log(conversation);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowOption = () => {
    alert("updating...");
  };

  React.useEffect(() => {
    socket.current.on("get-last", (data) => {
      // setConversations(data);
      console.log(data);
      setConversations(data);
    });
  }, []);

  React.useEffect(() => {
    if (socket.current) {
      // socket.current.on("get-last-message", (data) => {
      //   // setConversations(data);
      //   const { listSender, listReceiver } = data;
      //   if (listSender[0].inFo.userIdFriend !== user.uid) {
      //     setConversations(listSender);
      //     console.log("S" + { listSender });
      //   } else if (listReceiver[0].inFo.userIdFriend !== user.uid) {
      //     setConversations(listReceiver);
      //     console.log("R" + listReceiver);
      //   }
      // });
    }
  }, [user]);

  //click 1 conversation -> show chat feed
  const handleShowChat = () => {
    // console.log("chat"+conversations._id);
    // console.log("old"+idConversation);

    // socket.current.emit("leave-room", idConversation);

    //featch user by id
    UserService.getById(inFo.userIdFriend)
      .then(function (snapshot) {
        // const { users } = snapshot.data();
        // console.log(snapshot.data());

        //set state
        depatch(SetUserChatting(snapshot.data()));
        //set id conversation current
        depatch(SetIdConversation(conversations._id));
      })
      .catch((err) => {
        console.log(err.message);
      });
    //delete groupChitting
    depatch(SetGroupChatting(null));
    if (socket.current) {
      socket.current.emit("seen-message", {
        conversationId: idConversation,
        userId: user.uid,
      });
    }
  };
  // How many hours are between 2 July 2014 06:50:00 and 2 July 2014 19:00:00?
  // const result = differenceInHours(
  //   new Date(),
  //   new Date("2022-10-17T14:30:53.856Z".replace("Z", ""))
  // );
  // console.log(result);
  // //=> 12
  //card_chat card_chat_active

  return (
    <div
      className={
        userChatting?.uid === inFo?.userIdFriend
          ? "card_chat card_chat_active"
          : "card_chat"
      }
      onClick={() => handleShowChat()}
    >
      <div className="card_group">
        {inFo?.avatar ? (
          <Avatar className="avt" src={inFo?.avatar} alt={inFo?.firstName} />
        ) : (
          <Avatar
            className="avt"
            style={{ textTransform: "capitalize", backgroundColor: "#e7f0ce" }}
            src={inFo?.avatar}
          >
            {inFo?.lastName[0]}
          </Avatar>
        )}
        <div className="card_name">
          <h6 className="">{inFo?.lastName + " " + inFo?.firstName}</h6>
          <p>
            <span>
              {conversations?.lastMessage[0].userId === user?.uid
                ? "Bạn:"
                : `${inFo?.lastName + " " + inFo?.firstName} : `}{" "}
            </span>
            <span className={conversations?.mb.numberUnread ? "active" : ""}>
              {conversations?.lastMessage[0]?.content.includes(
                "https://img.stipop.io"
              ) ? (
                "Sticker"
              ) : (
                <>
                  {checkUrlIsImage(conversations?.lastMessage[0]?.content) ? (
                    "hình ảnh"
                  ) : (
                    <>
                      {checkUrlIsVideo(
                        conversations?.lastMessage[0]?.content
                      ) ? (
                        "Video"
                      ) : (
                        <>
                          {checkUrlIsDocx(
                            conversations?.lastMessage[0]?.content
                          ) ? (
                            "File"
                          ) : (
                            <>
                              {conversations?.lastMessage[0]?.content.length >
                              20
                                ? conversations?.lastMessage[0]?.content.slice(
                                    0,
                                    10
                                  ) + "..."
                                : conversations?.lastMessage[0]?.content}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="group_right">
        <div className="card_time">
          {handleDate(
            new Date(),
            new Date(
              `${conversations.lastMessage[0].updatedAt}`.toLocaleString(
                "en-US",
                { timeZone: "Asia/Ho_Chi_Minh" }
              )
            )
          )}
        </div>
        {conversations.mb.numberUnread > 0 ? (
          <span className="numberNotification">
            {conversations.mb.numberUnread}
          </span>
        ) : null}
        <span
          className="threeDot"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <BsThreeDots />
        </span>
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          style={{ display: "flex", justifyContent: "space-between" }}
          onClick={handleClose}
        >
          Phân loại <RiArrowRightSLine />
        </MenuItem>
        <MenuItem onClick={handleClose}>Thêm vào nhóm</MenuItem>
        <MenuItem onClick={handleClose}>Ẩn trò chuyện</MenuItem>
        <Divider />
        <MenuItem style={{ color: "#E64848" }} onClick={handleClose}>
          Xóa hội thoại
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ChatCard;
