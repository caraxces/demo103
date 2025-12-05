"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import "../styles/cta/button.css";

const FULLPAGE_CONTAINER_ID = "fullpage-scroll";
const HEADER_OFFSET = 80;

const navItems = [
  { label: "Sản Phẩm", href: "#featured", hasDropdown: true as const },
  { label: "Về STile", href: "#about", hasDropdown: false as const },
  { label: "Công Trình & Xu Hướng", href: "#projects", hasDropdown: false as const },
  { label: "Dịch Vụ & Thi Công", href: "#contact", hasDropdown: true as const },
] as const;

const productDropdownItems = [
  { 
    label: "Châu Á", 
    href: "#",
    submenu: {
      title: "KÍCH THƯỚC",
      type: "dimensions",
      leftColumn: ["1200x3000mm", "1200x2780mm", "1200x2400mm", "1200x1200mm", "195x1200mm"],
      rightColumn: ["800x1600mm", "600x1200mm", "800x800mm", "600x600mm", "400x800mm"],
      other: "Khác"
    }
  },
  { 
    label: "Châu Âu", 
    href: "#",
    submenu: {
      title: "KÍCH THƯỚC",
      type: "dimensions",
      leftColumn: ["1620x3240mm", "1200x2800mm", "1200x2780mm", "1200x3000mm", "1000x3000mm"],
      rightColumn: ["200x1200mm", "600x1200mm", "800x800mm", "600x600mm", "300x600mm"],
      other: "Khác"
    }
  },
  { 
    label: "Trang Trí", 
    href: "#",
    submenu: {
      title: "SẢN PHẨM",
      type: "products",
      items: ["Mosaic", "Decor Tiles", "Tranh Mosaic"]
    }
  },
  { 
    label: "Sản Phẩm Khác", 
    href: "#",
    submenu: {
      title: "SẢN PHẨM",
      type: "products",
      items: ["Mosaic", "Decor Tiles", "Tranh Mosaic"]
    }
  },
] as const;

const galleryImages = [
  {
    src: "/ARTILE GALLERY/Rectangle 816.png",
    alt: "Artile Gallery 1",
  },
  {
    src: "/ARTILE GALLERY/Rectangle 817.png",
    alt: "Artile Gallery 2",
  },
  {
    src: "/ARTILE GALLERY/Rectangle 818.png",
    alt: "Artile Gallery 3",
  },
  {
    src: "/ARTILE GALLERY/Rectangle 819.png",
    alt: "Artile Gallery 4",
  },
] as const;

const featuredVariants = [
  {
    id: "gemini-acero",
    collection: "Gemini",
    title: "Acero",
    image: "/SẢN PHẨM NỔI BẬT/1GEMINI_ACERO.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/Acero_Interactive LightMix.jpg",
    description:
      "The profound dialog between humans and nature translates into an interplay of glimpses and reflections, where humans and the earth mirror each other and collaborate in perfect synergy.",
    swatch: "#b68363",
  },
  {
    id: "gemini-grano",
    collection: "Gemini",
    title: "Grano",
    image: "/SẢN PHẨM NỔI BẬT/2GEMINI_GRANO.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/Grano_Interactive LightMix.jpg",
    description:
      "A tactile shade that blends warm minerals and muted neutrals, creating calm, grounding spaces with subtle surface movement.",
    swatch: "#a88b6a",
  },
  {
    id: "gemini-cielo",
    collection: "Gemini",
    title: "Cielo",
    image: "/SẢN PHẨM NỔI BẬT/3GEMINI_CIELO.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/Ceilo_Interactive LightMix.jpg",
    description:
      "Inspired by expansive skies, Cielo layers delicate veining over a soft base, ideal for serene living environments.",
    swatch: "#9aa0a8",
  },
  {
    id: "gemini-cerene",
    collection: "Gemini",
    title: "Cerene",
    image: "/SẢN PHẨM NỔI BẬT/4GEMINI_CERENE.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/Cenere_Interactive LightMix.jpg",
    description:
      "Cerene balances matte and gloss accents to elevate contemporary interiors with refined simplicity.",
    swatch: "#c7b4a3",
  },
  {
    id: "gemini-muschio",
    collection: "Gemini",
    title: "Muschio",
    image: "/SẢN PHẨM NỔI BẬT/6GEMINI_MUSCHIO.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/Muschio_Interactive LightMix.jpg",
    description:
      "Earthy greens paired with organic textures bring a biophilic sensibility to large feature surfaces.",
    swatch: "#71806a",
  },
  {
    id: "gemini-luce",
    collection: "Gemini",
    title: "Luce",
    image: "/SẢN PHẨM NỔI BẬT/6GEMINI_LUCE.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/Luce_Interactive LightMix.jpg",
    description:
      "Luce captures luminous gradients, echoing the softly diffused daylight of refined residential settings.",
    swatch: "#d3c7be",
  },
  {
    id: "gemini-flora-luce",
    collection: "Gemini",
    title: "Flora Luce",
    image: "/SẢN PHẨM NỔI BẬT/7GEMINI_FLORA LUCE.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/FLO_Interactive LightMix.jpg",
    description:
      "Flora Luce celebrates botanical motifs layered over a satin base, creating immersive, nature-led surfaces.",
    swatch: "#8f826d",
  },
  {
    id: "gemini-flora-pelle",
    collection: "Gemini",
    title: "Flora Pelle",
    image: "/SẢN PHẨM NỔI BẬT/8GEMINI_FLORA PELLE.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/FloraPelle_Interactive LightMix.jpg",
    description:
      "A sophisticated interplay of warm undertones and soft botanicals, tailored for hospitality statements.",
    swatch: "#b18e6d",
  },
  {
    id: "gemini-pelle",
    collection: "Gemini",
    title: "Pelle",
    image: "/SẢN PHẨM NỔI BẬT/9GEMINI_PELLE.jpg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/mobile/Pelle_Interactive LightMix.jpg",
    description:
      "Pelle channels handcrafted leather hues, adding depth and character to expansive wall and floor planes. The profound dialog between humans and nature translates into an interplay of glimpsesand reflections, where humans and the earth, twin faces, reflect each other and collaboratein perfect synergy. In the constant interchange with the surrounding environment, nature shows us that we are part of an intricate and wonderful living system. A harmonious meeting, expressed through grandiose and cyclic movements, which give form to the structure itself of the Gemini collection, inspired by the natural flows between earth and sky.",
    swatch: "#b17f5d",
  },
];

const collectionSlides = [
  {
    id: "gemini-01",
    largeImage: "/BỘ SƯU TẬP/collection-img-3.png",
    smallImage: "/BỘ SƯU TẬP/collection-img-4.png",
    title: "Gemini",
    subtitle: "Collection",
    description:
      "The profound dialog between humans and nature translates into an interplay of glimpsesand reflections, where humans and the earth, twin faces, reflect each other and collaboratein perfect synergy.\n\nIn the constant interchange with the surrounding environment, nature shows us that we are part of an intricate and wonderful living system. A harmonious meeting, expressed through grandiose and cyclic movements, which give form to the structure itself of the Gemini collection, inspired by the natural flows between earth and sky.",
    ctaLabel: "Khám phá ngay",
  },
  {
    id: "civic-01",
    largeImage: "/BỘ SƯU TẬP/collection-img-2.png",
    smallImage: "/BỘ SƯU TẬP/collection-img-5.png",
    title: "CiViC",
    subtitle: "Collection",
    description:
      "CiViC explores the concept of material through three variants that interpret the cement effect in different expressive declinations, responding to contemporary urban influences. Cross proposes a cloud-like, shaded effect, restoring the layered texture of cement artefacts. Vein develops dynamic directional veins that accentuate the perception of movement on the surface. Chips introduces material flakes, also available in the Multicolour version to broaden compositional possibilities.",
    ctaLabel: "Khám phá ngay",
  },
  {
    id: "infinito-01",
    largeImage: "/BỘ SƯU TẬP/collection-img-1.png",
    smallImage: "/BỘ SƯU TẬP/collection-img-6.png",
    title: "Infinito 2.0",
    subtitle: "Collection",
    description:
      "From \"total black\", through shades of grey and brown, to all the whites imaginable, the marble in the Infinito 2.0 collection offers different textures, run through with different sized veins that enhance their natural aesthetics and prestige.",
    ctaLabel: "Khám phá ngay",
  },
] as const;

const collectionMobileSlides = [
  {
    id: "gemini-mobile-01",
    image: "/BỘ SƯU TẬP/Clip path group.png",
    heading: "BỘ SƯU TẬP",
    title: "Gemini",
    subtitle: "Collection",
    description:
      "Hòa quyện thiên nhiên và công nghệ, tạo nên bề mặt tinh tế, bền vững và đậm chất đương đại.",
    ctaLabel: "Khám phá ngay",
    backgroundColor: "#5C493A",
  },
  {
    id: "civic-mobile-01",
    image: "/BỘ SƯU TẬP/image copy 2.png",
    heading: "BỘ SƯU TẬP",
    title: "CIVIC",
    subtitle: "Collection",
    description:
      "Bộ sưu tập này biến ý tưởng về vật liệu thành một ngôn ngữ sống động, ba chiều trong tay các nhà thiết kế.",
    ctaLabel: "Khám phá ngay",
    backgroundColor: "#8B6F47",
  },
  {
    id: "infinito-mobile-01",
    image: "/BỘ SƯU TẬP/image.png",
    heading: "BỘ SƯU TẬP",
    title: "Infinito 2.0",
    subtitle: "Collection",
    description:
      "Bộ sưu tập này biến ý tưởng về vật liệu thành một ngôn ngữ sống động, ba chiều trong tay các nhà thiết kế.",
    ctaLabel: "Khám phá ngay",
    backgroundColor: "#6B4E37",
  },
  {
    id: "gemini-mobile-02",
    image: "/BỘ SƯU TẬP/Clip path group2.png",
    heading: "BỘ SƯU TẬP",
    title: "Gemini",
    subtitle: "Collection",
    description: "Những mảng màu trung tính kết hợp ánh sáng tự nhiên mang đến chiều sâu thư thái cho không gian.",
    ctaLabel: "Khám phá ngay",
    backgroundColor: "#5C493A",
  },
  {
    id: "gemini-mobile-03",
    image: "/BỘ SƯU TẬP/Clip path group3.png",
    heading: "BỘ SƯU TẬP",
    title: "Gemini",
    subtitle: "Collection",
    description: "Đường nét tinh giản và bề mặt mịn màng tạo nên phông nền hoàn hảo cho mọi phong cách nội thất.",
    ctaLabel: "Khám phá ngay",
    backgroundColor: "#5C493A",
  },
  {
    id: "gemini-mobile-04",
    image: "/BỘ SƯU TẬP/Clip path group4.png",
    heading: "BỘ SƯU TẬP",
    title: "Gemini",
    subtitle: "Collection",
    description: "Gam màu ấm áp cùng điểm nhấn thiên nhiên đem lại nguồn cảm hứng mới cho những bộ sưu tập cao cấp.",
    ctaLabel: "Khám phá ngay",
    backgroundColor: "#5C493A",
  },
] as const;

const applicationSections = [
  {
    label: "ỐP TƯỜNG",
    items: [
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/ốp tường.png",
        isMain: true,
      },
      {
        title: "LÁT SÀN",
        image: "/ỨNG DỤNG/lát sàn.png",
        isMain: false,
      },
      {
        title: "ĐỒ NỘI THẤT",
        image: "/ỨNG DỤNG/nội thất.png",
        isMain: false,
      },
      {
        title: "MẶT TIỀN KIẾN TRÚC",
        image: "/ỨNG DỤNG/4 - Ảnh Mặt Tiền Kiến Trúc.jpeg",
        isMain: false,
      },
    ],
  },
  {
    label: "LÁT SÀN",
    items: [
      {
        title: "LÁT SÀN",
        image: "/ỨNG DỤNG/lát sàn.png",
        isMain: true,
      },
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/ốp tường.png",
        isMain: false,
      },
      {
        title: "ĐỒ NỘI THẤT",
        image: "/ỨNG DỤNG/nội thất.png",
        isMain: false,
      },
      {
        title: "MẶT TIỀN KIẾN TRÚC",
        image: "/ỨNG DỤNG/4 - Ảnh Mặt Tiền Kiến Trúc.jpeg",
        isMain: false,
      },
    ],
  },
  {
    label: "ĐỒ NỘI THẤT",
    items: [
      {
        title: "ĐỒ NỘI THẤT",
        image: "/ỨNG DỤNG/nội thất.png",
        isMain: true,
      },
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/ốp tường.png",
        isMain: false,
      },
      {
        title: "LÁT SÀN",
        image: "/ỨNG DỤNG/lát sàn.png",
        isMain: false,
      },
      {
        title: "MẶT TIỀN KIẾN TRÚC",
        image: "/ỨNG DỤNG/4 - Ảnh Mặt Tiền Kiến Trúc.jpeg",
        isMain: false,
      },
    ],
  },
  {
    label: "MẶT TIỀN KIẾN TRÚC",
    items: [
      {
        title: "MẶT TIỀN KIẾN TRÚC",
        image: "/ỨNG DỤNG/4 - Ảnh Mặt Tiền Kiến Trúc.jpeg",
        isMain: true,
      },
      {
        title: "ỐP TƯỜNG",
        image: "/ỨNG DỤNG/ốp tường.png",
        isMain: false,
      },
      {
        title: "LÁT SÀN",
        image: "/ỨNG DỤNG/lát sàn.png",
        isMain: false,
      },
      {
        title: "ĐỒ NỘI THẤT",
        image: "/ỨNG DỤNG/nội thất.png",
        isMain: false,
      },
    ],
  },
] as const;

