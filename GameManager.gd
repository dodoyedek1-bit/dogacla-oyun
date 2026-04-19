extends Control

@onready var bg = $Background
@onready var video = $VideoPlayer
@onready var label = $UI/StatusLabel
@onready var btn = $UI/ActionBtn

var is_playing = false

func _ready():
	# 1. Arka planı güvenli yükle
	if FileAccess.file_exists("res://assets/arkplan.png"):
		var bg_img = Image.load_from_file("res://assets/arkplan.png")
		bg.texture = ImageTexture.create_from_image(bg_img)
	
	# 2. Butonu React'teki gibi Kusursuz Sarart (StyleBox)
	var style = StyleBoxFlat.new()
	style.bg_color = Color(1.0, 0.84, 0.0) # Altın Sarısı
	style.corner_radius_top_left = 50
	style.corner_radius_top_right = 50
	style.corner_radius_bottom_left = 50
	style.corner_radius_bottom_right = 50
	style.shadow_color = Color(0, 0, 0, 0.5)
	style.shadow_size = 10
	
	btn.add_theme_stylebox_override("normal", style)
	btn.add_theme_stylebox_override("hover", style)
	btn.add_theme_stylebox_override("pressed", style)
	
	# 3. Tıklama dinleyicisini başlat
	btn.pressed.connect(_on_ActionBtn_pressed)

func _on_ActionBtn_pressed():
	if is_playing:
		# Kapat
		video.stop()
		label.text = "SIRA DİĞER TAKIMDA"
		btn.text = "ZAR AT"
		is_playing = false
	else:
		# Şimşek Hızında Videoyu Aç
		label.text = "SAHNEDE: İBİŞ!"
		btn.text = "PERFORMANSI BİTİR"
		
		# Önceden indirdiğimiz MP4'ü motorun ekran kartına (GPU) veriyoruz
		if FileAccess.file_exists("res://assets/ibis_kolay.mp4"):
			video.stream = preload("res://assets/ibis_kolay.mp4")
			video.play()
			is_playing = true
		else:
			label.text = "VİDEO YÜKLENEMEDİ!"

func _process(delta):
	# Eğer video kendi kendine biterse
	if is_playing and not video.is_playing():
		label.text = "PERFORMANS BİTTİ"
		btn.text = "DEVAM ET"
		is_playing = false
