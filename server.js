const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Servir les fichiers statiques (le front-end)
app.use(express.static('public'));

// Route pour soumettre un pari
app.post('/submit-bet', (req, res) => {
    const name = req.body.name;
    const bet = req.body.bet;
    
    if (!name || !bet) {
        return res.status(400).json({ message: 'Le nom ou le pari est vide.' });
    }

    // Obtenir la date et l'heure actuelles
    const now = new Date();
    const dateTime = now.toLocaleString('fr-FR', { 
        dateStyle: 'short', 
        timeStyle: 'short' 
    });

    // Charger les paris existants
    let bets = [];
    if (fs.existsSync('bets.json')) {
        const data = fs.readFileSync('bets.json');
        bets = JSON.parse(data);
    }

    // Ajouter le nouveau pari avec la date et l'heure
    const newBet = { name: name, bet: bet, dateTime: dateTime };
    bets.push(newBet);

    // Enregistrer les paris mis à jour dans le fichier JSON
    fs.writeFile('bets.json', JSON.stringify(bets, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement du pari.' });
        }
        res.json({ message: 'Pari enregistré avec succès !' });
    });
});

// Route pour récupérer les paris en JSON
app.get('/get-bets', (req, res) => {
    if (fs.existsSync('bets.json')) {
        const data = fs.readFileSync('bets.json');
        const bets = JSON.parse(data);
        res.json(bets);
    } else {
        res.json([]);
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
