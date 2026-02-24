import React, { useState, useEffect } from 'react';

export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  badge?: string;
  badgeColor?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  title: string;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const JobCard: React.FC<CarouselProps> = ({
  items,
  title,
  autoSlide = false,
  autoSlideInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-500">
          {currentIndex + 1} of {items.length}
        </p>
      </div>

      <div className="carousel w-full bg-base-200 rounded-lg shadow-md overflow-hidden">
        <div className="carousel-item w-full">
          <div className="w-full p-8 flex flex-col justify-between min-h-[400px]">
            {currentItem.image && (
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentItem.title}
                  </h3>
                  {currentItem.subtitle && (
                    <p className="text-lg text-gray-600 mb-4">
                      {currentItem.subtitle}
                    </p>
                  )}
                </div>
                {currentItem.badge && (
                  <div
                    className={`badge badge-${
                      currentItem.badgeColor || 'primary'
                    } text-white px-4 py-2`}
                  >
                    {currentItem.badge}
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {currentItem.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 gap-4">
        <button
          onClick={prevSlide}
          className="btn btn-sm btn-outline"
          aria-label="Previous slide"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`btn btn-xs ${
                index === currentIndex
                  ? 'btn-primary'
                  : 'btn-ghost'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="btn btn-sm btn-outline"
          aria-label="Next slide"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobCard;
