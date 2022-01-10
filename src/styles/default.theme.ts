import { border, colors, fontSize, fontWeight, spacing } from "./tokens";

export const defaultTheme = {
  color: {
    black: colors.black,
    lightBlue: colors.lightBlue,
    blue: colors.blue,
    red: colors.red,
    gray9: colors.gray9,
    gray8: colors.gray8,
    gray7: colors.gray7,
    gray6: colors.gray6,
    gray5: colors.gray5,
    gray4: colors.gray4,
    gray3: colors.gray3,
    gray2: colors.gray2,
    gray1: colors.gray1,
  },
  text: {
    size: {
      small: fontSize.small,
      default: fontSize.default,
      h3: fontSize.h3,
      h2: fontSize.h2,
      h1: fontSize.h1,
    },
    wieght: {
      default: fontWeight.default,
      medium: fontWeight.medium,
      bold: fontWeight.bold,
      black: fontWeight.black,
    },
  },
  border: {
    size: {
      default: border.size.default,
      large: border.size.large,
    },
    radius: {
      small: border.radius.small,
      default: border.radius.default,
      large: border.radius.large,
    },
  },
  spacing: {
    small: spacing.small,
    default: spacing.default,
    double: spacing.double,
    jumbo: spacing.jumbo,
    xlarge: spacing.xlarge,
  },
  shadow: {
    small: "0.5px 1px 1px hsl(220deg 60% 50% / 0.7)",
    default:
      "2.8px 2.8px 1.6px rgba(0, 0, 0, 0.006),6.8px 6.7px 3.9px rgba(0, 0, 0, 0.008),12.8px 12.5px 7.3px rgba(0, 0, 0, 0.01),22.8px 22.3px 13px rgba(0, 0, 0, 0.012),42.6px 41.8px 24.2px rgba(0, 0, 0, 0.014),102px 100px 58px rgba(0, 0, 0, 0.02)",
  },
};

export default {};
