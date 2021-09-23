import {useCallback, useRef} from 'react'
import './App.css';
import {WaveSurfer, WaveForm} from "wavesurfer-react";
import {useReactMediaRecorder} from 'react-media-recorder'

function App() {
  // let url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3'
  const wavesurferRef = useRef()
  // let [recording, setRecording] = useState(false)
  // let [requireStop, setrequireStop] = useState(false)
  const {
      status,
      startRecording,
      stopRecording,
      mediaBlobUrl,
    } = useReactMediaRecorder({ audio: true });
  const play = useCallback(() => {
          wavesurferRef.current.playPause();
      }, []);
  const handleToggleRecoring = () => {
     if (status === 'recording')
      stopRecording()
     else
      startRecording()
   }
  const handleWSMount = useCallback(
          (waveSurfer) => {
              wavesurferRef.current = waveSurfer;
              if (wavesurferRef.current) {
                  wavesurferRef.current.load(mediaBlobUrl);


                  wavesurferRef.current.on("ready", () => {
                      console.log("WaveSurfer is ready");
                  });

                  wavesurferRef.current.on('finish', () => {
                      console.log('track End')
                  })


                  wavesurferRef.current.on("loading", data => {
                      console.log("loading --> ", data);
                  });


                  if (window) {
                      window.surferidze = wavesurferRef.current;
                  }
              }
          },
          [mediaBlobUrl]
      );
  return (
    <div className="App">
      {
        mediaBlobUrl && <>
        <h2>Wavesurfer component</h2>
     <WaveSurfer onMount={handleWSMount}>
                        <WaveForm waveColor={'f4f2f2'} cursorColor={'#00000000'} progressColor={'#EA1073'} height={50}
                                  id={`waveform`} fillParent={false} responsive={true}
                            //   pixelRatio={1}
                            backend={'MediaElement'}
                                  barHeight={3}
                        >
                        </WaveForm>
                    </WaveSurfer>
      <button onClick={play}>play/pause</button>
      <h2>
        Html audio component
      </h2>
      <audio controls>
        <source src={mediaBlobUrl}/>
      </audio>
        </>

      }
      <p>{status}</p>
      <button onClick={handleToggleRecoring}>
        {status === 'recording' ? 'Stop':'Record'}
      </button>

    </div>
  );
}

export default App;
