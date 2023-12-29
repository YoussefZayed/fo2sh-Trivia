import React, { useState, useEffect } from "react";
import {
  AppShell,
  Title,
  Text,
  Button,
  Group,
  ScrollArea,
  Table,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Link } from "react-router-dom";
import Tvbackground_f02sh_pointing_right from "../imgs/10230.jpg";
import socketIO from "socket.io-client";
import TextToSpeech from "./tts";
import useSound from "use-sound";
import buzz from "/short-buzzer.wav";

const socket = socketIO.connect(
  "https://fo2sh-trivia-be-production.up.railway.app/"
);

export default function PlayerPage() {
  const [users, setUsers] = useState([]);
  const [question, setQuestion] = useState("");
  const [gameState, setGameState] = useState("waiting");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasPresenter, setHasPresenter] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [timeLimit, setTimeLimit] = useState(10);
  const [buzzed, setBuzzed] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionSaid, setQuestionSaid] = useState(false);
  const [shouldStart, setShouldStart] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [connectedUserIds, setConnectedUserIds] = useState([]);
  const [appData, setAppData] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [isPresenter, setIsPresenter] = useState(false);
  const [inputName, setInputName] = useState("");
  const [name, setName] = useState("");
  const [presenterCode, setPresenterCode] = useState("");
  const [playActive] = useSound(buzz, { volume: 1 });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("app update", (data) => {
      setAppData(data);
    });
    return () =>
      socket.on("disconnect", () => {
        console.log("disconnected");
      });
  }, []);

  useEffect(() => {
    let data = appData;
    console.log(data);
    if (!data) return;

    let hasPresenter = false;
    if (data.users !== undefined) {
      for (let username of Object.keys(data.users)) {
        const user = data.users[username];
        if (user.role === "presenter") {
          hasPresenter = true;
          break;
        }
      }
    }
    if (
      !hasPresenter &&
      data.question &&
      !questionSaid &&
      question !== data.question
    ) {
      setShouldStart(true);
    }
    setGameState(data.game_state);
    if (question !== data.question) {
      setQuestion(data.question);
    }
    if (answer !== data.correct_answer) {
      setAnswer(data.correct_answer);
    }
    setUsers(data.users);
    setShowAnswer(data.show_answer);
    setShowQuestion(data.show_question);
    setBuzzed(data.buzzed_in);
    if (data.buzzed_in && buzzed) {
      if (shouldStart && !isPaused && data.buzzed_in.length > buzzed.length) {
        setIsPaused(true);
      }
    }
    if (
      data.users !== undefined &&
      data.users[name] !== undefined &&
      data.users[name].role === "presenter"
    ) {
      setIsPresenter(true);
    } else {
      setIsPresenter(false);
    }
    setAnswers(data.answers);
    setConnectedUserIds(data.connectedUserIds);
  }, [answer, appData, question, questionSaid]);

  useEffect(() => {
    if (questionSaid) {
      socket.emit("showQuestion", []);
      setShouldStart(false);
      setIsPaused(false);
    }
  }, [questionSaid]);

  const getNextQuestion = () => {
    socket.emit("nextQuestion", []);
    setQuestionSaid(false);
    setShouldStart(false);
    setCharIndex(0);
  };

  const theme = useMantineTheme();
  const inlineStyles = {
    rightSideContainer: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      minHeight: "80%",
      height: "90%",
      width: "90%",
      background: "rgba(255, 255, 255, 0.55)", // Semi-transparent background
      padding: "4rem 1rem 2rem 1rem",
      borderRadius: "4rem 1rem 1rem 4rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: theme.spacing.md,
      color: theme.colors.dark[9],
    },
    questionText: {
      margin: `${theme.spacing.lg}px 0`,
      fontSize: "2.3rem",
      fontWeight: 500,
    },
    answerText: {
      fontSize: "2.25rem",
      color: theme.colors.green[7],
      fontWeight: 500,
    },
    button: {
      padding: `0.5rem`,
      margin: `0.5rem`,
      fontSize: "1rem",
      fontWeight: "lighter",
      backgroundColor: theme.colors.blue[6],
      color: theme.white,
      "&:hover": {
        backgroundColor: theme.colors.blue[7],
      },
    },
    // Style for user list, score and buzz-in status
    userBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.gray[0],
      boxShadow: theme.shadows.md,
      margin: theme.spacing.md,
    },
    buzzedText: {
      color: theme.colors.red[6],
      fontSize: "0.25rem",
      fontWeight: 500,
    },
    userTable: {
      width: "90%",
      fontSize: "1.25rem",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      maxHeight: "10px",
      overflow: "scroll",
      display: "-moz-grid",
      overflowY: "scroll",
    },
  };

  if (name === "") {
    return (
      <AppShell styles={{ main: { background: "none", padding: 0 } }}>
        <div
          style={{
            position: "relative",
            height: "100vh",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={Tvbackground_f02sh_pointing_right}
            alt="Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              position: "absolute",
            }}
          />
          <div style={inlineStyles.rightSideContainer}>
            <Title order={1} style={inlineStyles.headerTitle}>
              Fo2sh Trivia
            </Title>
            <Text style={inlineStyles.questionText}>
              Please enter your name to join the game
            </Text>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
            <Button
              onClick={() => {
                setName(inputName);
                socket.emit("addName", inputName);
              }}
              style={inlineStyles.button}
              size="xl"
            >
              Join Game
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (isPresenter) {
    return (
      <AppShell styles={{ main: { background: "none", padding: 0 } }}>
        <div
          style={{
            position: "relative",
            height: "100vh",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={Tvbackground_f02sh_pointing_right}
            alt="Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          />
          <div
            style={{
              ...inlineStyles.rightSideContainer,
              height: "90vh",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <Title order={1} style={inlineStyles.headerTitle}>
              Fo2sh Trivia TV
            </Title>
            <Text style={inlineStyles.questionText}>
              Question: <br />
              <div dangerouslySetInnerHTML={{ __html: question }} />
            </Text>
            <Text style={inlineStyles.answerText}>
              Answer: <br />
              <div dangerouslySetInnerHTML={{ __html: answer }} />
            </Text>

            <Text style={inlineStyles.question}>
              Options: <br />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0.5rem",
                }}
              >
                {answers.map((option) => (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: option }}
                      style={{
                        fontSize: "1.3rem",
                        color: "blue",
                        fontWeight: 500,
                        margin: "0.5rem",
                      }}
                    />
                  </>
                ))}
              </div>
            </Text>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                onClick={getNextQuestion}
                style={inlineStyles.button}
                size="xl"
              >
                Next Question
              </Button>
              <Button
                onClick={() => socket.emit("showQuestion", {})}
                style={inlineStyles.button}
                size="xl"
              >
                Show Question
              </Button>

              <Button
                onClick={() => socket.emit("showAnswer", {})}
                style={inlineStyles.button}
                size="xl"
              >
                Show Answer
              </Button>
              <Button
                onClick={() => socket.emit("resetGame", [])}
                style={{ ...inlineStyles.button, backgroundColor: "red" }}
                size="xl"
              >
                Reset Game
              </Button>
            </div>
            <Table striped highlightOnHover style={inlineStyles.userTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Buzzed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users !== undefined &&
                  connectedUserIds !== undefined &&
                  Object.keys(users)
                    .map((user) => {
                      return {
                        name: user,
                        score: users[user].score,
                        role: users[user].role,
                      };
                    })
                    .reduce((prev, user) => {
                      let userIsConnected = false;
                      for (let userId of Object.keys(connectedUserIds)) {
                        if (connectedUserIds[userId] === user.name) {
                          userIsConnected = true;
                          break;
                        }
                      }
                      if (userIsConnected && user.role !== "presenter") {
                        prev.push(user);
                      }
                      return prev;
                    }, [])
                    .sort((a, b) => {
                      // use the order they buzzed in if they buzzed in otherwise sort by score
                      const aIndex = buzzed.findIndex(
                        (buzzer) => buzzer[0] === a.name
                      );
                      const bIndex = buzzed.findIndex(
                        (buzzer) => buzzer[0] === b.name
                      );
                      if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex;
                      } else if (aIndex !== -1) {
                        return -1;
                      } else if (bIndex !== -1) {
                        return 1;
                      } else {
                        return b.score - a.score;
                      }
                    })
                    .map((user) => {
                      return (
                        <tr key={user.name}>
                          <td>{user?.name}</td>
                          <td>{user?.score}</td>
                          <td>
                            {buzzed.some((buzzer) => buzzer[0] === user.name)
                              ? `Buzzed: ${
                                  buzzed.findIndex(
                                    (buzzer) => buzzer[0] === user.name
                                  ) + 1
                                }`
                              : "No"}
                          </td>
                          <td>
                            <Button
                              onClick={() => socket.emit("addScore", user.name)}
                              style={inlineStyles.button}
                              size="lg"
                            >
                              +1
                            </Button>
                            <Button
                              onClick={() =>
                                socket.emit("removeScore", user.name)
                              }
                              style={{
                                ...inlineStyles.button,
                                backgroundColor: "red",
                              }}
                              size="lg"
                            >
                              -1
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </Table>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "10vh",
              }}
            >
              <Button
                onClick={() => socket.emit("changeRole", name)}
                style={{ ...inlineStyles.button, backgroundColor: "red" }}
                size="lg"
              >
                Become Player
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  } else {
    return (
      <AppShell
        styles={{
          main: { background: "none", padding: 0, overflowY: "scroll" },
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100vh",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={Tvbackground_f02sh_pointing_right}
            alt="Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          />
          <div
            style={{
              ...inlineStyles.rightSideContainer,
              height: "90vh",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <Title order={1} style={inlineStyles.headerTitle}>
              Fo2sh Trivia
            </Title>
            {/* HUGE RED ROUND BUTTON */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "30vh",
                width: "100%",
                padding: "1rem",
                marginBottom: "5vh",
              }}
            >
              <button
                onClick={() => {
                  socket.emit("buzz", name);
                  playActive();
                }}
                style={{
                  backgroundColor: "red",
                  borderRadius: "50%",
                  width: "60vw",
                  height: "30vh",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "white",
                  margin: "1rem",
                  padding: "1rem",
                }}
              >
                Buzz In!
              </button>
            </div>
            {question && showQuestion && (
              <Text style={inlineStyles.questionText}>
                Question: <br />
                <div dangerouslySetInnerHTML={{ __html: question }} />
              </Text>
            )}

            {question && showAnswer && (
              <Text style={inlineStyles.answerText}>
                Answer: <br />
                <div dangerouslySetInnerHTML={{ __html: answer }} />
              </Text>
            )}

            <Table striped highlightOnHover style={inlineStyles.userTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Buzzed</th>
                </tr>
              </thead>
              <tbody>
                {users !== undefined &&
                  connectedUserIds !== undefined &&
                  Object.keys(users)
                    .map((user) => {
                      return {
                        name: user,
                        score: users[user].score,
                        role: users[user].role,
                      };
                    })
                    .reduce((prev, user) => {
                      let userIsConnected = false;
                      for (let userId of Object.keys(connectedUserIds)) {
                        if (connectedUserIds[userId] === user.name) {
                          userIsConnected = true;
                          break;
                        }
                      }
                      if (userIsConnected && user.role !== "presenter") {
                        prev.push(user);
                      }
                      return prev;
                    }, [])
                    .sort((a, b) => {
                      // use the order they buzzed in if they buzzed in otherwise sort by score
                      const aIndex = buzzed.findIndex(
                        (buzzer) => buzzer[0] === a.name
                      );
                      const bIndex = buzzed.findIndex(
                        (buzzer) => buzzer[0] === b.name
                      );
                      if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex;
                      } else if (aIndex !== -1) {
                        return -1;
                      } else if (bIndex !== -1) {
                        return 1;
                      } else {
                        return b.score - a.score;
                      }
                    })
                    .map((user) => {
                      return (
                        <tr key={user.name}>
                          <td>
                            {user?.name} {name === user?.name && "(You)"}
                          </td>
                          <td>{user?.score}</td>
                          <td>
                            {buzzed.some((buzzer) => buzzer[0] === user.name)
                              ? `Buzzed: ${
                                  buzzed.findIndex(
                                    (buzzer) => buzzer[0] === user.name
                                  ) + 1
                                }`
                              : "No"}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </Table>

            <div
              style={{
                display: "flex",
                margin: "1rem",

                padding: "1rem",
              }}
            >
              <input
                type="text"
                value={presenterCode}
                onChange={(e) => setPresenterCode(e.target.value)}
                style={{
                  fontSize: "1rem",
                  marginRight: "1rem",
                  height: "2rem",
                }}
              />
              <Button
                onClick={() => {
                  if (presenterCode === "Fo2sh") {
                    socket.emit("changeRole", name);
                  }
                }}
                size="sm"
                style={{
                  fontColor: "white",
                  fontFamily: "Sans-Serif",
                  fontWeight: "lighter",
                  backgroundColor: "red",
                  fontSize: "1rem",
                  height: "2rem",
                }}
              >
                Present?
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }
}
