export interface Team {
  id: string;
  name: string;
  logo: string;
  stadium: string;
  founded: number;
  league: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  nationality: string;
  age: number;
  image: string;
  teamId: string;
}

export interface PredictionCategory {
  id: string;
  name: string;
  description: string;
}

export const LEAGUES: League[] = [
  {
    id: "epl",
    name: "English Premier League",
    country: "England",
    logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg"
  },
  {
    id: "laliga",
    name: "La Liga",
    country: "Spain",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/LaLiga.svg"
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo.svg"
  },
  {
    id: "seriea",
    name: "Serie A",
    country: "Italy",
    logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo.svg"
  },
  {
    id: "nba",
    name: "National Basketball Association",
    country: "United States",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg"
  },
  {
    id: "mlb",
    name: "Major League Baseball",
    country: "United States",
    logo: "https://upload.wikimedia.org/wikipedia/en/a/a6/Major_League_Baseball_logo.svg"
  },
  {
    id: "nfl",
    name: "National Football League",
    country: "United States",
    logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg"
  }
];

export const TEAMS: { [key: string]: Team[] } = {
  "epl": [
    {
      id: "mancity",
      name: "Manchester City",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png",
      stadium: "Etihad Stadium",
      founded: 1880,
      league: "epl"
    },
    {
      id: "arsenal",
      name: "Arsenal",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png",
      stadium: "Emirates Stadium",
      founded: 1886,
      league: "epl"
    },
    {
      id: "liverpool",
      name: "Liverpool",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png",
      stadium: "Anfield",
      founded: 1892,
      league: "epl"
    },
    {
      id: "manutd",
      name: "Manchester United",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
      stadium: "Old Trafford",
      founded: 1878,
      league: "epl"
    }
  ],
  "laliga": [
    {
      id: "realmadrid",
      name: "Real Madrid",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
      stadium: "Santiago Bernabéu",
      founded: 1902,
      league: "laliga"
    },
    {
      id: "barcelona",
      name: "Barcelona",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png",
      stadium: "Camp Nou",
      founded: 1899,
      league: "laliga"
    },
    {
      id: "atletico",
      name: "Atlético Madrid",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atletico_Madrid_2017_logo.svg/1200px-Atletico_Madrid_2017_logo.svg.png",
      stadium: "Metropolitano",
      founded: 1903,
      league: "laliga"
    },
    {
      id: "realsociedad",
      name: "Real Sociedad",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Real_Sociedad_logo.svg/1200px-Real_Sociedad_logo.svg.png",
      stadium: "Anoeta",
      founded: 1909,
      league: "laliga"
    }
  ],
  "bundesliga": [
    {
      id: "bayern",
      name: "Bayern Munich",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_München_logo_%282017%29.svg/1200px-FC_Bayern_München_logo_%282017%29.svg.png",
      stadium: "Allianz Arena",
      founded: 1900,
      league: "bundesliga"
    },
    {
      id: "dortmund",
      name: "Borussia Dortmund",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/1200px-Borussia_Dortmund_logo.svg.png",
      stadium: "Signal Iduna Park",
      founded: 1909,
      league: "bundesliga"
    },
    {
      id: "leipzig",
      name: "RB Leipzig",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/1200px-RB_Leipzig_2014_logo.svg.png",
      stadium: "Red Bull Arena",
      founded: 2009,
      league: "bundesliga"
    },
    {
      id: "leverkusen",
      name: "Bayer Leverkusen",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/1200px-Bayer_04_Leverkusen_logo.svg.png",
      stadium: "BayArena",
      founded: 1904,
      league: "bundesliga"
    }
  ],
  "seriea": [
    {
      id: "inter",
      name: "Inter Milan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png",
      stadium: "San Siro",
      founded: 1908,
      league: "seriea"
    },
    {
      id: "juventus",
      name: "Juventus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_2017_icon.svg/1200px-Juventus_FC_2017_icon.svg.png",
      stadium: "Allianz Stadium",
      founded: 1897,
      league: "seriea"
    },
    {
      id: "milan",
      name: "AC Milan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/AC_Milan_2022_logo.svg/1200px-AC_Milan_2022_logo.svg.png",
      stadium: "San Siro",
      founded: 1899,
      league: "seriea"
    },
    {
      id: "napoli",
      name: "Napoli",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SSC_Napoli_2021.svg/1200px-SSC_Napoli_2021.svg.png",
      stadium: "Diego Armando Maradona",
      founded: 1926,
      league: "seriea"
    }
  ],
  "nba": [
    {
      id: "lakers",
      name: "Los Angeles Lakers",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
      stadium: "Crypto.com Arena",
      founded: 1947,
      league: "nba"
    },
    {
      id: "celtics",
      name: "Boston Celtics",
      logo: "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
      stadium: "TD Garden",
      founded: 1946,
      league: "nba"
    },
    {
      id: "warriors",
      name: "Golden State Warriors",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
      stadium: "Chase Center",
      founded: 1946,
      league: "nba"
    },
    {
      id: "bucks",
      name: "Milwaukee Bucks",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg",
      stadium: "Fiserv Forum",
      founded: 1968,
      league: "nba"
    }
  ],
  "mlb": [
    {
      id: "yankees",
      name: "New York Yankees",
      logo: "https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Yankees_logo.svg",
      stadium: "Yankee Stadium",
      founded: 1901,
      league: "mlb"
    },
    {
      id: "redsox",
      name: "Boston Red Sox",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/6d/Boston_Red_Sox_cap_logo.svg",
      stadium: "Fenway Park",
      founded: 1901,
      league: "mlb"
    },
    {
      id: "dodgers",
      name: "Los Angeles Dodgers",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/69/Los_Angeles_Dodgers_logo.svg",
      stadium: "Dodger Stadium",
      founded: 1883,
      league: "mlb"
    },
    {
      id: "rangers",
      name: "Texas Rangers",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/41/Texas_Rangers.svg",
      stadium: "Globe Life Field",
      founded: 1961,
      league: "mlb"
    }
  ],
  "nfl": [
    {
      id: "chiefs",
      name: "Kansas City Chiefs",
      logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg",
      stadium: "Arrowhead Stadium",
      founded: 1960,
      league: "nfl"
    },
    {
      id: "niners",
      name: "San Francisco 49ers",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg",
      stadium: "Levi's Stadium",
      founded: 1946,
      league: "nfl"
    },
    {
      id: "ravens",
      name: "Baltimore Ravens",
      logo: "https://upload.wikimedia.org/wikipedia/en/1/16/Baltimore_Ravens_logo.svg",
      stadium: "M&T Bank Stadium",
      founded: 1996,
      league: "nfl"
    },
    {
      id: "bills",
      name: "Buffalo Bills",
      logo: "https://upload.wikimedia.org/wikipedia/en/7/77/Buffalo_Bills_logo.svg",
      stadium: "Highmark Stadium",
      founded: 1960,
      league: "nfl"
    }
  ]
};

