import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Github, Twitter } from "lucide-react";
import LangugeSwitcher from "../locale/LangSwitcher";
import { useTranslations } from "next-intl";
export default function Footer() {
	const t = useTranslations("landing");
	return (
		<footer className="pt-24">
			<Divider />
			<div className="max-w-screen-xl mx-auto px-4 md:px-8">
				<div className="flex justify-between items-center py-10">
					<p className="text-sm font-light">{t("madeWith")}</p>
					<LangugeSwitcher />
				</div>
			</div>
		</footer>
	);
}
