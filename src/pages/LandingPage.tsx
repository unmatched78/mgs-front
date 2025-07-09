// // src/pages/LandingPage.tsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import LanguageSelector from "@/components/LanguageSelector";
// import { Menu, X } from "lucide-react"; // hamburger / close icons

// export default function LandingPage() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <nav className="container mx-auto flex items-center justify-between px-4 py-4">
//           {/* Logo */}
//           <div className="text-xl font-bold text-gray-900 sm:text-2xl">
//             Ikiraro Mgs
//           </div>

//           {/* desktop nav */}
//           <div className="hidden sm:flex sm:items-center sm:gap-4">
//             {/* <LanguageSelector /> */}
//             <Link to="/login">
//               <Button variant="outline">Login</Button>
//             </Link>
//             <Link to="/register">
//               <Button className="bg-blue-600 hover:bg-blue-700 text-white">
//                 Register
//               </Button>
//             </Link>
//           </div>

//           {/* mobile menu button */}
//           <button
//             className="sm:hidden p-2 rounded hover:bg-gray-100"
//             onClick={() => setMenuOpen((o) => !o)}
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </nav>

//         {/* mobile nav */}
//         {menuOpen && (
//           <div className="sm:hidden bg-white border-t shadow-sm">
//             <div className="flex flex-col px-4 py-2 space-y-2">
//               {/* <LanguageSelector /> */}
//               <Link to="/login" onClick={() => setMenuOpen(false)}>
//                 <Button variant="outline" className="w-full">
//                   Login
//                 </Button>
//               </Link>
//               <Link to="/register" onClick={() => setMenuOpen(false)}>
//                 <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                   Register
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Hero */}
//       <section className="container mx-auto flex flex-col items-center px-4 py-12 sm:py-16 md:flex-row md:gap-12">
//         <div className="w-full md:w-1/2">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
//             Streamline Your Butcher Business
//           </h1>
//           <p className="mt-4 text-base text-gray-600 sm:text-lg">
//             Ikiraro Mgs connects butcher shops and veterinarians to manage
//             inventory, suppliers, and customers efficiently. Join our platform
//             to simplify operations and ensure quality.
//           </p>
//           <Link to="/register" className="mt-6 inline-block w-full sm:w-auto">
//             <Button className="w-full sm:w-auto bg-blue-600 text-lg hover:bg-blue-700 text-white">
//               Get Started Now
//             </Button>
//           </Link>
//         </div>
//         <div className="mt-8 w-full md:mt-0 md:w-1/2">
//           <img
//             src="https://plus.unsplash.com/premium_photo-1682147959789-5225f5512b70?w=600&auto=format&fit=crop&q=60"
//             alt="Professional butcher shop counter"
//             className="h-48 w-full rounded-lg object-cover shadow-lg sm:h-64 md:h-96"
//           />
//         </div>
//       </section>