export const PLAYERS: { [key: string]: Player[] } = {
  "mancity": [
    {
      id: "haaland",
      name: "Erling Haaland",
      position: "Forward",
      number: 9,
      nationality: "Norway",
      age: 23,
      image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png",
      teamId: "mancity"
    },
    {
      id: "debruyne",
      name: "Kevin De Bruyne",
      position: "Midfielder",
      number: 17,
      nationality: "Belgium",
      age: 32,
      image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png",
      teamId: "mancity"
    }
  ],
  "arsenal": [
    {
      id: "saka",
      name: "Bukayo Saka",
      position: "Forward",
      number: 7,
      nationality: "England",
      age: 22,
      image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p444145.png",
      teamId: "arsenal"
    },
    {
      id: "odegaard",
      name: "Martin Ødegaard",
      position: "Midfielder",
      number: 8,
      nationality: "Norway",
      age: 25,
      image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p184029.png",
      teamId: "arsenal"
    }
  ],
  "realmadrid": [
    {
      id: "bellingham",
      name: "Jude Bellingham",
      position: "Midfielder",
      number: 5,
      nationality: "England",
      age: 20,
      image: "https://assets.laliga.com/squad/2023/t186/p492341/512x512/p492341_t186_2023_1_001_000.png",
      teamId: "realmadrid"
    },
    {
      id: "vini",
      name: "Vinícius Júnior",
      position: "Forward",
      number: 7,
      nationality: "Brazil",
      age: 23,
      image: "https://assets.laliga.com/squad/2023/t186/p279757/512x512/p279757_t186_2023_1_001_000.png",
      teamId: "realmadrid"
    }
  ],
  "barcelona": [
    {
      id: "lewandowski",
      name: "Robert Lewandowski",
      position: "Forward",
      number: 9,
      nationality: "Poland",
      age: 35,
      image: "https://assets.laliga.com/squad/2023/t178/p37412/512x512/p37412_t178_2023_1_001_000.png",
      teamId: "barcelona"
    },
    {
      id: "gavi",
      name: "Gavi",
      position: "Midfielder",
      number: 6,
      nationality: "Spain",
      age: 19,
      image: "https://assets.laliga.com/squad/2023/t178/p496593/512x512/p496593_t178_2023_1_001_000.png",
      teamId: "barcelona"
    }
  ],
  "lakers": [
    {
      id: "lebron",
      name: "LeBron James",
      position: "Forward",
      number: 23,
      nationality: "USA",
      age: 39,
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
      teamId: "lakers"
    },
    {
      id: "davis",
      name: "Anthony Davis",
      position: "Forward/Center",
      number: 3,
      nationality: "USA",
      age: 31,
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png",
      teamId: "lakers"
    }
  ],
  "warriors": [
    {
      id: "curry",
      name: "Stephen Curry",
      position: "Guard",
      number: 30,
      nationality: "USA",
      age: 36,
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png",
      teamId: "warriors"
    },
    {
      id: "thompson",
      name: "Klay Thompson",
      position: "Guard",
      number: 11,
      nationality: "USA",
      age: 34,
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/202691.png",
      teamId: "warriors"
    }
  ],
  "yankees": [
    {
      id: "judge",
      name: "Aaron Judge",
      position: "Outfield",
      number: 99,
      nationality: "USA",
      age: 31,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current",
      teamId: "yankees"
    },
    {
      id: "cole",
      name: "Gerrit Cole",
      position: "Pitcher",
      number: 45,
      nationality: "USA",
      age: 33,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/543037/headshot/67/current",
      teamId: "yankees"
    }
  ],
  "dodgers": [
    {
      id: "ohtani",
      name: "Shohei Ohtani",
      position: "Designated Hitter/Pitcher",
      number: 17,
      nationality: "Japan",
      age: 29,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current",
      teamId: "dodgers"
    },
    {
      id: "betts",
      name: "Mookie Betts",
      position: "Outfield",
      number: 50,
      nationality: "USA",
      age: 31,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/605141/headshot/67/current",
      teamId: "dodgers"
    }
  ],
  "chiefs": [
    {
      id: "mahomes",
      name: "Patrick Mahomes",
      position: "Quarterback",
      number: 15,
      nationality: "USA",
      age: 28,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/vs40h82nvqaqvyephwlq",
      teamId: "chiefs"
    },
    {
      id: "kelce",
      name: "Travis Kelce",
      position: "Tight End",
      number: 87,
      nationality: "USA",
      age: 34,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/qb0qmqz6c2dy3snp9qsp",
      teamId: "chiefs"
    }
  ],
  "niners": [
    {
      id: "purdy",
      name: "Brock Purdy",
      position: "Quarterback",
      number: 13,
      nationality: "USA",
      age: 24,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/pxe1qy2sf6f1yqkbukqf",
      teamId: "niners"
    },
    {
      id: "mccaffrey",
      name: "Christian McCaffrey",
      position: "Running Back",
      number: 23,
      nationality: "USA",
      age: 27,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/vrsf24rf3qhfmvhpzawp",
      teamId: "niners"
    }
  ]
};

