import {useCallback, useRef} from 'react'
import './App.css';
import {WaveSurfer, WaveForm} from "wavesurfer-react";

function App() {
  let url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3'
  const wavesurferRef = useRef()
  const play = useCallback(() => {
          wavesurferRef.current.playPause();
      }, []);
  const handleWSMount = useCallback(
          (waveSurfer) => {
              wavesurferRef.current = waveSurfer;
              if (wavesurferRef.current) {
                  wavesurferRef.current.load(url);


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
          [url]
      );
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
