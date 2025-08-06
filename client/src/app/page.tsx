import NavBar from "../components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_40%_50%,_#22c55e_0%,_#22c55e_20%,_#000_40%,_#000_100%)]]">
      <NavBar/>
         <div className="flex flex-col items-center justify-center h-screen text-white">
            <div className="bg-white opacity-20 h-1/2 w-3/4 rounded-2xl border-1"></div>
         </div>

    </div>
  );
}