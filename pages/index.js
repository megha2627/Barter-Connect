import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold">Barter Circle Connect</h1>
        <p className="mt-4">Exchange skills like never before!</p>
        <a
          href="/skills"
          className="mt-4 inline-block bg-blue-500 text-white p-2 rounded"
        >
          Browse Skills
        </a>
      </div>
    </div>
  );
}
