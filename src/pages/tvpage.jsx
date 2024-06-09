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
import Tvbackground_f02sh_pointing_right from "../imgs/tvbackground_f02sh_pointing_right.jpg";
import socketIO from "socket.io-client";
import TextToSpeech from "./tts";
import useSound from "use-sound";
import buzz from "/short-buzzer.wav";
const socket = socketIO.connect("https://triviabe.fo2sh.fun/");

export default function TVPage() {
  const [users, setUsers] = useState([]);
  const [question, setQuestion] = useState("");
  const [gameState, setGameState] = useState("waiting");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasPresenter, setHasPresenter] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [timeLimit, setTimeLimit] = useState(10);
  const [buzzed, setBuzzed] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionSaid, setQuestionSaid] = useState(false);
  const [shouldStart, setShouldStart] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [connectedUserIds, setConnectedUserIds] = useState([]);
  const [appData, setAppData] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [playActive] = useSound(buzz, { volume: 1 });
  const [timeForQuestion, setTimeForQuestion] = useState(10.0);
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
      console.log("setting question");
      setShouldStart(true);
    }
    setGameState(data.game_state);
    if (question !== data.question) {
      setQuestion(data.question);
      setCharIndex(0);
      setShowOptions(false);
    }
    if (answer !== data.correct_answer) {
      setAnswer(data.correct_answer);
    }
    setUsers(data.users);
    setShowAnswer(data.show_answer);
    setShowQuestion(data.show_question);
    if (
      data &&
      data.buzzed_in &&
      buzzed !== undefined &&
      data.buzzed_in.length > buzzed.length
    ) {
      playActive();
    }

    if (
      data.buzzed_in &&
      buzzed != undefined &&
      data.buzzed_in.length >= buzzed.length
    ) {
      for (let i = 0; i < buzzed.length; i++) {
        data.buzzed_in[i].push(buzzed[i][2]);
      }
    }

    setBuzzed(data.buzzed_in);

    if (data.buzzed_in && buzzed) {
      if (shouldStart && !isPaused && data.buzzed_in.length > buzzed.length) {
        setIsPaused(true);
      }
    }
    setAnswers(data.answers);
    setConnectedUserIds(data.connectedUserIds);
  }, [answer, appData, question, questionSaid]);

  useEffect(() => {
    if (buzzed !== undefined && buzzed.length > 0) {
      let timer = setTimeout(() => {
        // loop through buzzed in users
        let newBuzzed = [...buzzed];
        let greatestTime = 0;
        for (let i = 0; i < newBuzzed.length; i++) {
          if (newBuzzed[i].length == 2) {
            // if they haven't buzzed in yet, set their time to 0
            newBuzzed[i].push(greatestTime + timeForQuestion);
          }
          if (newBuzzed[i][2] > greatestTime) {
            greatestTime = newBuzzed[i][2];
          }
          if (newBuzzed[i][2] > 0.011) {
            newBuzzed[i][2] -= 0.1;
          }
        }
        setBuzzed(newBuzzed);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [buzzed]);

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
      top: 0,
      right: 0,
      minHeight: "80%",
      height: "90%",
      width: "40%",
      background: "rgba(255, 255, 255, 0.95)", // Semi-transparent background
      padding: "4rem",
      margin: "4rem",
      borderRadius: "4rem 1rem 1rem 4rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
    },
    mainContainer: {
      backgroundImage: `url(${Tvbackground_f02sh_pointing_right})`,
      backgroundSize: "cover",
      padding: theme.spacing.xl,
      height: "100vh",
    },
    headerTitle: {
      fontSize: "5rem",
      fontWeight: 700,
      marginBottom: theme.spacing.md,
      color: theme.colors.dark[9],
    },
    questionText: {
      margin: `${theme.spacing.lg}px 0`,
      fontSize: "3rem",
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
      fontSize: "2rem",
      fontWeight: 600,
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
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    userTable: {
      width: "100%",
      fontSize: "1.75rem",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      maxHeight: "10px",
      overflow: "scroll",
      display: "-moz-grid",
      overflowY: "scroll",
    },
  };

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
        <div style={inlineStyles.rightSideContainer}>
          <Title order={1} style={inlineStyles.headerTitle}>
            Fo2sh Trivia TV
          </Title>

          {question && (
            <>
              <TextToSpeech
                text={question}
                setEnded={setQuestionSaid}
                shouldStart={shouldStart}
                setCharIndex={setCharIndex}
                prefix="The question is ... "
                isPaused={isPaused}
              />

              <Text style={inlineStyles.questionText}>
                Question: <br />
                {showQuestion ? (
                  <div dangerouslySetInnerHTML={{ __html: question }} />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: question.slice(0, charIndex),
                    }}
                  />
                )}
              </Text>
            </>
          )}

          {showAnswer && (
            <Text style={inlineStyles.answerText}>
              Answer: <br />
              <div dangerouslySetInnerHTML={{ __html: answer }} />
            </Text>
          )}

          {showOptions && (
            <Text style={inlineStyles.answerText}>
              Options: <br />
              <div
                style={{
                  height: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "1rem",
                }}
              >
                {answers.map((option) => (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: option }}
                      style={{
                        fontSize: "2rem",
                        color: "blue",
                        fontWeight: 500,
                        margin: "1rem",
                      }}
                    />
                  </>
                ))}
              </div>
            </Text>
          )}

          <Group position="center">
            {isPaused && shouldStart && (
              <Button
                onClick={() => setIsPaused(false)}
                style={inlineStyles.button}
                size="xl"
              >
                UnPause Question
              </Button>
            )}
            {!showOptions && (
              <Button
                onClick={() => setShowOptions(true)}
                style={{
                  ...inlineStyles.button,
                  backgroundColor: "purple",
                  opacity: 0.25,
                }}
                size="xl"
              >
                Show Options
              </Button>
            )}

            <Button
              onClick={getNextQuestion}
              style={inlineStyles.button}
              size="xl"
            >
              Next Question
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
          </Group>
          <ScrollArea
            type="hover"
            style={{
              ...inlineStyles.userBox,
              maxHeight: "40vh",
              width: "100%",
              marginBottom: "-3rem",
            }}
          >
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
                              ? `# ${
                                  buzzed.findIndex(
                                    (buzzer) => buzzer[0] === user.name
                                  ) + 1
                                } Buzzed: ${(buzzed.filter(
                                  (buzzer) =>
                                    buzzer[0] === user.name && buzzer.length > 2
                                )[0]
                                  ? buzzed.filter(
                                      (buzzer) =>
                                        buzzer[0] === user.name &&
                                        buzzer.length > 2
                                    )[0][2] ?? 0
                                  : 0
                                ).toFixed(1)}s`
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
          </ScrollArea>
        </div>
        <div
          style={{
            height: "3rem",
            position: "absolute",
            bottom: 0,
            left: 0,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "2rem",
            borderRadius: "4rem 4rem 4rem 4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 
            add dropdown to select time limit
          */}
          <Text style={{ fontSize: "1.5rem", marginRight: "1rem" }}>
            Time Limit: {timeForQuestion} seconds
          </Text>
          <Button
            onClick={() => setTimeForQuestion((prev) => prev + 5.0)}
            style={inlineStyles.button}
            size="md"
          >
            +5
          </Button>

          <Button
            onClick={() => setTimeForQuestion((prev) => prev - 5.0)}
            style={{
              ...inlineStyles.button,
              backgroundColor: "red",
            }}
            size="md"
          >
            -5
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
