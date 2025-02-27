////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ThreeColorSet = {
  color1?: string
  color2?: string
  color3?: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const black: ThreeColorSet = {
  color1: "hsl(0, 0%, 0%)",
  color2: "hsl(0, 0%, 0%)",
  color3: "hsl(0, 0%, 0%)"
}

const gray20: ThreeColorSet = {
  color1: "hsl(0, 0%, 20%)",
  color2: "hsl(0, 0%, 20%)",
  color3: "hsl(0, 0%, 20%)"
}

const gray40: ThreeColorSet = {
  color1: "hsl(0, 0%, 40%)",
  color2: "hsl(0, 0%, 40%)",
  color3: "hsl(0, 0%, 40%)"
}

const gray50: ThreeColorSet = {
  color1: "hsl(0, 0%, 50%)",
  color2: "hsl(0, 0%, 50%)",
  color3: "hsl(0, 0%, 50%)"
}

const gray60: ThreeColorSet = {
  color1: "hsl(0, 0%, 60%)",
  color2: "hsl(0, 0%, 60%)",
  color3: "hsl(0, 0%, 60%)"
}

const gray80: ThreeColorSet = {
  color1: "hsl(0, 0%, 80%)",
  color2: "hsl(0, 0%, 80%)",
  color3: "hsl(0, 0%, 80%)"
}

const white: ThreeColorSet = {
  color1: "hsl(0, 0%, 100%)",
  color2: "hsl(0, 0%, 100%)",
  color3: "hsl(0, 0%, 100%)"
}

const gold: ThreeColorSet = {
  color1: "rgb(232, 232, 0)",
  color2: "orange",
  color3: "white"
}

const set01: ThreeColorSet = {
  color1: "rgb(255, 80, 80)",
  color2: "rgb(255, 165, 0)",
  color3: "rgb(255, 255, 80)"
}

const set02: ThreeColorSet = {
  color1: "rgb(255, 165, 0)",
  color2: "rgb(255, 255, 0)",
  color3: "rgb(80, 255, 0)"
}

const set03: ThreeColorSet = {
  color1: "rgb(80, 255, 80)",
  color2: "rgb(80, 255, 150)",
  color3: "rgb(80, 255, 150)"
}

const set04: ThreeColorSet = {
  color1: "rgb(128, 128, 255)",
  color2: "rgb(0, 200, 200)",
  color3: "rgb(0, 255, 255)"
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const threeColorSets = {
  set01, set02, set03, set04,
  black, gray20, gray40, gray50, gray60, gray80, white,
  gold
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default threeColorSets

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
