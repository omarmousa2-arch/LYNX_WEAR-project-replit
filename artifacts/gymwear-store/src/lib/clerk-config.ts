import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { arSA } from "@clerk/localizations";

export const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
export const storePath = basePath ? `${basePath}/` : "/";
export const signInPath = `${basePath}/sign-in`;
export const signUpPath = `${basePath}/sign-up`;

export const clerkPublishableKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

export function toWouterPath(path: string): string {
  const url = new URL(path, window.location.origin);
  const pathname =
    basePath && url.pathname.startsWith(basePath)
      ? url.pathname.slice(basePath.length) || "/"
      : url.pathname;
  return `${pathname}${url.search}${url.hash}`;
}

export const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoImageUrl: `${basePath}/logo.svg`,
    logoLinkUrl: storePath,
  },
  variables: {
    colorPrimary: "#bd5638",
    colorBackground: "#f8f5ed",
    colorForeground: "#29241f",
    colorInputBackground: "#ffffff",
    colorInputForeground: "#29241f",
    colorNeutral: "#6e675b",
    colorDanger: "#a82e2e",
    borderRadius: "0",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "!bg-transparent !shadow-none !border-0 !rounded-none p-0",
    headerTitle: "!text-[#29241f]",
    headerSubtitle: "!text-[#6e675b]",
    formFieldLabel: "!text-[#29241f]",
    formFieldInput: "!bg-white !text-[#29241f] !border-[#cfc7b9]",
    formButtonPrimary: "!bg-[#bd5638] !text-white hover:!bg-[#a94028]",
    socialButtonsBlockButtonText: "!text-[#29241f]",
    footerActionText: "!text-[#6e675b]",
    footerActionLink: "!text-[#a94028]",
    dividerText: "!text-[#6e675b]",
  },
};

export const clerkLocalization = {
  ...arSA,
  formFieldInputPlaceholder__emailAddress: "اكتب بريدك الإلكتروني",
  signIn: {
    ...arSA.signIn,
    start: {
      ...(arSA.signIn?.start ?? {}),
      title: "أهلاً بعودتك",
      subtitle: "سجّل الدخول لمتابعة Lynx Wear",
    },
  },
  signUp: {
    ...arSA.signUp,
    start: {
      ...(arSA.signUp?.start ?? {}),
      title: "أنشئ حسابك",
      subtitle: "سجّل بالبريد الإلكتروني أو باستخدام طريقة الدخول المتاحة",
    },
  },
};
