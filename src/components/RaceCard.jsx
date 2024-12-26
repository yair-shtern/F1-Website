import React from "react";
import { Calendar, MapPin, Clock, Link } from "lucide-react";
import Card from "./Card";

const RaceCard = ({ race, index, onSelect }) => {
  const formatDate = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    }).format(date);
  };

  const details = [
    {
      icon: MapPin,
      text: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
    },
    {
      icon: Calendar,
      text: formatDate(race.date, race.time),
    },
    {
      icon: Clock,
      text: `Race Start: ${race.time.slice(0, 5)}`,
    },
    {
      icon: Link,
      text: (
        <a
          href={race.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Circuit Page
        </a>
      ),
    },
  ];

  return (
    <Card
      imageSrc={race.circuitImage}
      imageAlt={race.raceName}
      badgeContent={<div className="bg-white/90 backdrop-blur-sm rounded-full top-4 left-4 px-3 py-1">Round {index + 1}</div>}
      title={race.raceName}
      details={details}
      onCardClick={onSelect}
    />
  );
};

export default RaceCard;
