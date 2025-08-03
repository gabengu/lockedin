"use client"
import { useRouter } from "next/navigation"

export default function NavBar() {

    const router = useRouter()
    
    return(
        <nav className="bg-gray-200 text-black py-8 fixed top-0 left-0 w-full">
            <div className="container mx-auto flex items-center justify-between" >
                <div className="bg-gray-600 text-white py-6 px-10 rounded">LOGO</div>
                <ul className="absolute left-1/2  -translate-x-1/2  flex space-x-40 text-lg">
                    <li className="cursor-pointer hover:underline" onClick={() => router.push('/draft')}>DRAFT TOOL</li>
                    <li className="cursor-pointer hover:underline" onClick={() => router.push('/')}>ABOUT</li>
                    <li className="cursor-pointer hover:underline" onClick={() => router.push('/')}>JOIN</li>
                </ul>
            </div>
        </nav>
    );
}

