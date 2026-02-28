# Specification

## Summary
**Goal:** Implement a localStorage-based account system (signup, login, session management) in the XinPay frontend, replacing the active auth flow with a local approach, while removing all failure/error state messages from the auth UI.

**Planned changes:**
- Add a local authentication system using localStorage for signup, login, and session persistence (storing username, password, and default INR/USDT balances)
- Session state persists across page reloads; logout clears the session from localStorage
- Update `LoginPage.tsx` to use the new local auth system while keeping the tab-based UI, input validation, and spinner feedback intact
- Remove all failure/error toasts, alerts, and inline error messages from the login and signup flow (invalid credentials, duplicate signup, etc. are handled silently or with neutral feedback)
- Successful login navigates the user to the main app as before

**User-visible outcome:** Users can register and log in using a username and password stored locally, with their session persisting on reload, and no error or failure messages ever shown during the auth flow.
