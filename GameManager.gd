extends Node

# --- DOĞAÇLA OYUN YÖNETİCİSİ (GODOT 4) ---

signal game_state_changed(new_state)
signal hype_meter_changed(new_value)
signal dice_rolled(value)

enum GameState { LOBBY, INTRO, ROLL, CARD, PRE_PERFORM, PERFORM, VOTE, END }

var current_state: GameState = GameState.LOBBY
var current_turn: int = 0
var hype_meter: int = 0

var teams = [
	{ "id": 0, "name": "İBİŞ", "score": 0, "pos": 0, "bonuses": [], "obstacles": [] },
	{ "id": 1, "name": "KARAGÖZ", "score": 0, "pos": 0, "bonuses": [], "obstacles": [] },
	{ "id": 2, "name": "SHAKESPEARE", "score": 0, "pos": 0, "bonuses": [], "obstacles": [] },
	{ "id": 3, "name": "ARİSTOFANES", "score": 0, "pos": 0, "bonuses": [], "obstacles": [] }
]

func _ready():
	print("Doğaçla Godot Engine Başlatıldı!")
	
func change_state(new_state: GameState):
	current_state = new_state
	game_state_changed.emit(current_state)

func roll_dice():
	if current_state != GameState.ROLL:
		return
	
	var roll = randi_range(1, 6)
	var bonus_move = int(teams[current_turn]["score"] / 5.0)
	var total_move = roll + bonus_move
	
	dice_rolled.emit(roll)
	
	teams[current_turn]["pos"] += total_move
	if teams[current_turn]["pos"] >= 35:
		teams[current_turn]["pos"] = 35
		change_state(GameState.END)
	else:
		change_state(GameState.CARD)
