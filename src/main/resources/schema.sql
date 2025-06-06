CREATE TABLE board_game (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_name VARCHAR(255),
    types VARCHAR(255),
    number_of_players VARCHAR(50),
    age_of_players VARCHAR(50),
    difficulty_level VARCHAR(50),
    playing_time VARCHAR(50),
    availability BOOLEAN,
    discount_deposit VARCHAR(50),
    promotions VARCHAR(255),
    picture VARCHAR(255),
    stock INT
);

CREATE TABLE rental (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_id BIGINT,
    tenant_name VARCHAR(255),
    rental_date DATE,
    rental_period VARCHAR(50),
    return_due_date DATE,
    rental_price INT,
    real_return_date DATE,
    annotation VARCHAR(255),
    fine VARCHAR(50),
    review TEXT
);
