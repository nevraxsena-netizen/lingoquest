CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'translator',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_strings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(200) UNIQUE NOT NULL,
  source_text TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  string_id INTEGER REFERENCES game_strings(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  language_code VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);