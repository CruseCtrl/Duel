DROP TABLE IF EXISTS "User";

CREATE TABLE "User" (
    filename VARCHAR(255) NOT NULL,

    user_id VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    instagram_handle VARCHAR(255),
    tiktok_handle VARCHAR(255),
    joined_at TIMESTAMP,

    program_id VARCHAR(255),
    brand VARCHAR(255) NOT NULL,
    total_sales_attributed NUMERIC(18,2),

    task_id VARCHAR(255),
    platform VARCHAR(255) NOT NULL,
    post_url VARCHAR(1024),
    likes INTEGER,
    comments INTEGER,
    shares INTEGER NOT NULL,
    reach INTEGER
);
