# QAHE English - IELTS Speaking Practice Platform

🎯 **AI-Powered IELTS Speaking Practice with Real-Time Analysis**

A comprehensive Next.js application that provides authentic IELTS speaking practice with AI-powered scoring, pronunciation analysis, and personalized feedback. Practice all three IELTS speaking parts with official topics and get detailed band score assessments.

![IELTS Speaking Practice](https://img.shields.io/badge/IELTS-Speaking_Practice-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![AI Powered](https://img.shields.io/badge/AI-Powered-green)

## 🌟 Features

### 🎤 Complete IELTS Speaking Practice
- **All 3 Parts Coverage**: Practice Part 1 (Introduction), Part 2 (Cue Cards), and Part 3 (Discussion)
- **Authentic Topics**: 90+ official topics sourced from IELTS Liz including:
  - 33+ Part 1 topics (Work, Study, Hometown, Hobbies, etc.)
  - 29+ Part 2 cue cards (Describe a person, place, event, etc.)
  - 27+ Part 3 discussion topics (Society, Technology, Education, etc.)
- **Real Timing**: Authentic IELTS timing with preparation time for Part 2

### 🤖 AI-Powered Analysis
- **Detailed Band Scoring**: Get precise IELTS band scores (0.25 increments)
  - Lexical Resource scoring
  - Grammatical Range and Accuracy
  - Overall band calculation
- **Comprehensive Feedback**: Detailed analysis of your speaking performance
- **Enhanced Versions**: AI generates improved versions of your responses
- **Vocabulary Upgrades**: Suggestions for more sophisticated word choices

### 🔊 Advanced Audio Features
- **Real-time Recording**: Professional-quality audio capture
- **Pronunciation Analysis**: Word-level pronunciation scoring
- **Speech-to-Text**: Automatic transcription with accuracy assessment
- **Audio Worklet Technology**: Advanced audio processing

### 📊 Intelligent Assessment
- **Relevance Detection**: Analyzes if responses address the topic
- **Fluency Metrics**: Speech rate, pause analysis, filler word detection
- **Improvement Guidance**: Specific, actionable suggestions for band score improvement
- **Follow-up Questions**: Dynamic examiner-style follow-up questions

### ✍️ Writing Practice (Bonus)
- **IELTS Writing Tasks**: Task 1 (Academic & General) and Task 2 practice
- **Multiple Topics**: Variety of writing prompts and question types

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub Personal Access Token (for AI analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uniqueskillslab/Qahe-English.git
   cd Qahe-English
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy to Production

### Quick Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/uniqueskillslab/Qahe-English)

### Manual Deployment Steps
1. **Fork or Clone** this repository
2. **Connect to Vercel**: Import your GitHub repository
3. **Environment Variables**: Add `GITHUB_TOKEN` in Vercel dashboard
4. **Deploy**: Automatic deployment with every push to main branch

### Environment Variables for Production
```env
GITHUB_TOKEN=your_github_personal_access_token
```

**Get your GitHub Token:**
- Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
- Generate new token (classic) - no special permissions needed
- Copy and paste in Vercel environment variables

📖 **Detailed Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive instructions.

## 🎯 How to Use

### Speaking Practice
1. **Choose Your Part**: Select from IELTS Speaking Part 1, 2, or 3
2. **Pick a Topic**: Choose from authentic IELTS topics
3. **Record Your Response**: Use the built-in voice recorder
4. **Get AI Analysis**: Receive detailed scoring and feedback
5. **Review Enhancement**: See improved versions of your response
6. **Practice Follow-ups**: Answer dynamic follow-up questions

### Getting the Best Results
- **Speak Clearly**: Ensure good audio quality for accurate analysis
- **Stay On Topic**: Address the question directly for better scoring
- **Use Examples**: Include personal examples and specific details
- **Practice Regularly**: Consistent practice improves band scores

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Audio Processing**: Audio Worklet API, Web Audio API
- **AI Analysis**: GitHub Models API (GPT-4)
- **Speech Processing**: Web Speech API
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
qahe/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analyze-speech/    # Speech analysis endpoint
│   │   ├── generate-followup/ # Follow-up questions
│   │   ├── pronunciation-analysis/ # Pronunciation scoring
│   │   └── speech-to-text/    # Transcription service
│   ├── audio-worklet-demo/    # Audio worklet demo
│   └── writing/           # Writing practice pages
├── components/            # React components
│   ├── VoiceRecorder.tsx      # Main recording component
│   ├── ScoreDisplay.tsx       # Results display
│   ├── TopicDisplay.tsx       # Topic selection
│   └── Timer.tsx             # Practice timer
├── data/                 # Static data
│   └── ieltsTopics.ts        # IELTS topics and questions
├── types/                # TypeScript definitions
├── utils/                # Utility functions
└── public/              # Static assets
```

## 🎯 IELTS Band Scoring

The platform provides authentic IELTS band scoring:

- **Band 9**: Expert user - fully operational command
- **Band 8**: Very good user - fully operational with minor inaccuracies
- **Band 7**: Good user - operational command with occasional inaccuracies
- **Band 6**: Competent user - generally effective command
- **Band 5**: Modest user - partial command with frequent problems
- **Band 4**: Limited user - basic competence in familiar situations

## 🔧 API Endpoints

- `POST /api/analyze-speech` - Analyze recorded speech
- `POST /api/speech-to-text` - Convert speech to text
- `POST /api/generate-followup` - Generate follow-up questions
- `POST /api/pronunciation-analysis` - Analyze pronunciation

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

If you have any questions or need help:
- Open an issue on GitHub
- Contact: [Your contact information]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IELTS Liz** - For providing authentic IELTS speaking topics and questions
- **GitHub Models** - For AI-powered speech analysis
- **Next.js Team** - For the amazing React framework
- **Vercel** - For deployment and hosting solutions

## 🚀 Live Demo & Deployment

### Production Deployment
🌐 **Deploy your own instance**: 
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/uniqueskillslab/Qahe-English)

### Quick Links
- 📖 **Detailed Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🛠️ **GitHub Repository**: [Qahe-English](https://github.com/uniqueskillslab/Qahe-English)
- 🌍 **Live Demo**: [Coming Soon - Deploy Your Own!]

### Deployment Platforms Supported
- ✅ **Vercel** (Recommended) - Zero configuration deployment
- ✅ **Netlify** - Alternative deployment option  
- ✅ **Railway** - Full-stack deployment
- ✅ **Docker** - Containerized deployment

---

**Built with ❤️ for IELTS learners worldwide**

![GitHub stars](https://img.shields.io/github/stars/uniqueskillslab/Qahe-English)
![GitHub forks](https://img.shields.io/github/forks/uniqueskillslab/Qahe-English)
![GitHub issues](https://img.shields.io/github/issues/uniqueskillslab/Qahe-English)
