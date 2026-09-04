export const BUSINESS = {
  name: "Raj Laxmi Textiles",
  nameDevanagari: "राज लक्ष्मी टेक्सटाइल्स",
  phone: "+918949508709",
  whatsapp: "918949508709",
  email: "himanshubhagwani95@gmail.com",
  address: {
    street: "Jai Hanuman Plaza, B7",
    city: "Jaipur",
    state: "Rajasthan",
    postalCode: "302029",
    country: "IN",
  },
} as const;

export const telHref = `tel:${BUSINESS.phone}`;
export const mailHref = `mailto:${BUSINESS.email}`;

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${BUSINESS.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatPhone(phone: string = BUSINESS.phone) {
  const match = /^\+(\d{2})(\d{5})(\d{5})$/.exec(phone);
  return match ? `+${match[1]} ${match[2]} ${match[3]}` : phone;
}

export const addressLines = [
  BUSINESS.address.street,
  `${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.postalCode}`,
];
