import {
  // useCallback,
  useEffect,
  // , useRef
  useState,
} from "react";
import "./App.css";
import { useReactMediaRecorder } from "react-media-recorder";
import Track from "./Track";
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
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });
  useEffect(() => {
    if (mediaBlobUrl)
      setTracks((prev) => {
        if (!prev.has(mediaBlobUrl))
          prev.set(mediaBlobUrl, { title: recordingName });
        return new Map([...prev.entries()]);
      });
  }, [mediaBlobUrl, recordingName]);
  const deleteTrack = (url) => {
    setTracks((prevState) => {
      prevState.delete(url);
      return JSON.parse(JSON.stringify(prevState));
    });
  };
  const handleToggleRecoring = () => {
    if (status === "recording") {
      stopRecording();
    } else {
      startRecording();
      setRecordingName(
        // `New_Idea_${Object.entries(tracks).length + 1}_${formattedDateTime()}`
        `New_Idea_${tracks.size + 1}_${formattedDateTime()}`
      );
    }
  };

  return (
    <div className="App">
      <p>{status}</p>
      <button onClick={handleToggleRecoring}>
        {status === "recording" ? "Stop" : "Record"}
      </button>
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
