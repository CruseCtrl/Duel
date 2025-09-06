import ghyston from "@ghyston/eslint-config-ghyston";

export default [
  ...ghyston,
  {
    rules: {
      "no-console": "off",
    },
  },
];
