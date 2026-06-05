import type { Article } from "@/types";

/**
 * Article content is authored as light markdown:
 *  - "## " lines become section headings
 *  - "- " lines become list items
 *  - blank-line-separated blocks become paragraphs
 * Swap this array for a CMS or MDX loader later without touching the UI.
 */
export const articles: Article[] = [
  {
    slug: "build-us-credit-score-from-zero",
    title: "How to Build a US Credit Score From Zero as a New Immigrant",
    excerpt:
      "Your Indian credit history doesn't follow you. Here's the exact 12-month playbook to go from no file to a 750+ score.",
    topic: "credit",
    author: "Priya Nair",
    date: "2026-05-28",
    readingTime: 9,
    featured: true,
    content: `When you land in the US, you are financially invisible. Your CIBIL score, your years of disciplined EMI payments, your salary in India — none of it crosses the ocean. To American lenders you are a blank page, and a blank page is treated almost as badly as a bad page.

The good news: credit is a system with rules, and rules can be gamed legitimately. With the right moves you can reach a 700+ score within a year.

## Start with a secured card
A secured credit card is backed by a refundable deposit you put down — usually $200 to $500. That deposit becomes your limit. Because the bank takes no risk, approval is near-automatic even with no SSN history. The Discover it Secured and Capital One Platinum Secured are the usual starting points.

Use it for one small recurring charge — a subscription, your phone bill — and pay it in full every month. That single habit drives most of your early score.

## Get added as an authorized user
If a spouse, sibling, or close friend already has a seasoned US card with a clean history, ask to be added as an authorized user. Their account history can backfill onto your report, instantly giving you "age" you didn't earn. You never even need to use the card.

## Keep utilization low
Credit utilization — the percentage of your limit you use — is the second-biggest factor after payment history. Keep it under 10% if you can. On a $500 limit, that means carrying a statement balance under $50, even if you pay everything off.

## What NOT to do
- Don't apply for five cards in your first month. Each application is a hard inquiry and dings your score.
- Don't close your first card once you upgrade. Age of accounts matters.
- Don't carry a balance to "build credit." That's a myth that only earns the bank interest.

## The 12-month timeline
Months 1–3: secured card + authorized user. Months 4–6: your score appears and climbs into the 600s. Months 7–12: you qualify for a real unsecured card, graduate your secured deposit back, and cross 700.

Patience compounds here exactly like interest does. Start today, automate the payments, and let time do the rest.`,
  },
  {
    slug: "h1b-first-tax-return-guide",
    title: "Your First US Tax Return on H-1B: A No-Panic Guide",
    excerpt:
      "Resident vs. non-resident, the substantial presence test, India income, and the forms that actually matter.",
    topic: "taxes",
    author: "Arjun Mehta",
    date: "2026-04-12",
    readingTime: 11,
    featured: true,
    content: `Tax season in your first year is where most NRIs feel genuinely lost. The vocabulary is new, the stakes feel high, and bad advice is everywhere. Let's make it boring and clear.

## First question: are you a resident for tax purposes?
This has nothing to do with your green card. The IRS uses the Substantial Presence Test. Broadly, if you were physically in the US for at least 31 days this year and 183 days across a weighted three-year window, you are a resident alien for tax purposes.

Residents are taxed on worldwide income. Non-residents are taxed only on US income. Many first-year H-1B holders are "dual-status," which is exactly as fun as it sounds.

## Worldwide income means India too
If you are a resident alien, your Indian salary (before you moved), rental income, savings interest, and mutual fund gains are all reportable. The India–US tax treaty and the Foreign Tax Credit (Form 1116) usually prevent true double taxation — you credit taxes paid in India against your US bill — but you still have to disclose.

## FBAR and FATCA
If your foreign accounts (Indian bank accounts, PPF, etc.) together crossed $10,000 at any point in the year, you must file an FBAR (FinCEN Form 114). It's separate from your tax return and the penalties for ignoring it are severe. FATCA (Form 8938) is a similar disclosure that kicks in at higher thresholds.

## The forms checklist
- W-2 from your employer
- 1099s for any interest, dividends, or freelance income
- Form 1040 (the main return)
- Form 1116 if claiming the Foreign Tax Credit
- FBAR if foreign accounts crossed $10,000
- Form 8938 if you cross FATCA thresholds

## Should you DIY or hire a pro?
If you're single, W-2 only, and have no India income after moving — software like the major filers handles it fine. The moment you have India income, dual-status, or RSUs, pay a CPA who specifically does NRI returns. It's a few hundred dollars that prevents five-figure mistakes.

File on time, disclose everything, keep your documents for seven years, and the IRS becomes a non-event.`,
  },
  {
    slug: "401k-match-explained-nri",
    title: "401(k) for NRIs: Why You Should Never Skip the Employer Match",
    excerpt:
      "The match is free money — but what happens to your 401(k) if you move back to India? Here's the full picture.",
    topic: "retirement",
    author: "Sneha Rao",
    date: "2026-05-03",
    readingTime: 8,
    featured: true,
    content: `A 401(k) is an employer-sponsored retirement account. You contribute pre-tax dollars, it grows tax-deferred, and many employers match part of your contribution. That match is the closest thing to free money you'll encounter — and far too many NRIs skip it because they "might move back."

## The match is a 100% instant return
A typical match is "100% of the first 4%." That means if you put in 4% of your salary, your employer adds another 4%. You doubled your money before the market moved a cent. No investment on earth reliably beats that.

Always contribute at least enough to capture the full match. Skipping it is a voluntary pay cut.

## Roth vs. traditional 401(k)
- Traditional: contributions are pre-tax now, taxed when you withdraw in retirement.
- Roth: contributions are after-tax now, withdrawals are tax-free later.

If you expect to be in a higher tax bracket later (or to retire outside the US), Roth is often the smarter long-term play. Many plans let you split.

## "But what if I move back to India?"
This is the real NRI question, and the answer is reassuring: your 401(k) is yours. It doesn't vanish if you leave the country. Your options:

- Leave it invested in the US and let it grow until retirement.
- Roll it into an IRA for more investment choices and lower fees.
- Withdraw it (worst option) — you'd owe US tax plus a 10% early-withdrawal penalty before age 59½.

If you become a non-resident again, withdrawals may face a flat US withholding, and India will tax the income too, though the tax treaty offers relief. The key point: moving back is a reason to plan, not a reason to skip free money.

## The simple rule
Capture the full match, choose Roth if you're early-career, and don't touch it until retirement. Your 55-year-old self will quietly thank your 28-year-old self.`,
  },
  {
    slug: "nre-nro-accounts-explained",
    title: "NRE vs. NRO Accounts: The Money-Transfer Setup Every NRI Needs",
    excerpt:
      "Which account holds your US savings, which holds your India income, and how to move money tax-efficiently.",
    topic: "money-transfer",
    author: "Vikram Shah",
    date: "2026-03-20",
    readingTime: 7,
    content: `Once you're earning in dollars, you'll eventually want to send money to India — for family, savings, or investments. The foundation of doing this cleanly is understanding two account types: NRE and NRO.

## NRE — Non-Resident External
An NRE account holds money you earned abroad and bring into India. Key benefits:
- Fully repatriable — you can move it back to the US anytime.
- Interest earned is tax-free in India.
- Held in rupees, but funded from your foreign income.

This is where your US-earned savings should land if you want flexibility.

## NRO — Non-Resident Ordinary
An NRO account holds income that originates in India — rent, dividends, a salary from before you left. Key points:
- Interest is taxable in India (typically ~30% TDS).
- Repatriation is capped (currently up to $1 million per year with paperwork).

## Choosing a transfer service
Banks give you terrible exchange rates and bury fees in the spread. Specialist services consistently beat them on the all-in cost. Compare the rate you actually receive, not the advertised fee. A "zero fee" transfer with a bad rate costs more than a small flat fee at the mid-market rate.

## A clean setup
- Open both an NRE and NRO account before you need them.
- Route US-earned money to NRE for tax-free, repatriable savings.
- Route India-origin income to NRO.
- Use a low-spread transfer specialist and always check the receive amount.

Get this scaffolding in place early and every future transfer becomes a two-minute task instead of a research project.`,
  },
  {
    slug: "buy-vs-lease-car-no-credit",
    title: "Buy vs. Lease Your First US Car (With No Credit History)",
    excerpt:
      "Financing a car before you have a credit score is possible. Here's how to do it without getting fleeced.",
    topic: "cars",
    author: "Rohit Desai",
    date: "2026-02-14",
    readingTime: 8,
    content: `A car is often the first big purchase an NRI makes in the US, frequently before any credit score exists. Dealers know newcomers are vulnerable here, so go in informed.

## The no-credit problem
Without a credit history, lenders see risk and respond with sky-high interest rates — sometimes 12–18% APR. Your job is to neutralize that.

## Tactics that work
- Put down a larger down payment to shrink the loan and the lender's risk.
- Bring a pay stub and offer letter; some lenders weigh income heavily for newcomers.
- Check if your employer's credit union offers newcomer auto loans — they're often the most forgiving.
- Some manufacturers (notably a few luxury and Japanese brands) run "new-to-country" financing programs specifically for visa holders.

## Buy or lease?
Lease if: you want lower monthly payments, a newer car every few years, and you drive under ~12,000 miles a year. You never build equity, and mileage overages are pricey.

Buy if: you plan to keep the car for years and want to eventually own it outright. A used car 2–3 years old hits the sweet spot — someone else ate the steepest depreciation.

For most NRIs in their first job, a lightly used car bought with a meaningful down payment is the financially sober choice. A lease only makes sense if predictable low payments matter more than ownership.

## Don't forget insurance
No US driving history means high premiums at first. Get quotes from multiple insurers, ask whether your Indian no-claims record counts (some accept a letter from your Indian insurer), and revisit your rate every six months as your record builds.

Walk into the dealership with financing pre-arranged from a bank or credit union. The dealer's financing is a profit center; your outside offer is your leverage.`,
  },
  {
    slug: "first-apartment-lease-guide",
    title: "Renting Your First US Apartment: Leases, Deposits & Credit Checks",
    excerpt:
      "No credit, no US rental history, no problem — how to land your first apartment and decode the lease.",
    topic: "housing",
    author: "Ananya Iyer",
    date: "2026-01-30",
    readingTime: 7,
    content: `Your first apartment hunt collides head-on with the credit problem: landlords want a credit score and rental history you don't have yet. Here's how to get the keys anyway.

## How to qualify with no credit
- Offer to pay a larger security deposit or a few months upfront.
- Provide your job offer letter and recent pay stubs as proof of income (aim to show income ~3x the rent).
- Ask about a co-signer or guarantor — some buildings accept third-party guarantor services for a fee.
- Smaller private landlords are far more flexible than big corporate complexes.

## Decoding the lease
- Term: most are 12-month. Breaking early usually costs 1–2 months' rent.
- Security deposit: refundable, minus damages. Document the apartment's condition with photos on day one.
- Renter's insurance: often required, and cheap (~$15/month). Get it regardless.
- Utilities: clarify what's included. "Water included, electric separate" is common.

## Hidden costs to budget for
- Application fees ($30–$75 per applicant, non-refundable).
- Broker fee in some cities (can be a full month's rent).
- First month + last month + security deposit due at signing — budget ~3x the monthly rent in cash upfront.

## Red flags
- A landlord who won't let you see the unit in person or on video.
- Pressure to wire a deposit before signing anything.
- A lease missing the landlord's real name and address.

Take photos at move-in, keep every receipt, and get all promises in writing. In US rentals, if it isn't in the lease, it doesn't exist.`,
  },
  {
    slug: "index-funds-for-beginners-nri",
    title: "Index Funds for Beginners: The NRI's Simplest Path to Investing",
    excerpt:
      "You don't need to pick stocks. Here's why low-cost index funds are the default — and the PFIC trap to avoid.",
    topic: "investing",
    author: "Sneha Rao",
    date: "2026-04-25",
    readingTime: 9,
    content: `Once your emergency fund is set and you're capturing your 401(k) match, the next question is investing the rest. The honest answer for most people is delightfully boring: low-cost index funds.

## What an index fund actually is
Instead of betting on individual companies, an index fund buys a tiny slice of hundreds or thousands of them at once — for example, the 500 largest US companies. You get instant diversification, near-zero fees, and the long-run growth of the whole market.

Decades of data show that the vast majority of professional stock-pickers fail to beat a simple index fund over time. You don't need to be smarter than them; you need to not pay them.

## Open a brokerage account
Any major US brokerage will do. Look for: no account minimum, commission-free trades, and access to low-expense-ratio index funds or ETFs. Expense ratios under 0.10% are the goal.

## The NRI-specific trap: PFICs
Here's the one rule that trips up NRIs: do NOT hold Indian mutual funds while you're a US tax resident. The IRS classifies them as PFICs (Passive Foreign Investment Companies), and the tax treatment is punishing and paperwork-heavy.

The fix is simple: invest through US-domiciled funds while you're in the US. Keep your India and US investments cleanly separated.

## A starter portfolio
- A total US stock market index fund as your core.
- A total international index fund for global exposure.
- A bond index fund if you want to dial down volatility.

That's it. Automate a monthly contribution, ignore the daily noise, and let compounding work over decades. Simplicity isn't a compromise here — it's the strategy.`,
  },
  {
    slug: "from-h1b-to-green-card-my-story",
    title: "From H-1B to Green Card: What 7 Years of Waiting Taught Me",
    excerpt:
      "A first-person account of the green card backlog — the anxiety, the financial planning, and the unexpected lessons.",
    topic: "stories",
    author: "Karthik Subramanian",
    date: "2026-05-18",
    readingTime: 10,
    content: `I landed at Newark in 2017 with two suitcases and a job offer. I assumed the green card would take a couple of years. Seven years later, I finally got it. Here's what nobody told me.

## The waiting is a tax on your life decisions
The India green card backlog means major life choices get held hostage by your visa. Should we buy a house if we might have to leave? Can my spouse work? Can I switch jobs without restarting the queue? Every decision carried an asterisk.

The lesson I wish I'd learned sooner: build a life you'd be happy with regardless of the outcome. Waiting for "after the green card" to start living is how you lose a decade.

## Money discipline became my anchor
Not knowing whether I'd stay forced me to be financially deliberate. I kept my finances portable: maxed my 401(k) but understood the rollback rules, kept an NRE account healthy in India, and avoided over-leveraging on a house until my I-485 was filed.

That uncertainty, painful as it was, made me a far better money manager than my friends back home who never had to think twice.

## Switching jobs is terrifying — until it isn't
I stayed at a job I'd outgrown for two extra years out of visa fear. When I finally moved using H-1B portability, nothing broke. The fear was bigger than the risk. Know your rights: portability, the AC21 provisions, and what your priority date actually protects.

## What I'd tell my younger self
- Start the green card process the day you're eligible. Time in the queue is the only thing you can't buy back.
- Keep documents obsessively organized. One folder, every receipt, every approval notice.
- Don't put your whole identity in the outcome. You are not a priority date.

The green card finally came. But the person it shaped during the wait — disciplined, adaptable, a little stubborn — turned out to matter more than the card itself.`,
  },
  {
    slug: "buying-first-home-on-visa",
    title: "Can You Buy a Home in the US on a Work Visa? Yes — Here's How",
    excerpt:
      "You don't need a green card to own property. Mortgages, down payments, and the real risks for visa holders.",
    topic: "property",
    author: "Vikram Shah",
    date: "2026-03-08",
    readingTime: 9,
    content: `One of the most persistent myths among NRIs is that you need a green card to buy a house in the US. You don't. There's no citizenship or permanent-residency requirement to own property. What you need is a down payment, a credit history, and a clear-eyed view of the risks.

## Getting a mortgage on a visa
Lenders care about repayment ability, not your immigration status per se. On an H-1B or L-1 you can qualify for a conventional mortgage if you have:
- A credit score (typically 620+, ideally 700+).
- A stable income and employment history (2 years is the classic benchmark, though some lenders flex for newer arrivals).
- A down payment, usually 5–20%.

Some lenders are visa-friendly and well-practiced with H-1B applicants; others aren't. Shop around.

## The numbers beyond the sticker price
- Down payment: 20% avoids private mortgage insurance (PMI); less is possible but adds cost.
- Closing costs: budget 2–5% of the purchase price.
- Property taxes, homeowners insurance, and possibly HOA fees — ongoing, and they add up.

## The visa-holder risk you must respect
The hard question: what if you have to leave the country? A house is illiquid. Selling under time pressure can mean a loss. Before buying, ask yourself whether you'd be financially fine if you had to rent it out remotely or sell in a soft market.

A reasonable rule: only buy if you expect to stay in the same area for at least 5 years, so appreciation and equity outpace your transaction costs.

## Buying property in India as an NRI
The flip side — many NRIs invest back home. You can buy residential and commercial property in India (but not agricultural land) as an NRI. Fund it through your NRE/NRO accounts, mind the TDS rules on rental income, and keep clean records for when you eventually repatriate.

Owning a home on a visa is entirely doable. Just make sure the decision survives the "what if I have to leave" stress test before you sign.`,
  },
  {
    slug: "building-community-as-new-immigrant",
    title: "Beyond the Job: Building a Real Community as a New Immigrant",
    excerpt:
      "The loneliness nobody warns you about — and practical ways to build a life, not just a career, in a new country.",
    topic: "community",
    author: "Ananya Iyer",
    date: "2026-02-28",
    readingTime: 6,
    content: `The financial side of immigrating gets all the guides. The emotional side gets silence. But ask any NRI a few years in, and they'll tell you: the hardest part wasn't the taxes. It was the loneliness.

## Why it hits harder than expected
Back home, community was ambient — family nearby, friends from school, neighbors who'd known you for years. In a new country, you start from zero socially while also navigating a new job, a new city, and a new financial system. The isolation can be heavy, especially in the first winter.

## Practical ways to build roots
- Find your overlap groups: regional associations, alumni networks, and cultural organizations exist in most US cities.
- Use shared interests, not just shared origin — a running club or a board-game meetup builds faster bonds than a generic "networking" event.
- Say yes early and often. The first six months set your social trajectory.
- Host. Even a simple chai-and-snacks evening makes you the connector everyone remembers.

## Don't only befriend people exactly like you
It's comforting to stay inside the diaspora bubble, and you should have that anchor. But the immigrants who thrive long-term tend to build mixed networks — colleagues, neighbors, parents from their kids' school. It accelerates everything from job opportunities to simply feeling at home.

## Look after your mind
The stress of immigration is real and under-discussed. Therapy is normalized in the US and often covered by employer insurance. Using it isn't weakness; it's the same maintenance you'd give any system you depend on.

A career can be rebuilt anywhere. A community takes intention. Start building it the same week you start your job — not years later when the isolation has already set in.`,
  },
  {
    slug: "emergency-fund-first-year-usa",
    title: "The Emergency Fund: Your Financial Seatbelt in Year One",
    excerpt:
      "Before investing a single dollar, build this. Here's how much, where to keep it, and why it matters more for immigrants.",
    topic: "finance",
    author: "Priya Nair",
    date: "2026-01-15",
    readingTime: 6,
    content: `Every personal finance guide preaches the emergency fund, but for NRIs it's not just prudent — it's existential. When you have no family safety net in the country and your visa is tied to your job, cash is freedom.

## Why immigrants need a bigger buffer
A US-born worker who loses a job can move back in with family and regroup. An H-1B worker who loses a job has a 60-day clock to find a new sponsor or leave the country. That pressure makes a robust cash cushion non-negotiable. It buys you time to make good decisions instead of desperate ones.

## How much to save
The standard advice is 3–6 months of expenses. For visa holders, aim for the higher end — 6 months — precisely because of the job-loss clock. Calculate your real monthly burn (rent, food, insurance, minimum debt payments) and multiply.

## Where to keep it
Not in your checking account, where it earns nothing and is too easy to spend. Not in the stock market, where it could drop 20% the week you need it. The right home is a high-yield savings account: liquid, safe, and earning meaningful interest.

## Build it before you invest
It's tempting to chase market returns immediately. Resist. The sequence is:
1. Capture your 401(k) employer match (free money).
2. Build the emergency fund.
3. Then invest the surplus.

An emergency fund feels like idle money right up until the day it becomes the most important money you own. For an immigrant building a life on a visa, that day is never as far away as it seems.`,
  },
  {
    slug: "roth-ira-vs-traditional-nri",
    title: "Roth IRA vs. Traditional IRA: Which Should an NRI Choose?",
    excerpt:
      "Beyond your 401(k), an IRA supercharges your retirement savings. Here's how to pick the right one as an immigrant.",
    topic: "retirement",
    author: "Arjun Mehta",
    date: "2026-05-10",
    readingTime: 7,
    content: `Your 401(k) gets the employer match, but it's not the only retirement tool. An IRA — Individual Retirement Account — lets you save more, with more investment freedom. The big choice is Roth vs. traditional.

## The core difference
- Traditional IRA: contributions may be tax-deductible now; you pay tax when you withdraw in retirement.
- Roth IRA: you contribute after-tax dollars now; qualified withdrawals are completely tax-free later, including all the growth.

## Why Roth often wins for younger NRIs
If you're early in your career, your tax bracket is likely lower now than it will be at peak earnings. Paying tax now at a low rate, then withdrawing tax-free later, is a strong bet. The Roth's tax-free growth over decades is extraordinary.

There's also a portability angle: if you move back to India in retirement, tax-free Roth withdrawals are far simpler to plan around than a traditional account's taxable distributions interacting with two tax systems.

## Watch the income limits
Roth IRA eligibility phases out at higher incomes. High earners can still get in via the "backdoor Roth" — contributing to a traditional IRA and converting — but the mechanics deserve care, especially if you hold other IRA balances (the pro-rata rule).

## How it fits the bigger plan
The clean priority order for most NRIs:
1. 401(k) up to the full employer match.
2. Max a Roth IRA.
3. Back to the 401(k) to max it out.
4. Taxable brokerage for anything beyond.

An IRA is the quiet workhorse of an immigrant's retirement plan. Open one, automate the contribution, choose low-cost index funds inside it, and let 30 years of tax-free compounding do something remarkable.`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByTopic(topicSlug: string): Article[] {
  return articles
    .filter((a) => a.topic === topicSlug)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getRecentArticles(limit = 6): Article[] {
  return [...articles]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter((a) => a.topic === article.topic && a.slug !== article.slug)
    .concat(articles.filter((a) => a.topic !== article.topic))
    .filter((a) => a.slug !== article.slug)
    .slice(0, limit);
}
