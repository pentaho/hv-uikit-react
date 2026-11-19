# Approved screens: Schedule health

Two frames from the Pentaho UI library, approved by the designer: `01-jobs.png` and `02-job-details.png`, at 1440
wide. What each is made of, as the library names it (components, their properties, text styles); the header is the
App Shell's own, so the page leaves it out.

## 01 Jobs

- Title block, vertical, gap 16
  - "Scheduled jobs" (Typography/title2)
  - "The health of every scheduled job: what failed, what is running, and what runs next." (Typography/body)
- Summary, horizontal, gap 24, four equal Cards (title, subheader, body; status bar on top)
  - Status negative: title "3", subheader "Failed in the last 24 hours", body "Nightly sales load and 2 more"
  - Status info: title "1", subheader "Running now", body "Marketing campaign KPIs"
  - No status: title "42", subheader "Scheduled", body "Next: Data quality checks at 17:00"
  - Status warning: title "5", subheader "Paused", body "HR headcount snapshot and 4 more"
- Filters: one Dropdown, label "Show", value "All jobs"
- Jobs table: header cells (sort none, left aligned) Name, Owner, File, Last run, Next run, Status; text cells; the
  Status cell is a Tag (size sm) with the status in words
  | Name | Owner | File | Last run | Next run | Status |
  | --- | --- | --- | --- | --- | --- |
  | Nightly sales load | suzy | /public/Sales/Nightly sales.ktr | Today 06:00 | Tomorrow 06:00 | Failed (negative) |
  | Weekly inventory report | admin | /public/Operations/Inventory.prpt | Mon 07:30 | Mon 24 Nov 07:30 | Succeeded (positive) |
  | Customer churn model refresh | tiffany | /home/tiffany/Churn refresh.kjb | Today 02:15 | Tomorrow 02:15 | Succeeded (positive) |
  | Finance month-end export | pat | /public/Finance/Month end.ktr | Yesterday 23:00 | Sun 30 Nov 23:00 | Failed (negative) |
  | Marketing campaign KPIs | suzy | /public/Marketing/Campaign KPIs.prpt | Today 08:00 | Today 20:00 | Running (info) |
  | Data quality checks | admin | /public/Data quality/Checks.kjb | Today 05:00 | Today 17:00 | Succeeded (positive) |
  | Regional sales dashboard cache | joe | /public/Sales/Regional cache.ktr | Today 04:00 | Tomorrow 04:00 | Failed (negative) |
  | HR headcount snapshot | tiffany | /public/HR/Headcount.prpt | Sat 1 Nov 09:00 | — | Paused (warning) |

## 02 Job details

01 under the overlay (Surfaces/bgOverlay), and a Drawer on the right, 480 wide, title "Nightly sales load"
(Typography/title4). Its content, vertical, gap 16; each field a label (Typography/label, Text/textSubtle) over its
value (Typography/body), gap 8:

- Status: Tag "Failed" (negative, sm)
- Owner: suzy
- File: /public/Sales/Nightly sales.ktr
- Schedule: Every day at 06:00
- Last run: Today 06:00, failed after 4 min
- Next run: Tomorrow 06:00
- Last error: Couldn't connect to the database "sales_dw": connection refused by host dw01.acme.local:5432.

Action bar at the end: "Close" (secondary ghost) and "Run now" (primary).
