export default {
  // TODO: Make these dates the actual dates of the hackathon
  hackathon_year: 2023,
  hackathon_date_range: "February 17-19",
  locations: ["In-Person"],
  deadlines: [
    {
      key: "oos",
      label: "out-of-state",
      date: "2023-01-03T07:59:00.000Z",
      display_date: "January 2, 2023",
    },
    {
      key: "is",
      label: "in-state",
      date: "2023-01-03T07:59:00.000Z",
      display_date: "January 2, 2023",
    },
    {
      key: "stanford",
      label: "Stanford student",
      date: "2023-02-17T07:59:00.000Z",
      display_date: "Feb 16, 2023",
    },
  ],
  logo: require("./assets/logo.svg"),
  favicon: require("./assets/favicon.ico"),
  dashboard_background: require("./assets/combined_circuit.svg"),
};
