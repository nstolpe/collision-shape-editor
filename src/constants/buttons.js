const BUTTONS = {
  MAIN: 'MAIN', // 0 left
  AUXILARY: 'AUXILARY', // 1 wheel
  SECONDARY: 'SECONDARY', // 2 right
};

const NUMBERS_TO_BUTTONS = [
  BUTTONS.MAIN, // 0 left
  BUTTONS.AUXILARY, // 1 wheel
  BUTTONS.SECONDARY, // 2 right
];

export const buttonFromNumber = (number) => NUMBERS_TO_BUTTONS[number];

export default BUTTONS;
