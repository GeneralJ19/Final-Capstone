export interface Sport {
  id: string;
  name: string;
  type: 'team' | 'individual';
  indoor: boolean;
  logo: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
  sport: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  stadium: string;
  founded: number;
  league: string;
  sport: string;
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
  sport: string;
}

export const SPORTS: Sport[] = [
  {
    id: "soccer",
    name: "Soccer",
    type: "team",
    indoor: false,
    logo: "https://example.com/soccer-logo.png"
  },
  {
    id: "basketball",
    name: "Basketball",
    type: "team",
    indoor: true,
    logo: "https://example.com/basketball-logo.png"
  },
  {
    id: "baseball",
    name: "Baseball",
    type: "team",
    indoor: false,
    logo: "https://example.com/baseball-logo.png"
  },
  {
    id: "hockey",
    name: "Ice Hockey",
    type: "team",
    indoor: true,
    logo: "https://example.com/hockey-logo.png"
  },
  {
    id: "football",
    name: "Football",
    type: "team",
    indoor: false,
    logo: "https://example.com/football-logo.png"
  }
];

export const LEAGUES: { [key: string]: League[] } = {
  "soccer": [
    {
      id: "epl",
      name: "English Premier League",
      country: "England",
      logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
      sport: "soccer"
    },
    {
      id: "laliga",
      name: "La Liga",
      country: "Spain",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/LaLiga.svg",
      sport: "soccer"
    },
    {
      id: "bundesliga",
      name: "Bundesliga",
      country: "Germany",
      logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo.svg",
      sport: "soccer"
    },
    {
      id: "seriea",
      name: "Serie A",
      country: "Italy",
      logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo.svg",
      sport: "soccer"
    }
  ],
  "basketball": [
    {
      id: "nba",
      name: "National Basketball Association",
      country: "United States",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg",
      sport: "basketball"
    },
    {
      id: "euroleague",
      name: "EuroLeague",
      country: "Europe",
      logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Euroleague_Basketball_logo.svg",
      sport: "basketball"
    }
  ],
  "baseball": [
    {
      id: "mlb",
      name: "Major League Baseball",
      country: "United States",
      logo: "https://upload.wikimedia.org/wikipedia/en/a/a6/Major_League_Baseball_logo.svg",
      sport: "baseball"
    }
  ],
  "hockey": [
    {
      id: "nhl",
      name: "National Hockey League",
      country: "United States & Canada",
      logo: "https://upload.wikimedia.org/wikipedia/en/3/3a/National_Hockey_League_logo.svg",
      sport: "hockey"
    }
  ],
  "football": [
    {
      id: "nfl",
      name: "National Football League",
      country: "United States",
      logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/National_Football_League_logo.svg",
      sport: "football"
    }
  ]
};

