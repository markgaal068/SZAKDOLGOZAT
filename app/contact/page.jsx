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
        description: "egyesület telefonszáma",
    },
    {
        icon: <FaEnvelope />,
        title: "Email",
        description: "acs.sportcsarnok@gmail.com",
    },
    {
        icon: <FaMapMarkerAlt />,
        title: "Cím",
        description: "cím",
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
            alert(response.data); //success
        } catch (error) {
            console.error("Error details:", error);
            alert("Error sending email: " + error.message); // Show error message
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
            className="flex items-center justify-center min-h-screen py-6 overflow-hidden" // Add overflow-hidden here
        >
            <div className="container mx-auto">
                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Form Section */}
                    <div className="xl:w-1/2 items-center">
                        <form
                            className="flex flex-col gap-6 p-10 rounded-xl shadow-md border border-accent bg-sndbg/10"
                            onSubmit={handleSubmit}
                        >
                            <h3 className="text-3xl font-semibold text-accent">
                                Lépjen velünk kapcsolatba!
                            </h3>
                            <p className="text-gray-300">
                                Ácsi Kinizsi SC. sportegyesület
                            </p>
                            {/* Input Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-accent">
                                <Input
                                    type="text"
                                    name="firstname"
                                    placeholder="Keresztnév"
                                    className="bg-sndbg border-none"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="lastname"
                                    placeholder="Vezetéknév"
                                    className="bg-sndbg border-none"
                                    required
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail cím"
                                    className="bg-sndbg border-none"
                                    required
                                />
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="Telefonszám"
                                    className="bg-sndbg border-none"
                                    required
                                />
                            </div>
                            {/* Message Textarea */}
                            <Textarea
                                className="h-40 bg-sndbg text-accent border-none"
                                name="message"
                                placeholder="Ide írja az üzenetet.."
                                required
                            />
                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="md"
                                className="max-w-xs"
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
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center justify-center w-16 h-16 bg-sndbg/10 border border-accent text-accent rounded-md">
                                        <div className="text-3xl">{item.icon}</div>
                                    </div>
                                    <div>
                                        <p className="text-gray-300">
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
