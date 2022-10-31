import * as React from "react";
import Avatar from "@mui/material/Avatar";
import avt from "../../images/av.jpg";
import "./ChatCardStyle.scss";
import { BsThreeDots } from "react-icons/bs";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RiArrowRightSLine } from "react-icons/ri";
import AvatarGroup from "@mui/material/AvatarGroup";
import {
  SetGroupChatting,
  SetIdConversation,
  SetUserChatting,
} from "../../store/Actions";
import Contex from "../../store/Context";
import useDateLogic from "../../hooks/useDateLogic";
import useCheckFile from "../../hooks/useCheckFile";
const ChatCardGroup = ({ status, conversation, socket }) => {
  const { state, depatch } = React.useContext(Contex);
  const { groupChatting, userChatting, user } = state;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { checkUrlIsImage, checkUrlIsDocx, checkUrlIsVideo } = useCheckFile();
  const open = Boolean(anchorEl);

  //custom hook
  const { handleDate } = useDateLogic();

  const { inFo, conversations } = conversation;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowOption = () => {
    alert("updating...");
  };

  const handleGroupChat = () => {
    //delete user chatting
    depatch(SetUserChatting(null));
    depatch(SetGroupChatting(inFo));
    depatch(SetIdConversation(inFo.idCon));
  };
  return (
    <div className="card_chat" onClick={() => handleGroupChat()}>
      <div className="card_group">
        {/* <div className="group_avatar">
          <Avatar className="avt group_avatar" alt="Remy Sharp" src={avt} />
          <Avatar className="avt group_avatar" alt="Remy Sharp" src={avt} />
          <Avatar className="avt group_avatar" alt="Remy Sharp" src={avt} />
          <Avatar className="avt" alt="4" />
        </div> */}

        <AvatarGroup max={4} className="group_avatar">
          <div>
            <Avatar
              className="avt avatar_item"
              alt="Remy Sharp"
              src={inFo.avatar[0].avaUser}
            />
            <Avatar
              className="avt avatar_item"
              alt="Remy Sharp"
              src={inFo.avatar[0].avaUser}
            />
          </div>
          <AvatarGroup max={2}>
            <Avatar
              className="avt avatar_item"
              alt="Remy Sharp"
              src={inFo.avatar[0].avaUser}
            />
            <Avatar
              className="avt avatar_item"
              alt="Remy Sharp"
              src={inFo.avatar[0].avaUser}
            />
            <Avatar
              className="avt avatar_item"
              alt="Remy Sharp"
              src={inFo.avatar[0].avaUser}
            />
          </AvatarGroup>
        </AvatarGroup>

        <div className="card_name">
          <h6 className="">{inFo.name}</h6>
          <p>
            <span>
              {conversations.lastMessage[0].userId === user.uid
                ? "Bạn: "
                : `${inFo.userInfo.map((user) => {
                    if (user.userId === user.uid) {
                      return user?.firstName + " " + user?.lastName;
                    }
                  })}`}{" "}
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
          {" "}
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
        {conversations?.mb?.numberUnread > 0 ? (
          <span className="numberNotification">
            {conversations?.mb?.numberUnread}
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

export default ChatCardGroup;