export const TEAMS: { [key: string]: Team[] } = {
  // Soccer Teams
  "epl": [
    {
      id: "mancity",
      name: "Manchester City",
      logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      stadium: "Etihad Stadium",
      founded: 1880,
      league: "epl",
      sport: "soccer"
    },
    {
      id: "liverpool",
      name: "Liverpool FC",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      stadium: "Anfield",
      founded: 1892,
      league: "epl",
      sport: "soccer"
    },
    {
      id: "arsenal",
      name: "Arsenal",
      logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
      stadium: "Emirates Stadium",
      founded: 1886,
      league: "epl",
      sport: "soccer"
    }
  ],
  "laliga": [
    {
      id: "realmadrid",
      name: "Real Madrid",
      logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      stadium: "Santiago Bernabéu",
      founded: 1902,
      league: "laliga",
      sport: "soccer"
    },
    {
      id: "barcelona",
      name: "FC Barcelona",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg",
      stadium: "Camp Nou",
      founded: 1899,
      league: "laliga",
      sport: "soccer"
    },
    {
      id: "atletico",
      name: "Atlético Madrid",
      logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",
      stadium: "Metropolitano",
      founded: 1903,
      league: "laliga",
      sport: "soccer"
    }
  ],
  "bundesliga": [
    {
      id: "bayern",
      name: "Bayern Munich",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo.svg",
      stadium: "Allianz Arena",
      founded: 1900,
      league: "bundesliga",
      sport: "soccer"
    },
    {
      id: "dortmund",
      name: "Borussia Dortmund",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
      stadium: "Signal Iduna Park",
      founded: 1909,
      league: "bundesliga",
      sport: "soccer"
    },
    {
      id: "leverkusen",
      name: "Bayer Leverkusen",
      logo: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
      stadium: "BayArena",
      founded: 1904,
      league: "bundesliga",
      sport: "soccer"
    }
  ],
  "seriea": [
    {
      id: "inter",
      name: "Inter Milan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg",
      stadium: "San Siro",
      founded: 1908,
      league: "seriea",
      sport: "soccer"
    },
    {
      id: "juventus",
      name: "Juventus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon.svg",
      stadium: "Allianz Stadium",
      founded: 1897,
      league: "seriea",
      sport: "soccer"
    },
    {
      id: "milan",
      name: "AC Milan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/AC_Milan_2022_logo.svg",
      stadium: "San Siro",
      founded: 1899,
      league: "seriea",
      sport: "soccer"
    }
  ],
  // Basketball Teams
  "nba": [
    {
      id: "lakers",
      name: "Los Angeles Lakers",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg",
      stadium: "Crypto.com Arena",
      founded: 1947,
      league: "nba",
      sport: "basketball"
    },
    {
      id: "celtics",
      name: "Boston Celtics",
      logo: "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg",
      stadium: "TD Garden",
      founded: 1946,
      league: "nba",
      sport: "basketball"
    },
    {
      id: "warriors",
      name: "Golden State Warriors",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg",
      stadium: "Chase Center",
      founded: 1946,
      league: "nba",
      sport: "basketball"
    },
    {
      id: "bucks",
      name: "Milwaukee Bucks",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg",
      stadium: "Fiserv Forum",
      founded: 1968,
      league: "nba",
      sport: "basketball"
    },
    {
      id: "nuggets",
      name: "Denver Nuggets",
      logo: "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg",
      stadium: "Ball Arena",
      founded: 1967,
      league: "nba",
      sport: "basketball"
    }
  ],
  "euroleague": [
    {
      id: "realmadrid_basketball",
      name: "Real Madrid Baloncesto",
      logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      stadium: "WiZink Center",
      founded: 1931,
      league: "euroleague",
      sport: "basketball"
    },
    {
      id: "barcelona_basketball",
      name: "FC Barcelona Bàsquet",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg",
      stadium: "Palau Blaugrana",
      founded: 1926,
      league: "euroleague",
      sport: "basketball"
    }
  ],
  // Baseball Teams
  "mlb": [
    {
      id: "yankees",
      name: "New York Yankees",
      logo: "https://upload.wikimedia.org/wikipedia/en/2/25/NewYorkYankees_PrimaryLogo.svg",
      stadium: "Yankee Stadium",
      founded: 1901,
      league: "mlb",
      sport: "baseball"
    },
    {
      id: "redsox",
      name: "Boston Red Sox",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg",
      stadium: "Fenway Park",
      founded: 1901,
      league: "mlb",
      sport: "baseball"
    },
    {
      id: "dodgers",
      name: "Los Angeles Dodgers",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/69/Los_Angeles_Dodgers_logo.svg",
      stadium: "Dodger Stadium",
      founded: 1883,
      league: "mlb",
      sport: "baseball"
    },
    {
      id: "astros",
      name: "Houston Astros",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Houston-Astros-Logo.svg",
      stadium: "Minute Maid Park",
      founded: 1962,
      league: "mlb",
      sport: "baseball"
    },
    {
      id: "braves",
      name: "Atlanta Braves",
      logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg",
      stadium: "Truist Park",
      founded: 1871,
      league: "mlb",
      sport: "baseball"
    }
  ],
  // Hockey Teams
  "nhl": [
    {
      id: "bruins",
      name: "Boston Bruins",
      logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Boston_Bruins.svg",
      stadium: "TD Garden",
      founded: 1924,
      league: "nhl",
      sport: "hockey"
    },
    {
      id: "canadiens",
      name: "Montreal Canadiens",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/63/Montreal_Canadiens.svg",
      stadium: "Bell Centre",
      founded: 1909,
      league: "nhl",
      sport: "hockey"
    },
    {
      id: "rangers",
      name: "New York Rangers",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/New_York_Rangers.svg",
      stadium: "Madison Square Garden",
      founded: 1926,
      league: "nhl",
      sport: "hockey"
    },
    {
      id: "avalanche",
      name: "Colorado Avalanche",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/45/Colorado_Avalanche_logo.svg",
      stadium: "Ball Arena",
      founded: 1979,
      league: "nhl",
      sport: "hockey"
    },
    {
      id: "oilers",
      name: "Edmonton Oilers",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/4d/Logo_Edmonton_Oilers.svg",
      stadium: "Rogers Place",
      founded: 1971,
      league: "nhl",
      sport: "hockey"
    }
  ],
  "nfl": [
    {
      id: "patriots",
      name: "New England Patriots",
      logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg",
      stadium: "Gillette Stadium",
      founded: 1959,
      league: "nfl",
      sport: "football"
    },
    {
      id: "packers",
      name: "Green Bay Packers",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Green_Bay_Packers_logo.svg",
      stadium: "Lambeau Field",
      founded: 1919,
      league: "nfl",
      sport: "football"
    },
    {
      id: "cowboys",
      name: "Dallas Cowboys",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Dallas_Cowboys.svg",
      stadium: "AT&T Stadium",
      founded: 1960,
      league: "nfl",
      sport: "football"
    }
  ]
};

