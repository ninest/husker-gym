import { prisma } from "@/db/prisma";

export default async function HomePage() {
  const gyms = await prisma.gym.findMany();

  return (
    <main>
      <h1>Husker Gyms</h1>

      <div>The gyms are:</div>

      <div>
        {gyms.map((gym) => (
          <div>{gym.name}</div>
        ))}
      </div>
    </main>
  );
}
