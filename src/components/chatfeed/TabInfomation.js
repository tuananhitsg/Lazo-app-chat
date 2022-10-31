import * as React from "react";
import "./TabInfomation.scss";
import Avatar from "@mui/material/Avatar";
import { AiOutlineBell } from "react-icons/ai";
import { MdGroupAdd } from "react-icons/md";
import { RiDeleteBin3Line } from "react-icons/ri";
import { TiAttachmentOutline } from "react-icons/ti";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import love from "../../images/love.jpg";
import Contex from "../../store/Context";
import { useContext } from "react";
const TabInfomation = () => {
  const { state, depatch } = useContext(Contex);

  //detructering...
  const { userChatting, groupChatting } = state;

  return (
    <div data-simplebar className="tab_infomation">
      <div>
        <div className="tab_info-header">
          <p>Thông tin hội thoại</p>
        </div>
        <div className="tab_info-content">
          <div className="content_top">
            {userChatting?.avatar ? (
              <Avatar
                className="avatarCustom"
                src={userChatting?.avatar}
                alt={userChatting?.first_name}
              />
            ) : (
              <Avatar
                className="avatarCustom"
                style={{ textTransform: "capitalize" }}
                src={userChatting?.avatar}
              >
                {userChatting?.last_name[0]}
              </Avatar>
            )}

            {groupChatting ? (
              <p style={{ textTransform: "capitalize" }}>
                {groupChatting.name}
              </p>
            ) : (
              <p style={{ textTransform: "capitalize" }}>
                {userChatting?.last_name + " " + userChatting?.first_name}
              </p>
            )}
          </div>
          <div className="content_icons">
            <div className="block_icon">
              <span>
                <AiOutlineBell />
              </span>
              <p>Tắt thông báo</p>
            </div>
            <div className="block_icon">
              <span>
                <TiAttachmentOutline />
              </span>
              <p>Ghim hội thoại</p>
            </div>
            {groupChatting ? (
              <div className="block_icon">
                <span>
                  <MdGroupAdd />
                </span>
                <p>Thêm thành viên</p>
              </div>
            ) : (
              <div className="block_icon">
                <span>
                  <MdGroupAdd />
                </span>
                <p>Tạo nhóm trò chuyện</p>
              </div>
            )}
          </div>
        </div>
        <div className="divide"></div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Ảnh/ Video</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ImageList
              sx={{ width: "auto", height: 450 }}
              cols={3}
              rowHeight={150}
              className="imageList"
            >
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    src={`${item.img}?w=150&h=150&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=150&h=150&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </AccordionDetails>
        </Accordion>
        <div className="divide"></div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>File</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <div className="divide"></div>
      </div>
      <div className="deleteChat">
        <span>
          <RiDeleteBin3Line />
        </span>
        <p>Xóa lịch xử trò chuyện</p>
      </div>
    </div>
  );
};

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];
export default TabInfomation;