export const PLAYERS: { [key: string]: Player[] } = {
  // Soccer Players
  "mancity": [
    {
      id: "haaland",
      name: "Erling Haaland",
      position: "Forward",
      number: 9,
      nationality: "Norway",
      age: 23,
      image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png",
      teamId: "mancity",
      sport: "soccer"
    },
    {
      id: "debruyne",
      name: "Kevin De Bruyne",
      position: "Midfielder",
      number: 17,
      nationality: "Belgium",
      age: 32,
      image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png",
      teamId: "mancity",
      sport: "soccer"
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
      teamId: "realmadrid",
      sport: "soccer"
    },
    {
      id: "vini",
      name: "Vinícius Júnior",
      position: "Forward",
      number: 7,
      nationality: "Brazil",
      age: 23,
      image: "https://assets.laliga.com/squad/2023/t186/p279757/512x512/p279757_t186_2023_1_001_000.png",
      teamId: "realmadrid",
      sport: "soccer"
    }
  ],
  "bayern": [
    {
      id: "kane",
      name: "Harry Kane",
      position: "Forward",
      number: 9,
      nationality: "England",
      age: 30,
      image: "https://img.bundesliga.com/tachyon/sites/2/2023/08/Kane_Harry_FCB.png",
      teamId: "bayern",
      sport: "soccer"
    },
    {
      id: "kimmich",
      name: "Joshua Kimmich",
      position: "Midfielder",
      number: 6,
      nationality: "Germany",
      age: 29,
      image: "https://img.bundesliga.com/tachyon/sites/2/2023/07/Kimmich_Joshua_FCB.png",
      teamId: "bayern",
      sport: "soccer"
    }
  ],
  // Basketball Players
  "lakers": [
    {
      id: "lebron",
      name: "LeBron James",
      position: "Forward",
      number: 23,
      nationality: "USA",
      age: 39,
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
      teamId: "lakers",
      sport: "basketball"
    },
    {
      id: "davis",
      name: "Anthony Davis",
      position: "Forward/Center",
      number: 3,
      nationality: "USA",
      age: 31,
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png",
      teamId: "lakers",
      sport: "basketball"
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
      teamId: "warriors",
      sport: "basketball"
    },
    {
      id: "thompson",
      name: "Klay Thompson",
      position: "Guard",
      number: 11,
      nationality: "USA",
      age: 34,
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/202691.png",
      teamId: "warriors",
      sport: "basketball"
    }
  ],
  // Baseball Players
  "yankees": [
    {
      id: "judge",
      name: "Aaron Judge",
      position: "Outfield",
      number: 99,
      nationality: "USA",
      age: 31,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/592450/headshot/67/current",
      teamId: "yankees",
      sport: "baseball"
    },
    {
      id: "cole",
      name: "Gerrit Cole",
      position: "Pitcher",
      number: 45,
      nationality: "USA",
      age: 33,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/543037/headshot/67/current",
      teamId: "yankees",
      sport: "baseball"
    }
  ],
  "dodgers": [
    {
      id: "betts",
      name: "Mookie Betts",
      position: "Outfield",
      number: 50,
      nationality: "USA",
      age: 31,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/605141/headshot/67/current",
      teamId: "dodgers",
      sport: "baseball"
    },
    {
      id: "ohtani",
      name: "Shohei Ohtani",
      position: "Designated Hitter/Pitcher",
      number: 17,
      nationality: "Japan",
      age: 29,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/660271/headshot/67/current",
      teamId: "dodgers",
      sport: "baseball"
    }
  ],
  // Hockey Players
  "bruins": [
    {
      id: "marchand",
      name: "Brad Marchand",
      position: "Left Wing",
      number: 63,
      nationality: "Canada",
      age: 35,
      image: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8473419.jpg",
      teamId: "bruins",
      sport: "hockey"
    },
    {
      id: "pastrnak",
      name: "David Pastrňák",
      position: "Right Wing",
      number: 88,
      nationality: "Czech Republic",
      age: 27,
      image: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8477956.jpg",
      teamId: "bruins",
      sport: "hockey"
    }
  ],
  "oilers": [
    {
      id: "mcdavid",
      name: "Connor McDavid",
      position: "Center",
      number: 97,
      nationality: "Canada",
      age: 27,
      image: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8478402.jpg",
      teamId: "oilers",
      sport: "hockey"
    },
    {
      id: "draisaitl",
      name: "Leon Draisaitl",
      position: "Center",
      number: 29,
      nationality: "Germany",
      age: 28,
      image: "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8477934.jpg",
      teamId: "oilers",
      sport: "hockey"
    }
  ],
  // NFL Players
  "chiefs": [
    {
      id: "mahomes",
      name: "Patrick Mahomes",
      position: "Quarterback",
      number: 15,
      nationality: "USA",
      age: 28,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/vs40h82nvqaqvyephwlq",
      teamId: "chiefs",
      sport: "football"
    },
    {
      id: "kelce",
      name: "Travis Kelce",
      position: "Tight End",
      number: 87,
      nationality: "USA",
      age: 34,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/qb0qmqz6c2dy3snp9qsp",
      teamId: "chiefs",
      sport: "football"
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
      teamId: "niners",
      sport: "football"
    },
    {
      id: "mccaffrey",
      name: "Christian McCaffrey",
      position: "Running Back",
      number: 23,
      nationality: "USA",
      age: 27,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/vrsf24rf3qhfmvhpzawp",
      teamId: "niners",
      sport: "football"
    }
  ],
  "ravens": [
    {
      id: "jackson",
      name: "Lamar Jackson",
      position: "Quarterback",
      number: 8,
      nationality: "USA",
      age: 27,
      image: "https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/vrsf24rf3qhfmvhpzawp",
      teamId: "ravens",
      sport: "football"
    }
  ],
  // MLB Players (expanded)
  "rangers": [
    {
      id: "seager",
      name: "Corey Seager",
      position: "Shortstop",
      number: 5,
      nationality: "USA",
      age: 29,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/608369/headshot/67/current",
      teamId: "rangers",
      sport: "baseball"
    },
    {
      id: "semien",
      name: "Marcus Semien",
      position: "Second Baseman",
      number: 2,
      nationality: "USA",
      age: 33,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/543760/headshot/67/current",
      teamId: "rangers",
      sport: "baseball"
    }
  ],
  "phillies": [
    {
      id: "harper",
      name: "Bryce Harper",
      position: "Designated Hitter",
      number: 3,
      nationality: "USA",
      age: 31,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/547180/headshot/67/current",
      teamId: "phillies",
      sport: "baseball"
    },
    {
      id: "wheeler",
      name: "Zack Wheeler",
      position: "Pitcher",
      number: 45,
      nationality: "USA",
      age: 33,
      image: "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/554430/headshot/67/current",
      teamId: "phillies",
      sport: "baseball"
    }
  ]
};

