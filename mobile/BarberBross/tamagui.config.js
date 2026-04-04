const { createTamagui } = require("tamagui")
const { themes } = require("./src/theme/theme")
const { tokens } = require("./src/theme/tokens")
const { fonts } = require("./src/theme/fonts")

const config = createTamagui({
  themes,
  tokens,
  fonts,
  defaultTheme: "dark",
  components: ["tamagui"],
})

module.exports = config