import React, { useState, useRef } from "react";
import {Link} from 'react-router-dom';
import emailjs from '@emailjs/browser';
const Contact = () => {
    const form = useRef();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        from_name: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);

        emailjs.sendForm('service_8xvhvfp', 'template_0dwb1rt', form.current, {
            publicKey: 'pd6Vf-cETl7l6sCpU',
        })
            .then(
                () => {
                    console.log('SUCCESS!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };

    return (
        <div class="mx-auto my-16 relative isolate w-[90%] bg-white">
            <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                <div class="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-32">
                    <div class="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                        <div
                            class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
                            <svg
                                class="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                                aria-hidden="true">
                                <defs>
                                    <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="100%" y="-1"
                                        patternUnits="userSpaceOnUse">
                                        <path d="M130 200V.5M.5 .5H200" fill="none"></path>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" stroke-width="0" fill="white"></rect><svg x="100%" y="-1"
                                    class="overflow-visible fill-gray-50">
                                    <path d="M-470.5 0h201v201h-201Z" stroke-width="0"></path>
                                </svg>
                                <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"></rect>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold tracking-tight text-gray-900">Contact Us</h2>
                        <p class="mt-6 text-lg leading-8 text-gray-600">Feel free to reach out to us for any inquiries or assistance.
                            We're here to help!</p>
                        <dl class="mt-10 space-y-4 text-base leading-7 text-gray-600">
                            <div class="flex gap-x-4">
                                <dt class="flex-none">
                                    <span class="sr-only">Email</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" aria-hidden="true" class="h-7 w-6 text-gray-400">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75">
                                        </path>
                                    </svg>
                                </dt>
                                <dd><Link class="hover:text-gray-900" to="mailto:prideagrosolutions@gmail.com">prideagrosolutions@gmail.com</Link></dd>
                            </div>
                            <div class="flex gap-x-4">
                                <dt class="flex-none">
                                    <span class="sr-only">Address</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" aria-hidden="true" class="h-7 w-6 text-gray-400">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z">
                                        </path>
                                    </svg>
                                </dt>
                                <dd className="text-left">B-804, Bhalchandra Prospera, Ravet, Pimpari-Chinchawad Dist - Pune Maharastra, india - 412101</dd>
                            </div>
                        </dl>
                        <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7560.172250515017!2d73.73992767412292!3d18.660130810906374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b1edd658d297%3A0x7bd566c0357b8443!2sBHALCHANDRA%20PROSPERA%2CNB%20Bhondve%20Promotors!5e0!3m2!1sen!2sin!4v1737898529596!5m2!1sen!2sin" width="550"
                        height="350" 
                        className="my-10 order-none"
                        allowfullscreen=""
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade" />
                    </div>
                </div>







                <form ref={form} onSubmit={handleSubmit} class="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-32">
                    <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                        <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label for="first-name" class="block text-sm font-semibold leading-6 text-gray-900">First name</label>
                                <div class="mt-2.5">
                                    <input
                                        type="text"
                                        id="first-name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900   ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label for="last-name" class="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                                <div class="mt-2.5">
                                    <input
                                        type="text"
                                        id="last-name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900   ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                                <div class="mt-2.5">
                                    <input
                                        type="email"
                                        id="email"
                                        name="from_name"
                                        value={formData.from_name}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900   ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                                <div class="mt-2.5">
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900   ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="mt-8 flex justify-end">
                            <button type="submit" class="w-max  rounded-2xl border-2 border-[#0057ff] bg-[#0057ff]  px-5 py-1.5 text-sm font-semibold text-white transition-colors duration-150 ease-in-out hover:border-blue-400 hover:bg-blue-400">Send message</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default Contact;


// // 18.6593911, 73.85018213900271
// <iframe
//     title="Google Map Location"
//     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086434014419!2d73.85018213900271!3d18.46542420751343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI3JzU1LjUiTiA3M8KwNTEnMDAuMiJF!5e0!3m2!1sen!2sin!4v1600210629374!5m2!1sen!2sin"
//     width="100%"
//     height="400"
//     style={{ border: 0 }}
//     allowFullScreen=""
//     loading="lazy"
// ></iframe>