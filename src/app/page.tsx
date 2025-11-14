"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../styles/cta/button.css";

const FULLPAGE_CONTAINER_ID = "fullpage-scroll";
const HEADER_OFFSET = 80;

const navItems = [
  { label: "Sản phẩm", href: "#featured" },
  { label: "Về STILE", href: "#about" },
  { label: "Công trình & Xu hướng", href: "#projects" },
  { label: "Artile Gallery", href: "#gallery" },
  { label: "Dịch vụ", href: "#contact" },
] as const;

const galleryImages = [
  {
    src: "/ARTILE GALLERY/1 ARTILE GALLERY.JPG",
    alt: "Artile Gallery 1",
  },
  {
    src: "/ARTILE GALLERY/2 ARTILE GALLERY.JPG",
    alt: "Artile Gallery 2",
  },
  {
    src: "/ARTILE GALLERY/3 ARTILE GALLERY.JPG",
    alt: "Artile Gallery 3",
  },
  {
    src: "/ARTILE GALLERY/4 ARTILE GALLERY.JPG",
    alt: "Artile Gallery 4",
  },
] as const;

const featuredVariants = [
  {
    id: "gemini-acero",
    collection: "Gemini",
    title: "Acero",
    image: "/SẢN PHẨM NỔI BẬT/1GEMINI_ACERO.jpg",
    description:
      "The profound dialog between humans and nature translates into an interplay of glimpses and reflections, where humans and the earth mirror each other and collaborate in perfect synergy.",
    swatch: "#b68363",
  },
  {
    id: "gemini-grano",
    collection: "Gemini",
    title: "Grano",
    image: "/SẢN PHẨM NỔI BẬT/2GEMINI_GRANO.jpg",
    description:
      "A tactile shade that blends warm minerals and muted neutrals, creating calm, grounding spaces with subtle surface movement.",
    swatch: "#a88b6a",
  },
  {
    id: "gemini-cielo",
    collection: "Gemini",
    title: "Cielo",
    image: "/SẢN PHẨM NỔI BẬT/3GEMINI_CIELO.jpg",
    description:
      "Inspired by expansive skies, Cielo layers delicate veining over a soft base, ideal for serene living environments.",
    swatch: "#9aa0a8",
  },
  {
    id: "gemini-cerene",
    collection: "Gemini",
    title: "Cerene",
    image: "/SẢN PHẨM NỔI BẬT/4GEMINI_CERENE.jpg",
    description:
      "Cerene balances matte and gloss accents to elevate contemporary interiors with refined simplicity.",
    swatch: "#c7b4a3",
  },
  {
    id: "gemini-muschio",
    collection: "Gemini",
    title: "Muschio",
    image: "/SẢN PHẨM NỔI BẬT/6GEMINI_MUSCHIO.jpg",
    description:
      "Earthy greens paired with organic textures bring a biophilic sensibility to large feature surfaces.",
    swatch: "#71806a",
  },
  {
    id: "gemini-luce",
    collection: "Gemini",
    title: "Luce",
    image: "/SẢN PHẨM NỔI BẬT/6GEMINI_LUCE.jpg",
    description:
      "Luce captures luminous gradients, echoing the softly diffused daylight of refined residential settings.",
    swatch: "#d3c7be",
  },
  {
    id: "gemini-flora-luce",
    collection: "Gemini",
    title: "Flora Luce",
    image: "/SẢN PHẨM NỔI BẬT/7GEMINI_FLORA LUCE.jpg",
    description:
      "Flora Luce celebrates botanical motifs layered over a satin base, creating immersive, nature-led surfaces.",
    swatch: "#8f826d",
  },
  {
    id: "gemini-flora-pelle",
    collection: "Gemini",
    title: "Flora Pelle",
    image: "/SẢN PHẨM NỔI BẬT/8GEMINI_FLORA PELLE.jpg",
    description:
      "A sophisticated interplay of warm undertones and soft botanicals, tailored for hospitality statements.",
    swatch: "#b18e6d",
  },
  {
    id: "gemini-pelle",
    collection: "Gemini",
    title: "Pelle",
    image: "/SẢN PHẨM NỔI BẬT/9GEMINI_PELLE.jpg",
    description:
      "Pelle channels handcrafted leather hues, adding depth and character to expansive wall and floor planes.",
    swatch: "#b17f5d",
  },
];

