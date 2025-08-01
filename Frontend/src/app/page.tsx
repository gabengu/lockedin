import NavBar from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
         <NavBar />
         <div className="flex flex-col items-center justify-center h-screen text-white">
          <div className="bg-gradient-to-r from-white/50 h-1/2 w-1/2 rounded-2xl border-1">

          </div>
         </div>
    </div>
  );
}
