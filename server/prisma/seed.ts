import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@moviebooking.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@moviebooking.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@moviebooking.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@moviebooking.com",
      passwordHash,
      role: "USER",
    },
  });

  const theater = await prisma.theater.upsert({
    where: { id: "seed-theater-1" },
    update: {},
    create: {
      id: "seed-theater-1",
      name: "Grand Cinema",
      location: "Downtown",
      totalSeats: 50,
    },
  });

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 10;

  for (const row of rows) {
    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
      await prisma.seat.upsert({
        where: {
          theaterId_row_seatNumber: {
            theaterId: theater.id,
            row,
            seatNumber,
          },
        },
        update: {},
        create: {
          theaterId: theater.id,
          row,
          seatNumber,
        },
      });
    }
  }

  const movieData = [
    {
      id: "seed-movie-1",
      title: "Spider-Man: No Way Home",
      description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help.",
      durationMinutes: 148,
      genre: "Action/Superhero",
      posterUrl: "/posters/spider_man.png",
      releaseDate: new Date("2021-12-17"),
    },
    {
      id: "seed-movie-2",
      title: "Avengers: Endgame",
      description: "After the devastating events of Infinity War, the Avengers assemble once more.",
      durationMinutes: 181,
      genre: "Action/Superhero",
      posterUrl: "/posters/avengers.png",
      releaseDate: new Date("2019-04-26"),
    },
    {
      id: "seed-movie-3",
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
      durationMinutes: 148,
      genre: "Sci-Fi/Action",
      posterUrl: "https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzZ4220zILwO01PO.jpg",
      releaseDate: new Date("2010-07-16"),
    },
    {
      id: "seed-movie-4",
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      durationMinutes: 152,
      genre: "Action/Crime",
      posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      releaseDate: new Date("2008-07-18"),
    },
    {
      id: "seed-movie-5",
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      durationMinutes: 169,
      genre: "Sci-Fi/Adventure",
      posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QlsUUHXjNpeEYZnW01Id221.jpg",
      releaseDate: new Date("2014-11-07"),
    },
    {
      id: "seed-movie-6",
      title: "The Matrix",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      durationMinutes: 136,
      genre: "Sci-Fi/Action",
      posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      releaseDate: new Date("1999-03-31"),
    },
    {
      id: "seed-movie-7",
      title: "Avatar",
      description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.",
      durationMinutes: 162,
      genre: "Sci-Fi/Adventure",
      posterUrl: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      releaseDate: new Date("2009-12-18"),
    },
    {
      id: "seed-movie-8",
      title: "Titanic",
      description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
      durationMinutes: 194,
      genre: "Romance/Drama",
      posterUrl: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      releaseDate: new Date("1997-12-19"),
    },
    {
      id: "seed-movie-9",
      title: "Jurassic Park",
      description: "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids.",
      durationMinutes: 127,
      genre: "Adventure/Sci-Fi",
      posterUrl: "https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VRcg1xMfjJM.jpg",
      releaseDate: new Date("1993-06-11"),
    },
    {
      id: "seed-movie-10",
      title: "The Lion King",
      description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
      durationMinutes: 89,
      genre: "Animation/Family",
      posterUrl: "https://image.tmdb.org/t/p/w500/sKCr78AS8oXOqKj74M4cpcO1TAD.jpg",
      releaseDate: new Date("1994-06-24"),
    }
  ];

  const movies = [];
  for (const m of movieData) {
    const movie = await prisma.movie.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
    movies.push(movie);
  }
  
  // Generate showtimes for 7 days (1 week)
  let showtimeCounter = 1;
  const today = new Date();
  today.setHours(0,0,0,0);

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + dayOffset);
    
    for (let i = 0; i < movies.length; i++) {
      const m = movies[i];
      // 2 showtimes per movie per day (Afternoon and Evening)
      const times = [14, 19]; // 2 PM and 7 PM
      
      for (const hour of times) {
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0); 
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + m.durationMinutes);

        await prisma.showtime.upsert({
          where: { id: `seed-showtime-${showtimeCounter}` },
          update: {
            movieId: m.id,
            theaterId: theater.id,
            startTime,
            endTime,
            price: hour === 14 ? 150 : 250, // Matinee is cheaper
          },
          create: {
            id: `seed-showtime-${showtimeCounter}`,
            movieId: m.id,
            theaterId: theater.id,
            startTime,
            endTime,
            price: hour === 14 ? 150 : 250, 
          },
        });
        showtimeCounter++;
      }
    }
  }

  console.log("Seed completed:");
  console.log(`  Admin: ${admin.email} / password123`);
  console.log(`  User:  ${user.email} / password123`);
  console.log(`  Movies Seeded: ${movies.length}`);
  console.log(`  Showtimes Seeded: ${showtimeCounter - 1}`);
  console.log(`  Theater: ${theater.name} (${theater.totalSeats} seats)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
