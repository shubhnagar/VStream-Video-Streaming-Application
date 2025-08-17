import React from "react";
import { Tv, Users, Video } from "lucide-react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <section className="text-center px-6 py-24 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">
          Your Gateway to Amazing Content
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-indigo-100">
          Discover, watch, and share videos across genres from creators around
          the world. Join our community of millions of content creators and
          viewers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink
            to="/dashboard"
            className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition"
          >
            Get Started
          </NavLink>
        </div>
      </section>

      <section className="bg-white/10 backdrop-blur-lg py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose VStream?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Video />}
              title="High Quality Content"
              description="Stream in HD quality with adaptive bitrate for the best viewing experience"
            />
            <FeatureCard
              icon={<Users />}
              title="Vibrant Community"
              description="Connect with millions of creators and viewers who share your interests"
            />
            <FeatureCard
              icon={<Tv />}
              title="Watch Anywhere"
              description="Enjoy your favorite content on any device, anytime, anywhere"
            />
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 text-center text-white/80">
        <p>© 2024 VStream. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl text-center hover:bg-white/10 transition">
      <div className="w-12 h-12 mx-auto mb-4 text-white">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-indigo-100">{description}</p>
    </div>
  );
};

export default Home;
