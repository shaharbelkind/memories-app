-- Life Story Capsule Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'parent',
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children table
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dob DATE,
  consent_json JSONB DEFAULT '{}',
  face_cluster_ids TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memories table
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('photo','video','audio','doc','scan3d')),
  s3_raw TEXT,
  s3_proc TEXT,
  duration_seconds INTEGER,
  exif JSONB,
  phash BYTEA,
  transcript TEXT,
  embedding VECTOR(768),
  taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  taxonomy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory tags junction table
CREATE TABLE memory_tags (
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  confidence FLOAT,
  PRIMARY KEY (memory_id, tag_id)
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('birthday','first_step','trip','school','custom')),
  title TEXT,
  description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Albums/Storybooks/Films table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('album','storybook','film')),
  template TEXT,
  status TEXT DEFAULT 'draft',
  artifact_keys TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AR Objects table
CREATE TABLE ar_objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  mesh_key TEXT,
  preview_key TEXT,
  memory_links UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shares table
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope TEXT CHECK (scope IN ('user','link','family')),
  permissions JSONB,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_memories_child_id ON memories(child_id);
CREATE INDEX idx_memories_kind ON memories(kind);
CREATE INDEX idx_memories_taken_at ON memories(taken_at);
CREATE INDEX idx_memories_embedding ON memories USING ivfflat (embedding embedding vector_cosine_ops);
CREATE INDEX idx_events_child_id ON events(child_id);
CREATE INDEX idx_events_kind ON events(kind);
CREATE INDEX idx_children_user_id ON children(user_id);
CREATE INDEX idx_memory_tags_memory_id ON memory_tags(memory_id);
CREATE INDEX idx_memory_tags_tag_id ON memory_tags(tag_id);

-- Full text search indexes
CREATE INDEX idx_memories_transcript_gin ON memories USING gin(to_tsvector('english', transcript));
CREATE INDEX idx_events_title_description_gin ON events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
