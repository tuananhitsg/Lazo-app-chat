import "./ListRequestStyle.scss";
import friend from "../../images/friend.png";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import avt from "../../images/av.jpg";

const ListRequestComponent = () => {
  return (
    <div className="list_request">
      <div className="list_top">
        <img
          src={friend}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <p>Danh sách kết bạn</p>
      </div>
      <div className="list_content" >
        <p className="content_title">Lời mời kết bạn (3)</p>
        <div className="cards">
          <div className="card">
            <div className="card_left">
              <img src={avt} />
              <div className="card_text">
                <p>Anh Huynh</p>
                <p>Muốn kết bạn</p>
                <p className="rep">Trả lời</p>
              </div>
            </div>
            <Stack spacing={2} direction="row">
              <Button variant="text">Bỏ qua</Button>
              <Button variant="contained">Đồng ý</Button>
            </Stack>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ListRequestComponent;
