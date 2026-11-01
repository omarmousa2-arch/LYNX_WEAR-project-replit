import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Redirect } from "wouter";
import { SignIn, SignUp, useClerk, useUser } from "@clerk/react";
import { ArrowLeft, CircleUserRound, LogOut, Save } from "lucide-react";
import lynxLogo from "../../../../attached_assets/generated_images/lynx-logo-white.png";
import {
  signInPath,
  signUpPath,
  storePath,
} from "@/lib/clerk-config";

function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-page arabic" dir="rtl">
      <header className="auth-header page-shell">
        <a className="brand-lockup auth-brand" href={storePath} aria-label="العودة لمتجر Lynx Wear">
          <img className="brand-logo" src={lynxLogo} alt="" />
          <span className="brand-copy">
            <span dir="ltr">Lynx<span style={{ color: "var(--clay)" }}> Wear</span></span>
            <small>ملابس رياضية</small>
          </span>
        </a>
        <a href={storePath} className="button-outline auth-back">
          <ArrowLeft size={15} />
          العودة للمتجر
        </a>
      </header>
      <section className="auth-content page-shell">
        <div className="auth-intro">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="auth-form-card">{children}</div>
        <p className="auth-phone-note">
          رقم الهاتف للتواصل فقط بعد تسجيل الدخول، ومش وسيلة للدخول إلى الحساب.
        </p>
      </section>
    </main>
  );
}

export function SignInPage() {
  return (
    <AuthShell
      eyebrow="حساب Lynx Wear"
      title="أهلاً بعودتك."
      description="سجّل بالبريد الإلكتروني أو استخدم طريقة الدخول المتاحة."
    >
      <SignIn
        routing="path"
        path={signInPath}
        signUpUrl={signUpPath}
      />
    </AuthShell>
  );
}

export function SignUpPage() {
  return (
    <AuthShell
      eyebrow="ابدأ من هنا"
      title="حسابك، على مزاجك."
      description="أنشئ حسابك بالبريد الإلكتروني أو استخدم طريقة الدخول المتاحة."
    >
      <SignUp
        routing="path"
        path={signUpPath}
        signInUrl={signInPath}
      />
    </AuthShell>
  );
}

export function AccountPage() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedPhone = user?.unsafeMetadata.contactPhone;
    setPhone(typeof savedPhone === "string" ? savedPhone : "");
  }, [user?.id, user?.unsafeMetadata.contactPhone]);

  if (!isLoaded) {
    return (
      <AuthShell
        eyebrow="حساب Lynx Wear"
        title="لحظة واحدة."
        description="بنحمّل بيانات حسابك."
      >
        <div className="auth-loading" role="status">جاري التحميل...</div>
      </AuthShell>
    );
  }

  if (!user) return <Redirect to="/sign-in" />;

  const saveContactPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          contactPhone: phone.trim(),
        },
      });
      setStatus("تم حفظ رقم التواصل في حسابك.");
    } catch {
      setStatus("ماقدرناش نحفظ الرقم دلوقتي. جرّب مرة تانية.");
    } finally {
      setSaving(false);
    }
  };

  const email = user.primaryEmailAddress?.emailAddress;

  return (
    <AuthShell
      eyebrow="حساب Lynx Wear"
      title="أهلاً بيك."
      description="بيانات حسابك ورقم التواصل محفوظين بشكل منفصل."
    >
      <div className="account-card">
        <div className="account-user">
          <span className="account-avatar" aria-hidden="true"><CircleUserRound size={22} /></span>
          <div>
            <b>{user.fullName || email || "عضو Lynx Wear"}</b>
            {email && <span dir="ltr">{email}</span>}
          </div>
        </div>
        <form className="contact-form" onSubmit={saveContactPhone}>
          <label htmlFor="contact-phone">رقم الهاتف للتواصل</label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            maxLength={24}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+20 10 0000 0000"
          />
          <small>اختياري. لا يُستخدم لتسجيل الدخول أو للتحقق برسالة نصية.</small>
          <button className="button-primary" type="submit" disabled={saving}>
            <Save size={15} />
            {saving ? "جاري الحفظ..." : "احفظ رقم التواصل"}
          </button>
          {status && <p className="account-status" role="status">{status}</p>}
        </form>
        <button
          className="button-outline account-signout"
          type="button"
          onClick={() => void signOut({ redirectUrl: storePath })}
        >
          تسجيل الخروج
          <LogOut size={15} />
        </button>
      </div>
    </AuthShell>
  );
}
