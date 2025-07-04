// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
    return (
        <div className="flex min-h-svh flex-col bg-gray-50">
            {/* Header with Navigation */}
            <header className="bg-white shadow-sm">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6">
                    <div className="text-2xl font-bold text-gray-900">Ikiraro Mgs</div>
                    <div className="flex gap-4">
                        <Link to="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-blue-600 hover:bg-blue-700">Register</Button>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-16 md:flex-row md:gap-12">
                <div className="md:w-1/2">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Streamline Your Butcher Business
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Ikiraro Mgs connects butcher shops and veterinarians to manage inventory, suppliers, and customers efficiently. Join our platform to simplify operations and ensure quality.
                    </p>
                    <Link to="/register" className="mt-6 inline-block">
                        <Button className="bg-blue-600 text-lg hover:bg-blue-700">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
                <div className="mt-8 md:mt-0 md:w-1/2">
                    <img
                        src="https://plus.unsplash.com/premium_photo-1682147959789-5225f5512b70?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnV0Y2hlcnxlbnwwfHwwfHx8MA%3D%3D"
                        alt="Professional butcher shop counter"
                        className="h-64 w-full rounded-lg object-cover shadow-lg md:h-96"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Why Choose Ikiraro Mgs?
                    </h2>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    For Butcher Shops
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Manage inventory, coordinate with suppliers, and register customers seamlessly. Our platform helps you focus on delivering quality meat.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    For Veterinarians
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Certify meat quality and streamline communication with butcher shops. Ensure compliance and build trust with our tools.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Secure & Reliable
                                </h3>
                                <p className="mt-2 text-gray-600">
                                    Your data is protected with secure authentication and reliable cloud infrastructure, trusted by professionals across the industry.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="bg-gray-100 py-16">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        What Our Users Say
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 italic">
                        "Ikiraro Mgs transformed how I manage my shop. Registering suppliers and customers is so easy, and the platform saves me hours every week!"
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                        — Mutabazi D., Butcher Shop Owner
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-16">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="mt-4 text-lg text-blue-100">
                        Join Ikiraro Mgs today and take control of your butcher shop or veterinary practice.
                    </p>
                    <Link to="/register" className="mt-6 inline-block">
                        <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg">
                            Sign Up Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 py-6">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-sm text-gray-400">
                        By signing up, you agree to our{" "}
                        <a href="#" className="underline hover:text-gray-200">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-gray-200">
                            Privacy Policy
                        </a>.
                    </p>
                </div>
            </footer>
        </div>
    );
}