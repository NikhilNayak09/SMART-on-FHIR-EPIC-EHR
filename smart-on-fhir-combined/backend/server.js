require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'https://1n5g6gml-3000.inc1.devtunnels.ms'], credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 8 * 60 * 60 * 1000 },
}));

// JWKS endpoint — Epic fetches our public key from here
app.get('/.well-known/jwks.json', (req, res) => {
  const jwks = JSON.parse(fs.readFileSync('./jwks.json', 'utf8'));
  res.json(jwks);
});

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/auth', require('./routes/auth'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/epro', require('./routes/epro'));
app.use('/api/vitals', require('./routes/vitals'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`RestoreMe Epic POC backend running on http://localhost:${PORT}`);
  console.log('Routes: /auth/launch | /auth/callback | /auth/ehr-launch | /auth/status');
  console.log('        /api/patient/summary | /api/epro/submit | /api/vitals/submit');
  console.log('        /api/admin/sync | /api/admin/sync/status');
});
