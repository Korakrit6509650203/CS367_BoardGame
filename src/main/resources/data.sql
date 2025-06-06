-- ข้อมูลสำหรับ BoardGame
INSERT INTO board_game (game_name, types, number_of_players, age_of_players, difficulty_level,
    playing_time, availability, discount_deposit, promotions, picture, stock) VALUES
('Harmonies', 'Strategy', '2-4', '12+', 'Medium', '30 minutes', true, '100 bath', 'No promotion', 'harmonies.jpg', 10),
('Brass Birmingham', 'Strategy', '2-4', '15+', 'Hard', '90 minutes', true, '300 bath', '5% discount', 'brass.png', 5),
('Catan', 'Resource', '2-4', '10+', 'Normal', '45 minutes', true, '100 bath', '10% discount', 'catan.png', 8),
('Werewolf', 'Party', '5-12', '10+', 'Easy', '45 minutes', true, '50 bath', '3% discount', 'werewolf.png', 12),
('Camel Up', 'Family', '2-5', '8+', 'Normal', '45 minutes', true, '50 bath', 'No promotion', 'camelup.png', 3),
('Splender', 'Strategy', '2-4', '10+', 'Normal', '45 minutes', true, '100 bath', 'No promotion', 'splender.png', 2),
('Uno', 'Family', '2-10', '8+', 'Easy', '20 minutes', true, '50 bath', 'No promotion', 'uno.png', 2),
('Forbidden Words', 'Party', '2-8', '8+', 'Easy', '30 minutes', true, '50 bath', 'No promotion', 'forbidden_words.png', 2);