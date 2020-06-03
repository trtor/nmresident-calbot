const axios = require("axios");
const ical = require("node-ical");
const iCalOffline = require("./icaloffline");
const { readableDate, readableTime } = require("./timeText");

async function readCalendar({ icalURL, mode, fwdHour }) {
  if (mode !== "online" && mode !== "offline")
    return console.error("Mode can be 'online' or 'offline'");

  let icalStr;
  if (mode === "online") icalStr = await getiCal({ url: icalURL });
  else icalStr = iCalOffline;

  // console.log("mainProcess", icalStr);
  const parseData = parseICS(icalStr);

  const dataArr = Object.entries(parseData).map((e) => e[1]);

  const filterUseKey = filterKey(dataArr);

  const filterHourFwd = filterHourInterval({
    data: filterUseKey,
    fwdHour,
    timeStart: new Date(),
  });

  if (!filterHourFwd || filterHourFwd.length === 0) {
    console.log("No event next day.", new Date());
    return "";
  }

  const msgPrepare = prepareMsg(filterHourFwd);

  return generateText(msgPrepare);
}

function generateText(data) {
  let msgOut = "\n-- Activity --";
  data.forEach((e) => {
    msgOut += "\n\n" + e.title || "No title";
    msgOut += e.dtRangeTxt ? "\n" + e.dtRangeTxt : "";
    msgOut += e.location ? "\nLocation: " + e.location : "";
    msgOut += e.description ? "\n" + e.description : "";
  });

  return msgOut;
}

/**
 * Prepare message -> prepare to sent Line notify API
 * @param {object[]} data - Array of object containing filtered calendar data
 */
function prepareMsg(data) {
  const allDataDate = [...new Set(data.map((e) => new Date(e.start).getDate()))];

  if (allDataDate.length === 0) return "";

  let tmp = [];
  allDataDate.forEach((a) => {
    data.forEach((d) => {
      const curDate = new Date(d.start).getDate();
      if (curDate !== a) return;

      const sameDateStartEnd = new Date(d.start).getDate() === new Date(d.end).getDate();

      let dtText = "";

      if (d.datetype === "date") {
        // date
        dtText = readableDate(d.start);
      } else if (sameDateStartEnd) {
        // date-time
        dtText =
          readableDate(d.start) +
          " " +
          readableTime(d.start) +
          " - " +
          readableTime(d.end);
      } else {
        dtText =
          readableDate(d.start) +
          " " +
          readableTime(d.start) +
          " - " +
          readableDate(d.end) +
          " " +
          readableTime(d.end);
      }

      tmp.push({
        title: d.title,
        dtRangeTxt: dtText,
        location: d.location,
        description: d.description,
      });
    });
  });
  // console.log(tmp);
  return tmp;
}

/**
 * Filter 24 hour interval
 * @param {object} param0
 * @param {object[]} param0.data - ICS data in array of object format
 * @param {string|number} - Look forward in hours
 * @param {object} [timeStart=new Date()] - Time to start look forward
 * @returns {object[]} - Filtered Data
 */
function filterHourInterval({ data, fwdHour, timeStart = new Date() }) {
  const now = timeStart.getTime();

  // Convert to ms
  fwdHour = parseInt(fwdHour) * 60 * 60 * 1000;

  const tmp = data
    .filter((e) => {
      if (!e.start) return false;
      if (e.start_ms >= now && e.start_ms < now + fwdHour) return true;
    })
    .sort((a, b) => {
      if (!a.start) return -1;
      if (!b.start) return 1;
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });

  return tmp;
}

function filterKey(icsData) {
  const filtered = icsData.map((e) => ({
    title: e.summary,
    start: e.start ? new Date(e.start) : null,
    end: e.end ? new Date(e.end) : null,
    start_ms: e.start ? new Date(e.start).getTime() : null,
    end_ms: e.end ? new Date(e.end).getTime() : null,
    datetype: e.datetype, // 'date-time' or 'date'
    location: e.location,
    description: e.description,
  }));
  return filtered;
}

function parseICS(icalString) {
  const events = ical.sync.parseICS(icalString);
  return events;
}

/**
 * Get calendar data to string format
 * @param {object} param0
 * @param {string} param0.url - Google calendar iCal private URL
 * @returns {object} - Axios data
 */
async function getiCal({ url }) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("Config ", error.response.config);
      console.log("Status ", error.response.status);
      console.log("Headers ", error.response.headers);
      console.log("Data", error.response.data);
      return error.response;
    } else {
      console.error("Unexpected error, ", error);
      return false;
    }
  }
}

module.exports = { readCalendar };
