import mysql from 'mysql2'
import dotenv from 'dotenv';

dotenv.config();

const connect = mysql.createPool({
     host: process.env.MYSQL_HOST,
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
     database: process.env.MYSQL_DATABASE,
     port: process.env.MYSQL_PORT || 3306,
}).promise();

async function initializeDatabase() {
     try {
          await connect.getConnection();
          console.log("✅ Database connected successfully!");

          // create tables if does not exist
          const [users_tb] = await connect.query(`
               CREATE TABLE IF NOT EXISTS user_tb (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    email varchar(255) NOT NULL,
                    fullname varchar(255) NOT NULL,
                    photoUrl varchar(2000) NOT NULL,
                    PRIMARY KEY (id),
                    UNIQUE KEY email (email)
               ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci
          `);

          const [tasks_tb] = await connect.query(`
               CREATE TABLE IF NOT EXISTS task_tb (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    user_id int(11) NOT NULL,
                    isPending tinyint(1) NOT NULL DEFAULT 0,
                    isComplete tinyint(1) NOT NULL DEFAULT 0,
                    title varchar(255) NOT NULL,
                    description varchar(255) NOT NULL,
                    time time NOT NULL,
                    date date NOT NULL,
                    PRIMARY KEY (id)
               ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
          `);

          const [note_tb] = await connect.query(`
               CREATE TABLE IF NOT EXISTS note_tb (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    user_id int(11) NOT NULL,
                    title varchar(255) NOT NULL,
                    content text NOT NULL,
                    favorite tinyint(1) NOT NULL DEFAULT 0,
                    category enum('general','personal','work','ideas') NOT NULL,
                    created_at timestamp NOT NULL DEFAULT current_timestamp(),
                    PRIMARY KEY (id)
               ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
          `);

          const [diarys_tb] = await connect.query(`
               CREATE TABLE IF NOT EXISTS diary_tb (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    user_id int(11) NOT NULL,
                    type enum('text','audio') NOT NULL,
                    content text NOT NULL,
                    created_at varchar(255) NOT NULL,
                    PRIMARY KEY (id)
               ) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
          `);

          if (users_tb && tasks_tb && note_tb && diarys_tb) {
               console.log('✅ Tables created or already exist');
          } else {
               console.error('❌ Failed to create tables');
          }
     } catch (err) {
          console.error("❌ Database initialization failed:", err.message);
          // Don't throw here to allow the server to at least start and bind to a port
          // though most API calls will fail until the DB is fixed.
     }
}

initializeDatabase();

export default connect;