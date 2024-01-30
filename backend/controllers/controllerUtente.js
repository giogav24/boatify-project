const Utente = require('../models/Utente')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config');
const sendConfirmationEmail = require('./email');

exports.registraUtente = async (req, res) => {
  const { nome, cognome, nr_telefono, data_nascita, email, password, ruolo } = req.body;

  if (!nome || !cognome || !nr_telefono || !data_nascita || !email || !password || !ruolo) {
    return res.status(400).json({ success: false, message: 'Compilare tutti i campi!' });
  }

  try {
    const existingUser = await Utente.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Utente già registrato' });
    }

    //controllo la validità della data 
    const dataNascita = new Date(data_nascita);
    const dataOdierna = new Date();
    
    if (isNaN(dataNascita.getTime()) || dataNascita >= dataOdierna) {
      return res.status(400).json({ success: false, message: 'Data di nascita non valida' });
    }
    //impongo età > 14
    const fourteenYearsAgo = new Date();
    fourteenYearsAgo.setFullYear(dataOdierna.getFullYear() - 14);
    
    // Confronta le date
    if (dataNascita > fourteenYearsAgo) {
      return res.status(400).json({ success: false, message: 'L\'utente deve avere almeno 14 anni' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new Utente({
      nome,
      cognome,
      nr_telefono,
      data_nascita,
      email,
      password: hashedPassword,
      ruolo,
    });

    await newUser.save();
    res.status(200).json({ success: true, message: 'Utente registrato con successo' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.loginUtente = async (req, res) => {
  const { email, password } = req.body;

// controllo su campi mancanti
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Compilare tutti i campi' });
  }

  try {
    // recupero utente dal database
    const user = await Utente.findOne({ email });

    //se non esiste ritorno errore
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utente inesistente' });
    }
    console.log('Provided Password:', password);


    //controllo la password
    const passwordCorrect = await bcrypt.compare(password.trim(), user.password);
    console.log('Hashed Password in Database:', user.password);
    console.log('Password Comparison Result:', passwordCorrect);

    if (!passwordCorrect) {
      return res.status(401).json({ success: false, message: 'Password incorretta' });
    }
    //se tutto va bene creo il tocken aggiungendo i vari campi
    const token = jwt.sign(
      {
        id: user._id,
        nome: user.nome,
        email: user.email,
        ruolo: user.ruolo,
      },
      config.SECRET_KEY,
      {
        expiresIn: '1 day',
      }
    );

    res.status(200).json({success: true,token: token});

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//resettare la password se si è dimenticata
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email non fornita' });
  }

  try {
    const user = await Utente.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Impossibile trovare l\'email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.tokenRecuperoPassword = crypto.createHash('sha256').update(resetToken).digest('hex');
    //imposto tempo massimo per eseguire il reset
    user.scadenzaRecuperoPassword = Date.now() + 10 * 60 * 1000; //10 minuti

    await user.save();

    const resetURL = `http://${config.HOST}:${config.FRONT_PORT}/resetpassword/${resetToken}`;

    const message = `
      <h1>Hai richiesto il ripristino della password</h1>
      <p>Per favore, vai a questo link per reimpostare la tua password:</p>
      <a href=${resetURL} clicktracking=off>${resetURL}`;

    // Invia l'email utilizzando la funzione di invio email
    sendConfirmationEmail(user.email, 'Reset Password', message);

    res.status(200).json({ success: true, message: 'Email inviata correttamente' });
  } catch (err) {
    //se ci sono stati problemi nell'invio della mail resetto i campi del db poichè l'operazione è fallita
    user.tokenRecuperoPassword = undefined
    user.scadenzaRecuperoPassword = undefined

    await user.save()

    res.status(500).json({ success: false, message: err.message });
  }
};

//per cambiare la mail conoscendo quella vecchia
exports.cambiaPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    res.status(400).json({ success: false, message: 'Campi vuoti forniti nella richiesta' });
  }

  try {
    const user = await Utente.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'Utente non trovato' });
    }

    //controllo che la vecchia password inserita sia uguale a quella registrata nel db
    const passwordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({ success: false, message: 'La vecchia password fornita è errata' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password cambiata con successo' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

exports.getDatiUtente = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Utente.findOne({email});

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utente non trovato' });
    }

    // Estraggo i dati richiesti
    const datiUtente = {
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      numero_di_telefono: user.nr_telefono,
      patenti: user.patenti,
    };

    res.status(200).json({ success: true, datiUtente });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

