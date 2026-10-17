CREATE TABLE IF NOT EXISTS clubs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          VARCHAR(120) NOT NULL,
  category      VARCHAR(60),
  description   TEXT,
  meeting_day   VARCHAR(20),
  contact_email VARCHAR(120),
  members_count INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO clubs (id, name, category, description, meeting_day, contact_email, members_count) VALUES
(1,  'Computer Science Society', 'Technology', 'Coding sessions and tech talks',          'Monday',    'cs@mu.edu.zm',        45),
(2,  'Debate Club',              'Academic',   'Weekly debates on current affairs',       'Tuesday',   'debate@mu.edu.zm',    30),
(3,  'Chess Club',               'Games',      'Casual and competitive chess',            'Wednesday', 'chess@mu.edu.zm',     18),
(4,  'Drama Society',            'Arts',       'Plays, skits and theatre workshops',      'Thursday',  'drama@mu.edu.zm',     25),
(5,  'Football Club',            'Sports',     'Training and inter-university matches',   'Friday',    'football@mu.edu.zm',  40),
(6,  'Entrepreneurship Club',    'Business',   'Startup ideas and mentorship',            'Monday',    'biz@mu.edu.zm',       35),
(7,  'Environmental Club',       'Community',  'Tree planting and clean-up drives',       'Saturday',  'green@mu.edu.zm',     22),
(8,  'Photography Club',         'Arts',       'Photo walks and editing sessions',        'Wednesday', 'photo@mu.edu.zm',     16),
(9,  'Christian Union',          'Faith',      'Fellowship, prayer and Bible study',      'Sunday',    'cu@mu.edu.zm',        60),
(10, 'Robotics Club',            'Technology', 'Building Arduino and robotics projects',  'Thursday',  'robotics@mu.edu.zm',  14);
