# Embeddit

Find and analyze relevant Reddit discussions with the power of AI - making crowd-sourced knowledge more accessible.

## 🌱 Inspiration

One issue with underdiagnosed and underrecognized diseases is the lack of information and treatment plans provided by doctors. For example, small intestinal bacterial overgrowth (SIBO) affects people worldwide with symptoms such as abdominal pain, nausea, and bloating. Diseases like this force patients to experiment with different solutions, relying on other people's personal experiences for guidance.

Subreddits like r/SIBO provide valuable personal experiences that can help people overcome their challenges. However, the variety of topics on Reddit can make it difficult to navigate. Embeddit makes searching through these experiences easy and efficient.

## 🤖 What it does

Embeddit allows users to ask questions about specific subreddits. Users input the subreddit's name and the number of posts to analyze. The app then:
- Calls Reddit's API to fetch posts
- Embeds them in a Pinecone vector database
- Provides AI-powered analysis of personal experiences
- Connects people facing similar challenges worldwide

## 🔧 Tech Stack

- **Frontend**: React, Tailwind CSS, DaisyUI
- **Backend**: Next.js
- **AI/ML**: OpenAI (ChatGPT), Pinecone Vector DB
- **APIs**: Reddit API
- **Deployment**: Vercel

## 🛠️ Challenges We Overcame

- Implementing retrieval-augmented generation (RAG) with limited prior experience
- Processing Reddit post data and authentication token generation
- Integrating Pinecone vector database for efficient data storage and retrieval
- Building a cost-effective RAG solution

## 🚀 Future Plans

- Expand post analysis capacity beyond current 10-post limit
- Implement bias detection and sentiment analysis
- Develop a mobile application
- Add more safety features around content filtering
- Enhance AI analysis capabilities

## 🏆 Recognition

- Winner of the Sauce Labs Hot Sauce Raffle at HackHarvard 2024

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/embeddit.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

## 👥 Team

- Gabriel Shiu
- Megan Kulshekar
- Seth Morton
- Christopher Chhim

## 📝 License

[MIT](LICENSE)
