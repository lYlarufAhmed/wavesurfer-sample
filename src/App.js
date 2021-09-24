import {
  // useCallback,
  useEffect,
  // , useRef
  useState,
} from "react";
import "./App.css";
import { useReactMediaRecorder } from "react-media-recorder";
import Track from "./Track";
import Visualizer from "./Visualizer";
const formattedDateTime = () => {
  let currentDateObj = new Date();
  return `${currentDateObj.getMonth()}-${currentDateObj.getDate()}-${currentDateObj.getFullYear()}_${currentDateObj
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDateObj
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};
function App() {
  let [tracks, setTracks] = useState(new Map());
  const [recordingName, setRecordingName] = useState();
  const [pause, setPause] = useState(false);
  const [recording, setRecording] = useState(false);
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    pauseRecording,
    resumeRecording,
    clearBlobUrl,
  } = useReactMediaRecorder({ audio: true });
  useEffect(() => {
    if (mediaBlobUrl) {
      setTracks((prev) => {
        if (!prev.has(mediaBlobUrl))
          prev.set(mediaBlobUrl, { title: recordingName });
        return new Map([...prev.entries()]);
      });
      clearBlobUrl();
    }
  }, [mediaBlobUrl, recordingName, clearBlobUrl]);
  const deleteTrack = (url) => {
    setTracks((prevState) => {
      prevState.delete(url);
      return JSON.parse(JSON.stringify(prevState));
    });
  };
  const handleToggleRecoring = () => {
    switch (status) {
      case "recording":
        setRecording(false);
        stopRecording();
        break;
      case "idle":
      case "stopped":
        setRecording(true);
        startRecording();
        setRecordingName(
          // `New_Idea_${Object.entries(tracks).length + 1}_${formattedDateTime()}`
          `New_Idea_${tracks.size + 1}_${formattedDateTime()}`
        );
        break;
      default:
        break;
    }
    // if (status === "recording") {
    //   stopRecording();
    // } else {
    //   startRecording();
    //   setRecordingName(
    //     // `New_Idea_${Object.entries(tracks).length + 1}_${formattedDateTime()}`
    //     `New_Idea_${tracks.size + 1}_${formattedDateTime()}`
    //   );
    // }
  };

  const handleToggleRecordingPause = async () => {
    if (pause) await resumeRecording();
    else await pauseRecording();

    setPause((prev) => !prev);
  };

  return (
    <div className="App">
      <p>{status}</p>
      {status === "recording" && (
        <Visualizer pause={pause} status={status} recording={recording} />
      )}
      <button onClick={handleToggleRecoring}>
        {status === "recording" ? "Stop" : "Record"}
      </button>
      {status === "recording" && (
        <button onClick={handleToggleRecordingPause}>
          {pause ? "Resume" : "Pause"}
        </button>
      )}
      {tracks.size > 0 &&
        [...tracks.entries()].map(([url, { title }], index) => (
          <Track
            key={url}
            url={url}
            count={index}
            title={title}
            handleDelete={() => deleteTrack(url)}
          />
        ))}
    </div>
  );
}

export default App;