const collectionSlides = [
  {
    id: "gemini-01",
    heading: "BỘ SƯU TẬP",
    title: "Gemini",
    subtitle: "Collection",
    description:
      "Hòa quyện thiên nhiên và công nghệ, tạo nên bề mặt tinh tế, bền vững và đậm chất đương đại.",
    highlightTitle: " Less is More ",
    highlightCopy: "Thiết kế tối giản khai thác ánh sáng và chất liệu để tạo chiều sâu cho không gian.",
    ctaLabel: "Khám phá ngay",
  },
  {
    id: "gemini-02",
    heading: "BỘ SƯU TẬP",
    title: "Gemini",
    subtitle: "Heritage",
    description:
      "Từ nguồn cảm hứng nghệ thuật Ý, Gemini Heritage mở ra những bề mặt sang trọng nhưng vẫn phóng khoáng.",
    highlightTitle: "Crafted Layers",
    highlightCopy: "Sự phối hợp giữa các lớp vật liệu tạo nên cảm giác ấm áp và tinh tế.",
    ctaLabel: "Khám phá ngay",
  },
] as const;

const applicationSections = [
  {
    label: "ỐP TƯỜNG",
    items: [
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/1 - Ảnh Ốp Tường.jpg",
      },
      {
        title: "LÁT SÀN",
        image: "/ỨNG DỤNG/2 - Ảnh Lát Sàn.jpg",
      },
      {
        title: "ĐỒ NỘI THẤT",
        image: "/ỨNG DỤNG/3 - Ảnh Đồ Nội Thất.jpg",
      },
    ],
  },
  {
    label: "LÁT SÀN",
    items: [
      {
        title: "LÁT SÀN",
        image: "/ỨNG DỤNG/2 - Ảnh Lát Sàn.jpg",
      },
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/1 - Ảnh Ốp Tường.jpg",
      },
      {
        title: "MẶT TIỀN KIẾN TRÚC",
        image: "/ỨNG DỤNG/4 - Ảnh Mặt Tiền Kiến Trúc.jpeg",
      },
    ],
  },
  {
    label: "ĐỒ NỘI THẤT",
    items: [
      {
        title: "ĐỒ NỘI THẤT",
        image: "/ỨNG DỤNG/3 - Ảnh Đồ Nội Thất.jpg",
      },
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/1 - Ảnh Ốp Tường.jpg",
      },
      {
        title: "MẶT TIỀN KIẾN TRÚC",
        image: "/ỨNG DỤNG/4 - Ảnh Mặt Tiền Kiến Trúc.jpeg",
      },
    ],
  },
  {
    label: "MẶT TIỀN KIẾN TRÚC",
    items: [
      {
        title: "MẶT TIỀN KIẾN TRÚC",
        image: "/ỨNG DỤNG/4 - Ảnh Mặt Tiền Kiến Trúc.jpeg",
      },
      {
        title: "LÁT SÀN",
        image: "/ỨNG DỤNG/2 - Ảnh Lát Sàn.jpg",
      },
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/1 - Ảnh Ốp Tường.jpg",
      },
    ],
  },
] as const;

const trendArticles = [
  {
    title: "TÂN CỔ ĐIỂN & NỘI THẤT HIỆN ĐẠI",
    description:
      "Sự dung hòa tinh thần Tân Cổ Điển và đường nét đồ nội thất hiện đại tạo nên một không gian độc đáo bật nhất giữa nét sang trọng và nét nhẹ nhàng tinh tế.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/CÔNG TRÌNH/BÀI POST TRANG 1.jpg",
  },
  {
    title: "THIÊN NHIÊN TRONG PHÒNG NGỦ",
    description:
      "Thổi hồn vào phòng ngủ của bạn với bộ sưu tập Gemini. Được lấy cảm hứng từ sự hòa trộn giữa thiên nhiên với những màu sắc nhẹ nhàng, thanh lịch.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/XU HƯỚNG/BÀI POST TRANG 2.jpg",
  },
] as const;

const footerLinks = [
  "Về STile",
  "Artile Gallery",
  "Sản Phẩm",
  "Công Trình & Xu Hướng",
  "Dịch Vụ",
] as const;

const footerSocials = [
  { src: "/FOOTER/tiktok 1.png", alt: "Tiktok" },
  { src: "/FOOTER/zalo.png", alt: "Zalo" },
  { src: "/FOOTER/linkedin.png", alt: "LinkedIn" },
  { src: "/FOOTER/pinterest.png", alt: "Pinterest" },
  { src: "/FOOTER/facebook.png", alt: "Facebook" },
  { src: "/FOOTER/instagram.png", alt: "Instagram" },
  { src: "/FOOTER/youtube.png", alt: "YouTube" },
] as const;

const heroSlides = [
  {
    src: "/BANNER/_SecondoImportThron_i_naturali_verde_alpi_bocciardato_still_life_7.jpg",
    alt: "Bề mặt Verde Alpi",
  },
  {
    src: "/BANNER/_SecondoImportThron_i_naturali_invisible_white_still_life_2.jpg",
    alt: "Bề mặt Invisible White",
  },
  {
    src: "/BANNER/_SecondoImportThron_i_naturali_sahara_noir_extra_lucidato_still_life_2.jpg",
    alt: "Bề mặt Sahara Noir",
  },
] as const;

