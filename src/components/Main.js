import { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function Main(props) {
  //States
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [numRolls, setNumRolls] = useState(0);
  const [runningGame, setRunningGame] = useState(false);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(
    localStorage.getItem("bestTime") || 0
  );
  const [bestRolls, setBestRolls] = useState(
    localStorage.getItem("bestRolls") || 0
  );

  useEffect(() => {
    const someHeld = dice.some((die) => die.isHeld);
    const allHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.value === dice[0].value);
    //start the game only if a die is held
    if (someHeld) {
      setRunningGame(true);
    }
    //if all ten dice are held and have the same value
    //stop the game and save best time & best rolls number
    if (allHeld && allSameValue) {
      setRunningGame(false);
      setTenzies(true);
      setBestTime((prevBestTime) => {
        if (prevBestTime === 0 || time < prevBestTime) {
          localStorage.setItem("bestTime", time);
          return time;
        } else {
          return prevBestTime;
        }
      });
      setBestRolls((prevBestRolls) => {
        if (prevBestRolls === 0 || numRolls < prevBestRolls) {
          localStorage.setItem("bestRolls", numRolls);
          return numRolls;
        } else {
          return prevBestRolls;
        }
      });
    }
  }, [dice, time, numRolls]);

  useEffect(() => {
    let timer;
    //check if the game is running then keep counting time
    if (runningGame) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    //cleanup function
    return () => clearInterval(timer);
  }, [runningGame]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  //generate an array of 10 random numbers between 1 & 6
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  //click on roll button handler
  function rollDice() {
    //if the 10 dice are not all held, keep counting rolls number
    //& keep generating new dice
    if (!tenzies) {
      setNumRolls((prevNum) => prevNum + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setNumRolls(0);
      setTime(0);
    }
  }

  function convertTime(seconds) {
    const min = String(Math.trunc(seconds / 60)).padStart(2, 0);
    const sec = String(seconds % 60).padStart(2, 0);
    return `${min} : ${sec}`;
  }

  //click on die to hold it handler
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  //display 10 die components
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main className={props.darkMode ? "dark" : ""}>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzi Game</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <div className="bottom-group">
        <div className="tracker">
          Time: <span className="font--style">{convertTime(time)}</span>
        </div>
        <div className="tracker">
          Rolls: <span className="font--style">{numRolls}</span>
        </div>
        <div className="tracker">
          Best Time:{" "}
          <span className="font--style">{convertTime(bestTime)}</span>
        </div>
        <div className="tracker">
          Best Rolls: <span className="font--style">{bestRolls}</span>
        </div>
      </div>
    </main>
  );
}
