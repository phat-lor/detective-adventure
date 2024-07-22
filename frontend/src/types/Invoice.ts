import { Currencies } from "@/lib/utils";
import { PaymentMethod } from "./PaymentMethod";

interface InvoiceResponse {
	availablePaymentMethods: PaymentMethod;
	invoice: {
		id: string;
		invoiceName: string;
		amount: number;
		currency: Currencies;
	};
}

export type { InvoiceResponse };