function DisableZoom() {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        ["+", "-", "=", "_"].includes(event.key)
      ) {
        event.preventDefault();
      }
      if (event.key === "Meta" || event.key === "Control") {
        window.addEventListener("wheel", handleWheel, { passive: false });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Meta" || event.key === "Control") {
        window.removeEventListener("wheel", handleWheel);
      }
    };

    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("gesturestart", preventGesture);
    window.addEventListener("gesturechange", preventGesture);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("gesturestart", preventGesture);
      window.removeEventListener("gesturechange", preventGesture);
    };
  }, []);

  return null;
}

function AnchorScrollManager() {
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#" || !href.startsWith("#")) {
        return;
      }

      if (window.innerWidth < 769) {
        return;
      }

      const container = document.getElementById(FULLPAGE_CONTAINER_ID);
      const section = document.querySelector<HTMLElement>(href);

      if (!container || !section) {
        return;
      }

      event.preventDefault();

      const containerRect = container.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();

      const offset =
        sectionRect.top - containerRect.top + container.scrollTop - HEADER_OFFSET + 4;

      container.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  return null;
}

function SectionVisibilityManager() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".fullpage-section");
    if (!sections.length) return;

    sections.forEach((section) => section.classList.add("is-visible")); // initial hero

    let scrolling = false;

    const onWheel = (event: WheelEvent) => {
      if (scrolling) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      triggerAnimation(direction);
    };

    const onKey = (event: KeyboardEvent) => {
      if (scrolling) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        triggerAnimation(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        triggerAnimation(-1);
      }
    };

    const triggerAnimation = (direction: 1 | -1) => {
      const container = document.getElementById(FULLPAGE_CONTAINER_ID);
      if (!container) return;
      const currentIndex = Math.round(container.scrollTop / container.clientHeight);
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
      const targetSection = sections[targetIndex];

      scrolling = true;
      targetSection.classList.add("is-visible");

      setTimeout(() => {
        scrolling = false;
      }, 600);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}

export default function Home() {
  return (
    <div className="bg-white text-[#111111]">
      <DisableZoom />
      <AnchorScrollManager />
      <SectionVisibilityManager />
      <div id="desktop-layout-wrapper" className="desktop-fixed-layout">
        <Header />
        <main id={FULLPAGE_CONTAINER_ID} className="fullpage-container">
          <Hero />
          <About />
          <Gallery />
          <FeaturedProducts />
          <Collections />
          <Applications />
          <Projects />
          <CatalogueCta />
          <Footer />
        </main>
      </div>
    </div>
  );
}

