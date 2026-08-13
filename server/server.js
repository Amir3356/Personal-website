import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
  console.error('Missing ADMIN_EMAIL / ADMIN_PASSWORD / JWT_SECRET. Copy .env.example to .env.');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Helper to read data
const readData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- Auth ---

/**
 * Guards every mutating route. Read endpoints stay public so the portfolio
 * itself can fetch content without a token.
 */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  const emailOk = typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const passwordOk = typeof password === 'string' && password === ADMIN_PASSWORD;

  // Same message either way so the response can't be used to probe for a valid email.
  if (!emailOk || !passwordOk) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email: ADMIN_EMAIL, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, email: ADMIN_EMAIL });
});

/** Lets the client verify a stored token is still valid on page load. */
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ email: req.user.email });
});

// --- Experiences Endpoints ---

app.get('/api/experience', (req, res) => {
  const data = readData();
  res.json(data.experience);
});

app.post('/api/experience', requireAuth, (req, res) => {
  const data = readData();
  const newExp = { id: 'exp-' + Date.now(), ...req.body };
  data.experience.push(newExp);
  writeData(data);
  res.status(201).json(newExp);
});

app.put('/api/experience/:id', requireAuth, (req, res) => {
  const data = readData();
  const index = data.experience.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    data.experience[index] = { ...data.experience[index], ...req.body };
    writeData(data);
    res.json(data.experience[index]);
  } else {
    res.status(404).json({ message: 'Experience not found' });
  }
});

app.delete('/api/experience/:id', requireAuth, (req, res) => {
  const data = readData();
  const initialLength = data.experience.length;
  data.experience = data.experience.filter(e => e.id !== req.params.id);
  
  if (data.experience.length < initialLength) {
    writeData(data);
    res.json({ message: 'Experience deleted' });
  } else {
    res.status(404).json({ message: 'Experience not found' });
  }
});

// --- Projects Endpoints ---

app.get('/api/projects', (req, res) => {
  const data = readData();
  res.json(data.projects);
});

app.post('/api/projects', requireAuth, (req, res) => {
  const data = readData();
  const newProject = { id: 'proj-' + Date.now(), ...req.body };
  data.projects.push(newProject);
  writeData(data);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', requireAuth, (req, res) => {
  const data = readData();
  const index = data.projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    data.projects[index] = { ...data.projects[index], ...req.body };
    writeData(data);
    res.json(data.projects[index]);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const data = readData();
  const initialLength = data.projects.length;
  data.projects = data.projects.filter(p => p.id !== req.params.id);
  
  if (data.projects.length < initialLength) {
    writeData(data);
    res.json({ message: 'Project deleted' });
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// --- Settings Endpoints (hero image, CV, contact) ---

/** Defaults keep the site rendering if data.json predates the settings block. */
const DEFAULT_SETTINGS = {
  hero: { image: '/images/amir.png', cvUrl: '/cv.pdf' },
  contact: {
    email: 'amir@betwotech.com',
    phone: '',
    location: '',
    socials: [],
  },
};

app.get('/api/settings', (req, res) => {
  const data = readData();
  res.json({
    hero: { ...DEFAULT_SETTINGS.hero, ...(data.settings?.hero || {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(data.settings?.contact || {}) },
  });
});

app.put('/api/settings/hero', requireAuth, (req, res) => {
  const data = readData();
  data.settings = data.settings || {};
  data.settings.hero = {
    ...DEFAULT_SETTINGS.hero,
    ...(data.settings.hero || {}),
    ...req.body,
  };
  writeData(data);
  res.json(data.settings.hero);
});

app.put('/api/settings/contact', requireAuth, (req, res) => {
  const data = readData();
  data.settings = data.settings || {};
  data.settings.contact = {
    ...DEFAULT_SETTINGS.contact,
    ...(data.settings.contact || {}),
    ...req.body,
  };
  writeData(data);
  res.json(data.settings.contact);
});

// --- Messages Endpoints ---

/** Public: anyone submitting the portfolio contact form. */
app.post('/api/messages', (req, res) => {
  const { name, email, subject, message } = req.body || {};

  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const entry = {
    id: 'msg-' + Date.now(),
    name: clean(name, 120),
    email: clean(email, 200),
    subject: clean(subject, 200),
    message: clean(message, 5000),
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (!entry.name || !entry.email || !entry.message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
    return res.status(400).json({ message: 'That email address looks invalid' });
  }

  const data = readData();
  data.messages = data.messages || [];
  data.messages.unshift(entry); // newest first
  writeData(data);

  res.status(201).json({ message: 'Message received' });
});

app.get('/api/messages', requireAuth, (req, res) => {
  const data = readData();
  res.json(data.messages || []);
});

app.patch('/api/messages/:id', requireAuth, (req, res) => {
  const data = readData();
  data.messages = data.messages || [];
  const index = data.messages.findIndex(m => m.id === req.params.id);

  if (index === -1) return res.status(404).json({ message: 'Message not found' });

  data.messages[index] = { ...data.messages[index], read: Boolean(req.body.read) };
  writeData(data);
  res.json(data.messages[index]);
});

app.delete('/api/messages/:id', requireAuth, (req, res) => {
  const data = readData();
  data.messages = data.messages || [];
  const initialLength = data.messages.length;
  data.messages = data.messages.filter(m => m.id !== req.params.id);

  if (data.messages.length === initialLength) {
    return res.status(404).json({ message: 'Message not found' });
  }
  writeData(data);
  res.json({ message: 'Message deleted' });
});

// --- File uploads (hero image / CV) ---

const UPLOAD_DIR = path.join(__dirname, '..', 'client', 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Serve uploaded media so the admin preview and the live site can load it.
app.use('/uploads', express.static(UPLOAD_DIR));

const ALLOWED_UPLOADS = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  // Browsers report .md as text/markdown or text/plain depending on the OS.
  'text/markdown': '.md',
  'text/x-markdown': '.md',
  'text/plain': '.md',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    // Never trust the client filename — build our own from a whitelisted extension.
    filename: (req, file, cb) => {
      // .md often arrives as text/plain, so prefer the original extension when
      // it's one we allow; otherwise fall back to the mime type's extension.
      const original = path.extname(file.originalname).toLowerCase();
      const allowed = Object.values(ALLOWED_UPLOADS);
      const ext = allowed.includes(original) ? original : ALLOWED_UPLOADS[file.mimetype];
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // text/plain is allowed only to let .md through — a real .txt is not a CV.
    if (file.mimetype.startsWith('text/')) {
      return path.extname(file.originalname).toLowerCase() === '.md'
        ? cb(null, true)
        : cb(new Error('Only .md is accepted for text files'));
    }
    if (ALLOWED_UPLOADS[file.mimetype]) return cb(null, true);
    cb(new Error('Only PNG, JPG, WEBP, GIF, AVIF, PDF, DOC, DOCX or MD files are allowed'));
  },
});

app.post('/api/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file received' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
