// server.js
require('dotenv').config(); // Lataa ympäristömuuttujat .env-tiedostosta
const express = require('express'); // Express-framework
const { Pool } = require('pg');  // PostgreSQL yhteys

const app = express();

// Middleware JSON-pyyntöjen käsittelyyn
app.use(express.json());

// PostgreSQL-yhteyden konfiguraatio
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Yhdistä tietokantaan ja testaa yhteys
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Tietokannan yhteys epäonnistui:', err.stack);
    } else {
        console.log('Tietokanta yhdistetty:', res.rows[0]);
    }
});

// Reitti genrejen lisäämiseen
app.post('/genres', async (req, res) => {
    const { name } = req.body; // Hakee genre-nimen pyynnöstä
    try {
        const result = await pool.query('INSERT INTO genres (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]); // Palauttaa lisätyn genren
    } catch (error) {
        console.error('Virhe lisätessä genreä:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Reitti elokuvien lisäämiseen (esimerkki)
app.post('/movies', async (req, res) => {
    const { name, year, genre_id } = req.body; // Hakee elokuvan tiedot pyynnöstä
    try {
        const result = await pool.query('INSERT INTO movies (name, year, genre_id) VALUES ($1, $2, $3) RETURNING *', [name, year, genre_id]);
        res.status(201).json(result.rows[0]); // Palauttaa lisätyn elokuvan
    } catch (error) {
        console.error('Virhe lisätessä elokuvaa:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Reitti elokuvan hakemiseen ID:llä
app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Elokuvaa ei löytynyt' });
        }
        res.json(result.rows[0]); // Palauttaa elokuvan tiedot
    } catch (error) {
        console.error('Virhe elokuvan hakemisessa:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Poista elokuva ID:llä
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Elokuvaa ei löytynyt' });
        }
        res.json({ message: 'Elokuva poistettu' }); // Palauttaa onnistumisviestin
    } catch (error) {
        console.error('Virhe elokuvan poistamisessa:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Palvelimen portti
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
});
