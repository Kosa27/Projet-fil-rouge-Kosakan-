const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Connexion à la base de données PostgreSQL
const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'etudiants_db', 
  password: 'motdepasse', 
  port: 5432,
});

// Vérification de la connexion à la base de données
pool.connect((err) => {
  if (err) {
    console.log('Erreur de connexion à la base de données :', err.message);
  } else {
    console.log('Connecté à la base de données PostgreSQL');
  }
});

// Route simple pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Serveur backend pour les étudiants !');
});

// Route pour ajouter un étudiant
app.post('/add-student', (req, res) => {
  const { nom, email } = req.body;

  // Requête SQL d'insertion
  pool.query(
    'INSERT INTO etudiants (nom, email) VALUES ($1, $2)',
    [nom, email],
    (err, result) => {
      if (err) {
        console.log('Erreur lors de l\'ajout de l\'étudiant :', err.message);
        res.status(500).send('Erreur lors de l\'ajout de l\'étudiant.');
      } else {
        res.send('Étudiant ajouté avec succès !');
      }
    }
  );
});

// Route pour voir tous les étudiants
app.get('/students', (req, res) => {
  pool.query('SELECT * FROM etudiants', (err, result) => {
    if (err) {
      console.log('Erreur lors de la récupération des étudiants :', err.message);
      res.status(500).send('Erreur lors de la récupération des étudiants.');
    } else {
      res.json(result.rows);
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
