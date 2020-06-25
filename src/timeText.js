function readableDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthList[date.getMonth()];
  return `${day} ${month}`;
}

function readableTime(dateString) {
  const date = new Date(dateString);
  let hr = date.getHours();
  let min = date.getMinutes();

  if (hr < 10) hr = "0" + hr;
  if (min < 10) min = "0" + min;

  return `${hr}:${min}`;
}

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

module.exports = { readableDate, readableTime };
