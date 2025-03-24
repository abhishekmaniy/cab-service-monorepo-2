import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Uber Clone
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/rider">
                <Button variant="ghost">Rider</Button>
              </Link>
            </li>
            <li>
              <Link href="/driver">
                <Button variant="ghost">Driver</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

