import { contactsDocument } from "./documents/contacts";
import { cookiePolicy } from "./documents/cookie-policy";
import { offer } from "./documents/offer";
import { privacyPolicy } from "./documents/privacy-policy";
import { refundPolicy } from "./documents/refund-policy";
import { serviceTerms } from "./documents/service-terms";
import { termsOfUse } from "./documents/terms-of-use";

export type { LegalDocument } from "./types";

export {
  contactsDocument,
  cookiePolicy,
  offer,
  privacyPolicy,
  refundPolicy,
  serviceTerms,
  termsOfUse,
};

export const LEGAL_DOCUMENTS = [
  offer,
  serviceTerms,
  refundPolicy,
  privacyPolicy,
  cookiePolicy,
  termsOfUse,
  contactsDocument,
] as const;
