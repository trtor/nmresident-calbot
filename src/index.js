require("dotenv").config();
const CronJob = require("cron").CronJob;

const { readCalendar } = require("./readCal");
const { sendNotify } = require("./lineNotify");

const job = new CronJob(
  process.env.PROCESS_INTERVAL_CRON,
  () => {
    runInterval();
  },
  null,
  true,
  "Asia/Bangkok"
);

job.start();
console.log("Start Cron Timer");

async function runInterval() {
  const msg = await readCalendar({
    icalURL: process.env.ICAL_URL,
    mode: process.env.MODE, // offline | online
    fwdHour: process.env.LOOKFORWARD_MAX_HOUR,
  });
  console.log("Cron job fetch calendar was triggered");

  if (msg)
    await sendNotify({
      token: process.env.LINE_TOKEN,
      options: {
        message: msg,
        notificationDisabled: false,
      },
    });
}

// runInterval();
