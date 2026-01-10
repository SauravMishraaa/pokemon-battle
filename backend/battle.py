def simulate_battle(team1, team2, weakness):
    rounds = []
    i = j = 0
    round_no = 1
    
    team1_life = {idx: p["life"] for idx, p in enumerate(team1)}
    team2_life = {idx: p["life"] for idx, p in enumerate(team2)}

    while i < len(team1) and j < len(team2):
        p1 = team1[i]
        p2 = team2[j]

        f1 = weakness[(p1["type"], p2["type"])]
        f2 = weakness[(p2["type"], p1["type"])]

        p1_life_before = team1_life[i]
        p2_life_before = team2_life[j]

        team1_life[i] -= p2["power"] * f2
        team2_life[j] -= p1["power"] * f1

        rounds.append({
            "round": round_no,
            "team1": {
                "pokemon": p1,
                "life_before": p1_life_before,
                "life_after": max(team1_life[i], 0)
            },
            "team2": {
                "pokemon": p2,
                "life_before": p2_life_before,
                "life_after": max(team2_life[j], 0)
            }
        })

        if team1_life[i] <= 0:
            i += 1
        if team2_life[j] <= 0:
            j += 1

        round_no += 1

    return {
        "winner": "team1" if i < len(team1) else "team2",
        "rounds": rounds
    }