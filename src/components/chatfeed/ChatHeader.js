import "./ChatHeaderStyle.scss";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";
import Context from "../../store/Context";
import { SetShowTabInfo } from "../../store/Actions";
import ModelDetailUser from "../model/ModelDetailUser";
import love from "../../images/love.jpg";
import { format } from "timeago.js";
const ChatHeader = ({ userChatting, socket }) => {
  const { state, depatch } = React.useContext(Context);
  const [openModelUser, setOpenModelUser] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(false);
  const [lastLogin, setLastLogin] = React.useState("");

  //detructering...
  const { showTabInfo, idConversation, user, groupChatting } = state;

  const handleShowTabInfo = () => {
    depatch(SetShowTabInfo(!showTabInfo));
  };

  const handleShowInfo = (params) => {
    setOpenModelUser(true);
  };

  React.useEffect(() => {
    if (idConversation) {
      socket.current.emit(
        "get-user-online",
        userChatting.uid,
        ({ isOnline, lastLogin }) => {
          setIsOnline(isOnline);
          setLastLogin(lastLogin);
          console.log(userChatting.uid, isOnline, lastLogin);
        }
      );
    }
  }, [idConversation]);

  const paseDate = format(lastLogin, "vi_VN");
  //console.log(paseDate);

  return (
    <div className="chat_header">
      <div className="chat_header-info">
        {userChatting?.avatar ? (
          <React.Fragment>
            <div className="info_block">
              <Avatar
                className="avt"
                src={userChatting?.avatar}
                alt={userChatting?.first_name}
                onClick={() => handleShowInfo()}
                style={{ backgroundColor: "#e7f0ce" }}
              />
              {isOnline ? <div className="statusOnline"></div> : null}
            </div>
          </React.Fragment>
        ) : (
          <div className="info_block">
            <Avatar
              className="avt"
              style={{ textTransform: "capitalize" }}
              src={userChatting?.avatar}
              onClick={() => handleShowInfo()}
            >
              {userChatting?.last_name[0]}
            </Avatar>
            {isOnline ? <div className="statusOnline"></div> : null}
          </div>
        )}

        <div className="info_text">
          <span className="info_name">
            {userChatting?.last_name + " " + userChatting?.first_name}
          </span>
          {/* // <span className="info_online">{isOnline ? "0" : "1"}</span> */}
          <span className="info_hour">
            {isOnline ? "Vừa truy cập" : "" + paseDate}
          </span>
        </div>
      </div>
      <ModelDetailUser
        openModelUser={openModelUser}
        setOpenModelUser={setOpenModelUser}
        friend
      />

      <div className="block_icon">
        <span className="icon" title="Cuộc gọi video">
          <BsCameraVideo />
        </span>
        <span
          className={showTabInfo ? "icon choise" : "icon"}
          title="Thông tin hội thoại"
          onClick={() => handleShowTabInfo()}
        >
          <BsLayoutSidebarReverse />
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