const trendArticles = [
  {
    title: "TÂN CỔ ĐIỂN & NỘI THẤT HIỆN ĐẠI",
    description:
      "Sự dung hòa tinh thần Tân Cổ Điển và đường nét đồ nội thất hiện đại tạo nên một không gian độc đáo bật nhất giữa nét sang trọng và nét nhẹ nhàng tinh tế.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/CÔNG TRÌNH/image2.jpg",
    href: "#",
  },
  {
    title: "THIÊN NHIÊN TRONG PHÒNG NGỦ",
    description:
      "Thổi hồn vào phòng ngủ của bạn với bộ sưu tập Gemini. Được lấy cảm hứng từ sự hòa trộn giữa thiên nhiên với những màu sắc nhẹ nhàng, thanh lịch.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/CÔNG TRÌNH/image.png",
    href: "#",
  },
  {
    title: "KHÔNG GIAN SỐNG HIỆN ĐẠI",
    description:
      "Khám phá những xu hướng thiết kế nội thất hiện đại, tạo nên không gian sống sang trọng và tiện nghi cho gia đình bạn.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/XU HƯỚNG/BÀI POST TRANG 1.jpg",
    href: "#",
  },
  {
    title: "THIẾT KẾ BỀN VỮNG",
    description:
      "Tìm hiểu về các giải pháp thiết kế bền vững, kết hợp giữa vẻ đẹp thẩm mỹ và trách nhiệm với môi trường.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/CÔNG TRÌNH/BÀI POST TRANG 1.jpg",
    href: "#",
  },
  {
    title: "XU HƯỚNG MÀU SẮC 2025",
    description:
      "Cập nhật những xu hướng màu sắc mới nhất trong thiết kế nội thất, mang đến không gian sống tươi mới và hiện đại.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/XU HƯỚNG/2025-11-22_16-01-03.png",
    href: "#",
  },
  {
    title: "CÔNG TRÌNH TIÊU BIỂU",
    description:
      "Chiêm ngưỡng những công trình tiêu biểu được thiết kế và thi công bởi đội ngũ chuyên nghiệp của chúng tôi.",
    image: "/CÔNG TRÌNH VÀ XU HƯỚNG/CÔNG TRÌNH/image2.jpg",
    href: "#",
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
    src: "/BANNER/Rectangle 801.png",
    alt: "Banner 801",
  },
  {
    src: "/BANNER/Rectangle 802.png",
    alt: "Banner 802",
  },
  {
    src: "/BANNER/Rectangle 803.png",
    alt: "Banner 803",
  },
  {
    src: "/BANNER/Rectangle 804.png",
    alt: "Banner 804",
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
    if (window.innerWidth < 769) return; // Only for desktop

    const container = document.getElementById(FULLPAGE_CONTAINER_ID);
    if (!container) return;

    const sections = document.querySelectorAll<HTMLElement>(".fullpage-section");
    if (!sections.length) return;

    // Only show hero section initially, hide all others
    sections.forEach((section, index) => {
      if (index === 0) {
        section.classList.add("is-visible");
      } else {
        section.classList.remove("is-visible");
      }
    });

    const checkVisibleSections = () => {
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      sections.forEach((section, index) => {
        const sectionTop = index * viewportHeight;
        const sectionBottom = (index + 1) * viewportHeight;
        
        // Check if section is in viewport (at least 50% visible)
        const isInViewport = scrollTop >= sectionTop - viewportHeight * 0.5 && 
                            scrollTop < sectionBottom - viewportHeight * 0.5;

        if (isInViewport) {
          section.classList.add("is-visible");
        }
      });
    };

    // Check visible sections on scroll - chỉ để animation fade in/out
    container.addEventListener("scroll", checkVisibleSections, { passive: true });

    // Initial check
    checkVisibleSections();

    return () => {
      container.removeEventListener("scroll", checkVisibleSections);
    };
  }, []);

  return null;
}

function BackgroundColorManager() {
  useEffect(() => {
    if (window.innerWidth < 769) return; // Only for desktop
    
    const container = document.getElementById(FULLPAGE_CONTAINER_ID);
    if (!container) return;

    // Sections without fullwidth images (will transition to #E3DCD1)
    const sectionsWithoutFullwidth = [
      '#about',
      '#applications',
      '#projects',
      '#contact'
    ];

    // Track target color and current color for smooth animation
    // Start with #E3DCD1 (homepage background color)
    let targetColor = '#E3DCD1';
    let currentColor = '#E3DCD1';
    let animationFrameId: number | null = null;

    // Convert hex to RGB
    const hexToRgb = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : [255, 255, 255];
    };

    // Convert RGB to hex
    const rgbToHex = (r: number, g: number, b: number): string => {
      return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    const updateColor = () => {
      const targetRgb = hexToRgb(targetColor);
      const currentRgb = hexToRgb(currentColor);
      
      // Calculate difference
      const diffR = targetRgb[0] - currentRgb[0];
      const diffG = targetRgb[1] - currentRgb[1];
      const diffB = targetRgb[2] - currentRgb[2];
      
      // Check if we need to continue animating
      if (Math.abs(diffR) > 0.5 || Math.abs(diffG) > 0.5 || Math.abs(diffB) > 0.5) {
        // Very slow animation - only move 2% of the difference per frame (waterfall effect)
        currentRgb[0] += diffR * 0.02;
        currentRgb[1] += diffG * 0.02;
        currentRgb[2] += diffB * 0.02;
        
        currentColor = rgbToHex(currentRgb[0], currentRgb[1], currentRgb[2]);
        document.body.style.backgroundColor = currentColor;
        document.documentElement.style.backgroundColor = currentColor;
        
        animationFrameId = requestAnimationFrame(updateColor);
      } else {
        // Animation complete
        currentColor = targetColor;
        document.body.style.backgroundColor = currentColor;
        document.documentElement.style.backgroundColor = currentColor;
        animationFrameId = null;
      }
    };

    const calculateTargetColor = () => {
      const viewportHeight = window.innerHeight;
      let maxVisibility = 0;
      let isSectionWithoutFullwidth = false;

      sectionsWithoutFullwidth.forEach((selector) => {
        const section = document.querySelector<HTMLElement>(selector);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        
        // Calculate how much of the section is visible in viewport
        // rect.top and rect.bottom are relative to viewport
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        
        // Calculate visible portion
        const visibleTop = Math.max(0, -sectionTop);
        const visibleBottom = Math.min(rect.height, viewportHeight - sectionTop);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / Math.min(viewportHeight, rect.height);

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          isSectionWithoutFullwidth = true;
        }
      });

      // Set target color based on visibility
      // Homepage background is always #E3DCD1
      if (isSectionWithoutFullwidth && maxVisibility > 0.2) {
        // Keep #E3DCD1 when on sections without fullwidth (at least 20% visible)
        targetColor = '#E3DCD1';
      } else {
        // Keep #E3DCD1 as default homepage background
        targetColor = '#E3DCD1';
      }

      // Start animation if not already running
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateColor);
      }
    };

    // Set initial body and html background to #E3DCD1 (homepage background)
    document.body.style.backgroundColor = '#E3DCD1';
    document.documentElement.style.backgroundColor = '#E3DCD1';
    document.body.style.transition = 'none'; // No CSS transition, we handle it manually

    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      () => {
        calculateTargetColor();
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "0px",
      }
    );

    // Observe all sections without fullwidth
    sectionsWithoutFullwidth.forEach((selector) => {
      const section = document.querySelector<HTMLElement>(selector);
      if (section) {
        observer.observe(section);
      }
    });

    // Listen to scroll for smooth updates
    const handleScroll = () => {
      calculateTargetColor();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial call
    calculateTargetColor();
    animationFrameId = requestAnimationFrame(updateColor);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return null;
}

export default function Home() {
  return (
    <div className="text-[#111111]" style={{ backgroundColor: '#E3DCD1' }}>
      <DisableZoom />
      <AnchorScrollManager />
      <SectionVisibilityManager />
      <BackgroundColorManager />
      <div id="desktop-layout-wrapper" className="desktop-fixed-layout">
        <Header />
        <main id={FULLPAGE_CONTAINER_ID} className="fullpage-container">
          <Hero />
          <About />
          {/* Mobile Quote Section */}
          <div className="lg:hidden w-full py-12 px-6" style={{ backgroundColor: '#B9B0A1' }}>
            <p className="text-center italic text-white" style={{ fontSize: '24px', fontStyle: 'italic' }}>
              "Your Style, Our Pride"
            </p>
          </div>
          <Gallery />
          <FeaturedProducts />
          <Collections />
          <Applications />
          <Projects />
          <CatalogueCtaAndFooter />
        </main>
      </div>
    </div>
  );
}

type DropdownType = 'product' | 'service' | 'menu';

