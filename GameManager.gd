extends Control

@onready var bg = $Background
@onready var video = $VideoPlayer
@onready var status_label = $UI/StatusLabel
@onready var main_btn = $UI/ActionBtn
@onready var team_scores_box = $TopPanel/TeamScores
@onready var card_modal = $CardModal
@onready var card_title = $CardModal/CardTitle
@onready var card_mission = $CardModal/CardMission
@onready var card_type_label = $CardModal/CardType

enum GameState { LOBBY, ROLL, CARD_DRAWN, PERFORM, VOTE }
var state = GameState.LOBBY
var play_timer = 0.0

var current_team_idx = 0
var current_card = null
var current_card_type = ""

# --- OYUN VERİTABANI ---
var teams = [
	{"name": "İBİŞ", "score": 0, "pos": 0, "color": Color(1, 0.5, 0), "video": "ibis_kolay.mp4"},
	{"name": "KARAGÖZ", "score": 0, "pos": 0, "color": Color(1, 0.2, 0.2), "video": "karagoz_orta.mp4"},
	{"name": "SHAKESPEARE", "score": 0, "pos": 0, "color": Color(0.6, 0.2, 1), "video": "shakespeare_zor.mp4"},
	{"name": "ARİSTOFANES", "score": 0, "pos": 0, "color": Color(0.2, 0.6, 1), "video": "artisto_bekleme.mp4"}
]

var cards_easy = [
	{"title": "BOZUK ASANSÖR", "mission": "Dar bir alanda sıkıştın. Bedeninle paniği göster."},
	{"title": "KUTUP SOĞUĞU", "mission": "Donuyorsun. Dişlerin birbirine çarpıyor. Isınmaya çalış."},
	{"title": "ARAMAK", "mission": "Gözlüğünü/telefonunu kaybettin, her yeri arıyorsun."},
	{"title": "ACI BİBER", "mission": "Yanlışlıkla dünyanın en acı biberini yedin. Tepki ver."}
]

var cards_medium = [
	{"title": "YAVAŞ ÇEKİM", "mission": "Biriyle kavga ediyormuşsun gibi yavaş çekimde hareket et."},
	{"title": "TERS RÜZGAR", "mission": "Çok şiddetli bir rüzgara karşı yürümeye çalış."},
	{"title": "GÖRÜNMEZ ORKESTRA", "mission": "Çılgın bir orkestra şefi gibi görünmez müzisyenleri yönet."},
	{"title": "BOZUK ROBOT", "mission": "Şarjı bitmek üzere olan ve bozulup tekleyen bir robotsun."}
]

var cards_hard = [
	{"title": "AĞLARKEN GÜLMEK", "mission": "Çok üzücü bir şey anlatırken sinir krizi geçirip kahkaha at."},
	{"title": "SESSİZ ÇIĞLIK", "mission": "Avazın çıktığı kadar bağır ama ağzından hiç ses çıkmasın."},
	{"title": "GERİYE AKAN ZAMAN", "mission": "Yaptığın her hareketi ve söylediğin kelimeyi tersten oyna."},
	{"title": "GÖRÜNMEZ KILIÇ", "mission": "Dünyanın en zorlu görünmez kılıç dövüşünü tek başına yap."}
]

var cards_bonus = [
	{"title": "ZAMAN BÜKÜCÜ", "mission": "Sürene anında ekstra +30 saniye eklenir!"},
	{"title": "ALTIN MİKROFON", "mission": "Jürinin vereceği puan bu tur otomatik 2'ye katlanır!"}
]

var cards_obstacle = [
	{"title": "TEK HECE", "mission": "Rakip performans boyunca sadece TEK HECELİ kelimeler kurabilir."},
	{"title": "ROBOT MİMİĞİ", "mission": "Rakip mimik kullanamaz, robotik sesle oynamak zorundadır."}
]

func _ready():
	randomize()
	if ResourceLoader.exists("res://assets/arkplan.png"):
		bg.texture = load("res://assets/arkplan.png")
	
	# Buton Tasarımı
	var style = StyleBoxFlat.new()
	style.bg_color = Color(1.0, 0.84, 0.0)
	style.corner_radius_top_left = 50
	style.corner_radius_top_right = 50
	style.corner_radius_bottom_left = 50
	style.corner_radius_bottom_right = 50
	main_btn.add_theme_stylebox_override("normal", style)
	main_btn.add_theme_stylebox_override("hover", style)
	main_btn.add_theme_stylebox_override("pressed", style)
	
	main_btn.pressed.connect(_on_ActionBtn_pressed)
	update_ui()

# --- 36 ADIMLIK OYUN TAHTASI MANTIĞI ---
func get_board_square_type(pos: int) -> String:
	if pos == 0: return "start"
	if pos >= 35: return "final"
	if pos % 5 == 0: return "bonus"
	if pos % 6 == 0: return "obstacle"
	if pos < 10: return "easy"
	if pos < 20: return "medium"
	return "hard"

