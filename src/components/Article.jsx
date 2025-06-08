import React, { useState } from "react";
import article from "../assets/article.png";
import article1 from "../assets/article1.png";
import article2 from "../assets/article2.png";

const Article = () => {
  const initialArticles = [
    {
      id: 1,
      image: article,
      date: "June 5, 2025",
      title: "Signs Your Car Needs Immediate Attention",
      description:
        "Don’t ignore the warning signs. From strange noises to dashboard lights, here’s how to spot issues before they become costly repairs.",
    },
    {
      id: 2,
      image: article1,
      date: "June 3, 2025",
      title: "How to Save Fuel with Smarter Driving Habits",
      description:
        "A few simple changes in how you drive and maintain your car can improve fuel efficiency and save you money at the pump.",
    },
    {
      id: 3,
      image: article2,
      date: "June 1, 2025",
      title: "Why Regular Oil Changes Keep Your Engine Healthy",
      description:
        "Oil changes may seem basic, but they’re essential. Learn how often you should change your oil and why it matters for your engine’s lifespan.",
    },
  ];

  const additionalArticles = [
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop",
      date: "May 28, 2025",
      title: "Classic Car Restoration Guide",
      description:
        "A comprehensive guide to restoring classic automobiles. Tips on finding parts, restoration techniques, and preserving automotive history.",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop",
      date: "May 25, 2025",
      title: "Fuel Efficiency Comparison 2025",
      description:
        "Compare fuel efficiency across different vehicle categories. See which cars offer the best mileage and lowest environmental impact.",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=250&fit=crop",
      date: "May 22, 2025",
      title: "Car Technology Innovations",
      description:
        "Discover the latest technological innovations in the automotive world. From smart infotainment systems to advanced driver assistance features.",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=250&fit=crop",
      date: "May 20, 2025",
      title: "SUV vs Sedan: Which to Choose?",
      description:
        "A detailed comparison between SUVs and sedans to help you make the right choice for your lifestyle and driving needs.",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop",
      date: "May 18, 2025",
      title: "Sports Car Performance Analysis",
      description:
        "Analyze the performance characteristics of today's top sports cars. Engine specs, handling, and track performance compared.",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=250&fit=crop",
      date: "May 15, 2025",
      title: "Car Insurance Tips for 2025",
      description:
        "Navigate the car insurance landscape with our expert tips. Learn how to get the best coverage while saving money on premiums.",
    },
  ];

  const [articles, setArticles] = useState(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [showingAll, setShowingAll] = useState(false);

  const handleToggleArticles = () => {
    setIsLoading(true);

    setTimeout(() => {
      if (showingAll) {
        setArticles(initialArticles);
      } else {
        setArticles([...initialArticles, ...additionalArticles]);
      }
      setShowingAll(!showingAll);
      setIsLoading(false);
      //   window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  return (
    <section className="py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-8">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#333333] mb-4 md:mb-8">
        Latest Articles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 rounded-lg"
          >
            <div className="relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 md:h-60 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="py-6 px-4">
              <p className="text-sm text-[#64607D] font-medium mb-2">
                {article.date}
              </p>
              <h3 className="text-xl font-semibold text-[#333333] mb-3 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-[#64607D] text-[14px] leading-relaxed">
                {article.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={handleToggleArticles}
          disabled={isLoading}
          className={`${
            showingAll
              ? "bg-gray-700 text-white hover:bg-gray-800"
              : "border-2 border-[#492F92] text-[#492F92] hover:bg-[#492F92] hover:text-white"
          } font-semibold py-3 px-8 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full cursor-pointer h-5 w-5 border-b-2 border-white"></div>
              Loading...
            </>
          ) : showingAll ? (
            "← Show Less"
          ) : (
            "Show All Articles"
          )}
        </button>
      </div>
    </section>
  );
};

export default Article;
