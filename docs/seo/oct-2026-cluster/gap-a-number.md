# Phase 2 gap analysis — `/uscis/a-number`

Main keywords: **"a number a"** 12,100/mo KD8 · **"alien registration number"** 9,900 KD28.
KD8 on the head term is the easiest win in the set. The intent is overwhelmingly "where is my number and what is it for", with a growing second intent — "do I have to register?" — created by the 2025–26 registration rule.
Fetched 2026-10-13.

## Competitor outlines, side by side

| uscis.gov glossary / alienregistration | rjimmigrationlaw.com "Alien Registration for Canadians: Who Needs to Register?" (~2,038 w) | Top non-gov organic (boundless, manifestlaw, ellis, greencardlink, baylegal, papagikoslaw) |
| --- | --- | --- |
| Glossary definition of A-number | Understanding the Alien Registration Form (G-325R) | What an A-number is |
| Who must register; who is exempt | Who Needs to Register? | Where to find it: green card, EAD, immigrant visa, I-797 |
| How to tell if you are already registered | Who Is Exempt from Registration? | Format: A + 8 or 9 digits, add leading zeros |
| How to file G-325R (online only, own account) | How to Register Using Form G-325R (4 steps) | A-number vs receipt number vs USCIS online account number |
| Proof of registration | What Serves as Proof of Registration? | What to do if you can't find it (USCIS account, FOIA G-639) |
| Penalties; registration confers no status | Requirement to Carry Proof of Registration | Why it matters |
| June 29 2026 final rule | Why It Matters for Canadians; Consequences of Failing to Register | — |

`opensphere.ai` A-number content — no such page found (**not readable**).

## Subtopic coverage matrix

| Subtopic | USCIS | RJ | Top-5 organic | We cover | Our angle |
| --- | --- | --- | --- | --- | --- |
| What an A-number is | ✓ | ✓ | ✓ | ✓ | Framed by what it legally *is*: the identifier attached to your alien-registration record under INA 262–264, not an account number |
| Format, 8 or 9 digits, zero-padding | — | — | ✓ | ✓ | With the rule for a form that demands nine digits |
| Where it is printed | partial | — | ✓ | ✓ | **Labelled SVG mocks** of the green card, EAD and immigrant visa foil showing where "USCIS #" sits, with invented digits — no real identifiers |
| A-number vs receipt number | — | — | ✓ | summary + link | Owned by `/uscis/receipt-number` |
| A-number vs USCIS online account number | ✓ | — | ✓ | summary + link | Owned by `/uscis/online-account-number` |
| A-number vs I-94 number | — | — | rarely | ✓ (short) | Cross-links the new `/uscis/i-94` |
| A-number vs SEVIS ID vs visa control number | — | — | rarely | ✓ | **Nobody covers the visa foil/control number.** It is the number Indian applicants are asked for at VFS and at a consulate, and it is not an A-number |
| Who must register | ✓ | ✓ | — | ✓ | The 30-day rule, 14-and-over, parents filing for under-14s, and that it applies **per trip of 30 days or more** |
| **Who is already registered** | ✓ | ✓ | — | ✓ | The point the keyword traffic needs and the organic results miss entirely: 8 CFR 264.1(a)–(b) makes the I-94 both a registration form *and* evidence of registration. A visa-holding NRI with an I-94 is already registered. Most readers need to do nothing |
| G-325R mechanics | ✓ | ✓ | — | ✓ | Online only, each person's own USCIS account, including a child's |
| Re-registration at 14 | ✓ | partial | — | ✓ | 8 CFR 264.1(g): within 30 days of the 14th birthday — including for children already registered |
| Carry-your-evidence duty | ✓ | ✓ | — | ✓ | INA 264(e) |
| Registration confers no status | ✓ | ✓ | — | ✓ | Stated plainly; it is the most common misreading |
| Current legal status of the rule | ✓ | partial | — | ✓ | 2025 interim final rule adopted as final 29 June 2026; the September 2026 interim rule for US-born children of foreign government employees is enjoined as to the certified class in *Casa Inc. v. Trump*, No. 8:25-cv-00201 (D. Md.) |
| Canadian long-stay visitors | — | ✓ | — | ✓ | RJ owns the Canadian framing; we cover it because it is the one group that genuinely must file G-325R, and name it as such |
| Two A-numbers / can't find it | — | — | ✓ | ✓ | Plus FOIA Form G-639 and the USCIS online account route |

Every subtopic covered by ≥2 competitors appears on our page, except the two
assigned to `/uscis/receipt-number` and `/uscis/online-account-number`.

## Subtopics nobody covers well — our unique sections

1. **"Am I already registered?" answered from 8 CFR 264.1(b), as a decision table.** Every competitor page answers "who must register". None answers the question an H-1B, F-1 or green-card holder actually has, which is whether the news applies to them. For most NRI readers the answer is no, and saying so clearly is the whole value of the page.
2. **Six numbers, one table.** A-number, receipt number, USCIS online account number, I-94 number, SEVIS ID, visa control/foil number — what each identifies, where it appears, who asks for it, and whether it is sensitive. Only the first four appear anywhere in the organic set, and never together.
3. **Interactive: "Which number is this?"** Pick the document, paste the shape of the number (digits are masked and nothing leaves the browser), and the tool names the number, says what it identifies and where it's used. No competitor has a tool.
4. **Where the number is on the card, drawn.** Labelled SVG mocks rather than prose directions, with fabricated digits.
5. **The India-specific confusions:** the immigrant visa foil issued at Mumbai/Delhi/Chennai/Hyderabad/Kolkata carries a Registration Number that *is* the A-number, while the nonimmigrant visa foil carries a control number that is not; and an OCI card number is not a US identifier at all.
6. **Registration is not status, and it is not work authorisation** — with the two places readers assume otherwise.

## Sources used

| Source | Checked |
| --- | --- |
| 8 CFR 264.1, full text, eCFR title-8 API, issue date 2026-10-08 | 2026-10-13 |
| USCIS Alien Registration Requirement (uscis.gov/alienregistration) | 2026-10-13 |
| USCIS Form G-325R page; form edition 09/04/26 | 2026-10-13 |
| Federal Register, Alien Registration Form and Evidence of Registration, 90 FR (2025-03-12); final rule 2026-06-29 | 2026-10-13 |
| Form G-1055 Fee Schedule, edition 10/07/26 (I-90, I-102, N-400 fees) | 2026-10-13 |
| rjimmigrationlaw.com, Alien Registration for Canadians | 2026-10-13 |
