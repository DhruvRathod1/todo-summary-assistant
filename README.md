# Todo Summary Assistant

A full-stack application that helps you manage your to-do items and generates AI-powered summaries of your pending tasks, which can be automatically posted to Slack.

## 🚀 Features

- **Todo Management**: Create, edit, delete, and mark todos as complete
- **AI-Powered Summaries**: Generate intelligent summaries of pending todos using Google's Gemini AI
- **Slack Integration**: Automatically post summaries to your Slack channel
- **Real-time Updates**: Instant UI updates with optimistic rendering
- **Responsive Design**: Clean, modern interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for PostgreSQL database
- **Google Gemini AI** for LLM integration
- **Slack Webhooks** for notifications

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Google AI Studio account (for Gemini API)
- A Slack workspace with webhook permissions

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/todo-summary-assistant.git
cd todo-summary-assistant
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Slack Configuration (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000
```

### 4. Database Setup

#### Supabase Configuration

1. Go to [Supabase](https://supabase.com) and create a new project
2. In the SQL Editor, run the following query to create the todos table:

```sql
-- Create todos table
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO todos (text, completed) VALUES
('Complete the project documentation', false),
('Review code with team', false),
('Deploy to production', false),
('Update README file', true);
```

3. Get your project URL and anon key from Settings > API

### 5. Google Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your backend `.env` file

### 6. Slack Integration Setup

1. Go to your Slack workspace
2. Navigate to **Apps** > **Manage** > **Custom Integrations**
3. Click **Incoming Webhooks** > **Add Configuration**
4. Choose a channel and click **Add Incoming WebHooks Integration**
5. Copy the Webhook URL and add it to your backend `.env` file

Alternatively, create a Slack app:
1. Go to [Slack API](https://api.slack.com/apps)
2. Click **Create New App** > **From scratch**
3. Enable **Incoming Webhooks**
4. Create a webhook for your desired channel

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
npm start
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Fetch all todos |
| POST | `/todos` | Create a new todo |
| PATCH | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a todo |
| POST | `/summarize` | Generate AI summary and post to Slack |
| GET | `/health` | Health check endpoint |

## 🏗️ Architecture Decisions

### Why Node.js + Express?
- **Rapid Development**: Express provides a minimal, flexible framework
- **TypeScript Support**: Full type safety across the stack
- **Rich Ecosystem**: Extensive library support for integrations

### Why Supabase?
- **Real-time Capabilities**: Built-in real-time subscriptions
- **PostgreSQL**: Powerful relational database with JSON support
- **Easy Authentication**: Built-in auth (for future enhancements)
- **Free Tier**: Generous free tier for development

### Why Google Gemini AI?
- **Cost-Effective**: Competitive pricing with generous free tier
- **High Quality**: Excellent text generation capabilities
- **Fast Response Times**: Low latency for real-time applications

### Frontend State Management
- **React State**: Using built-in useState for simplicity
- **Optimistic Updates**: Immediate UI feedback with error rollback
- **Error Boundaries**: Graceful error handling

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new todo
- [ ] Edit an existing todo
- [ ] Mark todo as complete/incomplete
- [ ] Delete a todo
- [ ] Generate AI summary with pending todos
- [ ] Verify Slack message is posted
- [ ] Test error handling (network failures, invalid data)

### API Testing with curl

```bash
# Get all todos
curl http://localhost:5000/todos

# Create a todo
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Test todo"}'

# Generate summary
curl -X POST http://localhost:5000/summarize
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform

### Backend (Railway/Render/Heroku)

1. Set environment variables in your hosting platform
2. Deploy directly from GitHub or push your code

### Environment-Specific Configurations

Update your environment variables for production:
- Set `FRONTEND_URL` to your deployed frontend URL
- Set `VITE_API_URL` to your deployed backend URL

## 🐛 Troubleshooting

### Common Issues

**Database Connection Fails**
- Verify your Supabase URL and API key
- Check if the todos table exists
- Ensure RLS (Row Level Security) is configured correctly

**AI Summary Not Working**
- Verify your Gemini API key is valid
- Check if you have sufficient API quota
- Ensure you have pending (incomplete) todos

**Slack Integration Fails**
- Verify your webhook URL is correct
- Check if the Slack app has proper permissions
- Test the webhook URL manually with curl

**CORS Issues**
- Ensure `FRONTEND_URL` in backend .env matches your frontend URL
- Check if your hosting platform supports CORS

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the LLM integration
- [Supabase](https://supabase.com/) for the database and backend services
- [Slack API](https://api.slack.com/) for webhook integration
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend framework

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/todo-summary-assistant/issues) page
2. Create a new issue with detailed information
3. Include logs, error messages, and steps to reproduce

---

**Happy Todo Managing! 🎉**
