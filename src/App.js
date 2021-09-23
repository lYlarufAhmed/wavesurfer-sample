import {useCallback,useEffect, useRef, useState} from 'react'
import './App.css';
import {WaveSurfer, WaveForm} from "wavesurfer-react";
import {useReactMediaRecorder} from 'react-media-recorder'


function Track({mediaBlobUrl, index}){
  const wavesurferRef = useRef()
  const play = useCallback(() => {
            wavesurferRef.current.playPause();
        }, []);
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
    <>
    <h1>Track {index+1}</h1>
        <h2>Wavesurfer component</h2>
     <WaveSurfer onMount={handleWSMount}>
                        <WaveForm waveColor={'f4f2f2'} cursorColor={'#00000000'} progressColor={'#EA1073'} height={50}
                                  id={`waveform-${index}`} fillParent={false} responsive={true}
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
      <hr/>
        </>
  )
}

function App() {
  // let url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3'
  // let [recording, setRecording] = useState(false)
  let [tracks, setTracks] = useState([])
  // let [requireStop, setrequireStop] = useState(false)
  const {
      status,
      startRecording,
      stopRecording,
      mediaBlobUrl,
    } = useReactMediaRecorder({ audio: true });
  useEffect(()=>{
    if (mediaBlobUrl) 
      setTracks(prev=>{
      if (!prev.includes(mediaBlobUrl))
        prev.push(mediaBlobUrl)
          return prev.slice()
        })
  }, [mediaBlobUrl]) 
  // const play = useCallback(() => {
  //         wavesurferRef.current.playPause();
  //     }, []);
  const handleToggleRecoring = () => {
     if (status === 'recording')
     {
      stopRecording()
      

     }
     else
      startRecording()
   }

  return (
    <div className="App">
      <p>{status}</p>
      <button onClick={handleToggleRecoring}>
        {status === 'recording' ? 'Stop':'Record'}
      </button>
      {
        tracks.length > 0 && tracks.map(( url, index)=><Track key={url} mediaBlobUrl={url} index={index}/>) 
        // tracks.length > 0 && tracks.map(url=><div>{url}</div>) 
      }
    </div>
  );
}

export default App;
