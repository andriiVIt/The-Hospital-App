-- Create a role for anonymous web access
CREATE ROLE web_anon NOLOGIN;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO web_anon;

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE diseases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE diagnoses (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    disease_id INT NOT NULL,
    diagnosis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO patients (name) VALUES
    ('Peter'),
    ('Bob');

INSERT INTO diseases (name) VALUES
    ('Flu'),
    ('Diarrhea');

INSERT INTO diagnoses (patient_id, disease_id, diagnosis_date) VALUES
    (1, 1, now()),
    (2, 2, now());

-- Grant access to the tables
GRANT ALL ON patients TO web_anon;
GRANT USAGE, SELECT ON SEQUENCE patients_id_seq TO web_anon;

GRANT ALL ON diseases TO web_anon;
GRANT USAGE, SELECT ON SEQUENCE diseases_id_seq TO web_anon;

GRANT ALL ON diagnoses TO web_anon;
GRANT USAGE, SELECT ON SEQUENCE diagnoses_id_seq TO web_anon;

-- Grant access to all tables in the schema (optional, but can be helpful for future tables)
GRANT ALL ON ALL TABLES IN SCHEMA public TO web_anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO web_anon;

-- Ensure future tables are accessible by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO web_anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO web_anon;