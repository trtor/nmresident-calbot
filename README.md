# Calendar bot Line notification

Server time zone must set to GMT +07:00

## Installation

### Create .env file in root of project directory

```
# MODE "offline", "online"
MODE=online

# Google calendar secret address in iCal format url:
ICAL_URL="https://calendar.google.com/...................../basic.ics"

# Time Section
## Daily settings
### Crontab run code
PROCESS_DAILY_INTERVAL_CRON="0 18 * * *"
### Check calendar event from now to next __ hours
LOOKFORWARD_DAILY_MAX_HOUR=24

## Weely settings
### Crontab run code
PROCESS_WEEKLY_INTERVAL_CRON="59 17 * * 0"
### Check calendar event from now to next __ hours
LOOKFORWARD_WEEKLY_MAX_HOUR=168

# LINE
LINE_TOKEN=
```

more about [crontab](https://crontab.guru/)