//       {/* Features */}
//       <section className="bg-white py-12 sm:py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
//             Why Choose Ikiraro Mgs?
//           </h2>
//           <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
//             <Card>
//               <CardContent className="p-4 sm:p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
//                   For Butcher Shops
//                 </h3>
//                 <p className="mt-2 text-gray-600">
//                   Manage inventory, coordinate with suppliers, and register
//                   customers seamlessly. Our platform helps you focus on
//                   delivering quality meat.
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 sm:p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
//                   For Veterinarians
//                 </h3>
//                 <p className="mt-2 text-gray-600">
//                   Certify meat quality and streamline communication with butcher
//                   shops. Ensure compliance and build trust with our tools.
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="p-4 sm:p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
//                   Secure & Reliable
//                 </h3>
//                 <p className="mt-2 text-gray-600">
//                   Your data is protected with secure authentication and
//                   reliable cloud infrastructure, trusted by professionals across
//                   the industry.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Testimonial */}
//       <section className="bg-gray-100 py-12 sm:py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
//             What Our Users Say
//           </h2>
//           <p className="mt-4 max-w-xl mx-auto text-base text-gray-600 italic sm:text-lg">
//             "Ikiraro Mgs transformed how I manage my shop. Registering
//             suppliers and customers is so easy, and the platform saves me
//             hours every week!"
//           </p>
//           <p className="mt-2 font-semibold text-gray-900">
//             — Mutabazi D., Butcher Shop Owner
//           </p>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-blue-600 py-12 sm:py-16">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-2xl font-bold text-white sm:text-3xl">
//             Ready to Transform Your Business?
//           </h2>
//           <p className="mt-4 text-base text-blue-100 sm:text-lg">
//             Join Ikiraro Mgs today and take control of your butcher shop or
//             veterinary practice.
//           </p>
//           <Link to="/register" className="mt-6 inline-block w-full sm:w-auto">
//             <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-lg">
//               Sign Up Now
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 py-6">
//         <div className="container mx-auto px-4 text-center">
//           <p className="text-sm text-gray-400">
//             By signing up, you agree to our{" "}
//             <a href="#" className="underline hover:text-gray-200">
//               Terms of Service
//             </a>{" "}
//             and{" "}
//             <a href="#" className="underline hover:text-gray-200">
//               Privacy Policy
//             </a>
//             .
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LanguageSelector from "@/components/LanguageSelector";
import { Menu, X } from "lucide-react"; // hamburger / close icons

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="text-xl font-bold text-gray-900 sm:text-2xl">
            Ikiraro Mgs
          </div>

          {/* desktop nav */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {/* <LanguageSelector /> */}
            <Link to="/login">
              <Button variant="outline">Injira</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Iyandikishe
              </Button>
            </Link>
          </div>

          {/* mobile menu button */}
          <button
            className="sm:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* mobile nav */}
        {menuOpen && (
          <div className="sm:hidden bg-white border-t shadow-sm">
            <div className="flex flex-col px-4 py-2 space-y-2">
              {/* <LanguageSelector /> */}
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Injira
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Iyandikishe
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="container mx-auto flex flex-col items-center px-4 py-12 sm:py-16 md:flex-row md:gap-12">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Korohereza imikorere y'ubucuruzi bwawe bw'inyama
          </h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Ikiraro Mgs ihuza amaduka y'inyama n'abaveterineri mu kugenzura ibikenewe, abatanga ibikoresho, n'abakiriya mu buryo bworoshye. Injira kuri porogaramu yacu kugira ngo woroshye imikorere kandi wemeze ubuziranenge.
          </p>
          <Link to="/register" className="mt-6 inline-block w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-blue-600 text-lg hover:bg-blue-700 text-white">
              Tangira Ubu
            </Button>
          </Link>
        </div>
        <div className="mt-8 w-full md:mt-0 md:w-1/2">
          <img
            src="https://plus.unsplash.com/premium_photo-1682147959789-5225f5512b70?w=600&auto=format&fit=crop&q=60"
            alt="Professional butcher shop counter"
            className="h-48 w-full rounded-lg object-cover shadow-lg sm:h-64 md:h-96"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Kuki wahitamo Ikiraro Mgs?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Ku maduka y'inyama
                </h3>
                <p className="mt-2 text-gray-600">
                  Cunga ibikoresho, uhuze n'abatanga ibikoresho, kandi wandike abakiriya nta nkomyi. Porogaramu yacu igufasha kwibanda ku gutanga inyama z'ubuziranenge.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Ku baveterineri
                </h3>
                <p className="mt-2 text-gray-600">
                  Emeza ubuziranenge bw'inyama kandi woroshe itumanaho n'amaduka y'inyama. Wemeze ko uhuje n'amategeko kandi wubake icyizere ukoresheje ibikoresho byacu.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Byizewe kandi bifite umutekano
                </h3>
                <p className="mt-2 text-gray-600">
                  Amakuru yawe arinzwe hifashishijwe uburyo bukomeye bwo kwinjira no ku bw'inzego zizewe za cloud, byizewe n'inzobere mu rwego rw'umwuga.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-gray-100 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Iby'abakoresha bacu bavuga
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-gray-600 italic sm:text-lg">
            "Ikiraro Mgs yahinduye uburyo ncunga iduka ryanjye. Kwiyandikisha kw'abatanga ibikoresho n'abakiriya biroroshye cyane, kandi iyi porogaramu inyongera amasaha buri cyumweru!"
          </p>
          <p className="mt-2 font-semibold text-gray-900">
            — Mutabazi D., Nyiri iduka ry'inyama
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Witeguye guhindura ubucuruzi bwawe?
          </h2>
          <p className="mt-4 text-base text-blue-100 sm:text-lg">
            Injira muri Ikiraro Mgs uyu munsi kandi ufate ubuyobozi bw'iduka ryawe ry'inyama cyangwa ibikorwa bya veterineri.
          </p>
          <Link to="/register" className="mt-6 inline-block w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-lg">
              Iyandikishe Ubu
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Mu kwiyandikisha, wemera
            <a href="#" className="underline hover:text-gray-200">
              Amabwiriza y'Ibikorerwa Serivisi
            </a>
            na
            <a href="#" className="underline hover:text-gray-200">
              Politiki y'Ubuzima bw'Ibanga
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
