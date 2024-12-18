# games/utils.py

def parse_pgn_date(pgn_date):
    year, month, day = None, None, None
    try:
        parts = pgn_date.split('.')
        if len(parts) == 3:
            year_str, month_str, day_str = parts

            # Validate and assign year
            if year_str.isdigit() and len(year_str) == 4:
                year = int(year_str)

            # Validate and assign month
            if month_str.isdigit() and 1 <= int(month_str) <= 12:
                month = int(month_str)

            # Validate and assign day
            if day_str.isdigit() and 1 <= int(day_str) <= 31:
                day = int(day_str)

    except Exception as e:
        print(f"Error parsing date '{pgn_date}': {e}")

    return year, month, day