function HeaderDropdownMenu({ 
  onLightSection, 
  type = 'menu',
  triggerLabel,
  triggerHref,
}: { 
  onLightSection: boolean;
  type?: DropdownType;
  triggerLabel?: string;
  triggerHref?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (type === 'menu') {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const clickedMenu = menuRef.current?.contains(target);
        const clickedButton = buttonRef.current?.contains(target);
        
      if (
        menuRef.current && 
        !clickedMenu &&
        buttonRef.current &&
        !clickedButton
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    }
  }, [isOpen, type]);

  const menuItems = {
    studio: {
      title: "STILE STUDIO",
      items: [
        { label: "Thiết Kế", href: "#" },
        { label: "Thi Công", href: "#" },
      ],
    },
    policy: {
      title: "CHÍNH SÁCH",
      items: [
        { label: "Bảo Hành", href: "#" },
        { label: "Chứng Nhận", href: "#" },
        { label: "Đổi Trả", href: "#" },
      ],
    },
    download: {
      title: "DOWNLOAD",
      items: [
        { label: "Catalogue", href: "#" },
        { label: "Hướng Dẫn Thi Công", href: "#" },
        { label: "Thông Số Kỹ Thuật", href: "#" },
        { label: "Hướng Dẫn Vệ Sinh", href: "#" },
      ],
    },
  };

  const textColor = onLightSection ? "text-[#111111]" : "text-white";
  const navLinkClass = onLightSection ? "text-[#111111] hover:text-[#555555]" : "text-white hover:text-gray-300";

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    if (type === 'product' || type === 'service') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsHovered(true);
    } else {
      handleToggle();
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (type === 'product' || type === 'service') {
      const relatedTarget = e.relatedTarget as Node | null;
      
      // Clear timeout khi chuột rời
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Chỉ tắt dropdown nếu chuột không ở trong trigger hoặc dropdown
      const isLeavingToTrigger = menuRef.current?.contains(relatedTarget);
      const isLeavingToDropdown = dropdownRef.current?.contains(relatedTarget);
      
      if (!isLeavingToTrigger && !isLeavingToDropdown) {
        // Delay để cho phép chuột di chuyển từ trigger sang dropdown
        timeoutRef.current = setTimeout(() => {
          // Kiểm tra lại một lần nữa trước khi tắt
          if (!menuRef.current?.contains(document.activeElement) && 
              !dropdownRef.current?.contains(document.activeElement)) {
            setIsHovered(false);
            setHoveredItemIndex(null);
          }
        }, 200);
      }
    }
  };

  const handleDropdownMouseEnter = () => {
    if (type === 'product' || type === 'service') {
      // Clear timeout khi chuột vào dropdown để giữ dropdown mở
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsHovered(true);
    }
  };

  const handleDropdownMouseLeave = (e: React.MouseEvent) => {
    if (type === 'product' || type === 'service') {
      const relatedTarget = e.relatedTarget as Node | null;
      
      // Clear timeout khi chuột rời
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Chỉ tắt dropdown nếu chuột không ở trong trigger hoặc dropdown
      const isLeavingToTrigger = menuRef.current?.contains(relatedTarget);
      const isLeavingToDropdown = dropdownRef.current?.contains(relatedTarget);
      
      if (!isLeavingToTrigger && !isLeavingToDropdown) {
        timeoutRef.current = setTimeout(() => {
          setIsHovered(false);
          setHoveredItemIndex(null);
        }, 150);
      }
    }
  };

  const shouldShowDropdown = type === 'menu' ? (isOpen && mounted) : (isHovered && mounted);
  const hoveredItem = hoveredItemIndex !== null ? productDropdownItems[hoveredItemIndex] : null;
  
  const renderDropdownContent = () => {
    if (type === 'product') {
  return (
        <div 
          className="grid grid-cols-2 gap-0"
          style={{
            paddingTop: 'calc(32px * (100vw / 1440px))',
            paddingBottom: 'calc(32px * (100vw / 1440px))',
          }}
        >
          {/* Left Column - GẠCH ỐP LÁT */}
          <div 
            className="flex flex-col border-r border-black"
            style={{ 
              paddingRight: 'calc(32px * (100vw / 1440px))',
            }}
          >
            <h3 
              className="font-heading uppercase text-[#111111]"
              style={{ 
                fontSize: 'calc(32px * (100vw / 1440px))',
                letterSpacing: '6%',
                marginBottom: 'calc(24px * (100vw / 1440px))',
              }}
            >
              GẠCH ỐP LÁT
            </h3>
            <ul 
              className="space-y-3"
              style={{
                gap: 'calc(12px * (100vw / 1440px))',
              }}
            >
              {productDropdownItems.map((item, index) => (
                <li 
                  key={item.label}
                  onMouseEnter={() => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }
                    setHoveredItemIndex(index);
                  }}
                  onMouseLeave={() => {
                    timeoutRef.current = setTimeout(() => {
                      setHoveredItemIndex(null);
                    }, 200);
                  }}
                >
                  <Link
                    href={item.href}
                    className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition block"
                    style={{ 
                      color: '#111111',
                      fontSize: 'calc(14px * (100vw / 1440px))',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Sub-dropdown Content */}
          <div 
            className="flex flex-col"
            style={{
              paddingLeft: 'calc(32px * (100vw / 1440px))',
            }}
          >
            {hoveredItem && hoveredItem.submenu && (
              <div
                className="transition-all duration-300 ease-out"
                style={{
                  opacity: hoveredItem ? 1 : 0,
                  transform: hoveredItem ? 'translateX(0)' : 'translateX(-10px)',
                }}
              >
                <h4 
                  className="font-heading uppercase text-[#111111]"
                  style={{ 
                    fontSize: 'calc(32px * 0.85 * (100vw / 1440px))',
                    letterSpacing: '6%',
                    marginBottom: 'calc(24px * 0.85 * (100vw / 1440px))',
                  }}
                >
                  {hoveredItem.submenu.title}
                </h4>
                {hoveredItem.submenu.type === "dimensions" && (
                  <div 
                    className="grid grid-cols-3"
                    style={{
                      gap: 'calc(16px * 0.85 * (100vw / 1440px))',
                    }}
                  >
                    <div 
                      className="flex flex-col"
                      style={{
                        gap: 'calc(8px * 0.85 * (100vw / 1440px))',
                      }}
                    >
                      {hoveredItem.submenu.leftColumn.map((dim, i) => (
                        <span 
                          key={i} 
                          className="font-montserrat text-[#111111]"
                          style={{
                            fontSize: 'calc(14px * 0.85 * (100vw / 1440px))',
                          }}
                        >
                          {dim}
                        </span>
                      ))}
                    </div>
                    <div 
                      className="flex flex-col"
                      style={{
                        gap: 'calc(8px * 0.85 * (100vw / 1440px))',
                      }}
                    >
                      {hoveredItem.submenu.rightColumn.map((dim, i) => (
                        <span 
                          key={i} 
                          className="font-montserrat text-[#111111]"
                          style={{
                            fontSize: 'calc(14px * 0.85 * (100vw / 1440px))',
                          }}
                        >
                          {dim}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <span 
                        className="font-montserrat text-[#111111]"
                        style={{
                          fontSize: 'calc(14px * 0.85 * (100vw / 1440px))',
                        }}
                      >
                        {hoveredItem.submenu.other}
                      </span>
                    </div>
                  </div>
                )}
                {hoveredItem.submenu.type === "products" && (
                  <div 
                    className="flex flex-col"
                    style={{
                      gap: 'calc(12px * 0.85 * (100vw / 1440px))',
                    }}
                  >
                    {hoveredItem.submenu.items.map((product, i) => (
                      <span 
                        key={i} 
                        className="font-montserrat text-[#111111]"
                        style={{
                          fontSize: 'calc(14px * 0.85 * (100vw / 1440px))',
                        }}
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    } else if (type === 'service') {
      return (
            <div 
              className="grid grid-cols-3 gap-0"
              style={{
            paddingTop: 'calc(32px * (100vw / 1440px))',
            paddingBottom: 'calc(32px * (100vw / 1440px))',
          }}
        >
          {/* Column 1: STILE STUDIO */}
          <div className="flex flex-col">
            <h3 
              className="font-heading uppercase text-[#111111]"
              style={{
                fontSize: 'calc(32px * (100vw / 1440px))',
                letterSpacing: '6%',
                marginBottom: 'calc(24px * (100vw / 1440px))',
              }}
            >
              {menuItems.studio.title}
            </h3>
            <ul 
              className="space-y-3"
              style={{
                gap: 'calc(12px * (100vw / 1440px))',
              }}
            >
              {menuItems.studio.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition"
                    style={{
                      fontSize: 'calc(14px * (100vw / 1440px))',
                      color: '#111111',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: CHÍNH SÁCH */}
          <div 
            className="flex flex-col border-l border-gray-300"
            style={{
              paddingLeft: 'calc(32px * (100vw / 1440px))',
            }}
          >
            <h3 
              className="font-heading uppercase text-[#111111]"
              style={{
                fontSize: 'calc(32px * (100vw / 1440px))',
                letterSpacing: '6%',
                marginBottom: 'calc(24px * (100vw / 1440px))',
              }}
            >
              {menuItems.policy.title}
            </h3>
            <ul 
              className="space-y-3"
              style={{
                gap: 'calc(12px * (100vw / 1440px))',
              }}
            >
              {menuItems.policy.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition"
                    style={{
                      fontSize: 'calc(14px * (100vw / 1440px))',
                      color: '#111111',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: DOWNLOAD */}
          <div 
            className="flex flex-col border-l border-gray-300"
            style={{
              paddingLeft: 'calc(32px * (100vw / 1440px))',
            }}
          >
            <h3 
              className="font-heading uppercase text-[#111111]"
              style={{
                fontSize: 'calc(32px * (100vw / 1440px))',
                letterSpacing: '6%',
                marginBottom: 'calc(24px * (100vw / 1440px))',
              }}
            >
              {menuItems.download.title}
            </h3>
            <ul 
              className="space-y-3"
              style={{
                gap: 'calc(12px * (100vw / 1440px))',
              }}
            >
              {menuItems.download.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition"
                    style={{
                      fontSize: 'calc(14px * (100vw / 1440px))',
                      color: '#111111',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    } else {
      // Menu type
      return (
        <div 
          className="grid grid-cols-3 gap-0"
          style={{
            paddingTop: 'calc(32px * (100vw / 1440px))',
            paddingBottom: 'calc(32px * (100vw / 1440px))',
              }}
            >
              {/* Column 1: STILE STUDIO */}
              <div className="flex flex-col">
                <h3 
                  className="font-heading font-bold uppercase tracking-[0.05em] mb-6 text-[#111111]"
                  style={{
                    fontSize: 'calc(18px * (100vw / 1440px))',
                    marginBottom: 'calc(24px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.studio.title}
                </h3>
                <ul 
                  className="space-y-3"
                  style={{
                    gap: 'calc(12px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.studio.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition"
                        style={{
                          fontSize: 'calc(14px * (100vw / 1440px))',
                      color: '#111111',
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: CHÍNH SÁCH */}
              <div 
                className="flex flex-col border-l border-gray-300"
                style={{
                  paddingLeft: 'calc(32px * (100vw / 1440px))',
                }}
              >
                <h3 
                  className="font-heading font-bold uppercase tracking-[0.05em] mb-6 text-[#111111]"
                  style={{
                    fontSize: 'calc(18px * (100vw / 1440px))',
                    marginBottom: 'calc(24px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.policy.title}
                </h3>
                <ul 
                  className="space-y-3"
                  style={{
                    gap: 'calc(12px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.policy.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition"
                        style={{
                          fontSize: 'calc(14px * (100vw / 1440px))',
                      color: '#111111',
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: DOWNLOAD */}
              <div 
                className="flex flex-col border-l border-gray-300"
                style={{
                  paddingLeft: 'calc(32px * (100vw / 1440px))',
                }}
              >
                <h3 
                  className="font-heading font-bold uppercase tracking-[0.05em] mb-6 text-[#111111]"
                  style={{
                    fontSize: 'calc(18px * (100vw / 1440px))',
                    marginBottom: 'calc(24px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.download.title}
                </h3>
                <ul 
                  className="space-y-3"
                  style={{
                    gap: 'calc(12px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.download.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition"
                        style={{
                          fontSize: 'calc(14px * (100vw / 1440px))',
                      color: '#111111',
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
      );
    }
  };
  
  const dropdownContent = shouldShowDropdown ? (
    <>
      {type === 'menu' && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed left-0 right-0 border-t border-b border-black transition-all duration-300 ease-out z-50 ${
          type === 'product' || type === 'service' 
            ? 'bg-[#EEEBE6]' 
            : 'bg-[#E3DCD1]'
        } ${
          type === 'product' || type === 'service'
            ? (isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none')
            : ''
        }`}
        style={{ 
          top: `calc(54px * (100vw / 1440px) + 5px)`,
          width: '100%',
          minHeight: '200px',
        }}
        ref={type === 'product' || type === 'service' ? dropdownRef : menuRef}
        onMouseEnter={type === 'product' || type === 'service' ? handleDropdownMouseEnter : undefined}
        onMouseLeave={type === 'product' || type === 'service' ? (e: any) => handleDropdownMouseLeave(e) : undefined}
      >
        <div 
          className="mx-auto"
          style={{
            maxWidth: 'calc(1440px * (100vw / 1440px))',
            paddingLeft: 'calc(104px * (100vw / 1440px))',
            paddingRight: 'calc(104px * (100vw / 1440px))',
          }}
        >
          {renderDropdownContent()}
            </div>
          </div>
        </>
  ) : null;

  const triggerElement = type === 'menu' ? (
    <button
      type="button"
      ref={buttonRef}
      onClick={handleToggle}
      className={`transition ${navLinkClass} inline-block`}
      style={{
        fontSize: 'calc(15px * (100vw / 1440px))',
        letterSpacing: 'calc(0.06em * (100vw / 1440px))',
      }}
    >
      {triggerLabel || 'Menu'}
    </button>
  ) : (
    <Link 
      href={triggerHref || '#'} 
      ref={linkRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition ${navLinkClass} inline-block`}
      style={{
        fontSize: 'calc(15px * (100vw / 1440px))',
        letterSpacing: 'calc(0.06em * (100vw / 1440px))',
      }}
    >
      {triggerLabel}
    </Link>
  );

  return (
    <div 
      ref={type === 'product' || type === 'service' ? menuRef : undefined}
      onMouseEnter={type === 'product' || type === 'service' ? handleMouseEnter : undefined}
      onMouseLeave={type === 'product' || type === 'service' ? handleMouseLeave : undefined}
    >
      {triggerElement}
      {mounted && createPortal(dropdownContent, document.body)}
    </div>
  );
}

function ProductDropdownMenu({ onLightSection }: { onLightSection: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navLinkClass = "text-[#111111] hover:text-[#555555]";

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Kiểm tra nếu chuột rời khỏi toàn bộ vùng dropdown (menu trigger + dropdown panel)
    const relatedTarget = e.relatedTarget as Node | null;
    if (
      menuRef.current &&
      dropdownRef.current &&
      relatedTarget &&
      !menuRef.current.contains(relatedTarget) &&
      !dropdownRef.current.contains(relatedTarget)
    ) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
        setHoveredItemIndex(null);
      }, 150); // 150ms delay before closing
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const hoveredItem = hoveredItemIndex !== null ? productDropdownItems[hoveredItemIndex] : null;

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <Link href="#featured" className={`transition ${navLinkClass} inline-block`}>
        Sản Phẩm
      </Link>
      <div
        ref={dropdownRef}
        className={`fixed left-0 right-0 bg-[#EEEBE6] border-t border-b border-black transition-all duration-300 ease-out ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ 
          top: `calc(54px * (100vw / 1440px) + 5px)`,
          width: '100%',
          minHeight: '200px',
          zIndex: 40,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={(e) => handleMouseLeave(e)}
      >
          <div 
            className="mx-auto"
            style={{
              maxWidth: 'calc(1440px * (100vw / 1440px))',
              paddingLeft: 'calc(104px * (100vw / 1440px))',
              paddingRight: 'calc(104px * (100vw / 1440px))',
            }}
          >
            <div 
              className="grid grid-cols-2 gap-0"
              style={{
                paddingTop: 'calc(32px * (100vw / 1440px))',
                paddingBottom: 'calc(32px * (100vw / 1440px))',
              }}
            >
              {/* Left Column - GẠCH ỐP LÁT */}
              <div 
                className="flex flex-col border-r border-black"
                style={{
                  paddingRight: 'calc(32px * (100vw / 1440px))',
                }}
              >
                <h3 
                  className="font-heading uppercase text-[#111111]"
                  style={{ 
                    fontSize: 'calc(32px * (100vw / 1440px))',
                    letterSpacing: '6%',
                    marginBottom: 'calc(24px * (100vw / 1440px))',
                  }}
                >
                  GẠCH ỐP LÁT
                </h3>
                <ul 
                  className="space-y-3"
                  style={{
                    gap: 'calc(12px * (100vw / 1440px))',
                  }}
                >
                  {productDropdownItems.map((item, index) => (
                    <li 
                      key={item.label}
                      onMouseEnter={() => {
                        if (timeoutRef.current) {
                          clearTimeout(timeoutRef.current);
                          timeoutRef.current = null;
                        }
                        setHoveredItemIndex(index);
                      }}
                      onMouseLeave={() => {
                        timeoutRef.current = setTimeout(() => {
                          setHoveredItemIndex(null);
                        }, 200);
                      }}
                    >
                      <Link
                        href={item.href}
                        className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition block"
                        style={{ 
                          color: '#111111',
                          fontSize: 'calc(14px * (100vw / 1440px))',
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column - Sub-dropdown Content */}
              <div 
                className="flex flex-col"
                style={{
                  paddingLeft: 'calc(32px * (100vw / 1440px))',
                }}
              >
                {hoveredItem && hoveredItem.submenu && (
                  <div
                    className="transition-all duration-300 ease-out"
                    style={{
                      opacity: hoveredItem ? 1 : 0,
                      transform: hoveredItem ? 'translateX(0)' : 'translateX(-10px)',
                    }}
                  >
                    <h4 
                      className="font-heading uppercase text-[#111111]"
                      style={{ 
                        fontSize: 'calc(32px * (100vw / 1440px))',
                        letterSpacing: '6%',
                        marginBottom: 'calc(24px * (100vw / 1440px))',
                      }}
                    >
                      {hoveredItem.submenu.title}
                    </h4>
                    {hoveredItem.submenu.type === "dimensions" && (
                      <div 
                        className="grid grid-cols-3"
                        style={{
                          gap: 'calc(16px * (100vw / 1440px))',
                        }}
                      >
                        <div 
                          className="flex flex-col"
                          style={{
                            gap: 'calc(8px * (100vw / 1440px))',
                          }}
                        >
                          {hoveredItem.submenu.leftColumn.map((dim, i) => (
                            <span 
                              key={i} 
                              className="font-montserrat text-[#111111]"
                              style={{
                                fontSize: 'calc(14px * (100vw / 1440px))',
                              }}
                            >
                              {dim}
                            </span>
                          ))}
                        </div>
                        <div 
                          className="flex flex-col"
                          style={{
                            gap: 'calc(8px * (100vw / 1440px))',
                          }}
                        >
                          {hoveredItem.submenu.rightColumn.map((dim, i) => (
                            <span 
                              key={i} 
                              className="font-montserrat text-[#111111]"
                              style={{
                                fontSize: 'calc(14px * (100vw / 1440px))',
                              }}
                            >
                              {dim}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span 
                            className="font-montserrat text-[#111111]"
                            style={{
                              fontSize: 'calc(14px * (100vw / 1440px))',
                            }}
                          >
                            {hoveredItem.submenu.other}
                          </span>
                        </div>
                      </div>
                    )}
                    {hoveredItem.submenu.type === "products" && (
                      <div 
                        className="flex flex-col"
                        style={{
                          gap: 'calc(12px * (100vw / 1440px))',
                        }}
                      >
                        {hoveredItem.submenu.items.map((product, i) => (
                          <span 
                            key={i} 
                            className="font-montserrat text-[#111111]"
                            style={{
                              fontSize: 'calc(14px * (100vw / 1440px))',
                            }}
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function ServiceDropdownMenu({ onLightSection }: { onLightSection: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navLinkClass = "text-[#111111] hover:text-[#555555]";

  const menuItems = {
    studio: {
      title: "STILE STUDIO",
      items: [
        { label: "Thiết Kế", href: "#" },
        { label: "Thi Công", href: "#" },
      ],
    },
    policy: {
      title: "CHÍNH SÁCH",
      items: [
        { label: "Bảo Hành", href: "#" },
        { label: "Chứng Nhận", href: "#" },
        { label: "Đổi Trả", href: "#" },
      ],
    },
    download: {
      title: "DOWNLOAD",
      items: [
        { label: "Catalogue", href: "#" },
        { label: "Hướng Dẫn Thi Công", href: "#" },
        { label: "Thông Số Kỹ Thuật", href: "#" },
        { label: "Hướng Dẫn Vệ Sinh", href: "#" },
      ],
    },
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Kiểm tra nếu chuột rời khỏi toàn bộ vùng dropdown (menu trigger + dropdown panel)
    const relatedTarget = e.relatedTarget as Node | null;
    if (
      menuRef.current &&
      dropdownRef.current &&
      relatedTarget &&
      !menuRef.current.contains(relatedTarget) &&
      !dropdownRef.current.contains(relatedTarget)
    ) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 150); // 150ms delay before closing
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={(e) => handleMouseLeave(e)}
      ref={menuRef}
    >
      <Link href="#contact" className={`transition ${navLinkClass} inline-block`}>
        Dịch Vụ & Thi Công
      </Link>
      <div
        ref={dropdownRef}
        className={`fixed left-0 right-0 bg-[#EEEBE6] border-t border-b border-black transition-all duration-300 ease-out ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ 
          top: `calc(54px * (100vw / 1440px) + 5px)`,
          width: '100%',
          minHeight: '200px',
          zIndex: 40,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={(e) => handleMouseLeave(e)}
      >
        <div 
          className="mx-auto"
          style={{
            maxWidth: 'calc(1440px * (100vw / 1440px))',
            paddingLeft: 'calc(104px * (100vw / 1440px))',
            paddingRight: 'calc(104px * (100vw / 1440px))',
          }}
        >
          <div 
            className="grid grid-cols-3 gap-0"
            style={{
              paddingTop: 'calc(32px * (100vw / 1440px))',
              paddingBottom: 'calc(32px * (100vw / 1440px))',
            }}
          >
            {/* Column 1: STILE STUDIO */}
              <div 
                className="flex flex-col border-r border-black"
                style={{
                  paddingRight: 'calc(32px * (100vw / 1440px))',
                }}
              >
                <h3 
                  className="font-heading uppercase text-[#111111]"
                  style={{ 
                    fontSize: 'calc(32px * (100vw / 1440px))',
                    letterSpacing: '6%',
                    marginBottom: 'calc(24px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.studio.title}
                </h3>
                <ul 
                  className="space-y-3"
                  style={{
                    gap: 'calc(12px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.studio.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition block"
                        style={{ 
                          color: '#111111',
                          fontSize: 'calc(14px * (100vw / 1440px))',
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: CHÍNH SÁCH */}
              <div 
                className="flex flex-col border-r border-black"
                style={{
                  paddingLeft: 'calc(32px * (100vw / 1440px))',
                  paddingRight: 'calc(32px * (100vw / 1440px))',
                }}
              >
                <h3 
                  className="font-heading uppercase text-[#111111]"
                  style={{ 
                    fontSize: 'calc(32px * (100vw / 1440px))',
                    letterSpacing: '6%',
                    marginBottom: 'calc(24px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.policy.title}
                </h3>
                <ul 
                  className="space-y-3"
                  style={{
                    gap: 'calc(12px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.policy.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition block"
                        style={{ 
                          color: '#111111',
                          fontSize: 'calc(14px * (100vw / 1440px))',
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: DOWNLOAD */}
              <div 
                className="flex flex-col"
                style={{
                  paddingLeft: 'calc(32px * (100vw / 1440px))',
                }}
              >
                <h3 
                  className="font-heading uppercase text-[#111111]"
                  style={{ 
                    fontSize: 'calc(32px * (100vw / 1440px))',
                    letterSpacing: '6%',
                    marginBottom: 'calc(24px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.download.title}
                </h3>
                <ul 
                  className="space-y-3"
                  style={{
                    gap: 'calc(12px * (100vw / 1440px))',
                  }}
                >
                  {menuItems.download.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-montserrat font-normal tracking-[0.02em] text-[#111111] hover:opacity-70 transition block"
                        style={{ 
                          color: '#111111',
                          fontSize: 'calc(14px * (100vw / 1440px))',
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function Header() {
  const [pastHero, setPastHero] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [onLightSection, setOnLightSection] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 980);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = document.getElementById(FULLPAGE_CONTAINER_ID);
          const scrollY = container ? container.scrollTop : window.scrollY || window.pageYOffset;
          
          // Nếu scroll xuống và đã scroll quá một khoảng nhỏ
          if (scrollY > lastScrollY.current && scrollY > 100) {
            setIsHeaderVisible(false);
          } 
          // Nếu scroll lên
          else if (scrollY < lastScrollY.current) {
            setIsHeaderVisible(true);
          }
          
          // Nếu ở đầu trang, luôn hiển thị header
          if (scrollY <= 0) {
            setIsHeaderVisible(true);
          }
          
          lastScrollY.current = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    const container = document.getElementById(FULLPAGE_CONTAINER_ID);
    const target = container || window;
    
    // Set initial scroll position
    lastScrollY.current = container ? container.scrollTop : window.scrollY || window.pageYOffset;
    
    target.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      target.removeEventListener('scroll', handleScroll);
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

  const navLinkClass = isMobile
    ? (onLightSection
    ? "text-[#111111] hover:text-[#555555]"
        : "text-white hover:text-[#f2f2f2]")
    : (pastHero ? "text-[#111111] hover:text-[#555555]" : "text-white hover:text-[#f2f2f2]");

  // Logo đen chính - hiển thị cùng logic với text
  // Desktop: đen khi pastHero, trắng khi ở hero. Mobile: đen khi onLightSection, trắng khi không
  const logoSrc = "/New STILE Logo Vector 1-16.png";

  const baseHeight = pastHero ? 29 : 40;
  const headerHeight = isHeaderHovered ? baseHeight + 6 : baseHeight;
  // Logo height calculation: logo width * (34/90) + 5px
  // Desktop: calc(71.5px * (100vw / 1440px)) * (34/90) + 5px = calc(27px * (100vw / 1440px)) + 5px
  // Mobile: 120px * (34/90) + 5px = 45.33px + 5px = 50.33px

  return (
    <header
      onMouseEnter={() => setIsHeaderHovered(true)}
      onMouseLeave={() => setIsHeaderHovered(false)}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-in-out ${
        isMobile && onLightSection ? "text-[#111111]" : isMobile ? "text-white" : (pastHero ? "text-[#111111]" : "text-white")
      }`}
      style={{ 
        height: `${headerHeight}px`,
        width: '100%',
        transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isHeaderVisible ? 1 : 0,
        pointerEvents: isHeaderVisible ? 'auto' : 'none',
      }}
    >
      {/* Background layer with double height */}
      <div
        className="absolute left-0 right-0 top-0 transition-all duration-500 ease-in-out"
        style={{
          height: isMobile 
            ? `${120 * (34 / 90) + 5}px` 
            : `calc(54px * (100vw / 1440px) + 5px)`,
          width: '100%',
          backgroundColor: pastHero ? '#EEEBE6' : 'transparent',
          zIndex: -1,
        }}
      />
      <div 
        className="relative mx-auto flex h-full w-full items-center px-6 max-lg:px-6"
        style={{
          paddingLeft: isMobile ? '24px' : 'calc(24px * (100vw / 1440px))',
          paddingRight: isMobile ? '24px' : 'calc(57px * (100vw / 1440px))',
          paddingTop: isMobile ? '30px' : 'calc(20px * (100vw / 1440px))',
        }}
      >
        <Link href="#hero" className="flex items-center z-10" style={{
          marginLeft: isMobile ? '0' : 'calc(60px * (100vw / 1440px))',
        }}>
          <Image
            src={logoSrc}
            alt="Stile logo"
            width={90}
            height={34}
            priority
            className="h-auto transition-all duration-300"
            style={{
              width: isMobile ? '120px' : 'calc(71.5px * (100vw / 1440px))',
              marginTop: isMobile ? '20px' : 'calc(5px * (100vw / 1440px))',
              // Logo đen: desktop khi pastHero (invert), mobile khi onLightSection = true
              // Logo trắng: desktop khi ở hero, mobile khi onLightSection = false
              filter: isMobile ? (onLightSection ? 'brightness(0)' : 'none') : (pastHero ? 'brightness(0)' : 'none'),
            }}
          />
        </Link>
        <nav 
          className="hidden items-center lg:flex absolute left-1/2 -translate-x-1/2"
          style={{
            gap: 'calc(40px * (100vw / 1440px))',
            fontSize: 'calc(15px * (100vw / 1440px))',
            letterSpacing: 'calc(0.06em * (100vw / 1440px))',
          }}
        >
          {navItems.map((item) => (
            <div key={item.label} className="group">
              {item.hasDropdown ? (
                item.label === "Sản Phẩm" ? (
                  <HeaderDropdownMenu 
                    onLightSection={pastHero} 
                    type="product"
                    triggerLabel="Sản Phẩm"
                    triggerHref="#featured"
                  />
                ) : (
                  <HeaderDropdownMenu 
                    onLightSection={pastHero} 
                    type="service"
                    triggerLabel="Dịch Vụ & Thi Công"
                    triggerHref="#contact"
                  />
                )
              ) : (
                <Link href={item.href} className={`transition ${navLinkClass}`}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <HeaderDropdownMenu 
            onLightSection={pastHero} 
            type="menu"
            triggerLabel="Menu"
          />
        </nav>
        <div 
          className="hidden items-center lg:flex ml-auto z-10"
          style={{
            gap: 'calc(24px * (100vw / 1440px))',
            fontSize: 'calc(15px * (100vw / 1440px))',
            letterSpacing: 'calc(0.06em * (100vw / 1440px))',
          }}
        >
          <button
            type="button"
            aria-label="Tìm kiếm"
            className={`flex items-center justify-center rounded-full border transition ${
              pastHero
                ? "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                : "border-white text-white hover:bg-white/20"
            }`}
            style={{
              width: 'calc(40px * (100vw / 1440px))',
              height: 'calc(40px * (100vw / 1440px))',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                width: 'calc(18px * (100vw / 1440px))',
                height: 'calc(18px * (100vw / 1440px))',
              }}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </button>
          <Link href="#contact" className={`transition ${navLinkClass}`}>
            Liên hệ
          </Link>
          <button
            type="button"
            className={`rounded-full border transition ${
              pastHero
                ? "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                : "border-white text-white hover:bg-white/20"
            }`}
            style={{
              paddingLeft: 'calc(16px * (100vw / 1440px))',
              paddingRight: 'calc(16px * (100vw / 1440px))',
              paddingTop: 'calc(4px * (100vw / 1440px))',
              paddingBottom: 'calc(4px * (100vw / 1440px))',
              fontSize: 'calc(13px * (100vw / 1440px))',
              letterSpacing: 'calc(0.12em * (100vw / 1440px))',
            }}
          >
            VN / EN
          </button>
        </div>
        <div className="relative lg:hidden">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
              onLightSection
                ? "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                : "border-white text-white hover:bg-white/20"
            }`}
          >
            <span className="flex flex-col items-center justify-center gap-[8px]">
              <span className={`block h-[2.5px] w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[10px]' : ''}`} />
              <span className={`block h-[2.5px] w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2.5px] w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`} />
            </span>
          </button>
          {isMobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div
                className={`fixed right-0 top-0 bottom-0 w-[280px] shadow-lg transition-transform duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } ${
                  onLightSection 
                    ? 'bg-white' 
                    : 'bg-[#111111]'
                }`}
                style={{ zIndex: 1000 }}
              >
                <nav className="flex flex-col py-4 h-full">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-6 py-3 transition text-[15px] font-normal tracking-[0.06em] ${
                        onLightSection
                          ? 'text-[#111111] hover:bg-gray-100'
                          : 'text-white hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-6 py-3 transition text-[15px] font-normal tracking-[0.06em] ${
                      onLightSection
                        ? 'text-[#111111] hover:bg-gray-100'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    Liên hệ
                  </Link>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="hero"
      className="fullpage-section relative flex min-h-[100vh] w-full items-center justify-center overflow-hidden text-white lg:min-h-0"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent lg:hidden" />
      </div>

      <div 
        className="relative z-10 mx-auto flex w-full flex-col items-center text-center max-lg:max-w-[1440px] max-lg:gap-[28px] max-lg:px-6"
        style={{
          maxWidth: isMobile ? '100%' : 'calc(1440px * (100vw / 1440px))',
          gap: isMobile ? '28px' : 'calc(28px * (100vw / 1440px))',
          paddingLeft: isMobile ? '24px' : 'calc(24px * (100vw / 1440px))',
          paddingRight: isMobile ? '24px' : 'calc(24px * (100vw / 1440px))',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h1 
          className="font-heading uppercase max-lg:max-w-[685px] max-lg:leading-[56px] max-lg:tracking-[0.02em]"
          style={{
            maxWidth: !isMobile ? 'calc(685px * (100vw / 1440px))' : '100%',
            fontSize: !isMobile ? 'calc(58px * (100vw / 1440px))' : '40px',
            lineHeight: !isMobile ? 'calc(73px * (100vw / 1440px))' : '56px',
            letterSpacing: !isMobile ? 'calc(1.16px * (100vw / 1440px))' : '0.02em',
          }}
        >
          <span className="hidden lg:inline whitespace-pre">
            <span className="block">BỀ MẶT LẤY CẢM HỨNG</span>
            <span className="block">TỪ THIÊN NHIÊN</span>
          </span>
          <span className="block lg:hidden whitespace-pre">
            <span className="block">BỀ MẶT LẤY CẢM HỨNG</span>
            <span className="block">TỪ THIÊN NHIÊN</span>
          </span>
        </h1>
        <p 
          className="font-alt font-normal max-lg:max-w-[593px]"
          style={{
            maxWidth: !isMobile ? 'calc(593px * (100vw / 1440px))' : '100%',
            fontSize: !isMobile ? 'calc(18px * (100vw / 1440px))' : 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
            lineHeight: !isMobile ? 'calc(24px * (100vw / 1440px))' : 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
          }}
        >
          <span className="hidden lg:inline">Thiết kế độc đáo phối hòa đường nét thanh lịch, tinh tế.</span>
          <span className="block lg:hidden">
            Thiết kế độc đáo phối hòa đường nét thanh lịch, tinh tế.
          </span>
        </p>
        <PillButton theme="dark" label="Khám phá ngay" />
      </div>
    </section>
  );
}

function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        // Mobile: < 980px (layout dọc)
        setIsMobile(width < 980);
        // Tablet: 980px - 1439px (layout riêng, scale từ 1440px)
        setIsTablet(width >= 980 && width < 1440);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const node = stickyRef.current;
    if (!node) return;
    // Trên tablet, hiển thị ảnh ngay lập tức
    if (isTablet) {
      setImageVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setImageVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isTablet]);

  useEffect(() => {
    const imageNode = stickyRef.current;
    const textNode = textRef.current;
    if (!imageNode || !textNode) return;

    imageNode.style.transform = "translate3d(0px, 0px, 0px)";
    textNode.style.transform = "translate3d(0px, 0px, 0px)";

    return () => {
      imageNode.style.transform = "";
      textNode.style.transform = "";
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
        {/* Desktop: >= 1440px - Scale theo màn hình lớn */}
        {/* Mobile: < 980px - Layout dọc */}
        <div 
          className={`mx-auto w-full items-center ${isTablet ? 'hidden' : ''} ${isMobile ? 'flex flex-col gap-10 px-0 pt-16' : 'grid'}`}
          style={{
            display: isMobile ? 'flex' : (isTablet ? 'none' : 'grid'),
            flexDirection: isMobile ? 'column' : 'unset',
            maxWidth: !isMobile && !isTablet ? 'calc(1440px * (100vw / 1440px))' : '100%',
            gridTemplateColumns: !isMobile && !isTablet ? `minmax(0, calc(640px * (100vw / 1440px))) minmax(0, 1fr)` : 'unset',
            gap: isMobile ? '40px' : (!isTablet ? 'calc(80px * (100vw / 1440px))' : 'unset'),
            paddingLeft: isMobile ? '0' : (!isTablet ? 'calc(104px * (100vw / 1440px))' : 'unset'),
            paddingRight: isMobile ? '0' : (!isTablet ? 'calc(104px * (100vw / 1440px))' : 'unset'),
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            ref={textRef}
            className="flex flex-col transition-transform duration-300 ease-out will-change-transform text-left"
            style={{
              gap: isMobile ? '24px' : 'calc(24px * (100vw / 1440px))',
              paddingLeft: isMobile ? '24px' : '0',
              paddingRight: isMobile ? '24px' : '0',
            }}
          >
            <span 
              className="font-alt font-medium tracking-[0.05em]"
              style={{
                fontSize: isMobile ? '14px' : 'calc(20px * (100vw / 1440px))',
                letterSpacing: '0.05em',
              }}
            >
              VỀ CHÚNG TÔI
            </span>
            <h2 className="font-heading tracking-[0.02em] uppercase text-[#000000]">
              {isMobile ? (
                <>
                  <span style={{ 
                    fontSize: '18px', 
                    lineHeight: '1.2', 
                    display: 'block',
                  }}>
                    ĐỊNH HÌNH CHUẨN MỰC MỚI CHO
                  </span>
                  <span style={{ 
                    fontSize: 'clamp(36px, calc(36px + (100vw - 480px) * 0.0375), 42px)', 
                    lineHeight: '1.2', 
                    display: 'block',
                  }}>
                    BỀ MẶT ỐP LÁT
                  </span>
                </>
              ) : (
                <span style={{ 
                  fontSize: 'calc(48px * (100vw / 1440px))',
                  lineHeight: 'calc(60px * (100vw / 1440px))',
                  display: 'block',
                }}>
                  ĐỊNH HÌNH CHUẨN MỰC MỚI CHO BỀ MẶT ỐP LÁT
                </span>
              )}
            </h2>
            <p 
              className="font-montserrat text-justify text-[#1a1a1a]"
              style={{
                fontSize: isMobile ? 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)' : 'calc(14px * (100vw / 1440px))',
                lineHeight: isMobile ? 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)' : 'calc(25px * (100vw / 1440px))',
              }}
            >
              STILE là một trong những nhà cung cấp giải pháp ốp lát hàng đầu Việt Nam tiên phong phát
              triển những bề mặt đột phá về kích cỡ , thiết kế và công nghệ. Kết hợp kinh nghiệm dày
              dặn cùng sự am hiểu sâu sắc về lĩnh vực sản xuất gạch, chúng tôi lựa chọn hợp tác cùng các
              nhà sản xuất sỡ hữu nguồn nguyên liệu chất lượng cao, quy trình cấp tiến và công nghệ thân
              thiện hàng đầu thế giới (Ý, Tây Ban Nha, Ấn Độ,...).
            </p>
            <div 
              className="pt-2 flex justify-start"
              style={{
                paddingTop: isMobile ? '8px' : 'calc(8px * (100vw / 1440px))',
              }}
            >
              <PillButton label="Khám phá ngay" />
            </div>
          </div>
          <div 
            className="relative flex justify-end"
            style={{
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <div 
              className="hidden lg:block lg:sticky"
              style={{
                top: 'calc(140px * (100vw / 1440px))',
                width: 'calc(534px * (100vw / 1440px))',
                maxWidth: 'calc(534px * (100vw / 1440px))',
                flexShrink: 0,
              }}
            >
              <div
                ref={stickyRef}
                className={`relative overflow-hidden rounded-lg shadow-lg transition-opacity duration-600 ease-out aspect-[534/601] ${
                  imageVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  width: '100%',
                }}
              >
                <Image
                  src="/VỀ CHÚNG TÔI/Gemini_Generated_Image_owhtrlowhtrlowht 1.png"
                  alt="Logo Stile trên mặt đá"
                  fill
                  className="object-contain"
                  sizes="534px"
                />
              </div>
            </div>
            <div className="block w-full max-w-none lg:hidden mt-10">
              <div className="relative left-1/2 w-screen -translate-x-1/2 transform aspect-[534/601] overflow-hidden max-lg:rounded-none">
                <Image
                  src="/VỀ CHÚNG TÔI/Gemini_Generated_Image_owhtrlowhtrlowht 1.png"
                  alt="Logo Stile trên mặt đá"
                  fill
                  className="object-cover"
                  sizes="480px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tablet: 980px - 1439px - Scale từ desktop 1440px */}
        {isTablet && (
          <div 
            className="mx-auto grid w-full items-center"
            style={{
              display: 'grid',
              width: '100%',
              maxWidth: '100%',
              gridTemplateColumns: `minmax(0, ${(640 / 1440) * 100}%) minmax(0, 1fr)`,
              gap: `${(80 / 1440) * 100}vw`,
              paddingLeft: `${(104 / 1440) * 100}vw`,
              paddingRight: `${(104 / 1440) * 100}vw`,
              boxSizing: 'border-box',
            }}
          >
            <div
              ref={textRef}
              className="flex flex-col transition-transform duration-300 ease-out will-change-transform text-left"
              style={{
                gap: `${(24 / 1440) * 100}vw`,
                width: '100%',
                maxWidth: '100%',
              }}
            >
              <span 
                className="font-alt font-medium tracking-[0.05em]"
                style={{
                  fontSize: `${(20 / 1440) * 100}vw`,
                  letterSpacing: '0.05em',
                }}
              >
                VỀ CHÚNG TÔI
              </span>
              <h2 
                className="font-heading tracking-[0.02em] uppercase text-[#000000]"
                style={{
                  fontSize: `${(48 / 1440) * 100}vw`,
                  lineHeight: `${(60 / 1440) * 100}vw`,
                  letterSpacing: '0.02em',
                }}
              >
                ĐỊNH HÌNH CHUẨN MỰC MỚI CHO BỀ MẶT ỐP LÁT
              </h2>
              <p 
                className="font-montserrat text-justify text-[#1a1a1a]"
                style={{
                  fontSize: `${(14 / 1440) * 100}vw`,
                  lineHeight: `${(25 / 1440) * 100}vw`,
                }}
              >
                STILE là một trong những nhà cung cấp giải pháp ốp lát hàng đầu Việt Nam tiên phong phát
                triển những bề mặt đột phá về kích cỡ , thiết kế và công nghệ. Kết hợp kinh nghiệm dày
                dặn cùng sự am hiểu sâu sắc về lĩnh vực sản xuất gạch, chúng tôi lựa chọn hợp tác cùng các
                nhà sản xuất sỡ hữu nguồn nguyên liệu chất lượng cao, quy trình cấp tiến và công nghệ thân
                thiện hàng đầu thế giới (Ý, Tây Ban Nha, Ấn Độ,...).
              </p>
              <div 
                className="pt-2 flex justify-start"
                style={{
                  paddingTop: `${(8 / 1440) * 100}vw`,
                }}
              >
                <PillButton label="Khám phá ngay" />
              </div>
            </div>
            <div 
              className="relative flex justify-end"
              style={{
                width: '100%',
                maxWidth: '100%',
              }}
            >
              <div 
                className="sticky"
                style={{
                  top: `${(140 / 1440) * 100}vw`,
                  width: `${(534 / 1440) * 100}vw`,
                  maxWidth: `${(534 / 1440) * 100}vw`,
                  minWidth: `${(534 / 1440) * 100}vw`,
                  flexShrink: 0,
                }}
              >
                <div
                  ref={stickyRef}
                  className="relative overflow-hidden rounded-lg shadow-lg transition-opacity duration-600 ease-out"
                  style={{
                    width: '100%',
                    aspectRatio: '534 / 601',
                    opacity: imageVisible ? 1 : 0,
                  }}
                >
                  <Image
                    src="/VỀ CHÚNG TÔI/Gemini_Generated_Image_owhtrlowhtrlowht 1.png"
                    alt="Logo Stile trên mặt đá"
                    fill
                    className="object-contain"
                    sizes="534px"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Gallery() {
  const [activePair, setActivePair] = useState(0);

  const imagePairs = [
    [
      { src: "/ARTILE GALLERY/image4.png", alt: "Artile Gallery 4" },
      { src: "/ARTILE GALLERY/image2.png", alt: "Artile Gallery 2" },
    ],
    [
      { src: "/ARTILE GALLERY/image1.png", alt: "Artile Gallery 1" },
      { src: "/ARTILE GALLERY/imag5.png", alt: "Artile Gallery 5" },
    ],
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePair((prev) => (prev + 1) % imagePairs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="gallery" className="fullpage-section relative w-full overflow-hidden bg-[#282828] text-white">
      <div className="hidden lg:block relative h-full w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/ARTILE GALLERY/image.png"
            alt="Artile Gallery Background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Gradient Overlay - từ phải sang trái (chéo) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(0, 0, 0, 3) 0%, rgba(0, 0, 0, 0) 100%)',
          }}
        />

        {/* Image 1 - Top/Left */}
        <div
          className="absolute z-20 transition-opacity duration-700"
          style={{
            left: 'calc(330px * (100vw / 1470px))',
            top: '42%',
            height: 'calc(400px * (100vw / 1470px))',
            transform: 'translateY(-50%) rotate(12deg)',
          }}
        >
          <div 
            className="relative h-full overflow-hidden shadow-2xl" 
            style={{ 
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              width: 'auto',
            }}
          >
            <Image
              src={imagePairs[activePair][0].src}
              alt={imagePairs[activePair][0].alt}
              width={400}
              height={400}
              className="h-full w-auto object-contain"
              sizes="400px"
            />
          </div>
        </div>

        {/* Image 2 - Bottom/Left */}
        <div
          className="absolute z-[5] transition-opacity duration-700"
          style={{
            left: 'calc(80px * (100vw / 1470px))',
            top: '70%',
            height: 'calc(400px * (100vw / 1470px))',
            transform: 'translateY(-50%) rotate(0deg)',
          }}
        >
          <div 
            className="relative h-full overflow-hidden shadow-2xl" 
            style={{ 
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              width: 'auto',
            }}
          >
            <Image
              src={imagePairs[activePair][1].src}
              alt={imagePairs[activePair][1].alt}
              width={400}
              height={400}
              className="h-full w-auto object-contain"
              sizes="400px"
            />
          </div>
        </div>

        {/* Content - Right Side */}
        <div 
          className="absolute top-1/2 z-30"
          style={{
            right: 'calc(100px * (100vw / 1470px))',
            maxWidth: 'calc(500px * (100vw / 1470px))',
            paddingRight: 'calc(32px * (100vw / 1470px))',
          }}
        >
          <div 
            style={{
              gap: 'calc(24px * (100vw / 1470px))',
            }}
            className="flex flex-col text-left"
          >
            <h2 
              className="font-heading uppercase text-white"
              style={{
                fontSize: 'calc(64px * (100vw / 1470px))',
                lineHeight: 'calc(64px * (100vw / 1470px))',
                letterSpacing: '0.05em',
              }}
            >
              ARTILE<br />GALLERY
            </h2>
            <p 
              className="font-montserrat text-gray-300 text-justify"
              style={{
                fontSize: 'calc(16px * (100vw / 1470px))',
                lineHeight: 'calc(28px * (100vw / 1470px))',
              }}
            >
              Tại STile, chúng tôi không đơn thuần gọi đó là Showroom. Với chúng tôi, mỗi sản phẩm là một tác phẩm nghệ thuật, được sắp đặt một cách có chủ đích, thể hiện cá tính và câu chuyện riêng.
            </p>
            <div style={{ paddingTop: 'calc(8px * (100vw / 1470px))' }}>
              <PillButton label="Khám phá ngay" theme="dark" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Simple background layout */}
      <div className="relative w-full lg:hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/ARTILE GALLERY/image copy.png"
            alt="Artile Gallery Background"
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 py-20">
          <div className="space-y-6 text-left max-w-[500px]">
            <h2 
              className="font-heading uppercase text-white"
              style={{
                fontSize: '96px',
                lineHeight: '77px',
                letterSpacing: '4.8px',
              }}
            >
              ARTILE<br />GALLERY
            </h2>
            <p 
              className="font-montserrat text-white text-justify"
              style={{
                fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
                lineHeight: 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
              }}
            >
              Tại STile, chúng tôi không đơn thuần gọi đó là Showroom. Với chúng tôi, mỗi sản phẩm là một tác phẩm nghệ thuật, được sắp đặt một cách có chủ đích, thể hiện cá tính và câu chuyện riêng.
            </p>
            <div className="pt-2 flex justify-start">
              <PillButton label="Khám phá ngay" theme="dark" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [activeVariant, setActiveVariant] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [animatingVariant, setAnimatingVariant] = useState<number | null>(null);
  const variant = featuredVariants[activeVariant];

  // DEBUG: Điều chỉnh vị trí header fixed trên desktop
  const DEBUG_HEADER_TOP = '120px';      // Vị trí top của header (từ trên xuống)
  const DEBUG_HEADER_LEFT = '6vw';       // Vị trí left của header (từ trái sang)
  const DEBUG_CONTENT_PADDING_TOP = '240px'; // Padding-top của phần nội dung (khoảng cách từ header)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVariant((prev) => (prev + 1) % featuredVariants.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageSrc = isMobile && variant.mobileImage ? variant.mobileImage : variant.image;

  return (
    <section
      id="featured"
      data-header-light="true"
      className="fullpage-section relative w-full overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] lg:min-h-0"
      style={isMobile ? { height: '100vh', minHeight: '100vh' } : { minHeight: '100vh' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {featuredVariants.map((v) => {
          const vImageSrc = isMobile && v.mobileImage ? v.mobileImage : v.image;
          const isActive = v.id === variant.id;
          return (
            <Image
              key={v.id}
              src={vImageSrc}
              alt={v.title}
              fill
              priority={v.id === featuredVariants[0].id}
              className="object-cover transition-opacity duration-700 ease-in-out"
              style={{
                objectPosition: isMobile ? "calc(50% - 60px) center" : "center",
                transform: isMobile ? "scale(1.6)" : undefined,
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Title - Center Top */}
      <div 
        className="absolute top-0 left-0 right-0 z-20 flex justify-center"
        style={{
          paddingTop: isMobile ? '40px' : 'calc(48px * (100vw / 1470px))',
        }}
      >
        <h2 
          className="font-heading tracking-[0.05em] uppercase text-[#151515]"
          style={{
            fontSize: isMobile ? '24px' : 'calc(48px * (100vw / 1470px))',
          }}
        >
          SẢN PHẨM NỔI BẬT
        </h2>
      </div>

      {/* Desktop: Content từ giữa màn hình, bên trái, text justify */}
      {!isMobile && (
        <div 
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20"
          style={{
            paddingLeft: 'calc(104px * (100vw / 1440px))',
            maxWidth: 'calc(520px * (100vw / 1440px))',
          }}
        >
          <div
            key={variant.id}
            className="animate-text-fade space-y-3"
            style={{
              gap: 'calc(12px * (100vw / 1440px))',
            }}
          >
            <span 
              className="font-montserrat tracking-[0.3em] text-[#151515] leading-[1] block"
              style={{
                fontSize: 'calc(15px * (100vw / 1440px))',
              }}
            >
              {variant.collection}
            </span>
            <h3 
              className="font-montserrat font-semibold text-[#151515] leading-[1]"
              style={{
                fontSize: 'calc(48px * (100vw / 1440px))',
              }}
            >
              {variant.title}
            </h3>
            <p 
              className="font-montserrat text-[#151515] text-justify"
              style={{
                fontSize: 'calc(16px * (100vw / 1440px))',
                lineHeight: 'calc(25px * (100vw / 1440px))',
                marginTop: 'calc(24px * (100vw / 1440px))',
              }}
            >
              The profound dialog between humans and nature translates into an interplay of glimpses and reflections, where humans and the earth, twin faces, reflect each other and collaborate in perfect synergy.
              <br /><br />
              In the constant interchange with the surrounding environment, nature shows us that we are part of an intricate and wonderful living system. A harmonious meeting, expressed through grandiose and cyclic movements, which give form to the structure itself of the Gemini collection, inspired by the natural flows between earth and sky.
            </p>
            <div 
              className="pt-2"
              style={{
                paddingTop: 'calc(16px * (100vw / 1440px))',
              }}
            >
              <PillButton label="Khám phá ngay" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Content */}
      {isMobile && (
        <div 
          className="relative flex w-full flex-col px-8"
          style={{ height: '100vh' }}
        >
          <div className="flex justify-start" style={{ paddingTop: '120px' }}>
            <div
              key={variant.id}
              className="animate-text-fade max-w-[520px] w-full space-y-3 text-left"
            >
              <span className="font-montserrat text-[15px] text-[#151515] leading-[1]">
                {variant.collection}
              </span>
              <h3 className="font-montserrat text-[48px] font-semibold text-[#151515] leading-[1]">
                {variant.title}
              </h3>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 mb-6 flex flex-col items-center gap-6 pb-6 px-8">
            <p 
              className="text-center font-montserrat text-[#151515] max-w-[520px]"
              style={{
                fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
                lineHeight: 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
              }}
            >
              {variant.description}
            </p>
            <PillButton label="Khám phá ngay" />
          </div>
        </div>
      )}

      {/* Desktop: Navigation dots */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 mb-6 flex items-center justify-center gap-4 z-20 lg:mb-10">
          {featuredVariants.map((item, index) => {
            const isActive = index === activeVariant;
            const isAnimating = animatingVariant === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setAnimatingVariant(index);
                  setActiveVariant(index);
                  setTimeout(() => setAnimatingVariant(null), 600);
                }}
                aria-label={item.title}
                className="relative h-[20px] w-[20px] rounded-full border-0 p-[1px]"
                style={{ background: item.swatch }}
              >
                <div className="h-full w-full rounded-full" style={{ background: item.swatch }} />
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none"
                  viewBox="0 0 26 26"
                  style={{ width: '26px', height: '26px', left: '-3px', top: '-3px' }}
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="12"
                    fill="none"
                    stroke="black"
                    strokeWidth="1"
                    strokeDasharray="75.4"
                    strokeDashoffset={isAnimating ? "75.4" : isActive ? "0" : "75.4"}
                    className={isActive || isAnimating ? "opacity-100" : "opacity-0"}
                    style={{
                      animation: isAnimating ? "drawCircle 0.6s ease-out forwards" : undefined,
                    }}
                  />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Collections() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileCollectionIndex, setMobileCollectionIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchDiffRef = useRef<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % collectionSlides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const handleMobilePrev = () => {
    setMobileCollectionIndex((prev) => (prev - 1 + collectionMobileSlides.length) % collectionMobileSlides.length);
  };

  const handleMobileNext = () => {
    setMobileCollectionIndex((prev) => (prev + 1) % collectionMobileSlides.length);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0].clientX;
    touchDiffRef.current = 0;
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const currentX = event.touches[0].clientX;
    touchDiffRef.current = currentX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    const threshold = 40;
    if (touchDiffRef.current > threshold) {
      handleMobilePrev();
    } else if (touchDiffRef.current < -threshold) {
      handleMobileNext();
    }
    touchStartXRef.current = null;
    touchDiffRef.current = 0;
  };

  const handleDesktopPrev = () => {
    setActiveSlide((prev) => (prev - 1 + collectionSlides.length) % collectionSlides.length);
  };

  const handleDesktopNext = () => {
    setActiveSlide((prev) => (prev + 1) % collectionSlides.length);
  };

  return (
    <section id="collections" className="fullpage-section relative w-full overflow-hidden" style={{ backgroundColor: '#E3DCD1', height: '85vh' }}>
      <div className="section-inner !p-0 hidden lg:block">
        <div className="relative h-full overflow-hidden" style={{ width: '100%', height: '100%' }}>
          {/* Heading "BỘ SƯU TẬP" - 40px above image container, centered on image */}
          <div 
            className="absolute z-10"
            style={{
              left: 'calc((-11px + 279px) * (100vw / 1589px))',
              top: 'calc((166px - 40px - 53px) * (100vw / 1589px))',
              transform: 'translateX(-50%)',
            }}
          >
            <h2 className="font-heading text-black text-center not-italic whitespace-pre" style={{ 
              fontSize: 'calc(32px * (100vw / 1589px))',
              lineHeight: '53px',
            }}>
              BỘ SƯU TẬP
            </h2>
          </div>

          {/* Large Image Component - Left side with 3 images stacked */}
          <div 
            className="absolute flex items-center justify-end overflow-hidden"
            style={{
              left: 'calc(-11px * (100vw / 1589px))',
              top: 'calc(166px * (100vw / 1589px))',
              width: 'calc(558px * (100vw / 1589px))',
              height: 'calc(689px * (100vw / 1589px))',
              padding: 'calc(10px * (100vw / 1589px))',
            }}
          >
            {/* Image 1 - Infinito (index 2) */}
            <div
              className="absolute"
              style={{
                width: 'calc(558px * (100vw / 1589px))',
                height: 'calc(689px * (100vw / 1589px))',
                opacity: activeSlide === 2 ? 1 : 0,
                transform: activeSlide === 2 
                  ? 'translateX(0)' 
                  : activeSlide < 2 
                    ? 'translateX(100%)' 
                    : 'translateX(-100%)',
                transition: 'opacity 600ms ease-in, transform 600ms ease-in',
                pointerEvents: activeSlide === 2 ? 'auto' : 'none',
              }}
              >
                <Image
                src={collectionSlides[2].largeImage}
                alt={`${collectionSlides[2].title} ${collectionSlides[2].subtitle}`}
                  fill
                priority={activeSlide === 2}
                quality={95}
                  className="object-cover object-center"
                />
            </div>
            {/* Image 2 - CiViC (index 1) */}
                <div 
                  className="absolute"
                  style={{
                width: 'calc(558px * (100vw / 1589px))',
                height: 'calc(689px * (100vw / 1589px))',
                opacity: activeSlide === 1 ? 1 : 0,
                transform: activeSlide === 1 
                  ? 'translateX(0)' 
                  : activeSlide < 1 
                    ? 'translateX(100%)' 
                    : 'translateX(-100%)',
                transition: 'opacity 600ms ease-in, transform 600ms ease-in',
                pointerEvents: activeSlide === 1 ? 'auto' : 'none',
              }}
            >
              <Image
                src={collectionSlides[1].largeImage}
                alt={`${collectionSlides[1].title} ${collectionSlides[1].subtitle}`}
                fill
                priority={activeSlide === 1}
                quality={95}
                className="object-cover object-center"
              />
            </div>
            {/* Image 3 - Gemini (index 0) */}
            <div
              className="absolute"
                    style={{
                width: 'calc(558px * (100vw / 1589px))',
                height: 'calc(689px * (100vw / 1589px))',
                opacity: activeSlide === 0 ? 1 : 0,
                transform: activeSlide === 0 
                  ? 'translateX(0)' 
                  : activeSlide < 0 
                    ? 'translateX(100%)' 
                    : 'translateX(-100%)',
                transition: 'opacity 600ms ease-in, transform 600ms ease-in',
                pointerEvents: activeSlide === 0 ? 'auto' : 'none',
              }}
            >
              <Image
                src={collectionSlides[0].largeImage}
                alt={`${collectionSlides[0].title} ${collectionSlides[0].subtitle}`}
                fill
                priority={activeSlide === 0}
                quality={95}
                className="object-cover object-center"
              />
            </div>
                </div>

          {/* Small Image Component - Right side with 3 images stacked */}
                <div 
            className="absolute flex flex-col items-start overflow-hidden"
                  style={{
              left: 'calc(800px * (100vw / 1589px))',
              top: 'calc(166px * (100vw / 1589px))',
              width: 'calc(655.2px * (100vw / 1589px))',
              height: 'calc(384px * (100vw / 1589px))',
              padding: 'calc(10px * (100vw / 1589px))',
            }}
          >
            {/* Image 1 - Infinito (index 2) */}
            <div
              className="absolute"
                    style={{
                width: 'calc(631.2px * (100vw / 1589px))',
                height: 'calc(384px * (100vw / 1589px))',
                opacity: activeSlide === 2 ? 1 : 0,
                transform: activeSlide === 2 
                  ? 'translateX(0)' 
                  : activeSlide < 2 
                    ? 'translateX(-100%)' 
                    : 'translateX(100%)',
                transition: 'opacity 600ms ease-in, transform 600ms ease-in',
                pointerEvents: activeSlide === 2 ? 'auto' : 'none',
              }}
            >
              <Image
                src={collectionSlides[2].smallImage}
                alt={`${collectionSlides[2].title} detail`}
                fill
                priority={activeSlide === 2}
                quality={95}
                className="object-cover object-center"
              />
            </div>
            {/* Image 2 - CiViC (index 1) */}
            <div
              className="absolute"
                      style={{
                width: 'calc(631.2px * (100vw / 1589px))',
                height: 'calc(384px * (100vw / 1589px))',
                opacity: activeSlide === 1 ? 1 : 0,
                transform: activeSlide === 1 
                  ? 'translateX(0)' 
                  : activeSlide < 1 
                    ? 'translateX(-100%)' 
                    : 'translateX(100%)',
                transition: 'opacity 600ms ease-in, transform 600ms ease-in',
                pointerEvents: activeSlide === 1 ? 'auto' : 'none',
              }}
            >
              <Image
                src={collectionSlides[1].smallImage}
                alt={`${collectionSlides[1].title} detail`}
                fill
                priority={activeSlide === 1}
                quality={95}
                className="object-cover object-center"
              />
            </div>
            {/* Image 3 - Gemini (index 0) */}
            <div
              className="absolute"
                      style={{
                width: 'calc(631.2px * (100vw / 1589px))',
                height: 'calc(384px * (100vw / 1589px))',
                opacity: activeSlide === 0 ? 1 : 0,
                transform: activeSlide === 0 
                  ? 'translateX(0)' 
                  : activeSlide < 0 
                    ? 'translateX(-100%)' 
                    : 'translateX(100%)',
                transition: 'opacity 600ms ease-in, transform 600ms ease-in',
                pointerEvents: activeSlide === 0 ? 'auto' : 'none',
              }}
            >
              <Image
                src={collectionSlides[0].smallImage}
                alt={`${collectionSlides[0].title} detail`}
                fill
                priority={activeSlide === 0}
                quality={95}
                className="object-cover object-center"
              />
                  </div>
          </div>

          {/* Content Container - Right side with overflow hidden */}
          <div 
            className="absolute overflow-hidden"
                    style={{
              left: 'calc(810px * (100vw / 1589px))',
              top: 'calc(560px * (100vw / 1589px))',
              width: 'calc(631.2px * (100vw / 1589px))',
              height: 'calc(303px * (100vw / 1589px))', // 773px - 500px + button height
            }}
          >
            {collectionSlides.map((slide, index) => (
              <div 
                key={`content-${slide.id}`}
                className="absolute bg-[#E3DCD1]"
                    style={{
                  left: 0,
                  top: 0,
                  width: 'calc(631.2px * (100vw / 1589px))',
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index 
                    ? 'translateY(0)' 
                    : activeSlide < index 
                      ? 'translateY(-100%)' 
                      : 'translateY(100%)',
                  transition: 'opacity 600ms ease-in, transform 600ms ease-in',
                  pointerEvents: activeSlide === index ? 'auto' : 'none',
                }}
              >
                {/* Title */}
                <div className="bg-[#E3DCD1] px-0 py-[10px] pr-[10px]">
                  <div className="flex items-center">
                    <p className="font-montserrat font-medium text-black leading-[53px]" style={{ fontSize: 'calc(36px * (100vw / 1589px))' }}>
                      {slide.title} <span className="font-normal" style={{ fontSize: 'calc(20px * (100vw / 1589px))' }}>{slide.subtitle}</span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div 
                  className="bg-[#E3DCD1] px-0 py-[10px] pr-[10px] flex items-center justify-center"
                  style={{
                    marginTop: 'calc((597px - 530px - 53px) * (100vw / 1589px))',
                  }}
                >
                  <p className="font-montserrat font-normal text-black text-justify leading-[19px]" style={{ 
                    fontSize: 'calc(11px * (100vw / 1589px))',
                    width: 'calc(631.2px * (100vw / 1589px))',
                  }}>
                    {slide.description.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < slide.description.split('\n').length - 1 && <><br /><br /></>}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Button */}
                <div style={{ marginTop: 'calc((803px - 597px - 191px) * (100vw / 1589px))' }}>
                  <PillButton label={slide.ctaLabel} theme="light" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="lg:hidden bg-white text-[#111111]">
          <div
            className="relative h-[540px] w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex h-full w-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${mobileCollectionIndex * 100}%)` }}
            >
          {collectionMobileSlides.map((slide) => {
            const safeSrc = encodeURI(slide.image);
            return (
              <div key={slide.id} className="relative h-full w-full flex-shrink-0">
                <Image src={safeSrc} alt={`${slide.title} ${slide.subtitle}`} fill className="object-cover" priority={slide.id === collectionMobileSlides[0].id} />
                  <div className="absolute inset-x-0 top-10 text-center font-montserrat text-[32px] normal-case tracking-[0.2em] text-white drop-shadow">
                    {slide.heading}
                  </div>
              </div>
            );
          })}
            </div>
          <button
            type="button"
            aria-label="Xem bộ sưu tập trước"
            onClick={handleMobilePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 px-3 py-2 text-2xl text-white backdrop-blur-sm"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Xem bộ sưu tập tiếp theo"
            onClick={handleMobileNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 px-3 py-2 text-2xl text-white backdrop-blur-sm"
          >
            ›
          </button>
          </div>
          <div 
            className="px-6 py-8 text-white"
            style={{ backgroundColor: collectionMobileSlides[mobileCollectionIndex].backgroundColor || '#5C493A' }}
          >
            <div className="space-y-3">
              <div className="flex items-baseline gap-3 font-montserrat text-[32px] font-semibold leading-[36px]">
                <span>{collectionMobileSlides[mobileCollectionIndex].title}</span>
                <span className="text-[16px] tracking-[0.2em] text-white/80">
                  {collectionMobileSlides[mobileCollectionIndex].subtitle}
                </span>
              </div>
              <p 
                className="font-montserrat"
                style={{
                  fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
                  lineHeight: 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
                }}
              >
                {collectionMobileSlides[mobileCollectionIndex].description}
              </p>
            </div>
            <div className="mt-6 flex justify-start">
              <PillButton label={collectionMobileSlides[mobileCollectionIndex].ctaLabel} theme="dark" />
            </div>
          </div>
        </div>
    </section>
  );
}

function Applications() {
  const [activeTab, setActiveTab] = useState(0);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileTouchStartRef = useRef<number | null>(null);
  const mobileTouchDeltaRef = useRef(0);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

  const activeSection = applicationSections[activeTab];

  const updateHighlight = useCallback(() => {
    const activeButton = tabRefs.current[activeTab];
    const container = tabsRef.current;
    if (activeButton && container) {
      setHighlightStyle({
        left: activeButton.offsetLeft,
        top: 0,
        width: activeButton.offsetWidth,
        height: 53,
      });
    }
  }, [activeTab]);

  useLayoutEffect(() => {
    updateHighlight();
  }, [updateHighlight]);

  useEffect(() => {
    window.addEventListener('resize', updateHighlight);
    return () => window.removeEventListener('resize', updateHighlight);
  }, [updateHighlight]);

  useEffect(() => {
    // Reset hover state when tab changes
    setHoveredImageIndex(null);
  }, [activeTab]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    if (typeof window !== 'undefined' && window.innerWidth >= 769) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const mobileSlides = useMemo(
    () =>
      applicationSections.flatMap((section, sectionIndex) =>
        section.items.map((item, itemIndex) => ({
          key: `${section.label}-${sectionIndex}-${item.title}-${itemIndex}`,
          title: item.title,
          image: item.image,
        }))
      ),
    []
  );

  const handleMobileTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    mobileTouchStartRef.current = event.touches[0].clientX;
    mobileTouchDeltaRef.current = 0;
  };

  const handleMobileTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (mobileTouchStartRef.current === null) return;
    const currentX = event.touches[0].clientX;
    mobileTouchDeltaRef.current = currentX - mobileTouchStartRef.current;
  };

  const handleMobileTouchEnd = () => {
    const threshold = 40;
    if (mobileTouchDeltaRef.current > threshold) {
      setMobileSlideIndex((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
    } else if (mobileTouchDeltaRef.current < -threshold) {
      setMobileSlideIndex((prev) => (prev + 1) % mobileSlides.length);
    }
    mobileTouchStartRef.current = null;
    mobileTouchDeltaRef.current = 0;
  };

  return (
    <section id="applications" className="fullpage-section flex w-full flex-col justify-center overflow-visible">
      <div className="section-inner overflow-visible">
        <div 
          className="hidden w-full flex-col lg:flex overflow-visible"
          style={{
            maxWidth: 'calc(1200px * (100vw / 1470px))',
            paddingLeft: 'calc(80px * (100vw / 1470px))',
            paddingRight: 'calc(80px * (100vw / 1470px))',
          }}
        >
          <div 
            className="relative"
            style={{
              marginBottom: 'calc(38px * (100vw / 1470px))',
            }}
          >
            <h2 
              className="text-center font-heading text-[#000]"
              style={{
                fontSize: 'calc(48px * (100vw / 1470px))',
                lineHeight: 'calc(48px * (100vw / 1470px))',
                letterSpacing: '2.4px',
                marginBottom: 'calc(68px * (100vw / 1470px))',
              }}
            >
              ỨNG DỤNG
            </h2>
            <div 
              className="absolute left-0 right-0 bg-black"
              style={{
                top: 'calc(68px * (100vw / 1470px))',
                height: 'calc(0.5px * (100vw / 1470px))',
              }}
            />
          </div>
          <div 
            className="mb-[38px] flex justify-center"
            style={{
              marginBottom: 'calc(38px * (100vw / 1470px))',
            }}
          >
            <div 
              ref={tabsRef} 
              className="relative inline-flex items-center"
              style={{
                height: 'calc(53px * (100vw / 1470px))',
                gap: 'calc(32px * (100vw / 1470px))',
              }}
            >
              <span
                className="pointer-events-none absolute rounded-[11px] bg-[#282828] transition-all duration-300"
                style={{
                  left: highlightStyle.left,
                  top: 0,
                  width: highlightStyle.width,
                  height: 'calc(53px * (100vw / 1470px))',
                  borderRadius: 'calc(11px * (100vw / 1470px))',
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
                    className={`relative z-10 flex items-center justify-center font-montserrat font-normal uppercase transition-colors duration-300 whitespace-nowrap ${
                      active ? 'text-white' : 'text-[#000]'
                    }`}
                    style={{
                      height: 'calc(48px * (100vw / 1470px))',
                      marginTop: 'calc(3px * (100vw / 1470px))',
                      padding: `calc(10px * (100vw / 1470px)) calc(20px * (100vw / 1470px))`,
                      fontSize: 'calc(20px * (100vw / 1470px))',
                      letterSpacing: 'calc(1px * (100vw / 1470px))',
                      color: active ? '#ffffff' : '#000000',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div 
            className="overflow-hidden"
            style={{
              paddingLeft: 'calc(15px * (100vw / 1470px))',
              paddingRight: 'calc(15px * (100vw / 1470px))',
              marginLeft: 'calc(-80px * (100vw / 1470px))',
              marginRight: 'calc(-80px * (100vw / 1470px))',
            }}
          >
            <div 
              className="relative" 
              style={{ 
                height: 'calc(520px * (100vw / 1470px))',
                minHeight: 'calc(520px * (100vw / 1470px))',
              }}
            >
              {(() => {
                const mainItem = activeSection.items.find(i => i.isMain);
                const mainIndex = mainItem ? activeSection.items.findIndex(i => i.isMain) : 0;
                const otherItems = activeSection.items.filter(item => !item.isMain);
                
                // Chỉ lấy 3 items: 1 item trước main, main item, 1 item sau main
                const prevIndex = (mainIndex - 1 + activeSection.items.length) % activeSection.items.length;
                const nextIndex = (mainIndex + 1) % activeSection.items.length;
                
                const displayItems = [
                  activeSection.items[prevIndex],
                  activeSection.items[mainIndex],
                  activeSection.items[nextIndex],
                ];
                
                return (
                  <div 
                    className="flex items-center transition-all duration-500 ease-in-out"
                    style={{
                      width: '100%',
                      height: '100%',
                      gap: hoveredImageIndex !== null 
                        ? 'calc(24px * (100vw / 1470px))' 
                        : 'calc(12px * (100vw / 1470px))',
                    }}
                  >
                    {displayItems.map((item, index) => {
                      const isHovered = hoveredImageIndex === index;
                      return (
                        <div 
                          key={`${activeSection.label}-${item.title}-${index}`} 
                          className="group relative flex-1 overflow-hidden cursor-none transition-all duration-500 ease-in-out"
                          style={{  
                            height: 'calc(450px * (100vw / 1470px))',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                            transformOrigin: 'center center',
                            alignSelf: 'center',
                            zIndex: isHovered ? 10 : 1,
                          }}
                          onMouseEnter={() => {
                            setIsHoveringImage(true);
                            setHoveredImageIndex(index);
                          }}
                          onMouseLeave={() => {
                            setIsHoveringImage(false);
                            setHoveredImageIndex(null);
                          }}
                        >
                          <Link href={`#${item.title.toLowerCase().replace(/\s+/g, '-')}`} className="block h-full w-full">
                            <div className="absolute inset-0 overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover object-center transition-transform duration-500"
                                sizes="(min-width: 1440px) calc((100vw - 208px - 30px) / 3), 458px"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                              <p className="font-montserrat text-[20px] font-normal text-white text-center tracking-[1px] whitespace-pre">
                                {item.title}
                              </p>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            {typeof window !== 'undefined' && window.innerWidth >= 769 && (
              <div
                ref={cursorRef}
                className={`custom-cursor ${isHoveringImage ? 'is-hovering' : ''}`}
                style={{
                  display: isHoveringImage ? 'flex' : 'none',
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="pl-6 pr-0 py-10 lg:hidden">
        <h2 className="mb-6 text-center font-heading text-[36px] tracking-[0.05em] relative pb-4 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[0.5px] after:bg-black after:content-['']">ỨNG DỤNG</h2>
        <div
          className="relative overflow-x-auto scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onTouchStart={handleMobileTouchStart}
          onTouchMove={handleMobileTouchMove}
          onTouchEnd={handleMobileTouchEnd}
        >
          <div className="flex gap-4">
            {mobileSlides.map((slide, index) => {
              const safeSrc = encodeURI(slide.image);
              return (
                <div 
                  key={slide.key} 
                  className="relative flex-shrink-0 snap-center" 
                  style={{ 
                    width: '300px',
                    aspectRatio: '314 / 587'
                  }}
                >
                  <div className="relative w-full" style={{ aspectRatio: '314 / 587' }}>
                    <Image src={safeSrc} alt={slide.title} fill className="object-cover" sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                      <p className="font-heading text-[26px] uppercase tracking-[0.2em]">{slide.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    if (typeof window !== 'undefined' && window.innerWidth >= 769) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        // Nếu đang ở cặp đầu tiên, chuyển đến cặp cuối cùng
        const lastPairIndex = Math.floor((trendArticles.length - 2) / 2) * 2;
        return lastPairIndex;
      }
      return prev - 2;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.floor((trendArticles.length - 2) / 2) * 2;
      if (prev >= maxIndex) {
        // Nếu đang ở cặp cuối cùng, quay về đầu
        return 0;
      }
      return prev + 2;
    });
  };

  const displayedArticles = [
    trendArticles[currentIndex],
    trendArticles[currentIndex + 1] || trendArticles[0],
  ];

  return (
    <section id="projects" data-header-light="true" className="fullpage-section flex w-full items-center justify-center" style={{ backgroundColor: 'transparent' }}>
      <div className="hidden w-full lg:block">
        <div className="section-inner">
          <div 
            className="mx-auto w-full"
            style={{
              maxWidth: 'calc(1440px * (100vw / 1470px))',
              paddingLeft: 'calc(82px * (100vw / 1470px))',
              paddingRight: 'calc(82px * (100vw / 1470px))',
            }}
          >
            <div 
              style={{
                marginBottom: 'calc(76px * (100vw / 1470px))',
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  marginBottom: 'calc(16px * (100vw / 1470px))',
                }}
              >
                <h2 
                  className="font-heading text-[#000]"
                  style={{
                    fontSize: 'calc(48px * (100vw / 1470px))',
                    lineHeight: 'calc(48px * (100vw / 1470px))',
                    letterSpacing: 'calc(2.4px * (100vw / 1470px))',
                  }}
                >
                  CÔNG TRÌNH &amp;&nbsp;XU HƯỚNG
                </h2>
                <PillButton label="Xem tất cả" />
              </div>
              <div 
                className="bg-black"
                style={{
                  height: 'calc(1px * (100vw / 1470px))',
                }}
              />
            </div>
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${(currentIndex / 2) * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(trendArticles.length / 2) }).map((_, pairIndex) => (
                  <div 
                    key={pairIndex}
                    className="grid grid-cols-2 flex-shrink-0"
                    style={{ 
                      width: '100%',
                      gap: 'calc(60px * (100vw / 1470px))',
                    }}
                  >
                    {[0, 1].map((offset) => {
                      const articleIndex = pairIndex * 2 + offset;
                      const article = trendArticles[articleIndex];
                      if (!article) return null;
                      
                      return (
                        <Link
                          key={article.title}
                          href={article.href}
                          className="group relative flex flex-col gap-5 cursor-none overflow-visible"
                          onMouseEnter={() => setHoveredCardIndex(articleIndex)}
                          onMouseLeave={() => setHoveredCardIndex(null)}
                        >
                          <div 
                            className="relative w-full overflow-hidden" 
                            style={{ 
                              aspectRatio: '601/355',
                            }}
                          >
                            <Image 
                              src={article.image} 
                              alt={article.title} 
                              fill 
                              className="object-cover transition-transform duration-500"
                              style={{
                                transform: hoveredCardIndex === articleIndex ? 'scale(1.05)' : 'scale(1)',
                              }}
                              sizes="601px" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                              <p 
                                className="font-montserrat font-normal text-white text-center whitespace-pre"
                                style={{
                                  fontSize: 'calc(20px * (100vw / 1470px))',
                                  letterSpacing: 'calc(1px * (100vw / 1470px))',
                                }}
                              >
                                Khám phá thêm
                              </p>
                            </div>
                          </div>
                          <h3 
                            className="font-montserrat font-medium text-[#000]"
                            style={{
                              fontSize: 'calc(32px * (100vw / 1470px))',
                              lineHeight: 'calc(24px * (100vw / 1470px))',
                            }}
                          >
                            {article.title}
                          </h3>
                          <p 
                            className="font-montserrat font-normal text-[#000]"
                            style={{
                              fontSize: 'calc(14px * (100vw / 1470px))',
                              lineHeight: 'calc(19px * (100vw / 1470px))',
                            }}
                          >
                            {article.description}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              
              <button
                type="button"
                onClick={handleNext}
                aria-label="Bài viết tiếp theo"
                className="flex h-10 w-10 items-center justify-center transition hover:opacity-70"
              >
                <svg width="7" height="15" viewBox="0 0 7 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.61523 0.290649L0.615235 7.29065L5.61523 14.2906" stroke="black" strokeWidth="1"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Bài viết trước"
                className="flex h-10 w-10 items-center justify-center transition hover:opacity-70"
              >
                <svg width="7" height="15" viewBox="0 0 7 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.40625 14.2906L5.40625 7.29065L0.406252 0.290649" stroke="black" strokeWidth="1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom cursor */}
      {hoveredCardIndex !== null && (
        <div
          ref={cursorRef}
          className="custom-cursor is-hovering"
          style={{
            position: 'fixed',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            zIndex: 9999,
          }}
        />
      )}
      <div className="w-screen py-10 lg:hidden -ml-[calc((100vw-100%)/2)]">
        <div className="mb-6 px-6">
          <h2 className="font-heading text-[30px] leading-[34px] tracking-[1.5px] text-black">
            <span className="block text-left">CÔNG TRÌNH &</span>
            <span className="block text-right">XU HƯỚNG</span>
          </h2>
        </div>
        <div className="relative" style={{ height: '434px' }}>
          <div className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth" style={{ height: '434px' }}>
            {trendArticles.map((article, index) => (
              <div key={article.title} className="relative w-screen flex-shrink-0 snap-center" style={{ height: '434px' }}>
                <div className="absolute bg-[#B9B0A1] inset-0" />
                <div className="absolute left-0 top-0 h-[248px] w-full">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill 
                      className="object-cover" 
                      sizes="100vw"
                    />
                  </div>
                </div>
                <div className="absolute left-[15px] top-[275px] w-[calc(100%-30px)] max-w-[328px]">
                  <h3 className="font-montserrat font-medium text-[25px] leading-[24px] text-black">
                    {article.title.includes('&') ? (
                      <>
                        <p className="mb-0">{article.title.split('&')[0].trim()}</p>
                        <p>& {article.title.split('&')[1].trim()}</p>
                      </>
                    ) : article.title.includes('TRONG') ? (
                      <>
                        <p className="mb-0">{article.title.split('TRONG')[0].trim()}</p>
                        <p>{article.title.split('TRONG')[1].trim()}</p>
                      </>
                    ) : (
                      article.title
                    )}
                  </h3>
                </div>
                <p 
                  className="absolute left-[15px] top-[340px] w-[calc(100%-30px)] max-w-[328px] font-montserrat font-normal text-black"
                  style={{
                    fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
                    lineHeight: 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
                  }}
                >
                  {article.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center px-6">
          <PillButton label="Xem tất cả" />
        </div>
      </div>
    </section>
  );
}

function CatalogueCtaAndFooter() {
  return (
    <>
      {/* Desktop: Combined vertical layout */}
      <section id="contact" data-header-light="true" className="fullpage-section hidden lg:flex flex-col w-full" style={{ backgroundColor: 'transparent' }}>
        {/* Catalogue CTA - Top section, lớn hơn để đẩy footer xuống sát đáy */}
        <div 
          className="relative overflow-hidden"
          style={{
            // Banner lớn hơn: base 320px ở màn 1470 và scale theo màn hình
            height: 'calc(320px * (100vw / 1470px))',
          }}
        >
          <Image
            src="/NHẬN ĐĂNG KÝ CATALOGUE/catalogue.png"
            alt="Đăng ký nhận catalogue"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 flex w-full h-full items-center justify-center">
            <div 
              className="flex flex-col items-center justify-center text-center"
              style={{
                gap: 'calc(16px * (100vw / 1470px))',
                paddingLeft: 'calc(24px * (100vw / 1470px))',
                paddingRight: 'calc(24px * (100vw / 1470px))',
              }}
            >
              <h2 
                className="font-heading uppercase leading-tight tracking-[0.08em] text-white"
                style={{
                  fontSize: 'calc(36px * (100vw / 1470px))',
                }}
              >
                NHẬN CATALOGUE
              </h2>
              <div className="flex justify-center">
                <PillButton label="Xem ngay" theme="dark" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Bottom section */}
        <div 
          className="flex-1 bg-[#E3DCD1] flex flex-col"
          style={{
            paddingLeft: 'calc(104px * (100vw / 1470px))',
            paddingRight: 'calc(104px * (100vw / 1470px))',
            paddingTop: 'calc(48px * (100vw / 1470px))',
            // Cách lề dưới 20px tại màn 1440px, sau đó scale theo tỉ lệ cho màn lớn hơn
            paddingBottom: 'calc(20px * (100vw / 1440px))',
          }}
        >
          <div 
            className="mx-auto w-full"
            style={{
              maxWidth: 'calc(1440px * (100vw / 1470px))',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div 
              className="flex flex-col mb-8"
              style={{
                gap: 'calc(24px * (100vw / 1470px))',
                // Giảm khoảng trống giữa khối nội dung và phần legal phía dưới
                marginBottom: 'calc(16px * (100vw / 1470px))',
                flex: 1,
              }}
            >
              {/* Logo + Social Icons - Top row with border below */}
              <div 
                className="border-b border-black"
                style={{
                  paddingBottom: 'calc(24px * (100vw / 1470px))',
                }}
              >
                <div className="flex items-center justify-between">
                  <Image
                    src="/FOOTER/logoSTile.png"
                    alt="Stile"
                    width={180}
                    height={72}
                    className="h-auto"
                    style={{
                      width: 'calc(75px * (100vw / 1470px))',
                    }}
                  />
                  
                  {/* Social Media Icons */}
                  <div 
                    className="flex items-center"
                    style={{
                      gap: 'calc(12px * (100vw / 1470px))',
                    }}
                  >
                    {footerSocials.map((item) => (
                      <Image
                        key={item.alt}
                        src={item.src}
                        alt={item.alt}
                        width={32}
                        height={32}
                        className="h-auto"
                        style={{
                          width: 'calc(32px * (100vw / 1470px))',
                          height: 'calc(32px * (100vw / 1470px))',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Name - Below border line */}
              <h3 
                className="font-manrope font-bold uppercase tracking-[0.05em] text-[#111111]"
                style={{
                  fontSize: 'calc(16px * (100vw / 1470px))',
                }}
              >
                CÔNG TY TNHH STILE
              </h3>

              {/* Row: Contact Info + Navigation + Contact Form */}
              <div 
                className="flex items-start justify-between"
                style={{
                  gap: 'calc(32px * (100vw / 1470px))',
                }}
              >
                {/* Left: Contact Info */}
                <div 
                  className="flex flex-col"
                  style={{
                    gap: 'calc(16px * (100vw / 1470px))',
                  }}
                >
                  <div 
                    className="space-y-2 font-montserrat text-[#111111]"
                    style={{
                      fontSize: 'calc(14px * (100vw / 1470px))',
                      lineHeight: 'calc(24px * (100vw / 1470px))',
                    }}
                  >
                    <p>098 165 0042</p>
                    <p>infor@stile.com.vn</p>
                    <p>155 - 157 Nguyễn Cơ Thạch, P. An Khánh, TP. HCM</p>
                  </div>
                  
                  {/* Certification Badge */}
                  <Image
                    src="/bocongthuong.png"
                    alt="Đã thông báo bộ công thương"
                    width={140}
                    height={42}
                    className="h-auto"
                    style={{
                      width: 'calc(140px * (100vw / 1470px))',
                    }}
                  />
                </div>

                {/* Middle: Navigation Links - 1 column */}
                <div 
                  className="flex flex-col font-montserrat text-[#111111]"
                  style={{
                    gap: 'calc(8px * (100vw / 1470px))',
                    fontSize: 'calc(14px * (100vw / 1470px))',
                    lineHeight: 'calc(24px * (100vw / 1470px))',
                  }}
                >
                  <Link href="#" className="transition hover:text-[#555]">Về STile</Link>
                  <Link href="#" className="transition hover:text-[#555]">Artile Gallery</Link>
                  <Link href="#" className="transition hover:text-[#555]">Sản Phẩm</Link>
                  <Link href="#" className="transition hover:text-[#555]">Công Trình & Xu Hướng</Link>
                  <Link href="#" className="transition hover:text-[#555]">Dịch Vụ</Link>
                </div>

                {/* Right: Contact Form */}
                <div 
                  className="flex flex-col"
                  style={{
                    gap: 'calc(16px * (100vw / 1470px))',
                  }}
                >
                  <form 
                    className="grid grid-cols-2 font-manrope"
                    style={{
                      columnGap: 'calc(12px * (100vw / 1470px))',
                      rowGap: 'calc(12px * (100vw / 1470px))',
                      fontSize: 'calc(12px * (100vw / 1470px))',
                    }}
                  >
                    <InputField placeholder="Họ và Tên" />
                    <InputField placeholder="Số Điện Thoại" />
                    <InputField placeholder="Email" full />
                    <TextareaField placeholder="Nội dung tin nhắn..." />
                    <div className="col-span-2 w-full">
                      <div className="w-full contact-submit-btn">
                        {/* Nút gửi: layout chữ nhật (noRounded), hiệu ứng hover vẫn là vòng tròn */}
                        <PillButton label="Gửi" fullWidth={true} noRounded={true} />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Legal Links and Copyright */}
            <div 
              className="flex items-center justify-between border-t border-[#d0d0d0] font-manrope text-[#111111]"
              style={{
                paddingTop: 'calc(24px * (100vw / 1470px))',
                fontSize: 'calc(12px * (100vw / 1470px))',
              }}
            >
              <div 
                className="flex"
                style={{
                  gap: 'calc(24px * (100vw / 1470px))',
                }}
              >
                <Link href="#" className="transition hover:text-[#555]">
                  Chính sách bảo mật
                </Link>
                <Link href="#" className="transition hover:text-[#555]">
                  Điều khoản sử dụng
                </Link>
              </div>
              <p>Bản quyền thuộc về Công Ty TNHH STILE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: Separate sections */}
      <section className="fullpage-section relative flex min-h-screen items-center justify-center overflow-hidden text-white lg:hidden">
        <Image
          src="/NHẬN ĐĂNG KÝ CATALOGUE/JUNGLE CHIC (7).jpg"
          alt="Đăng ký nhận catalogue"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex w-full max-w-[660px] flex-col items-center justify-center gap-6 px-6 text-center">
          <h2 className="font-heading text-[26px] uppercase leading-tight tracking-[0.08em] text-white">
            ĐĂNG KÝ NHẬN
            <br />
            CATALOGUE
          </h2>
          <div className="flex justify-center">
            <PillButton label="Liên hệ ngay" theme="dark" />
          </div>
        </div>
      </section>

      <footer id="contact" data-header-light="true" className="fullpage-section mx-auto text-[#000] lg:hidden" style={{ backgroundColor: 'transparent' }}>
        <div className="section-inner">
          <div className="w-full px-6 py-10">
          <div className="flex flex-col gap-6 border-b border-[#d0d0d0]/70 pb-8">
            <Image
              src="/FOOTER/logoSTile.png"
              alt="Stile"
              width={120}
              height={60}
              className="h-auto w-[120px]"
            />
            <div>
              <h3 className="font-heading text-[18px] uppercase tracking-[0.08em]">CÔNG TY TNHH STILE</h3>
              <div 
                className="mt-4 space-y-3 font-montserrat"
                style={{
                  fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
                  lineHeight: 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
                }}
              >
                <p>098 165 0042</p>
                <p>infor@stile.com.vn</p>
                <p>155 - 157 Nguyễn Cơ Thạch, P. An Khánh, TP. HCM</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {footerSocials.map((item) => (
                <Image key={item.alt} src={item.src} alt={item.alt} width={32} height={32} className="h-8 w-8" />
              ))}
            </div>
            <form 
              className="space-y-3 font-manrope"
              style={{
                fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
              }}
            >
              <input
                type="text"
                placeholder="Họ và Tên"
                className="h-11 w-full rounded border border-[#b3b3b3] px-4 text-[#222] placeholder:text-[#a4a4a4]"
              />
              <input
                type="text"
                placeholder="Số Điện Thoại"
                className="h-11 w-full rounded border border-[#b3b3b3] px-4 text-[#222] placeholder:text-[#a4a4a4]"
              />
              <input
                type="email"
                placeholder="Email"
                className="h-11 w-full rounded border border-[#b3b3b3] px-4 text-[#222] placeholder:text-[#a4a4a4]"
              />
              <textarea
                rows={4}
                placeholder="Nội dung tin nhắn.."
                className="w-full rounded border border-[#b3b3b3] px-4 py-3 text-[#222] placeholder:text-[#a4a4a4]"
              />
              <button
                type="submit"
                className="h-11 w-full rounded bg-[#242424] text-center font-heading text-[15px] uppercase tracking-[0.1em] text-white"
              >
                Gửi
              </button>
            </form>
            <div 
              className="grid grid-cols-2 gap-4 font-montserrat"
              style={{
                fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
                lineHeight: 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
              }}
            >
              {footerLinks.map((link) => (
                <Link key={link} href="#" className="transition hover:text-[#555]">
                  {link}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-8 font-manrope text-[12px]">
            <div className="flex justify-center">
              <Image
                src="/bocongthuong.png"
                alt="Đã thông báo bộ công thương"
                width={140}
                height={42}
                className="h-auto w-[140px]"
              />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <div className="flex justify-center gap-6 text-[#111]">
                <Link href="#" className="transition hover:text-[#555]">
                  Chính sách bảo mật
                </Link>
                <Link href="#" className="transition hover:text-[#555]">
                  Điều khoản sử dụng
                </Link>
              </div>
              <p>Bản quyền thuộc về Công Ty TNHH STile</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

function PillButton({
  label,
  theme = "light",
  fullWidth = false,
  noRounded = false,
}: {
  label: string;
  theme?: "dark" | "light";
  fullWidth?: boolean;
  noRounded?: boolean;
}) {
  const isLight = theme === "light";
  const themeClass = isLight ? "btn--light" : "btn--dark";
  return (
    <div 
      data-magnet-btn 
      className={fullWidth ? "w-full" : ""}
      style={noRounded ? { borderRadius: 0 } : undefined}
    >
      <div 
        className={`cta__item ${fullWidth ? "w-full" : ""}`}
        style={noRounded ? { borderRadius: 0 } : undefined}
      >
        <button
          type="button"
          className={`btn ${themeClass} ${fullWidth ? "w-full" : ""}`}
          style={noRounded ? { borderRadius: 0 } : undefined}
        >
          <span 
            className="btn__outline" 
            style={noRounded ? { borderRadius: 0 } : undefined}
          />
          <span 
            className="btn__hover" 
            style={noRounded ? { borderRadius: 0 } : undefined}
          />
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
      className={`border border-black text-[#222] placeholder:text-[#a4a4a4] focus:border-black focus:outline-none ${
        full ? "col-span-2" : "col-span-1"
      }`}
      style={{
        height: 'calc(40px * (100vw / 1470px))',
        paddingLeft: 'calc(12px * (100vw / 1470px))',
        paddingRight: 'calc(12px * (100vw / 1470px))',
        fontSize: 'calc(12px * (100vw / 1470px))',
      }}
    />
  );
}

function TextareaField({ placeholder }: { placeholder: string }) {
  return (
    <textarea
      placeholder={placeholder}
      rows={3}
      className="col-span-2 border border-black text-[#222] placeholder:text-[#a4a4a4] focus:border-black focus:outline-none"
      style={{
        paddingLeft: 'calc(12px * (100vw / 1470px))',
        paddingRight: 'calc(12px * (100vw / 1470px))',
        paddingTop: 'calc(8px * (100vw / 1470px))',
        paddingBottom: 'calc(8px * (100vw / 1470px))',
        fontSize: 'calc(12px * (100vw / 1470px))',
      }}
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
