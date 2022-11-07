export default function Die(props) {
  const held = props.isHeld ? "dice--held" : "";
  let dieFace;
  switch (props.value) {
    case 1:
      dieFace = "one";
      break;
    case 2:
      dieFace = "two";
      break;
    case 3:
      dieFace = "three";
      break;
    case 4:
      dieFace = "four";
      break;
    case 5:
      dieFace = "five";
      break;
    case 6:
      dieFace = "six";
      break;
    default:
      console.log(`Sorry, we are out of values!`);
      break;
  }
  return (
    <i
      className={`fa-solid fa-dice-${dieFace} die ${held}`}
      onClick={props.holdDice}
    ></i>
  );
}
