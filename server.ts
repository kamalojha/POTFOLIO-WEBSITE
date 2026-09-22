import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory messages storage for inbound recruiter/collaborator inquiries
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const contactMessages: ContactMessage[] = [];

// Contact form API endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newMessage: ContactMessage = {
      id: 'msg_' + Date.now(),
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 100),
      subject: String(subject || 'General Inquiry').trim().slice(0, 150),
      message: String(message).trim().slice(0, 2000),
      createdAt: new Date().toISOString(),
    };

    contactMessages.push(newMessage);
    console.log(`[Inbound Message Received] From: ${newMessage.name} <${newMessage.email}> | Subject: ${newMessage.subject}`);

    res.json({
      success: true,
      message: 'Message delivered successfully to Kamal Ojha. Thank you for reaching out!',
      id: newMessage.id,
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    res.status(500).json({ error: 'Internal server error processing contact message' });
  }
});

// Resume metadata API endpoint
app.get('/api/profile', (_req: Request, res: Response) => {
  res.json({
    name: 'Kamal Ojha',
    title: 'Software & Machine Learning Engineer',
    email: 'Kamal2001ojha@gmail.com',
    phone: '+91-9582636226',
    linkedin: 'https://linkedin.com/in/kamal-ojha',
    location: 'Greater Noida, Uttar Pradesh, India',
    education: [
      {
        institution: 'Chandigarh University',
        location: 'Mohali, Punjab',
        degree: 'B.E. in Computer Science Engineering',
        period: '2021 – 2024',
      },
      {
        institution: 'Chandigarh College of Engineering and Technology',
        location: 'Chandigarh',
        degree: 'Diploma in Computer Science Engineering',
        period: '2018 – 2021',
      },
      {
        institution: 'Shishu Niketan Model Senior Secondary School, Sector-22',
        location: 'Chandigarh',
        degree: 'NIOS – Secondary Education',
        period: '2017 – 2017',
      },
    ],
  });
});

// ----------------------------------------------------
// Setup Vite in Dev or Serve Static Dist in Production
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Kamal Ojha Portfolio Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
