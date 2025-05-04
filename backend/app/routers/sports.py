from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..services.sports_data_service import SportsDataService

router = APIRouter(
    prefix="/sports",
    tags=["sports"]
)

sports_data_service = SportsDataService()

@router.get("/team/{team_name}")
async def get_team_stats(team_name: str) -> Dict[str, Any]:
    """Get team statistics"""
    stats = await sports_data_service.get_team_stats(team_name)
    if not stats:
        raise HTTPException(status_code=404, detail="Team not found")
    return stats

@router.get("/league/{league_id}/teams")
async def get_league_teams(league_id: str) -> List[Dict[str, Any]]:
    """Get all teams in a league"""
    teams = await sports_data_service.get_league_teams(league_id)
    if not teams:
        raise HTTPException(status_code=404, detail="League not found or no teams available")
    return teams

@router.get("/team/{team_id}/players")
async def get_team_players(team_id: str) -> List[Dict[str, Any]]:
    """Get all players in a team"""
    players = await sports_data_service.get_team_players(team_id)
    if not players:
        raise HTTPException(status_code=404, detail="Team not found or no players available")
    return players

@router.get("/league/{league_id}/table")
async def get_league_table(league_id: str) -> List[Dict[str, Any]]:
    """Get league standings"""
    table = await sports_data_service.get_league_table(league_id)
    if not table:
        raise HTTPException(status_code=404, detail="League table not found")
    return table

@router.get("/team/{team_id}/last-matches")
async def get_team_last_matches(team_id: str) -> List[Dict[str, Any]]:
    """Get team's last 5 matches"""
    matches = await sports_data_service.get_team_last_matches(team_id)
    if not matches:
        raise HTTPException(status_code=404, detail="No recent matches found")
    return matches

@router.get("/team/{team_id}/next-matches")
async def get_team_next_matches(team_id: str) -> List[Dict[str, Any]]:
    """Get team's next 5 matches"""
    matches = await sports_data_service.get_team_next_matches(team_id)
    if not matches:
        raise HTTPException(status_code=404, detail="No upcoming matches found")
    return matches 