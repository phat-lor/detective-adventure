"use client";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import { EarthIcon, LanguagesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname as useRawPathname } from "next/navigation";

function LangugeSwitcher() {
	const t = useTranslations("locale");
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [selLang, setSelLang] = useState("en");
	const [currentLang, setCurrentLang] = useState<string>();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const rawPathname = useRawPathname();

	useEffect(() => {
		const locale = rawPathname.split("/")[1];
		if (locale) setCurrentLang(locale);
	}, [rawPathname]);

	const onSelected = (locale: string) => {
		window.location.href = `/${locale}${pathname}?${searchParams.toString()}`;
		// startTransition(() => {
		// 	router.replace(
		// 		// @ts-expect-error -- TypeScript will validate that only known `params`
		// 		// are used in combination with a given `pathname`. Since the two will
		// 		// always match for the current route, we can skip runtime checks.
		// 		{ pathname, params },
		// 		{ locale: locale }
		// 	);
		// });
	};

	return (
		<>
			<Dropdown>
				<DropdownTrigger>
					<Button isIconOnly variant="bordered" className="border-transparent">
						<EarthIcon />
					</Button>
				</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem
						onClick={() => {
							// onSelected("en");
							setSelLang("en");
							onOpen();
						}}
						isDisabled={currentLang === "en"}
					>
						{t("en")}
					</DropdownItem>
					<DropdownItem
						onClick={() => {
							setSelLang("th");
							onOpen();
						}}
						isDisabled={currentLang === "th"}
					>
						{t("th")}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			{/* Change Languge Confirmation */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					<ModalHeader>
						<div className="flex gap-2">
							<LanguagesIcon />
							{t("confirm.title").replace("%%lang%%", t(selLang))}
						</div>
					</ModalHeader>
					<ModalBody>
						{t("confirm.message").replace("%%lang%%", t(selLang))}
					</ModalBody>
					<ModalFooter>
						<Button
							color="default"
							variant="bordered"
							onClick={() => {
								onOpenChange();
							}}
						>
							{t("confirm.cancel")}
						</Button>
						<Button
							color="primary"
							onClick={() => {
								onSelected(selLang);
							}}
						>
							{t("confirm.confirm")}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default LangugeSwitcher;
