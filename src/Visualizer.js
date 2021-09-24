import { useCallback, useRef, useEffect, useMemo, useState } from "react";
import { WaveSurfer, WaveForm } from "wavesurfer-react";
import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone";

export default function Visualizer({ pause, status, recording }) {
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
    recording
      ? wavesurferRef.current.microphone.start()
      : wavesurferRef.current.microphone.stop();
  }, [recording]);
  useEffect(() => {
    if (pause) {
      wavesurferRef.current.microphone.pause();
      setResumeRequired(true);
    } else {
      if (resumeRequired) {
        wavesurferRef.current.microphone.play();
        setResumeRequired(false);
      }
    }
  }, [pause, resumeRequired]);
  return (
    <div style={{ width: "100%" }}>
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
        ></WaveForm>
      </WaveSurfer>
    </div>
  );
}
