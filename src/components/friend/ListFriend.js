import "./index.scss";
import friend from "../../images/friend.png";
import Divider from "@mui/material/Divider";
import * as React from "react";

import { IoPersonAddSharp } from "react-icons/io5";
import avt from "../../images/av.jpg";

const ListFriend = () => {
  return (
    <div className="list_friend">
      <div className="block" style={{ padding: "0.5rem 1.5rem" }}>
        <span style={{ color: "var(--shades-left-bar)" }}>
          <IoPersonAddSharp />
        </span>
        <p>thêm bạn bè bằng gmail</p>
      </div>
      <div className="block">
        <img src={friend} />
        <p>danh sách kết bạn</p>
      </div>

      <Divider />
      <p style={{ padding: "0.5rem 1rem", fontWeight: "500" }}>Bạn bè (100)</p>
      <div className="group_friend">
        <div className="f_card">
          <img src={avt} />
          <p>anh huynh</p>
        </div>
        <div className="f_card">
          <img src={avt} />
          <p>anh huynh</p>
        </div>
      </div>
    </div>
  );
};

export default ListFriend;
