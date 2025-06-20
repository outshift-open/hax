
import boxen from "boxen";

export function printPanelBox(message: string) {
  console.log(
    boxen(message, {
      padding: 1,
      borderStyle: "round",
      borderColor: "green",
    })
  );
}

