#!/usr/bin/env python3
"""
Generate a synthetic LCA disclosure file shaped like the real DOL OFLC export
(same column names) so we can test etl.py without the 600 MB download.
Includes messy employer-name variants, mixed wage units, and some
non-H-1B / non-certified rows that the ETL must filter out.
"""
import random
from datetime import date, timedelta
from openpyxl import Workbook

random.seed(42)

# (raw EMPLOYER_NAME as it appears in DOL files) -> these collapse to one company
EMPLOYERS = [
    "AMAZON.COM SERVICES LLC",
    "AMAZON WEB SERVICES, INC.",
    "AMAZON DEVELOPMENT CENTER U.S.A., INC.",
    "GOOGLE LLC",
    "GOOGLE INC.",
    "MICROSOFT CORPORATION",
    "META PLATFORMS, INC.",
    "INFOSYS LIMITED",
    "INFOSYS BPM LIMITED",
    "TATA CONSULTANCY SERVICES LIMITED",
    "COGNIZANT TECHNOLOGY SOLUTIONS US CORP",
    "BRIGHTWAVE ANALYTICS LLC",        # long-tail, no alias
    "NORTHSTAR ROBOTICS INC",          # long-tail, no alias
]

SOCS = [
    ("15-1252", "Software Developers"),
    ("15-2051", "Data Scientists"),
    ("15-1211", "Computer Systems Analysts"),
    ("13-2011", "Accountants and Auditors"),
]
JOB_TITLES = {
    "15-1252": ["Software Engineer", "Sr. Software Engineer", "SDE II", "Backend Engineer"],
    "15-2051": ["Data Scientist", "Machine Learning Engineer", "Applied Scientist"],
    "15-1211": ["Systems Analyst", "Business Systems Analyst"],
    "13-2011": ["Accountant", "Senior Auditor"],
}
STATES = ["CA", "WA", "TX", "NY", "NJ", "IL"]
CITIES = {"CA": "Sunnyvale", "WA": "Seattle", "TX": "Austin",
          "NY": "New York", "NJ": "Jersey City", "IL": "Chicago"}

# Mostly H-1B / Certified, with a minority that must be filtered out
VISA_CLASSES = ["H-1B"] * 18 + ["E-3 Australian", "H-1B1 Singapore"]
CASE_STATUSES = ["Certified"] * 17 + ["Denied", "Withdrawn", "Certified - Withdrawn"]
WAGE_UNITS = ["Year"] * 16 + ["Hour", "Month", "Bi-Weekly", "Week"]
PW_LEVELS = ["I", "II", "II", "III", "III", "III", "IV"]

START = date(2024, 4, 1)
END = date(2026, 3, 31)
SPAN = (END - START).days

COLUMNS = [
    "CASE_NUMBER", "CASE_STATUS", "RECEIVED_DATE", "DECISION_DATE",
    "VISA_CLASS", "JOB_TITLE", "SOC_CODE", "SOC_TITLE", "FULL_TIME_POSITION",
    "TOTAL_WORKER_POSITIONS", "EMPLOYER_NAME", "WORKSITE_CITY",
    "WORKSITE_STATE", "WAGE_RATE_OF_PAY_FROM", "WAGE_RATE_OF_PAY_TO",
    "WAGE_UNIT_OF_PAY", "PREVAILING_WAGE", "PW_UNIT_OF_PAY", "PW_WAGE_LEVEL",
]


def annual_to_unit(annual, unit):
    return {"Year": annual, "Hour": round(annual / 2080, 2), "Month": round(annual / 12),
            "Bi-Weekly": round(annual / 26), "Week": round(annual / 52)}[unit]


def main(path="LCA_SAMPLE.xlsx", n=700):
    wb = Workbook()
    ws = wb.active
    ws.title = "LCA"
    ws.append(COLUMNS)
    for i in range(n):
        soc_code, soc_title = random.choice(SOCS)
        emp = random.choice(EMPLOYERS)
        st = random.choice(STATES)
        unit = random.choice(WAGE_UNITS)
        base_annual = random.choice([110000, 125000, 140000, 160000, 185000, 210000])
        d = START + timedelta(days=random.randint(0, SPAN))
        ws.append([
            f"I-200-{24000+i}-{random.randint(100000,999999)}",
            random.choice(CASE_STATUSES),
            d - timedelta(days=7),
            d,
            random.choice(VISA_CLASSES),
            random.choice(JOB_TITLES[soc_code]),
            soc_code,
            soc_title,
            "Y",
            random.choice([1, 1, 1, 2, 5]),
            emp,
            CITIES[st],
            st,
            annual_to_unit(base_annual, unit),
            annual_to_unit(base_annual + 20000, unit),
            unit,
            annual_to_unit(base_annual - 5000, unit),
            unit,
            random.choice(PW_LEVELS),
        ])
    wb.save(path)
    print(f"wrote {path} with {n} rows")


if __name__ == "__main__":
    main()
