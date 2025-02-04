"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const info = [
    {
        icon: <FaPhoneAlt />,
        title: "Telefon",
        description: "+36 20 340 0898",
    },
    {
        icon: <FaEnvelope />,
        title: "Email",
        description: "acs.sportcsarnok@gmail.com",
    },
    {
        icon: <FaMapMarkerAlt />,
        title: "Cím",
        description: "2941 Ács, Gyár utca 81.",
    },
];

const Contact = () => {
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            firstname: formData.get("firstname"),
            lastname: formData.get("lastname"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            service: formData.get("service"),
            message: formData.get("message"),
        };

        const sendButton = event.target.querySelector('button[type="submit"]');
        sendButton.disabled = true;
        sendButton.textContent = "Folyamatban..";

        try {
            const response = await axios.post(
                "",
                data
            );
            alert(response.data); 
        } catch (error) {
            console.error("Error details:", error);
            alert("Error sending email: " + error.message); 
        } finally {
            sendButton.disabled = false;
            sendButton.textContent = "Küldés!";
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: { delay: 0.2, duration: 0.4, ease: "easeIn" },
            }}
            className="flex items-center justify-center min-h-screen py-6 overflow-hidden bg-gradient-to-r from-accent/50 to-sndbg/10"
        >
            <div className="container mx-auto">
                <div className="flex flex-col xl:flex-row gap-10 xl:gap-20">
                    {/* Form Section */}
                    <div className="xl:w-1/2 items-center">
                        <form
                            className="flex flex-col gap-6 p-10 rounded-xl shadow-xl border border-transparent bg-bg backdrop-blur-md hover:shadow-lg transition-shadow"
                            onSubmit={handleSubmit}
                        >
                            <h3 className="text-4xl font-semibold text-accent">
                                Lépjen velünk kapcsolatba!
                            </h3>
                            <p className="text-lg text-gray-300">
                                Ácsi Kinizsi SC sportegyesület
                            </p>
                            {/* Input Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    type="text"
                                    name="firstname"
                                    placeholder="Keresztnév"
                                    className="bg-sndbg text-white border-none focus:ring-2 focus:ring-accent rounded-lg transition-all"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="lastname"
                                    placeholder="Vezetéknév"
                                    className="bg-sndbg text-white border-none focus:ring-2 focus:ring-accent rounded-lg transition-all"
                                    required
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail cím"
                                    className="bg-sndbg text-white border-none focus:ring-2 focus:ring-accent rounded-lg transition-all"
                                    required
                                />
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Telefonszám"
                                    className="bg-sndbg text-white border-none focus:ring-2 focus:ring-accent rounded-lg transition-all"
                                    required
                                />
                            </div>
                            {/* Message Textarea */}
                            <Textarea
                                className="h-40 bg-sndbg text-white border-none focus:ring-2 focus:ring-accent rounded-lg transition-all"
                                name="message"
                                placeholder="Ide írja az üzenetet.."
                                required
                            />
                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="md"
                                className="h-[40px] bg-accent text-white rounded-md hover:bg-accent/90 transition-all"
                            >
                                Küldés!
                            </Button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 flex items-center xl:justify-end">
                        <ul className="flex flex-col gap-8">
                            {info.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-4 bg-sndbg/60 p-6 rounded-lg shadow-lg hover:bg-sndbg/80 transition-all"
                                >
                                    <div className="flex items-center justify-center w-16 h-16 bg-accent text-white rounded-md">
                                        <div className="text-3xl">{item.icon}</div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">
                                            {item.title}
                                        </p>
                                        <h3 className="text-xl font-semibold text-white">
                                            {item.description}
                                        </h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Contact;
