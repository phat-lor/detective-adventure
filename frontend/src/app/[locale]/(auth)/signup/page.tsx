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
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { signUp } from "./server";

function SignupPage() {
	const router = useRouter();
	const t = useTranslations("signup");
	const _t = useTranslations();

	const [formData, setFormData] = useState({
		username: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
	});

	const [processing, setProcessing] = useState(false);

	const validateForm = (ignoreEmpty: boolean) => {
		const { username, phoneNumber, password, confirmPassword } = formData;

		const isInvalidName =
			(username.length < 3 || username.length >= 128) &&
			!(ignoreEmpty && username === "");
		const isInvalidPhoneNumber =
			(!validatePhoneNumber(phoneNumber) || phoneNumber.length >= 254) &&
			!(ignoreEmpty && phoneNumber === "");
		const isInvalidPassword =
			(password.length < 8 || password.length >= 128) &&
			!(ignoreEmpty && password === "");
		const isInvalidConfirmPassword = password !== confirmPassword;

		return {
			isInvalidName,
			isInvalidPhoneNumber,
			isInvalidPassword,
			isInvalidConfirmPassword,
		};
	};

	const isInvalidPhoneNumber = useMemo(() => {
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
		// const validationErrors = validateForm(false);
		// if (Object.values(validationErrors).some((error) => error)) {
		// 	setProcessing(false);
		// 	return toast.error(
		// 		t("form.error").replace("%error%", t("form.fieldError"))
		// 	);
		// }

		const { username, phoneNumber, password } = formData;

		try {
			const req = signUp({ username, phoneNumber, password });
			const res = await req;
			if (res.ok) {
				toast.success(t("form.success"));
				router.push("/signin");
			} else {
				toast.error(t("form.error").replace("%error%", res.error));
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
			classNames={{ base: "bg-transparent border border-default shadow-2xl" }}
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
							label={t("form.name.label")}
							placeholder={t("form.name.placeholder")}
							variant="underlined"
							isInvalid={validateForm(true).isInvalidName}
							color={validateForm(true).isInvalidName ? "danger" : "default"}
							onChange={(e) => handleInputChange(e, "username")}
							errorMessage={
								validateForm(true).isInvalidName ? t("form.name.error") : ""
							}
							minLength={3}
						/>
						<Input
							label={t("form.phoneNumber.label")}
							placeholder={t("form.phoneNumber.placeholder")}
							variant="underlined"
							isInvalid={isInvalidPhoneNumber}
							color={isInvalidPhoneNumber ? "danger" : "default"}
							onChange={(e) => handleInputChange(e, "phoneNumber")}
							errorMessage={
								isInvalidPhoneNumber ? t("form.phoneNumber.error") : ""
							}
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
						<Input
							label={t("form.confirmPassword.label")}
							placeholder={t("form.confirmPassword.placeholder")}
							type="password"
							variant="underlined"
							onChange={(e) => handleInputChange(e, "confirmPassword")}
							isInvalid={validateForm(true).isInvalidConfirmPassword}
							color={
								validateForm(true).isInvalidConfirmPassword
									? "danger"
									: "default"
							}
							errorMessage={
								validateForm(true).isInvalidConfirmPassword
									? t("form.confirmPassword.error")
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
							{t("signin")}{" "}
							<Link href="/signin" className="text-primary">
								{_t("signin.title")}
							</Link>
						</p>
					</div>
				</CardFooter>
			</form>
		</Card>
	);
}
export default SignupPage;