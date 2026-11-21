# Content Rules

## Sentence case

Sentence case everywhere: buttons, titles, tabs, menu items ("Add item", "Save changes").

## Action labels

Buttons say what they do with a verb ("Save", "Apply filters"), not "OK" or "Yes".

## Dates and numbers

Dates and numbers people read, in their locale (`Intl.DateTimeFormat`, `Intl.NumberFormat`): "Nov 24, 2026", "1,250", never ISO dates or raw timestamps.

## Messages

Messages say what happened, then what to do ("Couldn't save the report. Check your connection and try again."). No exclamation marks or emoji in product messages.

## Errors from the server

Say why something failed in words people understand ("The connection was refused"), not the server's text (a status code, a Java exception). Keep the raw text available to whoever fixes it, collapsed under "Technical details" (`HvAccordion`).