export const PREDICTION_CATEGORIES: { [key: string]: PredictionCategory[] } = {
  "soccer": [
    { id: "goals", name: "Goals", description: "Total goals scored" },
    { id: "assists", name: "Assists", description: "Total assists provided" },
    { id: "shots", name: "Shots", description: "Total shots attempted" },
    { id: "shots_on_target", name: "Shots on Target", description: "Total shots on target" }
  ],
  "basketball": [
    { id: "points", name: "Points", description: "Total points scored" },
    { id: "rebounds", name: "Rebounds", description: "Total rebounds" },
    { id: "assists", name: "Assists", description: "Total assists" },
    { id: "three_pointers", name: "Three Pointers", description: "Total three pointers made" }
  ],
  "baseball": [
    { id: "hits", name: "Hits", description: "Total hits" },
    { id: "runs", name: "Runs", description: "Total runs" },
    { id: "rbis", name: "RBIs", description: "Runs batted in" },
    { id: "home_runs", name: "Home Runs", description: "Total home runs" },
    { id: "strikeouts", name: "Strikeouts", description: "Total strikeouts (Pitchers)" }
  ],
  "football": [
    { id: "passing_yards", name: "Passing Yards", description: "Total passing yards" },
    { id: "passing_tds", name: "Passing TDs", description: "Total passing touchdowns" },
    { id: "rushing_yards", name: "Rushing Yards", description: "Total rushing yards" },
    { id: "receiving_yards", name: "Receiving Yards", description: "Total receiving yards" },
    { id: "touchdowns", name: "Touchdowns", description: "Total touchdowns scored" }
  ]
}; 