import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useState } from "react";

import "./ContentModal.css";
import Carousel from "../Carousel/Carousel";

import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../Config/config";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "90%",
    height: "80%",
    backgroundColor: "#39445a",
    border: "1px solid #282c34",
    borderRadius: 10,
    color: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3),
  },
}));
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

export const ContentModal = ({ children, media_type, id }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOpen = async (e) => {
    fetchData();
    await fetchVideo();
  };

  const handleClose = () => setOpen(false);
  const [video, setVideo] = useState();
  const [content, setContent] = useState({});

  const fetchData = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }
    const data = await response.json();
    setContent(data);

    // console.log(data, "content");
    setOpen(true);
  };

  const fetchVideo = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        setVideo(data.results[0].key);
      } else {
        console.error("No videos found");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <>
      <div
        className="media"
        style={{ cursor: "pointer" }}
        color="inherit"
        onClick={(i) => handleOpen(i)}
      >
        {children}
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className={classes.paper}>
            {content && (
              <div className="ContentModal">
                <img
                  src={
                    content.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                  alt={content.name || content.title}
                  className="ContentModal__portrait"
                />
                <img
                  src={
                    content.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                  alt={content.name || content.title}
                  className="ContentModal__landscape"
                />
                <div className="ContentModal__about">
                  <span className="ContentModal__title">
                    {content.name || content.title}(
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "_ _ _ _"
                    ).substring(0, 4)}
                    )
                  </span>
                  {content.tagline && (
                    <i className="tagline">{content.tagline}</i>
                  )}
                  <span className="ContentModal__description">
                    {content.overview}
                  </span>
                  <div>
                    <Carousel id={id} media_type={media_type} />
                  </div>

                  <Button
                    variant="contained"
                    startIcon={<YouTubeIcon />}
                    color="secondary"
                    target="__blank"
                    href={video && `https://www.youtube.com/watch?v=${video}`}
                    onClick={fetchVideo}
                  >
                    Watch the Trailer
                  </Button>
                </div>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ContentModal;