export interface PredictionCategory {
  id: string;
  name: string;
  description: string;
}

// Categories for each sport based on ESPN's statistics
export const PREDICTION_CATEGORIES: { [key: string]: PredictionCategory[] } = {
  'soccer': [
    { id: 'goals', name: 'Goals', description: 'Number of goals scored' },
    { id: 'assists', name: 'Assists', description: 'Number of assists' },
    { id: 'shots', name: 'Shots', description: 'Total shots attempted' },
    { id: 'shots_on_target', name: 'Shots on Target', description: 'Shots that hit the target' },
    { id: 'passes', name: 'Passes', description: 'Total passes completed' },
    { id: 'tackles', name: 'Tackles', description: 'Successful tackles made' },
    { id: 'minutes', name: 'Minutes Played', description: 'Minutes on the field' }
  ],
  'basketball': [
    { id: 'points', name: 'Points', description: 'Total points scored' },
    { id: 'rebounds', name: 'Rebounds', description: 'Total rebounds (offensive + defensive)' },
    { id: 'assists', name: 'Assists', description: 'Number of assists' },
    { id: 'steals', name: 'Steals', description: 'Number of steals' },
    { id: 'blocks', name: 'Blocks', description: 'Number of shots blocked' },
    { id: 'field_goals', name: 'Field Goals Made', description: 'Number of field goals made' },
    { id: 'three_pointers', name: '3-Pointers Made', description: 'Number of three-pointers made' },
    { id: 'free_throws', name: 'Free Throws Made', description: 'Number of free throws made' },
    { id: 'turnovers', name: 'Turnovers', description: 'Number of turnovers' },
    { id: 'minutes', name: 'Minutes Played', description: 'Minutes played in the game' }
  ],
  'baseball': [
    { id: 'hits', name: 'Hits', description: 'Number of hits' },
    { id: 'home_runs', name: 'Home Runs', description: 'Number of home runs' },
    { id: 'rbis', name: 'RBIs', description: 'Runs batted in' },
    { id: 'runs', name: 'Runs', description: 'Runs scored' },
    { id: 'stolen_bases', name: 'Stolen Bases', description: 'Number of stolen bases' },
    { id: 'batting_avg', name: 'Batting Average', description: 'Batting average' },
    { id: 'ops', name: 'OPS', description: 'On-base plus slugging' },
    // Pitcher specific stats
    { id: 'strikeouts', name: 'Strikeouts', description: 'Number of strikeouts (pitchers)' },
    { id: 'era', name: 'ERA', description: 'Earned run average (pitchers)' },
    { id: 'whip', name: 'WHIP', description: 'Walks and hits per inning pitched' },
    { id: 'innings', name: 'Innings Pitched', description: 'Number of innings pitched' }
  ],
  'football': [
    // Quarterback stats
    { id: 'passing_yards', name: 'Passing Yards', description: 'Total passing yards' },
    { id: 'passing_tds', name: 'Passing TDs', description: 'Passing touchdowns' },
    { id: 'completions', name: 'Completions', description: 'Number of completed passes' },
    { id: 'interceptions', name: 'Interceptions', description: 'Passes intercepted' },
    // Running stats
    { id: 'rushing_yards', name: 'Rushing Yards', description: 'Total rushing yards' },
    { id: 'rushing_tds', name: 'Rushing TDs', description: 'Rushing touchdowns' },
    // Receiving stats
    { id: 'receptions', name: 'Receptions', description: 'Number of catches' },
    { id: 'receiving_yards', name: 'Receiving Yards', description: 'Total receiving yards' },
    { id: 'receiving_tds', name: 'Receiving TDs', description: 'Receiving touchdowns' },
    // Defense stats
    { id: 'tackles', name: 'Tackles', description: 'Total tackles' },
    { id: 'sacks', name: 'Sacks', description: 'Number of sacks' },
    { id: 'def_interceptions', name: 'Defensive INTs', description: 'Interceptions by defense' }
  ],
  'hockey': [
    { id: 'goals', name: 'Goals', description: 'Number of goals scored' },
    { id: 'assists', name: 'Assists', description: 'Number of assists' },
    { id: 'points', name: 'Points', description: 'Total points (goals + assists)' },
    { id: 'shots', name: 'Shots on Goal', description: 'Shots on goal' },
    { id: 'plus_minus', name: 'Plus/Minus', description: 'Plus/minus rating' },
    { id: 'penalty_minutes', name: 'Penalty Minutes', description: 'Time spent in penalty box' },
    { id: 'power_play_goals', name: 'Power Play Goals', description: 'Goals scored on power play' },
    // Goalie stats
    { id: 'saves', name: 'Saves', description: 'Number of saves (goalies)' },
    { id: 'save_percentage', name: 'Save Percentage', description: 'Percentage of shots saved' },
    { id: 'goals_against_avg', name: 'Goals Against Average', description: 'Average goals allowed per game' }
  ]
}; 