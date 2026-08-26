CREATE TABLE cache (
  key_name VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  expiration INT NOT NULL,
  PRIMARY KEY (key_name)
);

CREATE TABLE cache_locks (
  key_name VARCHAR(255) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  expiration INT NOT NULL,
  PRIMARY KEY (key_name)
);

CREATE TABLE failed_jobs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(255) NOT NULL UNIQUE,
  connection TEXT NOT NULL,
  queue TEXT NOT NULL,
  payload TEXT NOT NULL,
  exception TEXT NOT NULL,
  failed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE jobs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  queue VARCHAR(255) NOT NULL,
  payload TEXT NOT NULL,
  attempts INT NOT NULL,
  reserved_at INT,
  available_at INT NOT NULL,
  created_at INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE job_batches (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  total_jobs INT NOT NULL,
  pending_jobs INT NOT NULL,
  failed_jobs INT NOT NULL,
  failed_job_ids TEXT NOT NULL,
  options TEXT,
  cancelled_at INT,
  created_at INT NOT NULL,
  finished_at INT,
  PRIMARY KEY (id)
);

CREATE TABLE migrations (
  id INT NOT NULL AUTO_INCREMENT,
  migration VARCHAR(255) NOT NULL,
  batch INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE password_reset_tokens (
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  PRIMARY KEY (email)
);

CREATE TABLE sessions (
  id VARCHAR(255) NOT NULL,
  user_id BIGINT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  payload TEXT NOT NULL,
  last_activity INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at TIMESTAMP,
  password VARCHAR(255) NOT NULL,
  two_factor_secret TEXT,
  two_factor_recovery_codes TEXT,
  two_factor_confirmed_at TIMESTAMP,
  remember_token VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE tbl_student_info (
  LIBRARY_ID VARCHAR(255) NOT NULL,
  STUDENT_RFID_NUMBER VARCHAR(255),
  STUDENT_NUMBER VARCHAR(255),
  FN VARCHAR(255),
  MN VARCHAR(255),
  LN VARCHAR(255),
  SEX VARCHAR(255),
  BIRTHDAY VARCHAR(255),
  CONTACT_NUMBER VARCHAR(255),
  EMAIL VARCHAR(255),
  QR_SENT INT NOT NULL DEFAULT 0,
  PIC VARCHAR(255),
  COURSE VARCHAR(255),
  ADDRESS VARCHAR(255),
  REGISTERED_ON DATE,
  RENEW_ON DATE,
  ID_STATUS VARCHAR(255),
  ID_STATUS_DATE DATE,
  FACE_EMBEDDING TEXT,
  PRIMARY KEY (LIBRARY_ID)
);

CREATE TABLE tbl_student_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  LIBRARY_ID VARCHAR(255) NOT NULL,
  LOG_TIME TIME NOT NULL,
  LOG_DATE DATE NOT NULL,
  LOG_SESSION VARCHAR(255) NOT NULL,
  LOG_IMAGE VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE tbl_access_attempts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  LIBRARY_ID VARCHAR(255),
  STATUS VARCHAR(50) NOT NULL,
  IMAGE_PATH VARCHAR(255),
  ATTEMPT_TYPE VARCHAR(255) NOT NULL,
  LOG_DATE DATE NOT NULL,
  LOG_TIME TIME NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE tbl_rfid_info (
  RFID_NUMBER VARCHAR(255) NOT NULL,
  LOCKER_NUMBER INT,
  IS_AVAILABLE VARCHAR(255) NOT NULL DEFAULT 'Yes',
  PRIMARY KEY (RFID_NUMBER)
);

CREATE TABLE tbl_rfidhistory (
  id BIGINT NOT NULL AUTO_INCREMENT,
  RFID_CARD_NUMBER VARCHAR(255) NOT NULL,
  LIBRARY_ID VARCHAR(255) NOT NULL,
  BORROW_ON DATETIME NOT NULL,
  RETURN_ON DATETIME,
  LOCKER_NUMBER VARCHAR(255),
  EMP_ID VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE tbl_lost_id_reports (
  id BIGINT NOT NULL AUTO_INCREMENT,
  old_library_id VARCHAR(255) NOT NULL,
  new_library_id VARCHAR(255),
  student_number VARCHAR(255) NOT NULL,
  location_lost VARCHAR(255) NOT NULL,
  description TEXT,
  affidavit_path VARCHAR(255) NOT NULL,
  processed_by BIGINT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE email_messages (
  id BIGINT NOT NULL AUTO_INCREMENT,
  library_id VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  attachments VARCHAR(255),
  sent_to VARCHAR(255),
  is_read INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE surveys (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_by BIGINT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE survey_questions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  survey_id BIGINT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  type VARCHAR(50) NOT NULL DEFAULT 'short_text',
  label TEXT NOT NULL,
  options TEXT,
  required INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE survey_responses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  survey_id BIGINT NOT NULL,
  respondent_name VARCHAR(255),
  respondent_email VARCHAR(255),
  answers TEXT NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE tbl_sensitivity_thresholds (
  id BIGINT NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  value DECIMAL(3,2) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE tbl_settings (
  id BIGINT NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  description VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE audit_trails (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT,
  user_name VARCHAR(255),
  auditable_type VARCHAR(255) NOT NULL,
  auditable_id VARCHAR(255) NOT NULL,
  event VARCHAR(255) NOT NULL,
  activity TEXT,
  ip_address VARCHAR(45),
  old_values TEXT,
  new_values TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE calendar_notes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  date DATE NOT NULL,
  time TIME,
  note TEXT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE chats (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE chat_messages (
  id BIGINT NOT NULL AUTO_INCREMENT,
  chat_id BIGINT NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);

ALTER TABLE sessions ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE tbl_student_logs ADD FOREIGN KEY (LIBRARY_ID) REFERENCES tbl_student_info (LIBRARY_ID);
ALTER TABLE tbl_access_attempts ADD FOREIGN KEY (LIBRARY_ID) REFERENCES tbl_student_info (LIBRARY_ID);
ALTER TABLE tbl_rfidhistory ADD FOREIGN KEY (LIBRARY_ID) REFERENCES tbl_student_info (LIBRARY_ID);
ALTER TABLE tbl_rfidhistory ADD FOREIGN KEY (RFID_CARD_NUMBER) REFERENCES tbl_rfid_info (RFID_NUMBER);
ALTER TABLE tbl_rfidhistory ADD FOREIGN KEY (EMP_ID) REFERENCES users (id);
ALTER TABLE tbl_lost_id_reports ADD FOREIGN KEY (processed_by) REFERENCES users (id);
ALTER TABLE email_messages ADD FOREIGN KEY (library_id) REFERENCES tbl_student_info (LIBRARY_ID);
ALTER TABLE surveys ADD FOREIGN KEY (created_by) REFERENCES users (id);
ALTER TABLE survey_questions ADD FOREIGN KEY (survey_id) REFERENCES surveys (id);
ALTER TABLE survey_responses ADD FOREIGN KEY (survey_id) REFERENCES surveys (id);
ALTER TABLE audit_trails ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE chats ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE chat_messages ADD FOREIGN KEY (chat_id) REFERENCES chats (id);
