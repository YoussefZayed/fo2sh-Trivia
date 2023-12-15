import React, { useState, useEffect } from "react";

const TextToSpeech = ({
  text,
  setEnded,
  shouldStart,
  setCharIndex,
  prefix,
  isPaused,
}) => {
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    if (shouldStart) {
      console.log("starting");
      const synth = window.speechSynthesis;

      if (isPaused) {
        synth.resume();
      }
      if (utterance) {
        console.log("speaking");
        synth.speak(utterance);
      }
    }
  }, [utterance]);

  useEffect(() => {
    if (isPaused) {
      console.log("paused");
      const synth = window.speechSynthesis;
      synth.pause();
    } else {
      console.log("resumed");
      const synth = window.speechSynthesis;
      synth.resume();
    }
  }, [isPaused]);

  useEffect(() => {
    console.log("text changed");
    console.log(text);
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(prefix + text);
    u.addEventListener("boundary", (e) => {
      let charIndex =
        e.charIndex - prefix.length > 0 ? e.charIndex - prefix.length : 0;
      if (charIndex > text.length) {
        charIndex = text.length + prefix.length;
      }
      setCharIndex(charIndex);
    });

    u.lang = "en-US";
    u.onmark = (e) => {
      console.log("mark");
      console.log(e);
    };
    u.onstart = () => {
      console.log("started");
      setEnded(false);
    };
    u.onend = () => {
      console.log("ended");
      setCharIndex(text.length);
      setEnded(true);
    };
    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  return <div></div>;
};

export default TextToSpeech;
