import * as React from "react";

import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

import avt from "../images/av.jpg";
import "./TabBarStyle.scss";

import { BiMessageRoundedDetail } from "react-icons/bi";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { RiContactsBook2Line } from "react-icons/ri";
import { arrIconOption } from "../data/Data";
import ModelDetailUser from "./model/ModelDetailUser";
import Contex from "../store/Context";
import {
  SetIdConversation,
  SetIndexTab,
  SetUser,
  SetUserChatting,
} from "../store/Actions";

import { useNavigate } from "react-router-dom";

import firebase from "../firebase";
import "firebase/compat/auth";
import AlertNotification from "./model/AlertNotification";

const TabBarComponent = ({ socket, a }) => {
  const [openModelUser, setOpenModelUser] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const { state, depatch } = React.useContext(Contex);
  //detructering...
  const { user, indexTab } = state;
  //console.log("index tab " + indexTab);
  //show model
  //console.log(socket)
  const [openAlert, setOpenAlert] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {}, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  //open model detail user info
  const handleOpenModel = (e) => {
    handleClose(e);
    setOpenModelUser(true);
  };

  const handleLogout = (e) => {
    //show model
    setOpenAlert(true);
    depatch(SetIdConversation(null));
    depatch(SetUserChatting(null));
  };

  const handleLogoutMain = () => {
    //log out
    firebase.auth().signOut();

    //delete user current
    depatch(SetUser(null));
    if (socket.current) {
      socket.current.emit("out");
    }
  };
  const closeOpenAlert = () => {
    setOpenAlert(false);
  };

  const handleIndexTab = (idx) => {
    depatch(SetIndexTab(idx));
  };
  return (
    <div className="tab-bar">
      <div className="bar_top">
        {user?.avatar ? (
          <Avatar
            className="avatar"
            src={user?.avatar}
            ref={anchorRef}
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            alt={user?.first_name}
          />
        ) : (
          <Avatar
            className="avatar"
            onClick={handleToggle}
            src={user?.avatar}
            ref={anchorRef}
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            style={{ backgroundColor: "#e7f0ce" }}
          >
            {user?.last_name[0]}
          </Avatar>
        )}

        <ul className="option_icons">
          {arrIconOption.map((val, idx) => {
            return (
              <li
                key={val.id}
                className={
                  indexTab === idx ? "option_icon active" : "option_icon"
                }
                onClick={() => handleIndexTab(idx)}
                title={val.name}
              >
                <span>{val.icon}</span>
              </li>
            );
          })}
        </ul>

        <ModelDetailUser
          openModelUser={openModelUser}
          setOpenModelUser={setOpenModelUser}
        />

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="left-start"
          transition
          disablePortal
          style={{ zIndex: "100" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "left-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    className="menu_list"
                  >
                    <MenuItem
                      className="name
                    "
                    >
                      {user?.first_name + " " + user?.last_name}
                    </MenuItem>
                    <MenuItem
                      className="item"
                      onClick={(e) => handleOpenModel(e)}
                    >
                      Hồ sơ của bạn
                    </MenuItem>
                    <MenuItem className="item" onClick={handleClose}>
                      Cài đặt
                    </MenuItem>
                    <MenuItem className="item" onClick={(e) => handleLogout(e)}>
                      Đăng xuất
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <div className="bar_bottom">
        <ul className="option_icons">
          <li className="option_icon" title="Cài đặt" onClick={handleToggle}>
            <SettingsIcon className="icon_setting" />
          </li>
        </ul>
      </div>
      {openAlert ? (
        <AlertNotification
          openAlert={openAlert}
          closeOpenAlert={closeOpenAlert}
          handleLogoutMain={handleLogoutMain}
          title={{ text: "Bạn có muốn đăng xuất không?", status: "logout" }}
        />
      ) : null}
    </div>
  );
};

export default TabBarComponent;
