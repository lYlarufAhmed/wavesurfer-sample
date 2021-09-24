import { useCallback, useRef, useEffect, useMemo, useState } from "react";
import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone";
import { WaveSurfer, WaveForm } from "wavesurfer-react";

export default function Visualizer({ pause, status }) {
  let [resumeRequired, setResumeRequired] = useState(false);
  const wavesurferRef = useRef();
  const plugins = useMemo(() => {
    return [
      {
        plugin: MicrophonePlugin,
      },
    ];
  }, []);
  const handleWSMount = useCallback((waveSurfer) => {
    wavesurferRef.current = waveSurfer;
    if (wavesurferRef.current) {
      // wavesurferRef.current.load(url);
      if (window) {
        window.surferidze = wavesurferRef.current;
      }
    }
  }, []);

  useEffect(() => {
    if (resumeRequired) wavesurferRef.current.microphone.play();

    if (pause) wavesurferRef.current.microphone.pause();

    setResumeRequired((prev) => !prev);
  }, [pause, resumeRequired]);

  useEffect(() => {
    // if (status === "recording") wavesurferRef.current.microphone.play();
    switch (status) {
      case "recording":
        wavesurferRef.current.microphone.start();
        break;
      case "stopped":
        wavesurferRef.current.microphone.stop();
        break;
      default:
        break;
    }
  }, [status]);

  return (
    <WaveSurfer plugins={plugins} onMount={handleWSMount}>
      <WaveForm
        cursorColor={"#00000000"}
        height={100}
        barGap={2}
        barWidth={3}
        id="rec-waveform"
        fillParent={true}
        responsive={true}
        barMinHeight={1}
        barHeight={30}
        backend={"MediaElement"}
      ></WaveForm>
    </WaveSurfer>
  );
}
