import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import PlacesList from "@/components/landing/places/Places";
import Sponsors from "@/components/landing/Sponsor";
import { Divider } from "@nextui-org/react";

export default function LandingPage() {
	return (
		<>
			<Hero />
			<Sponsors />
			<PlacesList />
			<Footer />
		</>
	);
}
