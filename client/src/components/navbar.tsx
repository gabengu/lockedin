"use client";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();

    return (
        <nav className="bg-black text-white h-[134px] fixed top-0 left-0 w-full flex items-center">
            <div className="bg-gray-600 text-white h-[75px] w-[160px] rounded flex items-center justify-center ml-10">
                <div className="text-xl font-bold">LOGO</div>
            </div>
            <div className=" text-white text-4xl ml-10">LOCKEDIN</div>
            <ul className="flex gap-34 text-lg font-normal ml-auto mr-10">
                <li
                    className="cursor-pointer hover:underline text-center"
                    onClick={() => router.push("/draft")}
                >
                    DRAFT <br /> TOOL
                </li>
                <li
                    className="cursor-pointer hover:underline"
                    onClick={() => router.push("/")}
                >
                    ABOUT
                </li>
                <li
                    className="cursor-pointer hover:underline"
                    onClick={() => router.push("/")}
                >
                    JOIN
                </li>
            </ul>
        </nav>
    );
}
