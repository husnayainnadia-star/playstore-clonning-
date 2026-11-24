import { neon } from '@neondatabase/serverless';

// sql is lazy — only throws at runtime if DATABASE_URL is missing
export const sql = neon(process.env.DATABASE_URL || 'postgresql://placeholder');

/** Run the initial schema migration (called on first request) */
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      password    VARCHAR(255) NOT NULL,
      avatar_url  TEXT,
      play_points INTEGER DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS apps (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(100) NOT NULL,
      developer    VARCHAR(100) NOT NULL,
      description  TEXT,
      icon_emoji   VARCHAR(10),
      icon_color   VARCHAR(50),
      category     VARCHAR(50),
      rating       NUMERIC(2,1) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      download_count VARCHAR(20) DEFAULT '0',
      age_rating   VARCHAR(10) DEFAULT '4+',
      size_mb      INTEGER DEFAULT 10,
      tags         TEXT[],
      is_featured  BOOLEAN DEFAULT false,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS installs (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      app_id     INTEGER REFERENCES apps(id) ON DELETE CASCADE,
      installed_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, app_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      app_id     INTEGER REFERENCES apps(id) ON DELETE CASCADE,
      rating     INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment    TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, app_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS wishlist (
      id       SERIAL PRIMARY KEY,
      user_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
      app_id   INTEGER REFERENCES apps(id) ON DELETE CASCADE,
      added_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, app_id)
    )
  `;

  // Seed default apps if none exist
  const existing = await sql`SELECT COUNT(*) as count FROM apps`;
  if (Number(existing[0].count) === 0) {
    await seedApps();
  }
}

async function seedApps() {
  const apps = [
    { name: 'TikTok',       developer: 'TikTok Pte. Ltd.',    description: 'Discover videos you love, share with friends, and explore more.',  icon_emoji: '🎵', icon_color: '#010101', category: 'Social',        rating: 4.1, review_count: 62000000, download_count: '1B+',  age_rating: '12+', size_mb: 28,  tags: ['Social','Entertainment','Video'],   is_featured: true  },
    { name: 'Instagram',    developer: 'Meta Platforms',       description: 'Create and share photos, stories, Reels and more.',               icon_emoji: '📸', icon_color: '#C13584', category: 'Social',        rating: 4.3, review_count: 50000000, download_count: '5B+',  age_rating: '13+', size_mb: 45,  tags: ['Social','Photo','Video'],            is_featured: true  },
    { name: 'WhatsApp',     developer: 'WhatsApp LLC',         description: 'Simple. Secure. Reliable messaging.',                             icon_emoji: '💬', icon_color: '#25D366', category: 'Communication', rating: 4.3, review_count: 80000000, download_count: '5B+',  age_rating: '4+',  size_mb: 36,  tags: ['Communication','Messaging'],         is_featured: true  },
    { name: 'YouTube',      developer: 'Google LLC',           description: 'Watch, listen, and learn on the go.',                             icon_emoji: '▶️', icon_color: '#FF0000', category: 'Video Players', rating: 4.2, review_count: 71000000, download_count: '10B+', age_rating: '4+',  size_mb: 28,  tags: ['Video','Entertainment','Music'],     is_featured: false },
    { name: 'Google Maps',  developer: 'Google LLC',           description: 'Real-time GPS navigation, traffic, and transit info.',            icon_emoji: '🗺️', icon_color: '#34A853', category: 'Travel',        rating: 4.4, review_count: 45000000, download_count: '10B+', age_rating: '4+',  size_mb: 15,  tags: ['Navigation','Travel','Maps'],        is_featured: false },
    { name: 'Spotify',      developer: 'Spotify AB',           description: 'Music and podcasts for every mood.',                              icon_emoji: '🎧', icon_color: '#1DB954', category: 'Music',         rating: 4.3, review_count: 30000000, download_count: '1B+',  age_rating: '4+',  size_mb: 50,  tags: ['Music','Podcast','Entertainment'],   is_featured: false },
    { name: 'Netflix',      developer: 'Netflix Inc.',         description: 'Watch TV shows and movies anywhere.',                             icon_emoji: '🎬', icon_color: '#E50914', category: 'Entertainment', rating: 4.1, review_count: 28000000, download_count: '1B+',  age_rating: '12+', size_mb: 70,  tags: ['Video','Entertainment','Movies'],    is_featured: false },
    { name: 'Snapchat',     developer: 'Snap Inc.',            description: 'Chat and Snap with friends in real time.',                        icon_emoji: '👻', icon_color: '#FFFC00', category: 'Social',        rating: 4.0, review_count: 20000000, download_count: '1B+',  age_rating: '13+', size_mb: 55,  tags: ['Social','Photo','Messaging'],        is_featured: false },
  ];

  for (const app of apps) {
    await sql`
      INSERT INTO apps (name, developer, description, icon_emoji, icon_color, category, rating, review_count, download_count, age_rating, size_mb, tags, is_featured)
      VALUES (${app.name}, ${app.developer}, ${app.description}, ${app.icon_emoji}, ${app.icon_color}, ${app.category}, ${app.rating}, ${app.review_count}, ${app.download_count}, ${app.age_rating}, ${app.size_mb}, ${app.tags}, ${app.is_featured})
    `;
  }
}
