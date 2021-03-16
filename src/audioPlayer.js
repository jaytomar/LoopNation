import React, { useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "white",
  progressColor: "#296C96",
  barWidth: 2,
  barRadius: 1,
  barGap: 2,
  responsive: true,
  height: 80,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

export default function AudioPlayer({ url,name,author,genre }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const heartref = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  
  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function () {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    wavesurfer.current.on("finish", function () {
      setPlay(false)
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const onHeart = (e) => {
    heartref.current.classList.toggle("heart-red")
  }
  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  // const onVolumeChange = e => {
  //   const { target } = e;
  //   const newVolume = +target.value;

  //   if (newVolume) {
  //     setVolume(newVolume);
  //     wavesurfer.current.setVolume(newVolume || 1);
  //   }
  // };

  return (
    <>
      <div className="player-shadow">
        <div className="player-bg">
          <div className="player-main">
            <div className="player">
              <div className="controls">
                <button onClick={handlePlayPause}>
                  {playing ? (
                    <i className="fas fa-pause-circle fa-3x"></i>
                  ) : (
                    <i className="fas fa-play-circle fa-3x"></i>
                  )}
                </button>
              </div>
              <div id="waveform" ref={waveformRef} />
              <button className="controls download-btn">
              <i className="fas fa-arrow-alt-circle-down fa-2x"></i>
              </button>

            </div>
            <div className="genre">
              <p>00:00</p>
              <p>{genre}</p>
              <p>00:20</p>
            </div>
          </div>
          <div className="player-info">
            <div className="player-text">
              <h3>{name}</h3>
              <br />
              <h3 className="grey-text">by {author}</h3>
            </div>
            <div className="controls">
              <button onClick={onHeart}>
              <i className="fas fa-heart fa-2x heart-black" ref={heartref}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
