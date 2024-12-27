import React, { useState } from "react";

const Card = ({
  imageSrc,
  imageAlt,
  badgeContent,
  title,
  details,
  onCardClick,
  fallbackImageSrc
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 cursor-pointer transform ${
        isHovered ? "scale-105" : "hover:scale-105"
      }`}
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative bg-gray-200">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt || "Card Image"}
            className="w-full h-auto object-contain"
            onError={(e) => {
              if (fallbackImageSrc) {
                e.target.src = fallbackImageSrc;
              }
            }}
          />
        )}
        {badgeContent && (
          <div className="absolute top-4 left-4 px-3 py-1">
            <span className="font-semibold">{badgeContent}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {title && <h3 className="text-xl font-bold mb-3">{title}</h3>}
        {details && (
          <div className="space-y-3 text-gray-600">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center space-x-2">
                {detail.icon && <detail.icon size={18} />}
                <span>{detail.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;