"use client";
import { Link, useRouter } from "@/lib/navigation";
import { validatePhoneNumber } from "@/lib/utils";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Input,
} from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function SigninPage() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push("/");
		}
	}, [router, session]);
	const t = useTranslations("signin");
	const _t = useTranslations();

	const [formData, setFormData] = useState({
		phoneNumber: "",
		password: "",
	});

	const [processing, setProcessing] = useState(false);

	const validateForm = (ignoreEmpty: boolean) => {
		const { phoneNumber, password } = formData;

		const isInvalidPhoneNumber =
			(!validatePhoneNumber(phoneNumber) || phoneNumber.length >= 254) &&
			!(ignoreEmpty && phoneNumber === "");

		const isInvalidPassword =
			(password.length < 8 || password.length >= 128) &&
			!(ignoreEmpty && password === "");

		return {
			isInvalidPhoneNumber: isInvalidPhoneNumber,
			isInvalidPassword,
		};
	};

	const isInvalid = useMemo(() => {
		const { phoneNumber } = formData;
		if (phoneNumber === "") return false;
		return validatePhoneNumber(phoneNumber) ? false : true;
	}, [formData]);

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement>,
		fieldName: string
	) => {
		setFormData({ ...formData, [fieldName]: e.target.value });
	};

	const handleSubmit = async () => {
		setProcessing(true);
		const validationErrors = validateForm(false);
		if (Object.values(validationErrors).some((error) => error)) {
			setProcessing(false);
			return toast.error(
				t("form.error").replace("%error%", t("form.fieldError"))
			);
		}

		const { phoneNumber, password } = formData;

		try {
			const res = await signIn("credentials", {
				phoneNumber,
				password,
				redirect: false,
			});

			if (res?.ok) {
				toast.success(t("form.success"));
				router.push("/");
			} else {
				toast.error(
					t("form.error").replace("%error%", res?.error || "Unknown")
				);
			}
		} catch (e) {
			if (e instanceof Error) {
				console.error(e);
				toast.error(t("form.error").replace("%error%", e.message));
			}
		}
		setProcessing(false);
	};

	return (
		<Card
			className="p-3"
			// classNames={{ base: "bg-transparent border border-default shadow-2xl" }}
		>
			<form>
				<CardHeader>
					<div className="flex flex-col gap-2">
						<h4 className="text-2xl font-bold">{t("title")}</h4>
						<p className="text-sm">{t("description")}</p>
					</div>
				</CardHeader>
				<CardBody>
					<div className="flex flex-col gap-4">
						<Input
							label={t("form.phoneNumber.label")}
							placeholder={t("form.phoneNumber.placeholder")}
							variant="underlined"
							isInvalid={isInvalid}
							color={isInvalid ? "danger" : "default"}
							onChange={(e) => handleInputChange(e, "phoneNumber")}
							errorMessage={isInvalid ? t("form.phoneNumber.error") : ""}
							minLength={3}
						/>

						<Input
							label={t("form.password.label")}
							placeholder={t("form.password.placeholder")}
							type="password"
							variant="underlined"
							onChange={(e) => handleInputChange(e, "password")}
							isInvalid={validateForm(true).isInvalidPassword}
							color={
								validateForm(true).isInvalidPassword ? "danger" : "default"
							}
							errorMessage={
								validateForm(true).isInvalidPassword
									? t("form.password.error")
									: ""
							}
						/>
					</div>
				</CardBody>
				<CardFooter>
					<div className="flex w-full flex-col gap-2">
						<Button
							color="primary"
							fullWidth
							isLoading={processing}
							// type="submit"
							onClick={handleSubmit}
						>
							{t("form.submit")}
						</Button>
						<p className="text-sm text-left w-full mt-2">
							{t("signup")}{" "}
							<Link href="/signup" className="text-primary">
								{_t("signup.title")}
							</Link>
						</p>
					</div>
				</CardFooter>
			</form>
		</Card>
	);
}
export default SigninPage;