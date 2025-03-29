import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="flex-grow pt-20 text-center">
      {/* Hero Section */}
      <section id="hero" class="bg-gray-100 p-12 text-center">
        <h1 class="text-4xl mb-4">
          Unlock ESG Insights for Informed Decision-Making
        </h1>
        <p class="text-lg mb-8">
          Discover how our platform helps you navigate the banking sector with
          comprehensive Environmental, Social, and Governance metrics.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded">
          <Link to="/dashboard">Get Started</Link>
        </button>
      </section>

      {/* About Section */}
      <section id="about" class="p-12 text-lg">
        <h1 class="text-4xl mb-4">About Us</h1>
        <p class="mb-8">
          Our platform is designed to provide you with detailed ESG insights and
          forecasting tools, empowering you to make informed decisions in the
          banking sector.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" class="bg-gray-100 p-12">
        <h1 class="text-4xl mb-4">Key Features</h1>
        <div class="list-disc pl-8 mb-8">
          <div>
            <strong>Dashboard & Forecasts:</strong> Access ESG metrics and
            forecasts of various companies.
          </div>
          <div>
            <strong>Personalised Leaderboard:</strong> Compare companies across
            ESG scores based on your preferences and receive actionable
            insights.
          </div>
          <div>
            <strong>AI-Powered Chatbot:</strong> Get instant support and
            guidance with our integrated chatbot.
          </div>
        </div>
        <p>
          Explore our features to enhance your understanding of the banking
          sector and make data-driven decisions!
        </p>
      </section>
    </div>
  );
}
