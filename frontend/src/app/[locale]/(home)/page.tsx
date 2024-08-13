import Hero from "@/components/landing/Hero";
import PlacesList from "@/components/landing/places/Places";
import Sponsors from "@/components/landing/Sponsor";

export default function LandingPage() {
	return (
		<>
			<Hero />
			<Sponsors />
			<PlacesList />
		</>
	);
}