func _on_ActionBtn_pressed():
	if state == GameState.LOBBY:
		state = GameState.ROLL
		update_ui()
	elif state == GameState.ROLL:
		roll_dice()
	elif state == GameState.CARD_DRAWN:
		start_performance()
	elif state == GameState.PERFORM:
		finish_performance()
	elif state == GameState.VOTE:
		submit_vote()

func roll_dice():
	main_btn.disabled = true
	status_label.text = "ZAR ATILIYOR..."
	await get_tree().create_timer(1.0).timeout
	
	var team = teams[current_team_idx]
	var roll = randi() % 6 + 1
	var old_pos = team["pos"]
	team["pos"] += roll
	if team["pos"] > 35: team["pos"] = 35
	
	# Harita konumuna göre kart seçimi
	current_card_type = get_board_square_type(team["pos"])
	
	if current_card_type == "easy": current_card = cards_easy[randi() % cards_easy.size()]
	elif current_card_type == "medium": current_card = cards_medium[randi() % cards_medium.size()]
	elif current_card_type == "hard": current_card = cards_hard[randi() % cards_hard.size()]
	elif current_card_type == "bonus": current_card = cards_bonus[randi() % cards_bonus.size()]
	elif current_card_type == "obstacle": current_card = cards_obstacle[randi() % cards_obstacle.size()]
	else: current_card = {"title": "BÜYÜK FİNAL", "mission": "Oyun bitti! En epik veda performansını sergile!"}
	
	state = GameState.CARD_DRAWN
	main_btn.disabled = false
	update_ui()
	status_label.text = "ZAR GELDİ: " + str(roll) + " (" + str(old_pos) + " -> " + str(team["pos"]) + ")"

func start_performance():
	state = GameState.PERFORM
	play_timer = 0.0
	card_modal.visible = false
	
	var team = teams[current_team_idx]
	var vid_path = "res://assets/" + team["video"]
	
	if ResourceLoader.exists(vid_path):
		video.stream = load(vid_path)
		video.play()
	
	update_ui()

func finish_performance():
	video.stop()
	state = GameState.VOTE
	update_ui()

func submit_vote():
	# Local oylama simülasyonu
	var points = randi() % 6
	if current_card_type == "bonus": points = 0 # Bonus turunda puan alınmaz, envantere atılır
	
	teams[current_team_idx]["score"] += points
	
	# Sıra sonrakine geçer
	current_team_idx = (current_team_idx + 1) % teams.size()
	state = GameState.ROLL
	update_ui()

# --- ARAYÜZ GÜNCELLEYİCİ ---
func update_ui():
	var team = teams[current_team_idx]
	
	# Üstteki Puan Tablosunu Çiz
	for child in team_scores_box.get_children():
		child.queue_free()
		
	for t in teams:
		var lbl = Label.new()
		lbl.add_theme_font_size_override("font_size", 30)
		lbl.add_theme_color_override("font_color", t["color"])
		lbl.text = t["name"] + "\nP: " + str(t["score"]) + " | Adım: " + str(t["pos"])
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		team_scores_box.add_child(lbl)
		
		# Sıra kimdeyse ismini kalınlaştırmak/gölgelendirmek için
		if t == team:
			lbl.add_theme_color_override("font_shadow_color", Color(1,1,1, 0.5))
			lbl.add_theme_constant_override("shadow_offset_x", 2)
	
	# Ekran Altını Güncelle
	if state == GameState.LOBBY:
		status_label.text = "TAM SÜRÜME HOŞ GELDİNİZ"
		main_btn.text = "OYUNU BAŞLAT"
		card_modal.visible = false
		video.stop()
	
	elif state == GameState.ROLL:
		status_label.text = "SIRA SENDE: " + team["name"]
		main_btn.text = "ZAR AT VE İLERLE"
		card_modal.visible = false
		
	elif state == GameState.CARD_DRAWN:
		card_modal.visible = true
		if current_card_type == "bonus": card_type_label.text = "FIRSAT KARTI (BONUS)"
		elif current_card_type == "obstacle": card_type_label.text = "SABOTAJ KARTI (ENGEL)"
		elif current_card_type == "easy": card_type_label.text = "KOLAY GÖREV"
		elif current_card_type == "medium": card_type_label.text = "ORTA GÖREV"
		elif current_card_type == "hard": card_type_label.text = "ZOR GÖREV"
		
		if current_card:
			card_title.text = current_card["title"]
			card_mission.text = current_card["mission"]
			
		main_btn.text = "SAHNEYE ÇIK (VİDEO)"
		
	elif state == GameState.PERFORM:
		status_label.text = team["name"] + " SAHNEDE!"
		main_btn.text = "PERFORMANSI BİTİR"
		
	elif state == GameState.VOTE:
		status_label.text = "JÜRİ OYLAMASI"
		main_btn.text = "PUANI ONAYLA (Sırayı Sal)"

func _process(delta):
	if state == GameState.PERFORM:
		play_timer += delta
		if play_timer > 1.0 and not video.is_playing() and video.stream != null:
			finish_performance()
