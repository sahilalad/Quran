const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3001;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    charset: 'utf8',
});

app.use(cors());

// app.use('/project', express.static(path.join(__dirname, 'project')));
// app.use('/project/css', express.static(path.join(__dirname, 'project/css')));
// app.use('/project/fonts', express.static(path.join(__dirname, 'project/fonts')));
// app.use(express.static('public'));


// app.use((req, res, next) => {
//     console.log(`Requested URL: ${req.url}`);
//     next();
// });

// app.use(express.static(path.join(__dirname, 'project')));

// Route for Surah pages
// app.get('/surah/:surah_id', (req, res) => {
//     res.sendFile(__dirname + '/public/surah.html');
// });

app.get('/api/surahs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM surahs ORDER BY surahs.surah_number');
        // console.log('Fetched Surahs:', result.rows);
        res.json({ surahs: result.rows });
    } catch (error) {
        console.error('Error fetching Surahs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get all Parahs
app.get('/api/parahs', async (req, res) => {
    try {
        // No need for a complex SQL query, just return the predefined data
        const parahsData = [
            { parah_number: 1, ayah_id: '2:1' },
            { parah_number: 2, ayah_id: '2:142' },
            { parah_number: 3, ayah_id: '2:253' },
            { parah_number: 4, ayah_id: '3:92' },
            { parah_number: 5, ayah_id: '4:24' },
            { parah_number: 6, ayah_id: '4:148' },
            { parah_number: 7, ayah_id: '5:83' },
            { parah_number: 8, ayah_id: '6:111' },
            { parah_number: 9, ayah_id: '7:88' },
            { parah_number: 10, ayah_id: '8:41' },
            { parah_number: 11, ayah_id: '9:94' },
            { parah_number: 12, ayah_id: '11:6' },
            { parah_number: 13, ayah_id: '12:53' },
            { parah_number: 14, ayah_id: '15:2' },
            { parah_number: 15, ayah_id: '17:1' },
            { parah_number: 16, ayah_id: '18:75' },
            { parah_number: 17, ayah_id: '21:1' },
            { parah_number: 18, ayah_id: '23:1' },
            { parah_number: 19, ayah_id: '25:21' },
            { parah_number: 20, ayah_id: '27:60' },
            { parah_number: 21, ayah_id: '29:45' },
            { parah_number: 22, ayah_id: '33:31' },
            { parah_number: 23, ayah_id: '36:22' },
            { parah_number: 24, ayah_id: '39:32' },
            { parah_number: 25, ayah_id: '41:47' },
            { parah_number: 26, ayah_id: '46:1' },
            { parah_number: 27, ayah_id: '51:31' },
            { parah_number: 28, ayah_id: '58:1' },
            { parah_number: 29, ayah_id: '67:1' },
            { parah_number: 30, ayah_id: '78:1' }
        ];

        // Renamed 'parahs' to 'parahsWithText' to avoid conflict
        const parahsWithText = await Promise.all(parahsData.map(async (parah) => {
            const result = await pool.query('SELECT arabic_text FROM ayahs WHERE ayah_id = $1', [parah.ayah_id]);
            return {
                parah_number: parah.parah_number,
                ayah_id: parah.ayah_id,
                arabic_text: result.rows[0].arabic_text
            };
        }));

        res.json({ parahs: parahsWithText }); // Use the updated variable name
    } catch (error) {
        console.error('Error fetching Parahs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get Ayahs of a specific Surah by surah_number
app.get('/api/ayahs/:surah_number', async (req, res) => {
    const surahNumber = req.params.surah_number; // Extract the surah number from the request parameters

    try {
        // Fetch Ayahs for the given surah number from the database
        const result = await pool.query(`
            SELECT ayah_number, arabic_text, sajda_word, parah_number
            FROM ayahs
            WHERE surah_id = $1
        `, [surahNumber]); // Pass the surah number as a parameter to the query

        res.json({ ayahs: result.rows }); // Send the fetched Ayahs as a JSON response
    } catch (err) {
        console.error('Error fetching Ayahs:', err); // Log any error that occurs during the database query
        res.status(500).json({ error: 'Failed to retrieve Ayahs' }); // Respond with a 500 error status and an error message
    }
});

        // Endpoint to get details of a specific Surah by surah_id
        app.get('/api/surah/:surah_id', async (req, res) => {
            const surahId = req.params.surah_id; // Extract the surah ID from the request parameters

            try {
                // Fetch Surah details from the database
                const surahResult = await pool.query(`SELECT * FROM surahs WHERE surah_id = $1`, [surahId]);

                // Fetch Ayahs for the given surah ID from the database, along with their translations
                const ayahsResult = await pool.query(`
                    SELECT 
                        ayahs.ayah_id, 
                        ayahs.ayah_number, 
                        ayahs.arabic_text,
                        ayahs.parah_number, 
                        ayahs.sajda_word,
                        translations.translation_gujarati, 
                        translations.translation_english, 
                        translations.translation_urdu,
                        translations.translation_hindi,
                        translations.translation_as_kalam_roman, 
                        translations.tafsir_gujarati,
                        translations.tafsir_english,
                        translations.tafsir_urdu,
                        translations.tafsir_hindi,
                        translations.tafsir_as_kalam_roman
                    FROM ayahs
                    LEFT JOIN translations ON ayahs.ayah_id = translations.ayah_id
                    WHERE ayahs.surah_id = $1
                    ORDER BY ayahs.ayah_number
                `, [surahId]);

                // Include both Surah details and Ayahs in the response
                res.json({
                    surah: surahResult.rows[0], // Assuming there's only one Surah with that ID
                    ayahs: ayahsResult.rows
                });
            } catch (err) {
                console.error('Error fetching Surah Ayah details:', err); // Log any error that occurs during the database queries
                res.status(500).json({ error: 'Failed to retrieve Surah details' }); // Respond with a 500 error status and an error message
            }
        });

        // New API endpoint for reading data
        app.get('/api/reading', async (req, res) => {
            try {
                const query = `
                SELECT 
                surah_id,
                surah_number,
                name_english AS surah_name 
                FROM surahs
                ORDER BY surah_number
            `;
                const result = await pool.query(query);
                res.json({ reading: result.rows });
            } catch (error) {
                console.error('Error fetching reading data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Endpoint to fetch Sajdas (Ayahs containing prostration information)
        app.get('/api/sajdas', async (req, res) => {
            try {
                // Query the database to get all Ayahs that have Sajda information
                const result = await pool.query(`
                SELECT 
                    ayah_id AS id, 
                    arabic_text AS verse 
                FROM 
                    ayahs 
                WHERE 
                    sajda_word IS NOT NULL 
                ORDER BY 
                    surah_id`);
                res.json({ sajdas: result.rows }); // Send the retrieved Sajdas as a JSON response
            } catch (err) {
                console.error(err); // Log any errors to the console
                res.status(500).send('Error fetching sajdas'); // Send a 500 error response if something goes wrong
            }
        });

// This endpoint retrieves the text of a surah ruku from the Quran.	
app.get('/api/ruku', async (req, res) => {
  const surahId = req.query.surah;
  const rukuNumber = req.query.ruku;

  // Input validation (important to prevent SQL injection)
  if (isNaN(surahId) || isNaN(rukuNumber)) {
    return res.status(400).json({ error: 'Invalid surah or ruku number' });
  }

  try {
    const query = `
      SELECT 
          a.arabic_text, 
          a.ayah_id,
          a.ayah_number,
          a.surah_id AS surah_number,
          s.name_english AS surah_name_english,
          MIN(a.ayah_number) OVER () AS ruku_start_ayah,
          MAX(a.ayah_number) OVER () AS ruku_end_ayah
      FROM 
          public.ayahs a
      JOIN 
          public.surahs s ON a.surah_id = s.surah_id
      WHERE 
          a.ruku_number = $1 AND a.surah_id = $2
      ORDER BY 
          a.ayah_number ASC
    `;
    const values = [rukuNumber, surahId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ruku not found' });
    }

    // Extract Ruku metadata
    const rukuMetadata = {
      ruku_number: rukuNumber,
      surah_id: surahId,
      start_ayah: result.rows[0].ruku_start_ayah,
      end_ayah: result.rows[0].ruku_end_ayah,
    };

    // Format the response to include a separator
    const formattedResponse = {
      ruku_metadata: rukuMetadata,
      ayahs: result.rows.map((ayah, index) => ({
        ...ayah,
        isLastInRuku: index === result.rows.length - 1 // Mark the last Ayah in the Ruku
      })),
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error('Error fetching Ruku:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add this endpoint to get all Rukus for a surah
app.get('/api/surah-rukus', async (req, res) => {
  const surahId = req.query.surah;

  if (isNaN(surahId)) {
    return res.status(400).json({ error: 'Invalid surah number' });
  }

  try {
    const query = `
      SELECT 
        ruku_number,
        CONCAT(surah_id, ':', MIN(ayah_number)) AS start_ayah,
        CONCAT(surah_id, ':', MAX(ayah_number)) AS end_ayah
      FROM ayahs
      WHERE surah_id = $1
      GROUP BY ruku_number, surah_id
      ORDER BY ruku_number
    `;
    const result = await pool.query(query, [surahId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Rukus:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// In your server file (e.g., app.js or routes/pages.js)
app.get('/api/pages', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const pageNumber = req.query.page || 1; // Default to page 1
  
    try {
      const query = `
        WITH page_lines AS (
           SELECT *
           FROM pages
           WHERE page_number = $1
        )
        SELECT
           pl.line_number,
           pl.line_type,
           pl.is_centered,
           pl.surah_number,
           CASE 
             WHEN pl.line_type = 'ayah' THEN (
               SELECT STRING_AGG(w.text, ' ' ORDER BY w.word_index)
               FROM words w
               WHERE w.word_index BETWEEN pl.first_word_id AND pl.last_word_id
             )
             WHEN pl.line_type = 'surah_name' THEN (
               CASE pl.surah_number
                 WHEN 1 THEN 'الفاتحة'
                 WHEN 2 THEN 'البقرة'
                 -- Add additional mappings as needed
               END
             )
             WHEN pl.line_type = 'basmallah' THEN '﷽'
           END AS line_text
        FROM page_lines pl
        ORDER BY pl.line_number;
      `;
      const result = await pool.query(query, [pageNumber]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching page details:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  

  
// 🔹 Search API - Searches Ayahs, Translations, and Tafsir
app.get("/api/search", async (req, res) => {
    try {
        let { query } = req.query;
        if (!query) return res.json([]);

        console.log("Received search query:", query);

        const searchQuery = `
    SELECT 
        a.ayah_id, a.surah_id, a.ayah_number, a.arabic_text, a.sajda_word,
        s.name_english AS surah_name, s.name_gujarati AS surah_name_gujarati, s.surah_number,
        t.translation_gujarati, t.translation_english, t.translation_urdu,
        t.tafsir_gujarati, t.tafsir_english, t.tafsir_urdu
    FROM ayahs a
    LEFT JOIN translations t ON a.ayah_id = t.ayah_id
    LEFT JOIN surahs s ON a.surah_id = s.surah_id
    WHERE a.arabic_text ILIKE $1
    OR t.translation_english ILIKE $1
    OR t.translation_gujarati ILIKE $1
    OR t.translation_urdu ILIKE $1
    OR t.tafsir_english ILIKE $1
    OR t.tafsir_gujarati ILIKE $1
    OR t.tafsir_urdu ILIKE $1
    OR s.name_english ILIKE $1
    OR s.name_gujarati ILIKE $1
    ORDER BY a.surah_id, a.ayah_number
    LIMIT 50;
`;

        console.log("Executing query:", searchQuery);
        const { rows } = await pool.query(searchQuery, [`%${query}%`]);

        console.log("Query Results:", rows);
        res.json(rows);
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server and listen on the specified port
//const newLocal = app.listen(port, () => {
//    console.log(`Server running on http://localhost:${port}`);
//});
//const newLocal = app.listen(port, '0.0.0.0', () => {
//    console.log(`Server listening on port ${port}`);
//});
app.listen(port, '0.0.0.0', () => {
    console.log(`server listening on port ${port}`);
});
