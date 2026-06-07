-- Sample game strings
INSERT INTO game_strings (key, source_text, context) VALUES
('ui.button.start',     'Start Game',         'Main menu start button'),
('ui.button.quit',      'Quit',               'Main menu quit button'),
('ui.button.settings',  'Settings',           'Main menu settings button'),
('ui.button.continue',  'Continue',           'Pause menu continue button'),
('ui.label.score',      'Score',              'HUD score label'),
('ui.label.health',     'Health',             'HUD health bar label'),
('ui.label.level',      'Level',              'HUD level indicator'),
('dialog.npc.intro',    'Welcome, traveler! What brings you to our village?', 'First NPC dialog on arrival'),
('dialog.npc.quest',    'I need your help. The forest is dangerous these days.', 'Quest giver NPC dialog'),
('dialog.npc.reward',   'Thank you! Take this as a reward for your bravery.',  'Quest completion NPC dialog'),
('menu.pause.title',    'Game Paused',        'Pause screen title'),
('menu.gameover.title', 'Game Over',          'Game over screen title'),
('menu.gameover.retry', 'Try Again',          'Game over retry button'),
('error.connection',    'Connection lost. Please check your internet.',        'Network error message'),
('error.save',          'Failed to save game. Please try again.',              'Save error message');

-- Sample admin user (password: admin123)
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Sample translator user (password: translator123)
INSERT INTO users (username, password_hash, role) VALUES
('translator1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'translator');

-- Sample translations (pending)
INSERT INTO translations (string_id, user_id, language_code, translated_text, status) VALUES
(1, 2, 'tr', 'Oyunu Başlat',   'pending'),
(2, 2, 'tr', 'Çıkış',          'approved'),
(3, 2, 'tr', 'Ayarlar',        'approved'),
(4, 2, 'tr', 'Devam Et',       'pending'),
(8, 2, 'tr', 'Hoş geldin, gezgin! Seni köyümüze ne getirdi?', 'pending'),
(1, 2, 'de', 'Spiel Starten',  'pending'),
(2, 2, 'de', 'Beenden',        'approved'),
(8, 2, 'de', 'Willkommen, Reisender! Was führt dich in unser Dorf?', 'pending');