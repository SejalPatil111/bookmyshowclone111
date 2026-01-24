export interface Theater {
  id: string;
  name: string;
  location: string;
  amenities: string[];
}

export const theaters: Theater[] = [
  {
    id: "theater-1",
    name: "PVR Cinemas - Phoenix Mall",
    location: "Phoenix MarketCity, Kurla West",
    amenities: ["IMAX", "Dolby Atmos", "Recliner Seats"],
  },
  {
    id: "theater-2",
    name: "INOX - R-City Mall",
    location: "R-City Mall, Ghatkopar West",
    amenities: ["4DX", "Dolby 7.1", "Premium Lounge"],
  },
  {
    id: "theater-3",
    name: "Cinépolis - Viviana Mall",
    location: "Viviana Mall, Thane West",
    amenities: ["MX4D", "Dolby Atmos", "VIP Seats"],
  },
  {
    id: "theater-4",
    name: "PVR ICON - Oberoi Mall",
    location: "Oberoi Mall, Goregaon East",
    amenities: ["IMAX", "Director's Cut", "Luxury Recliners"],
  },
];

export interface TheaterShowtime {
  theaterId: string;
  times: { time: string; format: string; available: boolean }[];
}

// Function to generate showtimes for a movie at all theaters
export const getTheaterShowtimes = (movieShowTimes: string[] | null): TheaterShowtime[] => {
  const defaultTimes = movieShowTimes || ["10:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"];
  const formats = ["2D", "3D", "IMAX", "4DX"];
  
  return theaters.map((theater, index) => ({
    theaterId: theater.id,
    times: defaultTimes.map((time, timeIndex) => ({
      time,
      format: formats[(index + timeIndex) % formats.length],
      available: Math.random() > 0.2, // 80% availability
    })),
  }));
};
