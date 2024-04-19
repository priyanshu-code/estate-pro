import Search from '@/components/Home/Search'
import Main from "@/components/Home/Main";

async function getHomeProperties() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}public/getHomeProperties`, {
      // Revalidate every 5 mins
      next: { revalidate: 60 * 5 },
    });
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.log(error);
  }
}

export default async function Home() {
  const properties = await getHomeProperties();
  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-4 sm:px-8 md:px-12 lg:px-16 2xl:px-20">
      {/* Search Component */}
      <Search />
      {/* Cards */}
      <Main properties={properties} />

    </main>
  );
}
