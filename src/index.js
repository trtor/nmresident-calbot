require("dotenv").config();
const CronJob = require("cron").CronJob;
const { readCalendar } = require("./readCal");
const { sendNotify } = require("./lineNotify");
/*  */
console.log("Start Cron Timer");
/*  */
const jobDaily = new CronJob(
  process.env.PROCESS_DAILY_INTERVAL_CRON,
  () => {
    runDaily();
  },
  null,
  true,
  "Asia/Bangkok"
);
jobDaily.start();

async function runDaily() {
  const msg = await readCalendar({
    icalURL: process.env.ICAL_URL,
    mode: process.env.MODE, // offline | online
    fwdHour: process.env.LOOKFORWARD_DAILY_MAX_HOUR,
  });
  console.log("Cron job fetch daily calendar was triggered");

  if (msg)
    await sendNotify({
      token: process.env.LINE_TOKEN,
      options: {
        message: msg,
        notificationDisabled: false,
      },
    });
}
/* ##################################################### */
const jobWeekly = new CronJob(
  process.env.PROCESS_WEEKLY_INTERVAL_CRON,
  () => {
    runWeekly();
  },
  null,
  true,
  "Asia/Bangkok"
);
jobWeekly.start();

async function runWeekly() {
  const msg = await readCalendar({
    icalURL: process.env.ICAL_URL,
    mode: process.env.MODE, // offline | online
    fwdHour: process.env.LOOKFORWARD_WEEKLY_MAX_HOUR,
  });
  console.log("Cron job fetch weekly calendar was triggered");

  if (msg)
    await sendNotify({
      token: process.env.LINE_TOKEN,
      options: {
        message: msg,
        notificationDisabled: false,
      },
    });
}

runWeekly();