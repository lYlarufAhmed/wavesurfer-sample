import React, { useCallback, useRef, useState } from "react";
import { WaveSurfer, WaveForm } from "wavesurfer-react";
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  Delete,
  PauseCircleFilled,
  PlayCircleFilled,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  iconColor: {
    color: "#EA1073",
  },
}));

export default function Track({ url, title, count, handleDelete }) {
  const classes = useStyles();
  const wavesurferRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [, setDuration] = useState(0);
  const handleWSMount = useCallback(
    (waveSurfer) => {
      wavesurferRef.current = waveSurfer;
      if (wavesurferRef.current) {
        wavesurferRef.current.load(url);

        wavesurferRef.current.on("ready", () => {
          console.log("WaveSurfer is ready");
          setDuration(wavesurferRef.current.getDuration());
        });

        wavesurferRef.current.on("finish", () => {
          console.log("track End");
          setPlaying(false);
        });

        wavesurferRef.current.on("loading", (data) => {
          console.log("loading --> ", data);
        });

        if (window) {
          window.surferidze = wavesurferRef.current;
        }
      }
    },
    [url]
  );

  const deleteTrack = useCallback(() => {
    wavesurferRef.current.destroy();
    handleDelete(title);
  }, [handleDelete, title]);
  const play = useCallback(() => {
    wavesurferRef.current.playPause();
    setPlaying((prevState) => !prevState);
  }, []);

  return (
    <ListItem button>
      <ListItemIcon>
        {playing ? (
          <PauseCircleFilled
            onClick={play}
            className={classes.iconColor}
            fontSize={"large"}
          />
        ) : (
          <PlayCircleFilled
            onClick={play}
            className={classes.iconColor}
            fontSize={"large"}
          />
        )}
      </ListItemIcon>
      <ListItemText>
        <React.Fragment>
          <Typography variant={"subtitle1"}>{title}</Typography>
          <WaveSurfer onMount={handleWSMount}>
            <WaveForm
              waveColor={"f4f2f2"}
              cursorColor={"#00000000"}
              progressColor={"#EA1073"}
              height={50}
              id={`waveform-${count}`}
              fillParent={false}
              responsive={true}
              backend={"MediaElement"}
              barHeight={3}
            ></WaveForm>
          </WaveSurfer>
        </React.Fragment>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={deleteTrack}
          children={<Delete className={classes.iconColor} />}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
