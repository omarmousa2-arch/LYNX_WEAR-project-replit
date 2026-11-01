import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from "react";
import { ClerkProvider, useUser } from "@clerk/react";
import { useCreateShopifyCheckout, useListShopifyProducts } from "@workspace/api-client-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AccountPage, SignInPage, SignUpPage } from "@/pages/auth-pages";
import { toStoreProduct, type StoreProduct } from "@/data/catalog";
import {
  basePath,
  clerkAppearance,
  clerkLocalization,
  clerkPublishableKey,
  signInPath,
  signUpPath,
  storePath,
  toWouterPath,
} from "@/lib/clerk-config";
import { ArrowLeft, ArrowUpLeft, CircleUserRound, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import lynxLogo from "../../../attached_assets/generated_images/lynx-logo-white.png";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";

const queryClient = new QueryClient();
const CART_STORAGE_KEY = "lynx-wear-shopify-cart-v2";

type CartItem = { productId: string; variantId: string; quantity: number; color?: string };

function cartItemKey(item: Pick<CartItem, "variantId" | "color">) {
  return `${item.variantId}::${item.color ?? ""}`;
}

const formatPrice = (value: number, currencyCode: string) =>
  new Intl.NumberFormat(currencyCode === "USD" ? "en-US" : "ar-EG", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(value);

function variantLabel(variant: StoreProduct["variants"][number]) {
  const size = variant.selectedOptions.find((option) => option.name === "Size")?.value;
  if (size) return size;
  return variant.title === "Default Title" ? "مقاس واحد" : variant.title;
}

function Home() {
  const { data: apiProducts, isPending: productsLoading, isError: productsError, refetch } = useListShopifyProducts();
  const products = useMemo(() => (apiProducts ?? []).map(toStoreProduct), [apiProducts]);
  const categories = useMemo(
    () => ["الكل", ...new Set(products.map((product) => product.productType))],
    [products],
  );
  const [category, setCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [colorCycleStep, setColorCycleStep] = useState(0);
  const [colorSelectionStarted, setColorSelectionStarted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed)
        ? parsed.filter((item): item is CartItem =>
            Boolean(item) &&
            typeof item.productId === "string" &&
            typeof item.variantId === "string" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            (item.color === undefined || typeof item.color === "string"),
          )
        : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [email, setEmail] = useState("");
  const checkoutMutation = useCreateShopifyCheckout();

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (
      colorSelectionStarted ||
      !products.some((product) => product.colors.length > 1) ||
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }
    const interval = window.setInterval(() => setColorCycleStep((step) => step + 1), 3200);
    return () => window.clearInterval(interval);
  }, [colorSelectionStarted, products]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cartOpen]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "الكل" || product.productType === category;
    const query = search.trim().toLocaleLowerCase();
    const matchesSearch = !query || `${product.title} ${product.english} ${product.productType}`.toLocaleLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [category, products, search]);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartQuantityByVariant = new Map<string, number>();
  for (const item of cart) {
    cartQuantityByVariant.set(
      item.variantId,
      (cartQuantityByVariant.get(item.variantId) ?? 0) + item.quantity,
    );
  }
  const cartLines = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const variant = product?.variants.find((entry) => entry.id === item.variantId);
    return { item, product, variant };
  });
  const invalidCartLines = cartLines.filter(
    ({ item, product, variant }) =>
      !product ||
      !variant ||
      !variant.availableForSale ||
      variant.quantityAvailable < 1 ||
      (cartQuantityByVariant.get(item.variantId) ?? 0) > variant.quantityAvailable,
  );
  const cartTotal = cartLines.reduce(
    (total, line) => total + (line.variant?.price ?? 0) * line.item.quantity,
    0,
  );

  const addToCart = (
    product: StoreProduct,
    variant: StoreProduct["variants"][number],
    color?: string,
  ) => {
    setColorSelectionStarted(true);
    if (!variant.availableForSale || variant.quantityAvailable < 1) {
      setNotice("المقاس ده مش متاح دلوقتي.");
      return;
    }
    const existingQuantity = cart
      .filter((item) => item.variantId === variant.id)
      .reduce((total, item) => total + item.quantity, 0);
    if (existingQuantity >= variant.quantityAvailable) {
      setNotice("وصلت للكمية المتاحة من المقاس ده.");
      return;
    }
    const nextItem = { productId: product.id, variantId: variant.id, quantity: 1, ...(color ? { color } : {}) };
    setCart((current) => {
      const found = current.find((item) => cartItemKey(item) === cartItemKey(nextItem));
      return found
        ? current.map((item) => cartItemKey(item) === cartItemKey(nextItem) ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, nextItem];
    });
    setNotice(`اتضاف ${product.title}${color ? ` باللون ${color}` : ""} للسلة`);
  };
  const changeQuantity = (key: string, delta: number) => {
    const line = cartLines.find((item) => cartItemKey(item.item) === key);
    const variantQuantity = line
      ? cartQuantityByVariant.get(line.item.variantId) ?? 0
      : 0;
    if (delta > 0 && line?.variant && variantQuantity >= line.variant.quantityAvailable) {
      setNotice("وصلت للكمية المتاحة من المقاس ده.");
      return;
    }
    setCart((current) => current
      .map((item) => cartItemKey(item) === key ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };
  const beginCheckout = async () => {
    setCheckoutError("");
    if (invalidCartLines.length) {
      setCheckoutError("فيه صنف أو مقاس مش متاح. احذفه من السلة قبل إتمام الطلب.");
      return;
    }
    try {
      const result = await checkoutMutation.mutateAsync({
        data: {
          lines: cart.map(({ variantId, quantity, color }) => ({
            variantId,
            quantity,
            ...(color ? { color } : {}),
          })),
        },
      });
      window.location.assign(result.checkoutUrl);
    } catch {
      setCheckoutError("ماقدرناش نبدأ إتمام الطلب. راجع اتصال Shopify وحاول تاني.");
    }
  };

  return (
    <main dir="rtl" className="arabic">
      <div className="topline" data-testid="announcement-bar">معاينة فقط · الأسعار بالدولار · لن يتم خصم مبالغ حقيقية</div>
      <header className="site-header">
        <div className="page-shell nav-inner">
          <a className="brand-lockup" href="#home" aria-label="Lynx Wear، الصفحة الرئيسية" data-testid="link-home">
            <img className="brand-logo" src={lynxLogo} alt="" />
            <span className="brand-copy"><span dir="ltr">Lynx<span style={{ color: 'var(--clay)' }}> Wear</span></span><small>ملابس رياضية</small></span>
          </a>
          <nav className="nav-links" aria-label="القائمة الرئيسية">
            <a href="#shop" data-testid="link-shop">المتجر</a>
            <a href="#story" data-testid="link-story">حكاية لينكس وير</a>
            <a href="#newsletter" data-testid="link-newsletter">خليك في الصورة</a>
          </nav>
          <div className="nav-actions">
            <a href="#shop" className="icon-button" aria-label="ابحث في المنتجات" data-testid="link-search"><Search size={17} /><span>دور على اللي محتاجه</span></a>
            <AccountLink />
            <button className="icon-button" type="button" onClick={() => setCartOpen(true)} aria-label={`افتح السلة، ${cartCount} منتجات`} data-testid="button-open-cart">
              <ShoppingBag size={17} /><span className="cart-word">السلة</span><b dir="ltr">{cartCount}</b>
            </button>
          </div>
        </div>
      </header>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-bg"><img className="hero-logo" src={lynxLogo} alt="شعار Lynx Wear" /></div>
        <div className="hero-content">
          <div className="eyebrow">من القاهرة · للناس اللي بتنزل تتمرن</div>
          <h1 id="hero-title">كل عدة<br /><span>ليها شكل.</span></h1>
          <p>لبس تمرين معمول عشان يواكبك، من أول إحماء لآخر عدة. خامات عملية، قصّات مظبوطة، وثقة من غير دوشة.</p>
          <a href="#shop" className="button-primary" data-testid="link-shop-now">اكتشف المجموعة <ArrowLeft size={16} /></a>
        </div>
      </section>
      <div className="marquee" aria-hidden="true"><div className="marquee-track" dir="ltr">{Array.from({ length: 4 }, (_, index) => <span key={index}>BUILT FOR THE WORK · معمول للتمرين · CAIRO MADE ·</span>)}</div></div>

      <section className="section page-shell" id="shop" aria-labelledby="shop-title">
        <div className="section-heading">
          <div><div className="eyebrow">ملابس ومستلزمات التدريب</div><h2 id="shop-title">انزل جاهز.</h2></div>
          <p>اختار مقاسك من الملابس ومستلزمات الجيم. الأسعار والمخزون هنا للتجربة فقط.</p>
        </div>
        <div className="shop-tools">
          <div className="filters" role="group" aria-label="فلتر حسب نوع المنتج" data-testid="category-filters">
            {categories.map((item) => <button key={item} type="button" className={`filter-chip ${category === item ? 'active' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)} data-testid={`filter-${item}`}>{item}</button>)}
          </div>
          <label className="search-box">
            <Search size={16} />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="دوّر على قطعة..." aria-label="ابحث عن منتج" data-testid="input-product-search" />
          </label>
        </div>
        {productsLoading ? (
          <div className="catalog-message" role="status">بنحمّل المنتجات من Shopify...</div>
        ) : productsError ? (
          <div className="catalog-message" role="alert">
            <p>مش قادرين نحمّل المنتجات دلوقتي.</p>
            <button className="button-outline" type="button" onClick={() => void refetch()}>حاول تاني</button>
          </div>
        ) : visibleProducts.length ? (
          <div className="product-grid" data-testid="product-grid">
            {visibleProducts.map((product) => {
              const selectedId = selectedVariantIds[product.id] ?? product.variants[0]?.id;
              const selectedVariant = product.variants.find((variant) => variant.id === selectedId);
              const selectedColor =
                product.colors.find((color) => color.id === selectedColors[product.handle]) ??
                (product.colors.length ? product.colors[colorCycleStep % product.colors.length] : undefined);
              const unavailable = !selectedVariant?.availableForSale || (selectedVariant?.quantityAvailable ?? 0) < 1;
              return (
                <article className="product-card" key={product.handle} data-testid={`card-product-${product.handle}`}>
                  <div className="product-visual" style={{ "--product-color": selectedColor?.hex ?? product.color } as CSSProperties} data-testid={`visual-product-${product.handle}`}>
                    {selectedColor?.image || product.image ? (
                      <img
                        key={selectedColor?.id ?? product.handle}
                        className="product-photo"
                        src={selectedColor?.image ?? product.image}
                        alt={`${product.title}${selectedColor ? `، اللون ${selectedColor.label}` : ""}`}
                        loading="lazy"
                        data-testid={`img-product-${product.handle}`}
                      />
                    ) : (
                      <span className="product-image-placeholder" aria-label={`لا توجد صورة لـ ${product.title}`}>LYNX</span>
                    )}
                    {product.badge && <span className="product-tag">{product.badge}</span>}
                    {!unavailable && selectedVariant ? (
                      <button className="product-add" type="button" onClick={() => addToCart(product, selectedVariant, selectedColor?.label)} aria-label={`أضف ${product.title}${selectedColor ? ` باللون ${selectedColor.label}` : ""} للسلة`} data-testid={`button-add-${product.handle}`}>
                        ضيف للسلة <Plus size={14} />
                      </button>
                    ) : (
                      <span className="product-tag product-sold-out">غير متاح</span>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-title">
                      <h3>{product.title}</h3>
                      <p dir="ltr">{product.english}</p>
                      {product.variants.length > 1 ? (
                        <label className="size-picker">
                          <span>المقاس</span>
                          <select
                            value={selectedVariant?.id ?? ""}
                            onChange={(event) => {
                              setColorSelectionStarted(true);
                              setSelectedVariantIds((current) => ({ ...current, [product.id]: event.target.value }));
                            }}
                            aria-label={`اختار مقاس ${product.title}`}
                          >
                            {product.variants.map((variant) => (
                              <option key={variant.id} value={variant.id} disabled={!variant.availableForSale || variant.quantityAvailable < 1}>
                                {variantLabel(variant)}{variant.quantityAvailable < 1 ? " · غير متاح" : ""}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <span className="single-size">{variantLabel(product.variants[0])}</span>
                      )}
                      {product.colors.length > 0 && selectedColor && (
                        <div className="product-color-picker" data-testid={`color-picker-${product.handle}`}>
                          <span className="color-picker-label">اللون</span>
                          <div className="color-swatches" dir="ltr" role="group" aria-label={`ألوان ${product.title}`}>
                            {product.colors.map((color, index) => (
                              <button
                                key={color.id}
                                className="color-swatch"
                                type="button"
                                style={{
                                  "--swatch-color": color.hex,
                                  "--swatch-order": index,
                                } as CSSProperties}
                                aria-label={`اختار اللون ${color.label}`}
                                aria-pressed={selectedColor.id === color.id}
                                title={color.label}
                                data-testid={`color-${product.handle}-${color.id}`}
                                onClick={() => {
                                  setColorSelectionStarted(true);
                                  setSelectedColors((current) => ({ ...current, [product.handle]: color.id }));
                                }}
                              />
                            ))}
                          </div>
                          <span className="selected-color-name" data-testid={`selected-color-${product.handle}`}>{selectedColor.label}</span>
                        </div>
                      )}
                    </div>
                    <span className="price" data-testid={`text-price-${product.handle}`}>{formatPrice(product.price, product.currencyCode)}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-cart" data-testid="empty-search-results">
            <p>{products.length ? "ملقيناش حاجة بالاسم ده." : "مفيش منتجات منشورة للمعاينة دلوقتي."}</p>
            <button className="button-outline" type="button" onClick={() => { setSearch(""); setCategory("الكل"); }} data-testid="button-reset-search">امسح البحث</button>
          </div>
        )}
      </section>

      <section className="story-band" id="story">
        <div className="page-shell story-grid">
          <div className="story-stamp" aria-label="لينكس وير، تدريب من غير أعذار" data-testid="brand-story-art">
            <span className="eyebrow">التزامك هو البداية</span>
            <strong>Train<br />with intent.</strong>
            <span className="mono">LYNX WEAR / CAIRO</span>
          </div>
          <div className="story-copy">
            <div className="eyebrow">حكايتنا</div>
            <h2>اتعملت هنا.<br />عشان تتمرن بجد.</h2>
            <p>لينكس وير بدأت من سؤال بسيط: ليه لبس التمرين يا إما شكله حلو يا إما يستحمل؟ إحنا بنعمل قطع بتجمع الاتنين، مصممة بعين محلية ومجربة في جيمات القاهرة.</p>
            <p>مفيش وعود كبيرة. فيه قماش مظبوط، تفاصيل مفيدة، ولبس يخلّيك تركز في اللي نازل تعمله.</p>
            <a href="#shop" className="button-primary" data-testid="link-our-products">شوف القطع <ArrowUpLeft size={16} /></a>
          </div>
        </div>
      </section>

      <section className="section page-shell" aria-label="مميزات لينكس وير">
        <div className="eyebrow" style={{ marginBottom: 18 }}>تفاصيل بتفرق</div>
        <div className="benefits">
          <div className="benefit"><b>خامات بتتنفس</b><span>اختيارات خفيفة بتساعدك تفضل مركز حتى آخر التمرين.</span></div>
          <div className="benefit"><b>قصّة على الحركة</b><span>مفيش شد ولا تظبيط كل شوية. اتحرك براحتك.</span></div>
          <div className="benefit"><b>أساسيات تعيش</b><span>قطع عملية تتلبس كتير، مش موسم وخلاص.</span></div>
        </div>
      </section>

      <section className="newsletter" id="newsletter">
        <div className="page-shell newsletter-row">
          <div><div className="eyebrow">رسالة واحدة، وقت اللزوم</div><h2>خليك في الصورة.</h2><p>الجديد، المقاسات اللي رجعت، وحاجات من مجتمع لينكس وير.</p></div>
          <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setNotice(email.trim() ? 'تمام، سجلنا اهتمامك. قريب هنبعتلك أخبارنا.' : 'اكتب بريدك الإلكتروني الأول.'); setEmail(''); }} data-testid="form-newsletter">
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="بريدك الإلكتروني" aria-label="بريدك الإلكتروني" data-testid="input-newsletter-email" />
            <button type="submit" data-testid="button-newsletter-submit">سجّل <ArrowLeft size={15} /></button>
          </form>
        </div>
      </section>
      <footer className="footer"><div className="page-shell footer-row"><span className="footer-brand-lockup"><img className="footer-logo" src={lynxLogo} alt="" /><span className="brand-mark" dir="ltr">Lynx<span style={{ color: '#df7655' }}> Wear</span></span></span><span>اتعملت في القاهرة، للناس اللي بتتمرن بجد.</span><span dir="ltr">© LYNX WEAR 2026</span></div></footer>

      {cartOpen && <div className="cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }} data-testid="cart-overlay">
        <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" data-testid="cart-panel">
          <div className="cart-header"><h2 id="cart-title">سلتك <span className="mono" dir="ltr">({cartCount})</span></h2><button className="icon-button" type="button" onClick={() => setCartOpen(false)} aria-label="اقفل السلة" data-testid="button-close-cart"><X size={18} /></button></div>
          {cart.length ? <>
            <div className="cart-items">{cartLines.map(({ item, product, variant }) => (
              <div className="cart-line" key={cartItemKey(item)} data-testid={`cart-item-${product?.handle ?? "unavailable"}-${item.color ?? "default"}`}>
                {product?.image ? (
                  <img className="cart-swatch" src={product.colors.find((color) => color.label === item.color)?.image ?? product.image} alt="" />
                ) : (
                  <div className="cart-swatch" style={{ "--product-color": product?.color ?? "#77756d" } as CSSProperties} />
                )}
                <div>
                  <h3>{product?.title ?? "منتج غير متاح حالياً"}</h3>
                  <p>{item.color ? `اللون ${item.color} · ` : ""}{variant ? `المقاس ${variantLabel(variant)} · ${formatPrice(variant.price, variant.currencyCode)}` : "احذف الصنف لمتابعة الطلب"}</p>
                  <div className="qty-control">
                    <button type="button" aria-label={`قلل كمية ${product?.title ?? "الصنف"}`} onClick={() => changeQuantity(cartItemKey(item), -1)}><Minus size={13} /></button>
                    <span>{item.quantity}</span>
                    <button type="button" aria-label={`زود كمية ${product?.title ?? "الصنف"}`} onClick={() => changeQuantity(cartItemKey(item), 1)} disabled={!variant || (cartQuantityByVariant.get(item.variantId) ?? 0) >= variant.quantityAvailable}><Plus size={13} /></button>
                  </div>
                </div>
                <b className="price">{variant ? formatPrice(variant.price * item.quantity, variant.currencyCode) : "—"}</b>
              </div>
            ))}</div>
            <div className="cart-bottom">
              <div className="cart-total"><span>الإجمالي</span><span data-testid="text-cart-total">{formatPrice(cartTotal, "USD")}</span></div>
              {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
              <button type="button" className="button-primary checkout-button" onClick={() => void beginCheckout()} disabled={checkoutMutation.isPending || invalidCartLines.length > 0} data-testid="button-checkout">
                {checkoutMutation.isPending ? "جاري فتح الدفع..." : "كمّل للطلب"} <ArrowLeft size={16} />
              </button>
              <p className="checkout-note">الأسعار والمخزون تجريبيان للمعاينة، ولن يتم خصم مبلغ حقيقي. طرق الدفع مثل PayPal تظهر فقط إذا كانت مفعّلة في حساب Shopify.</p>
            </div>
          </> : <div className="empty-cart" data-testid="empty-cart"><ShoppingBag size={30} /><p>لسه مفيش حاجة في السلة.</p><button type="button" className="button-primary" onClick={() => setCartOpen(false)} data-testid="button-continue-shopping">كمّل تسوق <ArrowLeft size={15} /></button></div>}
        </aside>
      </div>}
      {notice && <div className="toast" role="status" aria-live="polite" data-testid="status-notice">{notice}</div>}
    </main>
  );
}

function AccountLink() {
  const { isLoaded, user } = useUser();
  const href = user ? `${basePath}/account` : signInPath;
  const label = isLoaded && user ? "حسابي" : "دخول";

  return (
    <a className="icon-button account-link" href={href} aria-label={label} data-testid="link-account">
      <CircleUserRound size={17} />
      <span>{label}</span>
    </a>
  );
}

function RoutedApp() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/account" component={AccountPage} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function AppProviders() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      proxyUrl={import.meta.env.VITE_CLERK_PROXY_URL}
      signInUrl={signInPath}
      signUpUrl={signUpPath}
      appearance={clerkAppearance}
      localization={clerkLocalization}
      routerPush={(to) => setLocation(toWouterPath(to))}
      routerReplace={(to) => setLocation(toWouterPath(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RoutedApp />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AppProviders />
    </WouterRouter>
  );
}

export default App;
