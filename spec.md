# Specification

## Summary
**Goal:** Fix the Active Accounts page in XinPay so it loads correctly without authentication errors and displays submitted bank accounts with masked account numbers and colored status indicators.

**Planned changes:**
- Remove authentication/login requirement from the Active Accounts page and its backend endpoint so it loads without "Unauthorized" or "Failed to Load Account" errors
- Display each submitted bank account as a card showing Bank Name, Account Type, and masked Account Number (only last 4 digits visible, e.g., ****1234)
- Add a colored status dot to each card: Yellow for Pending/Verification (default for new accounts), Green for Live Active, Red for Error/Rejected
- After submitting bank details from the Home or Deposit page (BankDetailsForm), the new account immediately appears in the Active Accounts page with Pending (yellow) status — no page refresh required
- Show a friendly empty state message ("No accounts added yet. Submit your bank details to get started.") when no accounts exist

**User-visible outcome:** Users can open the Active Accounts page without logging in, see all their submitted bank accounts as cards with masked numbers and status dots, and any newly submitted account appears instantly with a yellow Pending status.