function Header() {
  const [pastHero, setPastHero] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [onLightSection, setOnLightSection] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(entry.intersectionRatio < 0.6);
      },
      {
        threshold: [0.6],
      }
    );

    observer.observe(heroEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-header-light="true"]');
    if (!sections.length) return;

    const visibility = new Map<Element, boolean>();
    sections.forEach((section) => visibility.set(section, false));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target, entry.isIntersecting);
        });
        const anyVisible = Array.from(visibility.values()).some(Boolean);
        setOnLightSection(anyVisible);
      },
      {
        threshold: 0.35,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navLinkClass = onLightSection
    ? "text-[#111111] hover:text-[#555555]"
    : "text-white hover:text-[#f2f2f2]";

  const logoSrc = pastHero
    ? "/LOGO/STILE Logo HEADER-14.svg"
    : "/LOGO/STILE Logo HEADER-14.svg";

  const baseHeight = pastHero ? 58 : 80;
  const headerHeight = isHeaderHovered ? baseHeight + 12 : baseHeight;

  return (
    <header
      onMouseEnter={() => setIsHeaderHovered(true)}
      onMouseLeave={() => setIsHeaderHovered(false)}
      className={`fixed left-0 right-0 top-0 z-50 bg-transparent transition-[color,height] duration-500 ${
        onLightSection ? "text-[#111111]" : "text-white"
      }`}
      style={{ height: `${headerHeight}px` }}
    >
      <div className="mx-auto flex h-full w-full items-center justify-between px-[57px]">
        <Link href="#hero" className="flex items-center">
        <Image
            src={logoSrc}
            alt="Stile logo"
            width={110}
            height={42}
          priority
            className="h-auto w-[110px]"
        />
        </Link>
        <nav className="flex items-center gap-10 text-[15px] font-normal tracking-[0.06em]">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={`transition ${navLinkClass}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6 text-[15px] font-normal tracking-[0.06em]">
          <Link href="#contact" className={`transition ${navLinkClass}`}>
            Liên hệ
          </Link>
          <button
            type="button"
            className={`rounded-full border px-4 py-1 text-[13px] tracking-[0.12em] transition ${
              onLightSection
                ? "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                : "border-white text-white hover:bg-white/20"
            }`}
          >
            VN / EN
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="fullpage-section relative w-full overflow-hidden text-white"
    >
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transform-gpu transition-[opacity,transform,filter] duration-[1300ms] ease-[cubic-bezier(0.6,0.05,0.2,1)] ${
                isActive ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[1.05] brightness-[0.85]"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className={`object-cover transition-transform duration-[3200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  isActive ? "scale-100" : "scale-[1.08]"
                }`}
              />
              {isActive ? <div key={`${slide.src}-highlight`} className="tile-highlight" /> : null}
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center gap-[32px] px-6 text-center">
        <h1 className="max-w-[685px] text-[58px] leading-[73px] tracking-[0.02em] font-heading uppercase">
          BỀ MẶT LẤY CẢM HỨNG TỪ THIÊN NHIÊN
        </h1>
        <p className="max-w-[593px] font-alt text-[18px] font-normal leading-6">
          Thiết kế độc đáo phối hòa đường nét thanh lịch, tinh tế.
        </p>
        <PillButton theme="light" label="Khám phá ngay" />
      </div>
    </section>
  );
}

function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    const node = stickyRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setImageVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionNode = sectionRef.current;
    const imageNode = stickyRef.current;
    const textNode = textRef.current;
    if (!sectionNode || !imageNode || !textNode) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      if (viewportWidth < 1024) {
        imageNode.style.transform = "translate3d(0px, 0px, 0px)";
        textNode.style.transform = "translate3d(0px, 0px, 0px)";
        return;
      }

      const viewportCenterX = viewportWidth / 2;
      const viewportCenterY = viewportHeight / 2;

      const sectionRect = sectionNode.getBoundingClientRect();
      const sectionCenterY = sectionRect.top + sectionRect.height / 2;

      const distanceToCenter = Math.abs(sectionCenterY - viewportCenterY);
      const maxDistance = viewportHeight / 2;
      const rawProgress = 1 - Math.min(distanceToCenter / maxDistance, 1);
      const progress = Math.max(0, Math.min(1, rawProgress));

      const textRect = textNode.getBoundingClientRect();
      const textCenterX = textRect.left + textRect.width / 2;
      const textCenterY = textRect.top + textRect.height / 2;
      const textTranslateX = (viewportCenterX - textCenterX) * progress;
      const textTranslateY = (viewportCenterY - textCenterY) * progress;
      textNode.style.transform = `translate3d(${textTranslateX.toFixed(2)}px, ${textTranslateY.toFixed(2)}px, 0px)`;

      const imageRect = imageNode.getBoundingClientRect();
      const imageCenterX = imageRect.left + imageRect.width / 2;
      const imageCenterY = imageRect.top + imageRect.height / 2;
      const imageTranslateX = (viewportCenterX - imageCenterX) * progress;
      const imageTranslateY = (viewportCenterY - imageCenterY) * progress;
      imageNode.style.transform = `translate3d(${imageTranslateX.toFixed(2)}px, ${imageTranslateY.toFixed(2)}px, 0px)`;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-header-light="true"
      className="fullpage-section flex items-center"
    >
      <div className="section-inner">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[minmax(0,640px)_minmax(0,1fr)] items-center gap-20 px-[104px]">
          <div
            ref={textRef}
            className="flex flex-col gap-6 transition-transform duration-300 ease-out will-change-transform"
          >
            <span className="font-alt text-[20px] font-medium tracking-[0.05em]">VỀ CHÚNG TÔI</span>
            <h2 className="font-heading text-[48px] leading-[60px] tracking-[0.02em] uppercase text-[#000000]">
              ĐỊNH HÌNH CHUẨN MỰC MỚI CHO BỀ MẶT ỐP LÁT
            </h2>
            <p className="font-manrope text-[14px] leading-[25px] text-justify text-[#1a1a1a]">
              STILE là một trong những nhà cung cấp giải pháp ốp lát hàng đầu Việt Nam tiên phong phát
              triển những bề mặt đột phá về kích cỡ , thiết kế và công nghệ. Kết hợp kinh nghiệm dày
              dặn cùng sự am hiểu sâu sắc về lĩnh vực sản xuất gạch, chúng tôi lựa chọn hợp tác cùng các
              nhà sản xuất sỡ hữu nguồn nguyên liệu chất lượng cao, quy trình cấp tiến và công nghệ thân
              thiện hàng đầu thế giới (Ý, Tây Ban Nha, Ấn Độ,...).
            </p>
            <div className="pt-2">
              <PillButton label="Khám phá ngay" />
            </div>
          </div>
          <div className="relative flex justify-center xl:justify-end">
        <div
          ref={stickyRef}
          className={`hidden h-[601px] w-[534px] overflow-hidden rounded-lg shadow-lg transition-opacity duration-600 ease-out lg:block lg:sticky lg:top-[140px] ${
            imageVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src="/VỀ CHÚNG TÔI/Logo STILE on Verde alpi slabs.png"
            alt="Logo Stile trên mặt đá"
            fill
            className="object-cover"
            sizes="534px"
          />
        </div>
        <div className="block h-[420px] w-full max-w-[480px] overflow-hidden rounded-lg shadow-lg lg:hidden">
          <Image
            src="/VỀ CHÚNG TÔI/Logo STILE on Verde alpi slabs.png"
            alt="Logo Stile trên mặt đá"
            fill
            className="object-cover"
            sizes="480px"
          />
        </div>
        </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [contentFade, setContentFade] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    let dragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (event: MouseEvent) => {
      dragging = true;
      setIsDragging(true);
      node.classList.add("is-dragging");
      startX = event.pageX - node.offsetLeft;
      scrollLeft = node.scrollLeft;
    };

    const endDrag = () => {
      dragging = false;
      setIsDragging(false);
      node.classList.remove("is-dragging");
    };

    const handleScrollPosition = () => {
      const maxScroll = node.scrollWidth - node.clientWidth;
      if (maxScroll <= 0) {
        setContentFade(0);
        return;
      }
      const ratio = Math.min(1, Math.max(0, node.scrollLeft / maxScroll));
      setContentFade(ratio);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!dragging) return;
      event.preventDefault();
      const x = event.pageX - node.offsetLeft;
      const walk = x - startX;
      node.scrollLeft = scrollLeft - walk;
      handleScrollPosition();
    };

    node.addEventListener("mousedown", onMouseDown);
    node.addEventListener("mouseleave", endDrag);
    node.addEventListener("mouseup", endDrag);
    node.addEventListener("mousemove", onMouseMove);
    node.addEventListener("scroll", handleScrollPosition, { passive: true });

    handleScrollPosition();

    return () => {
      node.removeEventListener("mousedown", onMouseDown);
      node.removeEventListener("mouseleave", endDrag);
      node.removeEventListener("mouseup", endDrag);
      node.removeEventListener("mousemove", onMouseMove);
      node.removeEventListener("scroll", handleScrollPosition);
    };
  }, []);

  return (
    <section id="gallery" className="fullpage-section relative w-full overflow-hidden bg-[#282828] text-white">
      <div className="section-inner">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 lg:flex-row lg:items-center lg:px-0">
          <div className="relative w-full overflow-visible lg:w-[60%]">
          <div
            ref={scrollRef}
            className="gallery-scroll relative flex gap-8 overflow-x-auto pb-10"
            style={{ width: "60vw", maxWidth: "60vw", paddingRight: "45vw" }}
          >
            {galleryImages.map((image) => (
              <div
                key={image.alt}
                className="relative h-[520px] w-[460px] flex-shrink-0 overflow-hidden rounded-[48px] shadow-[0_28px_60px_rgba(0,0,0,0.35)]"
              >
                <Image src={image.src} alt={image.alt} fill className="pointer-events-none object-cover" sizes="460px" />
              </div>
            ))}
          </div>
          </div>
          <div
            className="relative z-20 flex w-full max-w-[520px] flex-col gap-6 transition-transform duration-500 lg:w-[40%] lg:pl-12"
            style={{
              opacity: Math.max(0.4, 1 - contentFade * 1.1),
              transform: `translateX(${-(contentFade * 60)}px)`,
              pointerEvents: contentFade > 0.3 || isDragging ? "none" : "auto",
            }}
          >
            <h2 className="font-heading text-[80px] leading-[70px] tracking-[0.05em] uppercase">ARTILE GALLERY</h2>
            <p className="max-w-[460px] font-montserrat text-[14px] leading-[25px] text-justify">
              Tại STile, chúng tôi không đơn thuần gọi đó là Showroom. Với chúng tôi, mỗi sản phẩm là một tác phẩm nghệ thuật, được sắp đặt một cách có chủ đích, thể hiện cá tính và câu chuyện riêng.
            </p>
            <div className="pt-6">
              <PillButton label="Khám phá ngay" theme="light" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 px-6 lg:hidden">
        <div className="flex gap-4 overflow-x-auto pb-6">
          {galleryImages.map((image) => (
            <div key={image.alt} className="relative h-[320px] w-[240px] flex-shrink-0 overflow-hidden rounded-[32px]">
              <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="240px" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="font-heading text-[48px] leading-[48px] tracking-[0.05em] uppercase">ARTILE GALLERY</h2>
          <p className="font-montserrat text-[14px] leading-[24px] text-justify">
            Tại STile, chúng tôi không đơn thuần gọi đó là Showroom. Với chúng tôi, mỗi sản phẩm là một tác phẩm nghệ thuật, được sắp đặt một cách có chủ đích, thể hiện cá tính và câu chuyện riêng.
          </p>
          <PillButton label="Khám phá ngay" theme="light" />
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [activeVariant, setActiveVariant] = useState(0);
  const variant = featuredVariants[activeVariant];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVariant((prev) => (prev + 1) % featuredVariants.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="featured" data-header-light="true" className="fullpage-section relative w-full overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]">
      <div className="absolute inset-0">
        <Image
          key={variant.id}
          src={variant.image}
          alt={variant.title}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f4f4]/95 via-[#f4f4f4]/88 to-[#f4f4f4]/20" />
      </div>

      <div className="relative flex h-full w-full flex-col justify-between px-8 lg:px-[6vw]">
        <div className="pt-10 text-center">
          <h2 className="font-heading text-[48px] uppercase tracking-[0.3em] text-[#151515]">
            SẢN PHẨM NỔI BẬT
          </h2>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-12 lg:flex-row lg:items-center">
          <div key={variant.id} className="animate-text-fade max-w-[520px] space-y-6 text-left">
            <div className="space-y-3">
              <span className="font-montserrat text-[15px] uppercase tracking-[0.3em] text-[#6b6b6b]">
                {variant.collection}
              </span>
              <h3 className="font-montserrat text-[48px] font-semibold text-[#151515]">
                {variant.title}
              </h3>
            </div>
            <p className="font-montserrat text-[15px] leading-[26px] text-[#3a3a3a]">
              {variant.description}
            </p>
            <div className="pt-4">
              <PillButton label="Khám phá ngay" />
            </div>
          </div>
          <div className="flex-1" />
        </div>

        <div className="relative mb-10 flex items-center justify-center gap-4">
          {featuredVariants.map((item, index) => {
            const isActive = index === activeVariant;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveVariant(index)}
                aria-label={item.title}
                className={`h-[26px] w-[26px] rounded-full border transition-all duration-200 ${
                  isActive ? "border-black" : "border-transparent hover:border-black/40"
                }`}
                style={{ background: item.swatch }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Collections() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % collectionSlides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="collections" className="fullpage-section relative w-full overflow-hidden bg-black text-white">
      <div className="section-inner !p-0">
        <div className="relative h-full min-w-[1440px]">
          {collectionSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src="/BỘ SƯU TẬP/COLLECTION-01.png"
              alt="Collection layout"
              fill
              priority={index === 0}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/5" />

            <div className="absolute left-[120px] top-[92px]">
              <h2 className="font-heading text-[48px] tracking-[0.05em] uppercase">{slide.heading}</h2>
            </div>

            <div className="absolute left-[670px] top-[180px] w-[360px] text-left text-white">
              <div className="mb-10">
                <Image src="/BỘ SƯU TẬP/Vector.png" alt="Tile outline" width={64} height={112} className="h-auto w-[64px]" />
              </div>
              <div className="flex items-baseline gap-4 font-montserrat text-[32px] uppercase tracking-[0.12em]">
                <span>{slide.title}</span>
                <span className="text-[18px] uppercase tracking-[0.6em] text-white/75">{slide.subtitle}</span>
              </div>
              <p className="mt-5 font-montserrat text-[15px] leading-[26px] text-white/90">{slide.description}</p>
              <div className="pt-7">
                <PillButton label={slide.ctaLabel} theme="light" />
              </div>
            </div>

            <div className="absolute left-[900px] top-[580px] w-[280px] text-center text-white">
              <p className="font-montserrat text-[22px] uppercase tracking-[0.25em]">
                {slide.highlightTitle}
              </p>
              <p className="mt-5 font-montserrat text-[13px] leading-[20px] text-white/80">
                {slide.highlightCopy}
              </p>
            </div>
          </div>
          ))}

          <div className="absolute bottom-[60px] left-[120px] flex gap-3">
            {collectionSlides.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to ${slide.title} slide`}
                className={`h-[16px] w-[16px] rounded-full border border-white/50 transition-colors ${
                  isActive ? "bg-white" : "bg-transparent hover:border-white"
                }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Applications() {
  const [activeTab, setActiveTab] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const activeSection = applicationSections[activeTab];
  const originalItems = activeSection.items;
  const loopedItems = [originalItems[originalItems.length - 1], ...originalItems, originalItems[0]];

  const updateHighlight = useCallback(() => {
    const activeButton = tabRefs.current[activeTab];
    const container = tabsRef.current;
    if (activeButton && container) {
      setHighlightStyle({
        left: activeButton.offsetLeft,
        top: activeButton.offsetTop,
        width: activeButton.offsetWidth,
        height: activeButton.offsetHeight,
      });
    }
  }, [activeTab]);

  useLayoutEffect(() => {
    updateHighlight();
  }, [updateHighlight]);

  useEffect(() => {
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [updateHighlight]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll<HTMLElement>("[data-app-card]");
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 32;

    const resetToMiddle = () => {
      track.scrollLeft = cardWidth;
    };

    resetToMiddle();

    const handleScroll = () => {
      if (track.scrollLeft <= 0) {
        track.scrollLeft = cardWidth * originalItems.length;
      } else if (track.scrollLeft >= cardWidth * (originalItems.length + 1)) {
        track.scrollLeft = cardWidth;
      }
    };

    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      track.classList.add("is-dragging");
      startX = event.pageX;
      scrollStart = track.scrollLeft;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      event.preventDefault();
      const walk = event.pageX - startX;
      track.scrollLeft = scrollStart - walk;
    };

    const endDrag = () => {
      isDragging = false;
      track.classList.remove("is-dragging");
    };

    const onTouchStart = (event: TouchEvent) => {
      isDragging = true;
      startX = event.touches[0].pageX;
      scrollStart = track.scrollLeft;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isDragging) return;
      const walk = event.touches[0].pageX - startX;
      track.scrollLeft = scrollStart - walk;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    track.addEventListener("mousedown", onMouseDown);
    track.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    track.addEventListener("mouseleave", endDrag);
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: true });
    track.addEventListener("touchend", onTouchEnd);

    window.addEventListener("resize", resetToMiddle);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("mousedown", onMouseDown);
      track.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      track.removeEventListener("mouseleave", endDrag);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resetToMiddle);
    };
  }, [activeSection, originalItems.length]);

  return (
    <section id="applications" className="fullpage-section flex w-full flex-col justify-center">
      <div className="section-inner">
        <div className="flex w-full max-w-[1440px] flex-col px-[104px]">
          <h2 className="mt-[72px] text-center font-heading text-[48px] tracking-[0.05em] text-[#000]">
            ỨNG DỤNG
          </h2>
          <div className="mt-[32px] flex justify-center">
            <div ref={tabsRef} className="relative flex items-center gap-[24px]">
              <span
                className="pointer-events-none absolute rounded-[11px] bg-[#282828] transition-all duration-300"
                style={{
                  left: highlightStyle.left,
                  top: highlightStyle.top,
                  width: highlightStyle.width,
                  height: highlightStyle.height,
                  opacity: highlightStyle.width ? 1 : 0,
                }}
              />
              {applicationSections.map((tab, index) => {
                const active = index === activeTab;
                return (
                  <button
                    type="button"
                    key={tab.label}
                    onClick={() => setActiveTab(index)}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    className={`relative z-10 flex h-[54px] items-center rounded-[28px] px-[5px] font-montserrat text-[16px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                      active ? "text-white !text-white" : "text-[#1a1a1a] hover:text-[#000]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-[48px] -mx-[104px]">
            <div className="relative">
              <div
                ref={trackRef}
                className="application-track flex cursor-grab gap-[32px] overflow-x-scroll overflow-y-hidden scroll-smooth pb-6"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {loopedItems.map((item, index) => (
                  <div
                    key={`${activeSection.label}-${item.title}-${index}`}
                    data-app-card
                    className="group relative flex h-[516px] w-[460px] flex-shrink-0 snap-center"
                  >
                    <div className="relative h-full w-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.05]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="460px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-16 flex translate-y-8 justify-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="font-heading text-[18px] uppercase tracking-[0.28em] text-white">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" data-header-light="true" className="fullpage-section flex w-full items-center justify-center bg-white">
      <div className="section-inner">
        <div className="mx-auto w-full max-w-[1440px] px-[104px]">
          <h2 className="font-heading text-[48px] tracking-[0.05em] text-[#000]">
            CÔNG TRÌNH &amp; XU HƯỚNG
          </h2>
          <div className="mt-[48px] grid grid-cols-2 gap-[60px]">
            {trendArticles.map((article) => (
              <div key={article.title} className="flex flex-col gap-5">
                <div className="relative h-[320px] w-full overflow-hidden rounded-lg">
                  <Image src={article.image} alt={article.title} fill className="object-cover" sizes="601px" />
                </div>
                <h3 className="font-montserrat text-[32px] font-medium leading-[24px] text-[#000]">
                  {article.title}
                </h3>
                <p className="font-montserrat text-[14px] leading-[19px] text-[#111]">{article.description}</p>
                <div>
                  <PillButton label="Khám phá ngay" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogueCta() {
  return (
    <section className="fullpage-section relative flex items-center justify-center overflow-hidden text-white">
      <Image
        src="/NHẬN ĐĂNG KÝ CATALOGUE/JUNGLE CHIC (7).jpg"
        alt="Đăng ký nhận catalogue"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-[36px] tracking-[0.05em] uppercase">
          ĐĂNG KÝ NHẬN CATALOGUE
        </h2>
        <PillButton label="Khám phá ngay" theme="light" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" data-header-light="true" className="fullpage-section mx-auto bg-white text-[#000]">
      <div className="section-inner">
        <div className="w-full max-w-[1440px] px-[104px]">
          <div className="flex flex-col gap-[48px] border-b border-[#d0d0d0] pb-[48px]">
            <div className="flex items-start justify-between gap-[32px]">
              <div className="flex flex-col gap-6">
                <Image
                  src="/LOGO/STILE Logo HEADER-12.svg"
                  alt="Stile"
                  width={200}
                  height={80}
                  className="h-auto w-[200px]"
                />
                <div>
                  <h3 className="font-manrope text-[20px] font-bold uppercase tracking-[0.05em]">
                    CÔNG TY TNHH STILE
                  </h3>
                  <div className="mt-6 space-y-4 font-montserrat text-[14px] leading-6">
                    <p>098 165 0042</p>
                    <p>infor@stile.com.vn</p>
                    <p>155 - 157 Nguyễn Cơ Thạch, P. An Khánh, TP. HCM</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-[60px] gap-y-[16px] font-montserrat text-[14px] leading-6">
                {footerLinks.map((link) => (
                  <Link key={link} href="#" className="transition hover:text-[#555]">
                    {link}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                <h4 className="font-manrope text-[20px] font-bold uppercase tracking-[0.05em]">
                  Liên hệ ngay
                </h4>
                <form className="grid grid-cols-2 gap-x-[16px] gap-y-3 font-manrope text-[12px]">
                  <InputField placeholder="Họ và Tên" />
                  <InputField placeholder="Số Điện Thoại" />
                  <InputField placeholder="Email" full />
                  <TextareaField placeholder="Nội dung tin nhắn..." />
                </form>
                <div className="flex justify-end">
                  <PillButton label="Gửi" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                {footerSocials.map((item) => (
                  <Image
                    key={item.alt}
                    src={item.src}
                    alt={item.alt}
                    width={36}
                    height={36}
                    className="h-9 w-9"
                  />
                ))}
              </div>
              <div className="flex gap-6 font-manrope text-[12px]">
                <Link href="#" className="transition hover:text-[#555]">
                  Chính sách bảo mật
                </Link>
                <Link href="#" className="transition hover:text-[#555]">
                  Điều khoản sử dụng
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6 font-manrope text-[12px]">
            <Image
              src="/FOOTER/da-thong-bao.png"
              alt="Đã thông báo bộ công thương"
              width={160}
              height={48}
              className="h-auto w-[160px]"
            />
            <p>Bản quyền thuộc về Công Ty TNHH STILE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PillButton({
  label,
  theme = "dark",
}: {
  label: string;
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  return (
    <div data-magnet-btn>
      <div className="cta__item">
        <button
          type="button"
          className={`btn ${isLight ? "btn--light" : ""}`}
        >
          <span className="btn__outline" />
          <span className="btn__hover" />
          <span className="btn__text">{label}</span>
        </button>
      </div>
    </div>
  );
}

function InputField({ placeholder, full }: { placeholder: string; full?: boolean }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`h-10 rounded border border-[#a4a4a4] px-3 text-[#222] placeholder:text-[#a4a4a4] focus:border-[#282828] focus:outline-none ${
        full ? "col-span-2" : "col-span-1"
      }`}
    />
  );
}

function TextareaField({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      placeholder={placeholder}
      rows={3}
      className="col-span-2 rounded border border-[#a4a4a4] px-3 py-2 text-[#222] placeholder:text-[#a4a4a4] focus:border-[#282828] focus:outline-none"
    />
  );
}

function SocialIcon({ icon }: { icon: string }) {
  return (
    <button
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#111] text-[#111] transition hover:bg-[#111] hover:text-white"
      aria-label={icon}
    >
      <span className="text-xs uppercase">{icon.slice(0, 2)}</span>
    </button>
  );
}
