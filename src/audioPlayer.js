import React, { useEffect, useRef, useState } from "react";
import { dbService } from "./fbase";
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

export default function AudioPlayer({
  id,
  url,
  name,
  author,
  genre,
  bpm,
  index,
  audioKey,
  scale,
  likes,
  setAudioData,
  audioData,
  profileInfo,
  likesArray,
  setLikesArray
}) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const heartref = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [liked, setLiked] = useState(false);

  var likesRef = dbService.collection("likes").doc(profileInfo.username);
  var likesCountRef = dbService.collection("audios").doc(id)

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
        setDuration(calcTime(wavesurfer.current.getDuration()));
        const time = calcTime(wavesurfer.current.getCurrentTime());
        setCurrentTime(time);
      }
    });

    wavesurfer.current.on("audioprocess", function () {
      if (wavesurfer.current) {
        const time = calcTime(wavesurfer.current.getCurrentTime());
        setCurrentTime(time);
      }
    });

    const calcTime = (time) => {
      var minutes = Math.floor(time / 60);
      var seconds = Math.floor(time - minutes * 60);
      var timeString =
        ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

      return timeString;
    };

    wavesurfer.current.on("finish", function () {
      setPlay(false);
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const onHeart = (e) => {
    console.log(liked);
    if (profileInfo) {
      
      let newLikes = [...likesArray,id]
      let items = [...audioData];
      let item = { ...items[index] };
      if (!likesArray.includes(id)) {
        item.likes = item.likes + 1;
        items[index] = item;
        setAudioData(items);
        setLikesArray(newLikes)
        likesCountRef.update("likes",(item.likes))
        likesRef.set({ likes: newLikes });
      } else {
        item.likes = item.likes - 1;
        items[index] = item;
        setAudioData(items);
        var arr = [...likesArray]
        var audioIndex = arr.indexOf(id);
        if (audioIndex !== -1) {
          arr.splice(audioIndex, 1);
        }
        console.log(arr);
        setLikesArray(arr)
        likesRef.set({likes: [...arr]});
        likesCountRef.update("likes",(item.likes))
      }
    }
  };
  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };
  const stopAudio = () => {
    setPlay(false);
    wavesurfer.current.pause();
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
                <button onClick={handlePlayPause} onBlur={stopAudio}>
                  {playing ? (
                    <i className="fas fa-pause-circle fa-3x"></i>
                  ) : (
                    <i className="fas fa-play-circle fa-3x"></i>
                  )}
                </button>
              </div>
              <div id="waveform" ref={waveformRef} />
              <a href={url} target="_blank" download={name}>
                <button className="controls download-btn">
                  <i className="fas fa-arrow-alt-circle-down fa-2x"></i>
                </button>
              </a>
            </div>
            <div className="genre">
              <p>{currentTime}</p>
              <p>{genre}</p>
              <p>{duration}</p>
            </div>
          </div>
          <div className="player-info">
            <div className="player-text">
              <div className="audio-tags">
                {audioKey == "No Key" ? (
                  ""
                ) : (
                  <h3>{audioKey + (scale || "")}</h3>
                )}
                <h3>{bpm + " BPM"}</h3>
              </div>
              <div className="title-author">
                <a href={"/" + author + "/" + id}>
                  <h3>{name}</h3>
                </a>
                <h3 className="grey-text">
                  by&nbsp;
                  <a href={"/" + author}>{author}</a>
                </h3>
              </div>
            </div>
            <div className="">
              <button className="heart-btn" onClick={onHeart}>
                {likesArray.includes(id) ? (
                  <i
                    className="fas fa-heart fa-2x heart-black heart-red"
                    ref={heartref}
                  ></i>
                ) : (
                  <i
                    className="fas fa-heart fa-2x heart-black"
                    ref={heartref}
                  ></i>
                )}
                <p>{likes}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
