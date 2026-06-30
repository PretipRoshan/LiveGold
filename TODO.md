# TODO - Remove Telegram from Project

- [x] Update `src/types.ts`: change `AlertLog.type` to only `'email'`.
- [x] Update `server.ts`: make `/api/send-alert` accept only email (remove telegram-related handling/validation).
- [x] Update `src/components/AlertSim.tsx`: remove Telegram channel toggle/input and update props to `(type: 'email')` only; adjust UI text to email-only.
- [x] Update `src/App.tsx`: update `handleDispatchAlert` signature and calls; update Alerts tab label to remove “Telegram”.
- [ ] Run `npm run lint` (or `npm run build`) to ensure TypeScript passes.


