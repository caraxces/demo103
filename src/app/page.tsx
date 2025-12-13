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
    image: "/SẢN PHẨM NỔI BẬT/CAM 1 1.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 1 1.svg",
    description:
      "The profound dialog between humans and nature translates into an interplay of glimpses and reflections, where humans and the earth mirror each other and collaborate in perfect synergy.",
    swatch: "#b68363",
  },
  {
    id: "gemini-grano",
    collection: "Gemini",
    title: "Grano",
    image: "/SẢN PHẨM NỔI BẬT/CAM 1 2.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 1 2.svg",
    description:
      "A tactile shade that blends warm minerals and muted neutrals, creating calm, grounding spaces with subtle surface movement.",
    swatch: "#a88b6a",
  },
  {
    id: "gemini-cielo",
    collection: "Gemini",
    title: "Cielo",
    image: "/SẢN PHẨM NỔI BẬT/CAM 1 3.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 1 3.svg",
    description:
      "Inspired by expansive skies, Cielo layers delicate veining over a soft base, ideal for serene living environments.",
    swatch: "#9aa0a8",
  },
  {
    id: "gemini-cerene",
    collection: "Gemini",
    title: "Cerene",
    image: "/SẢN PHẨM NỔI BẬT/CAM 1 4.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 1 4.svg",
    description:
      "Cerene balances matte and gloss accents to elevate contemporary interiors with refined simplicity.",
    swatch: "#c7b4a3",
  },
  {
    id: "gemini-muschio",
    collection: "Gemini",
    title: "Muschio",
    image: "/SẢN PHẨM NỔI BẬT/CAM 1 5.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 1 5.svg",
    description:
      "Earthy greens paired with organic textures bring a biophilic sensibility to large feature surfaces.",
    swatch: "#71806a",
  },
  {
    id: "gemini-luce",
    collection: "Gemini",
    title: "Luce",
    image: "/SẢN PHẨM NỔI BẬT/CAM 1 6.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 1 6.svg",
    description:
      "Luce captures luminous gradients, echoing the softly diffused daylight of refined residential settings.",
    swatch: "#d3c7be",
  },
  {
    id: "gemini-flora-luce",
    collection: "Gemini",
    title: "Flora Luce",
    image: "/SẢN PHẨM NỔI BẬT/CAM 1 7.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 1 7.svg",
    description:
      "Flora Luce celebrates botanical motifs layered over a satin base, creating immersive, nature-led surfaces.",
    swatch: "#8f826d",
  },
  {
    id: "gemini-flora-pelle",
    collection: "Gemini",
    title: "Flora Pelle",
    image: "/SẢN PHẨM NỔI BẬT/CAM 2 1.svg",
    mobileImage: "/SẢN PHẨM NỔI BẬT/CAM 2 1.svg",
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
                    fontSize: 'calc(14px * (100vw / 1440px))',
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

// Animated Plus/Minus Icon
const AnimatedPlusMinusIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none" className="relative">
    {/* Horizontal line - always visible (minus sign) */}
    <rect 
      y="5" 
      width="11" 
      height="1" 
      fill="#010101"
      className="transition-all duration-500 ease-in-out"
    />
    {/* Vertical line - rotates 90deg to become horizontal and fades out when expanded */}
    <rect 
      x="5" 
      y="0" 
      width="1" 
      height="11" 
      fill="#010101"
      className="transition-all duration-500 ease-in-out"
      style={{
        transform: `rotate(${isExpanded ? 90 : 0}deg)`,
        transformOrigin: 'center',
        opacity: isExpanded ? 0 : 1,
      }}
    />
  </svg>
);

// Mobile Menu Component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentView, setCurrentView] = useState<'main' | 'products' | 'services' | string>('main');
  const [selectedProductItem, setSelectedProductItem] = useState<typeof productDropdownItems[number] | null>(null);
  const [selectedServiceItem, setSelectedServiceItem] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const logoSrc = "/New STILE Logo Vector 1-16.png";

  // Use desktop menu items structure - Level 1
  const productMainItems = [
    { label: "GẠCH ỐP LÁT", hasSubmenu: true },
    { label: "HIỆU ỨNG", hasSubmenu: true },
    { label: "NỘI THẤT", hasSubmenu: true },
    { label: "ỨNG DỤNG", hasSubmenu: true },
  ];

  const serviceMainItems = {
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

  // Reset to main view when menu closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('main');
      setSelectedProductItem(null);
      setSelectedServiceItem(null);
      setShowContactForm(false);
      setExpandedItems(new Set());
    }
  }, [isOpen]);

  const handleViewChange = (newView: string, direction: 'left' | 'right' = 'right') => {
    setSlideDirection(direction);
    setCurrentView(newView);
  };

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemLabel)) {
        newSet.delete(itemLabel);
      } else {
        newSet.add(itemLabel);
      }
      return newSet;
    });
  };

  const handleProductItemClick = (item: typeof productDropdownItems[number]) => {
    if (item.submenu) {
      setSelectedProductItem(item);
      setCurrentView(`product-${item.label}`);
    } else {
      onClose();
    }
  };

  const handleServiceItemClick = (key: string) => {
    setSelectedServiceItem(key);
    setCurrentView(`service-${key}`);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className="fixed inset-0 bg-[#E3DCD1] z-50 overflow-hidden"
      style={{ 
        zIndex: 1001,
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
        opacity: isOpen ? 1 : 0,
      }}
      onClick={(e) => {
        // Prevent clicks from propagating to elements below
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        // Prevent touch events from propagating to elements below
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        // Prevent touch events from propagating to elements below
        e.stopPropagation();
      }}
    >
      {/* Header section with logo and hamburger button */}
      <div 
        className="relative mx-auto flex h-full w-full items-center justify-between px-6 max-lg:px-6 bg-[#E3DCD1]"
        style={{
          paddingLeft: '0',
          paddingRight: '20px',
          paddingTop: '0',
          height: '80px',
          position: 'relative',
          zIndex: 1002,
        }}
      >
        <Link href="#hero" className="flex items-center z-10" style={{
          marginLeft: '20px',
          marginTop: '20px',
        }}>
          <Image
            src={logoSrc}
            alt="Stile logo"
            width={90}
            height={34}
            priority
            className="h-auto transition-all duration-300"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              filter: 'brightness(0)',
            }}
          />
        </Link>
        <div className="relative">
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111111] text-[#111111] bg-[#E3DCD1] hover:bg-[#111111] hover:text-white transition-all duration-500"
            style={{ 
              zIndex: 1002,
            }}
          >
            <span className="flex flex-col items-center justify-center gap-[8px]">
              <span className="block h-[2.5px] w-6 bg-current transition-all duration-500 ease-in-out rotate-45 translate-y-[10px]" />
              <span className="block h-[2.5px] w-6 bg-current transition-all duration-500 ease-in-out opacity-0" />
              <span className="block h-[2.5px] w-6 bg-current transition-all duration-500 ease-in-out -rotate-45 -translate-y-[10px]" />
            </span>
          </button>
        </div>
      </div>
      <div className="relative w-full overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Main Menu View */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            currentView === 'main' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {currentView === 'main' && (
          <div className="px-6 pb-8 pt-6">
            {/* Part 1: Header */}
            <div className="relative mx-auto flex h-full w-full items-center justify-between px-6 max-lg:px-6 border-b border-black pb-4 mb-4">
              <h2 className="font-heading text-[#111111] text-center w-full" style={{ fontSize: '24px', letterSpacing: '1.44px' }}>
                MENU
              </h2>
            </div>
            
            {/* Part 2: Main Navigation */}
            <nav className="space-y-0 border-b border-black pb-4 mb-4">
              <Link
                href="#about"
                onClick={onClose}
                className="block py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
              >
                Về STile
              </Link>
              <button
                onClick={() => handleViewChange('products', 'right')}
                className="w-full flex items-center justify-between py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
              >
                <span className="text-[#111111]">Sản Phẩm</span>
                <span className="text-[#111111] text-[10px]">›</span>
              </button>
              <Link
                href="#projects"
                onClick={onClose}
                className="block py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
              >
                Công Trình & Xu Hướng
              </Link>
              <Link
                href="#gallery"
                onClick={onClose}
                className="block py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
              >
                Artile Gallery
              </Link>
              <button
                onClick={() => handleViewChange('services', 'right')}
                className="w-full flex items-center justify-between py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
              >
                <span className="text-[#111111]">Dịch Vụ</span>
                <span className="text-[#111111] text-[10px]">›</span>
              </button>
            </nav>

            {/* Part 3: Footer Section */}
            <div className="mt-4 pt-4 space-y-0 border-b border-black pb-4 mb-4">
              <Link
                href="#search"
                onClick={onClose}
                className="block py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
              >
                Tìm Kiếm
              </Link>
              
              {/* Contact Form */}
              <div>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full flex items-center justify-between py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
                >
                  <span className="text-[#111111]">Liên Hệ Ngay</span>
                  <span className="text-[#111111] flex items-center justify-center">
                    <AnimatedPlusMinusIcon isExpanded={showContactForm} />
                  </span>
                </button>
                <div 
                  className="flex flex-col items-start w-full overflow-hidden transition-all ease-in-out"
                  style={{
                    maxHeight: showContactForm ? '1000px' : '0px',
                    opacity: showContactForm ? 1 : 0,
                    transitionDuration: '600ms',
                  }}
                >
                  <div style={{ pointerEvents: showContactForm ? 'auto' : 'none' }}>
                    <div className="flex flex-col gap-3 pt-2">
                      {[
                        { type: 'text', placeholder: 'Họ và Tên', idx: 0 },
                        { type: 'tel', placeholder: 'Số Điện Thoại', idx: 1 },
                        { type: 'email', placeholder: 'Email', idx: 2 },
                        { type: 'textarea', placeholder: 'Nội dung Tin nhắn...', idx: 3 },
                        { type: 'button', label: 'Gửi', idx: 4 },
                      ].map((field) => (
                        field.type === 'textarea' ? (
                          <textarea
                            key={field.idx}
                            placeholder={field.placeholder}
                            rows={3}
                            className="bg-[#f3ece1] border border-[#cfc8bc] rounded-[7px] px-[10px] py-[5px] font-manrope text-[12px] text-[#8e8e8e] resize-none transition-all ease-out"
                            style={{
                              transform: showContactForm ? 'translateY(0)' : 'translateY(-10px)',
                              opacity: showContactForm ? 1 : 0,
                              transitionDuration: '600ms',
                              transitionDelay: showContactForm ? `${(field.idx + 1) * 60}ms` : `${(4 - field.idx) * 60}ms`
                            }}
                          />
                        ) : field.type === 'button' ? (
                          <button
                            key={field.idx}
                            type="button"
                            className="bg-[#5b5448] border border-[#cfc8bc] rounded-[7px] py-[5px] font-manrope text-[12px] text-white transition-all ease-out"
                            style={{
                              transform: showContactForm ? 'translateY(0)' : 'translateY(-10px)',
                              opacity: showContactForm ? 1 : 0,
                              transitionDuration: '600ms',
                              transitionDelay: showContactForm ? `${(field.idx + 1) * 60}ms` : `${(4 - field.idx) * 60}ms`
                            }}
                          >
                            {field.label}
                          </button>
                        ) : (
                          <input
                            key={field.idx}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="bg-[#f3ece1] border border-[#cfc8bc] rounded-[7px] px-[10px] py-[5px] font-manrope text-[12px] text-[#8e8e8e] transition-all ease-out"
                            style={{
                              transform: showContactForm ? 'translateY(0)' : 'translateY(-10px)',
                              opacity: showContactForm ? 1 : 0,
                              transitionDuration: '600ms',
                              transitionDelay: showContactForm ? `${(field.idx + 1) * 60}ms` : `${(4 - field.idx) * 60}ms`
                            }}
                          />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Part 4: Social Media Section */}
            <div className="mt-4 pt-4 space-y-0">
              <h3 className="font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px] mb-4">
                Các Nền Tảng Mạng Xã Hội
              </h3>
              <div className="flex flex-wrap gap-3">
                {footerSocials.map((item) => (
                  <Link
                    key={item.alt}
                    href="#"
                    className="flex h-[30px] w-[30px] items-center justify-center"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={30}
                      height={30}
                      className="h-auto"
                      style={{ width: '30px', height: '30px' }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Products Sub-menu - Level 1 */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            currentView === 'products' && !selectedProductItem
              ? 'translate-x-0'
              : currentView.startsWith('product') || currentView === 'products-list'
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          {currentView === 'products' && !selectedProductItem && (
          <div className="px-6 pb-8 pt-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => handleViewChange('main', 'left')}
                className="mr-4 flex h-8 w-8 items-center justify-center"
              >
                <span className="text-[#111111] text-2xl">‹</span>
              </button>
              <h2 className="font-montserrat text-[#111111] text-[15px] font-normal tracking-[0.9px] text-center flex-1">
                Sản Phẩm
              </h2>
              <div className="w-8" />
            </div>
            
            <nav className="space-y-0">
              {productMainItems.map((item) => {
                const isExpanded = expandedItems.has(item.label);
                return (
                  <div key={item.label} className="w-full">
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="w-full h-[48px] flex items-center justify-between relative"
                    >
                      <span 
                        className="font-heading text-[#111111] text-center absolute left-1/2 -translate-x-1/2"
                        style={{ 
                          fontSize: '20px', 
                          letterSpacing: '1.2px',
                          lineHeight: '24px'
                        }}
                      >
                        {item.label}
                      </span>
                      <span className="text-[#111111] flex items-center justify-center ml-auto">
                        <AnimatedPlusMinusIcon isExpanded={isExpanded} />
                      </span>
                    </button>
                    <div 
                      className="flex flex-col items-start w-full overflow-hidden transition-all ease-in-out"
                      style={{
                        maxHeight: isExpanded ? '1000px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                        transitionDuration: '600ms',
                      }}
                    >
                      <div style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}>
                        {item.label === "GẠCH ỐP LÁT" && (
                          <div className="flex flex-col gap-0 w-full">
                            {["Tất Cả", "Bộ Sưu Tập", "Châu Á", "Châu Âu", "Trang Trí"].map((subItem, idx) => (
                              <Link
                                key={idx}
                                href="#"
                                onClick={onClose}
                                className="box-border flex gap-[10px] items-center px-[10px] font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px] w-full transition-all ease-out"
                                style={{ 
                                  height: idx === 4 ? '48px' : '49px',
                                  paddingTop: '10px',
                                  paddingBottom: '10px',
                                  transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                                  opacity: isExpanded ? 1 : 0,
                                  transitionDuration: '600ms',
                                  transitionDelay: isExpanded ? `${idx * 60}ms` : `${(4 - idx) * 60}ms`
                                }}
                              >
                                {subItem}
                              </Link>
                            ))}
                          </div>
                        )}
                        {item.label === "HIỆU ỨNG" && (
                          <div className="flex flex-col gap-0 w-full">
                            {["Tất Cả", "Đá Marble", "Đá Tự Nhiên", "Xi Măng, Bê Tông", "Kim Loại", "Gỗ", "Mosaic", "Khác"].map((subItem, idx) => (
                              <Link
                                key={idx}
                                href="#"
                                onClick={onClose}
                                className="box-border flex gap-[10px] items-center px-[10px] font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px] w-full transition-all ease-out"
                                style={{ 
                                  height: idx < 3 ? '49px' : '48px',
                                  paddingTop: '10px',
                                  paddingBottom: '10px',
                                  transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                                  opacity: isExpanded ? 1 : 0,
                                  transitionDuration: '600ms',
                                  transitionDelay: isExpanded ? `${idx * 60}ms` : `${(7 - idx) * 60}ms`
                                }}
                              >
                                {subItem}
                              </Link>
                            ))}
                          </div>
                        )}
                        {item.label === "NỘI THẤT" && (
                          <div className="flex flex-col gap-0 w-full">
                            {["Đèn Trang Trí", "Bàn Ăn", "Thiết Bị Vệ Sinh"].map((subItem, idx) => (
                              <Link
                                key={idx}
                                href="#"
                                onClick={onClose}
                                className="box-border flex gap-[10px] items-center px-[10px] font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px] w-full transition-all ease-out"
                                style={{ 
                                  height: '49px',
                                  paddingTop: '10px',
                                  paddingBottom: '10px',
                                  transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                                  opacity: isExpanded ? 1 : 0,
                                  transitionDuration: '600ms',
                                  transitionDelay: isExpanded ? `${idx * 60}ms` : `${(2 - idx) * 60}ms`
                                }}
                              >
                                {subItem}
                              </Link>
                            ))}
                          </div>
                        )}
                        {item.label === "ỨNG DỤNG" && (
                          <div className="flex flex-col gap-0 w-full">
                            {["Ốp Tường", "Lát Sàn", "Nội Thất", "Ốp Mặt Ngoài"].map((subItem, idx) => (
                              <Link
                                key={idx}
                                href="#"
                                onClick={onClose}
                                className="box-border flex gap-[10px] items-center px-[10px] font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px] w-full transition-all ease-out"
                                style={{ 
                                  height: idx === 3 ? '48px' : '49px',
                                  paddingTop: '10px',
                                  paddingBottom: '10px',
                                  transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                                  opacity: isExpanded ? 1 : 0,
                                  transitionDuration: '600ms',
                                  transitionDelay: isExpanded ? `${idx * 60}ms` : `${(3 - idx) * 60}ms`
                                }}
                              >
                                {subItem}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
          )}
        </div>

        {/* Products Sub-menu - Level 2 (GẠCH ỐP LÁT items) */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            currentView === 'products-list'
              ? 'translate-x-0'
              : currentView.startsWith('product-')
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          {currentView === 'products-list' && (
          <div className="px-6 pb-8 pt-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => handleViewChange('products', 'left')}
                className="mr-4 flex h-8 w-8 items-center justify-center"
              >
                <span className="text-[#111111] text-2xl">‹</span>
              </button>
              <h2 className="font-montserrat text-[#111111] text-[15px] font-normal tracking-[0.9px] text-center flex-1">
                GẠCH ỐP LÁT
              </h2>
              <div className="w-8" />
            </div>
            
            <nav className="space-y-0">
              {productDropdownItems.map((item) => {
                const isExpanded = expandedItems.has(item.label);
                return (
                  <div key={item.label} className="w-full">
                    <button
                      onClick={() => {
                        if (item.submenu) {
                          toggleExpanded(item.label);
                        } else {
                          onClose();
                        }
                      }}
                      className="w-full block py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px] flex items-center justify-between"
                    >
                      <span className="text-[#111111]">{item.label}</span>
                      {item.submenu && (
                        <span className="text-[#111111] flex items-center justify-center">
                          <AnimatedPlusMinusIcon isExpanded={isExpanded} />
                        </span>
                      )}
                    </button>
                    {item.submenu && isExpanded && (
                      <div className="pl-0 pb-2">
                        {item.submenu.type === 'dimensions' && (
                          <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="flex flex-col gap-2">
                              {item.submenu.leftColumn.map((size, idx) => (
                                <Link
                                  key={idx}
                                  href="#"
                                  onClick={onClose}
                                  className="block py-2 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
                                >
                                  {size}
                                </Link>
                              ))}
                            </div>
                            <div className="flex flex-col gap-2">
                              {item.submenu.rightColumn.map((size, idx) => (
                                <Link
                                  key={idx}
                                  href="#"
                                  onClick={onClose}
                                  className="block py-2 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
                                >
                                  {size}
                                </Link>
                              ))}
                            </div>
                            <div className="flex flex-col">
                              {item.submenu.other && (
                                <Link
                                  href="#"
                                  onClick={onClose}
                                  className="block py-2 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
                                >
                                  {item.submenu.other}
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                        {item.submenu.type === 'products' && (
                          <div className="flex flex-col gap-0 pt-2">
                            {item.submenu.items.map((product, idx) => (
                              <Link
                                key={idx}
                                href="#"
                                onClick={onClose}
                                className="block py-4 font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px]"
                              >
                                {product}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          )}
        </div>


        {/* Services Sub-menu - Level 1 */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
            currentView === 'services' && !selectedServiceItem
              ? 'translate-x-0'
              : currentView.startsWith('service-')
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          {currentView === 'services' && !selectedServiceItem && (

          <div className="px-6 pb-8 pt-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => handleViewChange('main', 'left')}
                className="mr-4 flex h-8 w-8 items-center justify-center"
              >
                <span className="text-[#111111] text-2xl">‹</span>
              </button>
              <h2 className="font-montserrat text-[#111111] text-[15px] font-normal tracking-[0.9px] text-center flex-1">
                Dịch Vụ
              </h2>
              <div className="w-8" />
            </div>
            
            <nav className="space-y-0">
              {Object.entries(serviceMainItems).map(([key, item]) => {
                const isExpanded = expandedItems.has(item.title);
                return (
                  <div key={key} className="w-full">
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className="w-full h-[48px] flex items-center justify-between relative"
                    >
                      <span 
                        className="font-heading text-[#111111] text-center absolute left-1/2 -translate-x-1/2"
                        style={{ 
                          fontSize: '20px', 
                          letterSpacing: '1.2px',
                          lineHeight: '24px'
                        }}
                      >
                        {item.title}
                      </span>
                      <span className="text-[#111111] flex items-center justify-center ml-auto">
                        <AnimatedPlusMinusIcon isExpanded={isExpanded} />
                      </span>
                    </button>
                    <div 
                      className="flex flex-col items-start w-full overflow-hidden transition-all ease-in-out"
                      style={{
                        maxHeight: isExpanded ? '1000px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                        transitionDuration: '600ms',
                      }}
                    >
                      <div style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}>
                        <div className="flex flex-col gap-0 w-full">
                          {item.items.map((subItem, idx) => (
                            <Link
                              key={idx}
                              href={subItem.href}
                              onClick={onClose}
                              className="box-border flex gap-[10px] items-center px-[10px] font-montserrat text-[#111111] text-[15px] font-medium tracking-[0.9px] w-full transition-all ease-out"
                              style={{ 
                                height: '49px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                                opacity: isExpanded ? 1 : 0,
                                transitionDuration: '600ms',
                                transitionDelay: isExpanded ? `${idx * 60}ms` : `${(item.items.length - 1 - idx) * 60}ms`
                              }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
          )}
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
          // On mobile, use window scroll; on desktop, use container scroll
          const scrollY = isMobile 
            ? (window.scrollY || window.pageYOffset || 0)
            : (() => {
                const container = document.getElementById(FULLPAGE_CONTAINER_ID);
                return container ? container.scrollTop : (window.scrollY || window.pageYOffset);
              })();
          
          // Nếu scroll xuống và đã scroll quá một khoảng nhỏ
          if (scrollY > lastScrollY.current && scrollY > 30) {
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

    // On mobile, listen to window scroll; on desktop, listen to container scroll
    const target = isMobile ? window : (document.getElementById(FULLPAGE_CONTAINER_ID) || window);
    
    // Set initial scroll position
    lastScrollY.current = isMobile 
      ? (window.scrollY || window.pageYOffset || 0)
      : (() => {
          const container = document.getElementById(FULLPAGE_CONTAINER_ID);
          return container ? container.scrollTop : (window.scrollY || window.pageYOffset);
        })();
    
    target.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

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
    ? "text-[#111111] hover:text-[#555555]"
    : (pastHero ? "text-[#111111] hover:text-[#555555]" : "text-white hover:text-[#f2f2f2]");

  // Logo đen chính - hiển thị cùng logic với text
  // Desktop: đen khi pastHero, trắng khi ở hero. Mobile: đen khi onLightSection, trắng khi không
  const logoSrc = isMobile ? "/New STILE Logo Vector 1-16.png" : "/LOGO/logo-stile.svg";

  const baseHeight = isMobile ? 80 : (pastHero ? 29 : 40);
  const headerHeight = isMobile ? 80 : (isHeaderHovered ? baseHeight + 6 : baseHeight);
  // Logo height calculation: logo width * (34/90) + 5px
  // Desktop: calc(71.5px * (100vw / 1440px)) * (34/90) + 5px = calc(27px * (100vw / 1440px)) + 5px
  // Mobile: 120px * (34/90) + 5px = 45.33px + 5px = 50.33px

  return (
    <header
      onMouseEnter={() => setIsHeaderHovered(true)}
      onMouseLeave={() => setIsHeaderHovered(false)}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-in-out ${
        isMobile 
          ? (isMobileMenuOpen || pastHero ? "text-[#111111]" : "text-white")
          : (pastHero ? "text-[#111111]" : "text-white")
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
            ? `${80 + 20}px` 
            : `calc(54px * (100vw / 1440px) + 5px)`,
          width: '100%',
          backgroundColor: isMobile 
            ? (isMobileMenuOpen ? '#E3DCD1' : 'transparent')
            : (pastHero ? '#EEEBE6' : 'transparent'),
          zIndex: -1,
        }}
      />
      <div 
        className="relative mx-auto flex h-full w-full items-center justify-between px-6 max-lg:px-6"
        style={{
          paddingLeft: isMobile ? '0' : 'calc(24px * (100vw / 1440px))',
          paddingRight: isMobile ? '20px' : 'calc(57px * (100vw / 1440px))',
          paddingTop: isMobile ? '0' : 'calc(20px * (100vw / 1440px))',
        }}
      >
        <Link href="#hero" className="flex items-center z-10" style={{
          marginLeft: isMobile ? '20px' : 'calc(60px * (100vw / 1440px))',
          marginTop: isMobile ? '20px' : '0',
          alignSelf: isMobile ? 'flex-start' : 'center',
        }}>
          <Image
            src={logoSrc}
            alt="Stile logo"
            width={90}
            height={34}
            priority
            className="h-auto transition-all duration-300"
            style={{
              width: isMobile ? '80px' : 'calc((100px * (100vw * (1 / 1440px))) * 0.75)',
              height: isMobile ? '80px' : 'auto',
              objectFit: isMobile ? 'contain' : 'contain',
              // Logo đen: desktop khi pastHero, mobile khi pastHero hoặc mở menu
              // Logo trắng: desktop khi ở hero, mobile khi ở hero và chưa mở menu
              filter: isMobile 
                ? (isMobileMenuOpen || pastHero ? 'brightness(0)' : 'none')
                : (pastHero ? 'brightness(0)' : 'none'),
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
        {/* Mobile menu - Hamburger button on the right */}
        <div className="relative lg:hidden">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ease-in-out ${
              isMobileMenuOpen
                ? "border-[#111111] text-[#111111] bg-[#E3DCD1] hover:bg-[#111111] hover:text-white z-[1001]"
                : (pastHero 
                  ? "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                  : "border-white text-white hover:bg-white/20")
            }`}
            style={{ 
              zIndex: isMobileMenuOpen ? 1001 : 'auto',
              position: isMobileMenuOpen ? 'fixed' : 'relative',
              top: isMobileMenuOpen ? '20px' : 'auto',
              right: isMobileMenuOpen ? '20px' : 'auto',
              transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(0)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <span className="flex flex-col items-center justify-center gap-[8px]">
              <span 
                className="block h-[2.5px] w-6 bg-current"
                style={{
                  transform: isMobileMenuOpen ? 'rotate(45deg) translateY(10px)' : 'rotate(0deg) translateY(0px)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <span 
                className="block h-[2.5px] w-6 bg-current"
                style={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  transform: isMobileMenuOpen ? 'scaleX(0)' : 'scaleX(1)',
                  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <span 
                className="block h-[2.5px] w-6 bg-current"
                style={{
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-10px)' : 'rotate(0deg) translateY(0px)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </span>
          </button>
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
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
            fontSize: !isMobile ? 'calc(58px * (100vw / 1440px))' : '38px',
            lineHeight: !isMobile ? 'calc(73px * (100vw / 1440px))' : '56px',
            letterSpacing: !isMobile ? 'calc(1.16px * (100vw / 1440px))' : '0.02em',
          }}
        >
          <span className="hidden lg:inline whitespace-pre">
            <span className="block">BỀ MẶT LẤY CẢM HỨNG</span>
            <span className="block">TỪ THIÊN NHIÊN</span>
          </span>
          <span className="block lg:hidden whitespace-pre">
            Art of surface
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
  const svgRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [svgAnimated, setSvgAnimated] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Figma design dimensions: 1440x820
  const figmaWidth = 1440;
  const figmaHeight = 820;

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
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !svgAnimated) {
          setSvgAnimated(true);
          // Add animation class to SVG container
          svgElement.classList.add('svg-animate');
          
          // Try to animate paths if they exist
          const paths = svgElement.querySelectorAll('path');
          if (paths.length > 0) {
            paths.forEach((path, index) => {
              try {
                const pathLength = path.getTotalLength();
                path.style.strokeDasharray = `${pathLength}`;
                path.style.strokeDashoffset = `${pathLength}`;
                path.style.fill = 'transparent';
                path.style.stroke = '#000';
                path.style.strokeWidth = '2';
                
                // Animate stroke
                path.style.animation = `drawPath 2s ease forwards ${index * 0.1}s`;
              } catch (e) {
                // If path doesn't support getTotalLength, skip
              }
            });
            
            // After stroke animation, fill the paths
            setTimeout(() => {
              paths.forEach((path) => {
                path.style.animation = `fillPath 1s ease forwards`;
              });
            }, 2000 + paths.length * 100);
          }
        }
      },
      { threshold: 0.25 }
    );
    
    observer.observe(svgElement);
    return () => observer.disconnect();
  }, [svgAnimated]);

  useEffect(() => {
    const textNode = textRef.current;
    if (!textNode) return;

    textNode.style.transform = "translate3d(0px, 0px, 0px)";

    return () => {
      textNode.style.transform = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-header-light="true"
      className="fullpage-section flex items-center overflow-visible"
      style={{
        minHeight: '100vh',
        height: 'auto',
        zIndex: 1,
      }}
    >
      <div className="section-inner relative w-full overflow-visible" style={{ minHeight: 'calc(820px * (100vh / 820px))', height: 'auto' }}>
        {/* Desktop: >= 1440px - Layout theo Figma design (1440x820) */}
        {!isMobile && !isTablet && (
          <div 
            className="relative mx-auto w-full overflow-visible"
            style={{
              maxWidth: 'calc(1440px * (100vw / 1440px))',
              paddingLeft: 'calc(104px * (100vw / 1440px))',
              paddingRight: 'calc(104px * (100vw / 1440px))',
              minHeight: 'calc(820px * (100vh / 820px))',
              height: 'auto',
              paddingTop: 'calc(188px * (100vh / 820px))',
              paddingBottom: 'calc(100px * (100vh / 820px))',
            }}
          >
            {/* Left side - Text content */}
            <div
              ref={textRef}
              className="absolute left-0 flex flex-col text-left"
              style={{
                left: 'calc(104px * (100vw / 1440px))',
                top: 'calc(188px * (100vh / 820px))',
                width: 'calc(684px * (100vw / 1440px))',
                zIndex: 2,
              }}
            >
              {/* Heading - 3 lines */}
              <h2 className="font-heading uppercase text-[#000000] leading-none" style={{
                fontSize: 'calc(58px * (100vw * (1 / 1440px)))',
                lineHeight: 'calc(60px * (100vw / 1440px))',
                letterSpacing: '0.02em',
              }}>
                <span style={{ display: 'block' }}>ĐỊNH HÌNH</span>
                <span style={{ display: 'block', marginTop: 'calc(15px * (100vh / 820px))' }}>CHUẨN MỰC MỚI</span>
                <span style={{ display: 'block', marginTop: 'calc(15px * (100vh / 820px))' }}>CHO BỀ MẶT ỐP LÁT</span>
              </h2>

              {/* Paragraphs */}
              <div 
                className="font-manrope text-justify text-[#000000]"
                style={{
                  marginTop: 'calc(141px * (100vh / 820px))',
                  fontSize: 'calc(16px * (100vw / 1440px))',
                  lineHeight: 'calc(25px * (100vw / 1440px))',
                }}
              >
                <p className="mb-0">
                  STILE là một trong những nhà cung cấp giải pháp ốp lát hàng đầu Việt Nam tiên phong phát triển những bề mặt đột phá về kích cỡ, thiết kế và công nghệ.
                </p>
                <p className="mb-0">&nbsp;</p>
                <p>
                  Kết hợp kinh nghiệm dày dặn cùng sự am hiểu sâu sắc về lĩnh vực sản xuất gạch, chúng tôi lựa chọn hợp tác cùng các nhà sản xuất sỡ hữu nguồn nguyên liệu chất lượng cao, quy trình cấp tiến và công nghệ thân thiện hàng đầu thế giới (Ý, Tây Ban Nha, Ấn Độ,...).
                </p>
              </div>

              {/* Button */}
              <div 
                className="flex justify-start"
                style={{
                  marginTop: 'calc(40px * (100vh / 820px))',
                  }}
                >
                  <PillButton label="Khám phá ngay" />
              </div>
            </div>

            {/* Right side - SVG Logo */}
            <div 
              className="absolute top-0 bottom-0 overflow-visible"
              style={{
                right: 0,
                top: 0,
                width: 'calc((3980px * (100vw * (1 / 1440px))) * 0.35)',
                height: 'calc((3050px * (100vh * (1 / 820px))) * 0.35)',
                maxWidth: 'calc(150px + 100vw)',
                zIndex: 0,
                }}
              >
                <div
                  ref={svgRef}
                className={`absolute inset-0 ${svgAnimated ? 'svg-animate' : ''}`}
                  style={{
                    opacity: svgAnimated ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  zIndex: 0,
                  }}
                >
                  <img
                    src="/VỀ CHÚNG TÔI/Corona_Camera002._Interactive LightMix00100 1.svg"
                    alt="STILE Logo"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{
                    objectPosition: 'right center',
                    }}
                  />
              </div>
            </div>

            {/* Rotated "VỀ CHÚNG TÔI" text overlay */}
            <div 
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: 'calc(958px * (100vw / 1440px))',
                top: 'calc(240.17px * (100vh / 820px))',
                width: 'calc(170.413px * (100vw / 1440px))',
                height: 'calc(170.413px * (100vh / 820px))',
                zIndex: 3,
              }}
            >
              {/* <p 
                className="font-alt font-medium text-[#000000] whitespace-nowrap"
                style={{
                  fontSize: 'calc(20px * (100vw / 1440px))',
                  lineHeight: 'calc(48px * (100vh / 820px))',
                  letterSpacing: 'calc(4.4px * (100vw / 1440px))',
                  transform: 'rotate(315deg)',
                }}
              >
                VỀ CHÚNG TÔI
              </p> */}
            </div>
          </div>
        )}

        {/* Mobile: < 980px - Layout dọc */}
        {isMobile && (
          <div className="flex flex-col gap-10 px-6 pt-16 pb-16">
            <div
              ref={textRef}
              className="flex flex-col text-left"
              style={{
                gap: '24px',
              }}
            >
              <span 
                className="font-alt font-medium tracking-[0.05em]"
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                }}
              >
                VỀ CHÚNG TÔI
              </span>
              <h2 className="font-heading tracking-[0.02em] uppercase text-[#000000]">
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
              </h2>
              <p 
                className="font-manrope text-justify text-[#000000]"
                style={{
                  fontSize: 'clamp(16px, calc(16px + (100vw - 480px) * 0.0125), 18px)',
                  lineHeight: 'clamp(24px, calc(24px + (100vw - 480px) * 0.025), 28px)',
                }}
              >
                STILE là một trong những nhà cung cấp giải pháp ốp lát hàng đầu Việt Nam tiên phong phát
                triển những bề mặt đột phá về kích cỡ, thiết kế và công nghệ. Kết hợp kinh nghiệm dày
                dặn cùng sự am hiểu sâu sắc về lĩnh vực sản xuất gạch, chúng tôi lựa chọn hợp tác cùng các
                nhà sản xuất sỡ hữu nguồn nguyên liệu chất lượng cao, quy trình cấp tiến và công nghệ thân
                thiện hàng đầu thế giới (Ý, Tây Ban Nha, Ấn Độ,...).
              </p>
              <div className="pt-2 flex justify-start">
                <PillButton label="Khám phá ngay" />
              </div>
            </div>
            <div className="relative w-full aspect-[534/601] overflow-hidden">
              <div
                ref={svgRef}
                className={`relative w-full h-full ${svgAnimated ? 'svg-animate' : ''}`}
                style={{
                  opacity: svgAnimated ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              >
                <img
                  src="/VỀ CHÚNG TÔI/Corona_Camera002._Interactive LightMix00100 1.svg"
                  alt="STILE Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tablet: 980px - 1439px - Scale từ desktop 1440px */}
        {isTablet && (
          <div 
            className="relative mx-auto w-full overflow-visible"
            style={{
              paddingLeft: `${(104 / 1440) * 100}vw`,
              paddingRight: `${(104 / 1440) * 100}vw`,
              minHeight: `${(820 / 820) * 100}vh`,
              height: 'auto',
              paddingTop: `${(188 / 820) * 100}vh`,
              paddingBottom: `${(100 / 820) * 100}vh`,
            }}
          >
            <div
              ref={textRef}
              className="absolute left-0 flex flex-col text-left"
              style={{
                left: `${(104 / 1440) * 100}vw`,
                top: `${(188 / 820) * 100}vh`,
                width: `${(684 / 1440) * 100}vw`,
              }}
            >
              <h2 className="font-heading uppercase text-[#000000] leading-none" style={{
                fontSize: `${(64 / 1440) * 100}vw`,
                lineHeight: `${(60 / 1440) * 100}vw`,
                letterSpacing: '0.02em',
              }}>
                <span style={{ display: 'block' }}>ĐỊNH HÌNH</span>
                <span style={{ display: 'block', marginTop: `${(15 / 820) * 100}vh` }}>CHUẨN MỰC MỚI</span>
                <span style={{ display: 'block', marginTop: `${(15 / 820) * 100}vh` }}>CHO BỀ MẶT ỐP LÁT</span>
              </h2>

              <div 
                className="font-manrope text-justify text-[#000000]"
                style={{
                  marginTop: `${(141 / 820) * 100}vh`,
                  fontSize: `${(16 / 1440) * 100}vw`,
                  lineHeight: `${(25 / 1440) * 100}vw`,
                }}
              >
                <p className="mb-0">
                  STILE là một trong những nhà cung cấp giải pháp ốp lát hàng đầu Việt Nam tiên phong phát triển những bề mặt đột phá về kích cỡ, thiết kế và công nghệ.
                </p>
                <p className="mb-0">&nbsp;</p>
                <p>
                  Kết hợp kinh nghiệm dày dặn cùng sự am hiểu sâu sắc về lĩnh vực sản xuất gạch, chúng tôi lựa chọn hợp tác cùng các nhà sản xuất sỡ hữu nguồn nguyên liệu chất lượng cao, quy trình cấp tiến và công nghệ thân thiện hàng đầu thế giới (Ý, Tây Ban Nha, Ấn Độ,...).
                </p>
              </div>

              <div 
                className="flex justify-start"
                style={{
                  marginTop: `${(40 / 820) * 100}vh`,
                  }}
                >
                  <PillButton label="Khám phá ngay" />
              </div>
            </div>

            <div 
              className="absolute top-0 bottom-0 overflow-visible"
              style={{
                right: 0,
                top: 0,
                width: 'calc((3980px * (100vw * (1 / 1440px))) * 0.35)',
                height: 'calc((3250px * (100vh * (1 / 820px))) * 0.35)',
                maxWidth: 'calc(150px + 100vw)',
                zIndex: 0,
                }}
              >
                <div
                  ref={svgRef}
                className={`absolute inset-0 ${svgAnimated ? 'svg-animate' : ''}`}
                  style={{
                    opacity: svgAnimated ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }}
                >
                  <img
                    src="/VỀ CHÚNG TÔI/Corona_Camera002._Interactive LightMix00100 1.svg"
                    alt="STILE Logo"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{
                    objectPosition: 'right center',
                    }}
                  />
              </div>
            </div>

            <div 
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: `${(958 / 1440) * 100}vw`,
                top: `${(240.17 / 820) * 100}vh`,
                width: `${(170.413 / 1440) * 100}vw`,
                height: `${(170.413 / 820) * 100}vh`,
              }}
            >
              <p 
                className="font-alt font-medium text-[#000000] whitespace-nowrap"
                style={{
                  fontSize: `${(20 / 1440) * 100}vw`,
                  lineHeight: `${(48 / 820) * 100}vh`,
                  letterSpacing: `${(4.4 / 1440) * 100}vw`,
                  transform: 'rotate(315deg)',
                }}
              >
                VỀ CHÚNG TÔI
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Gallery() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textDescriptionRef = useRef<HTMLDivElement>(null);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const randomRevealedRef = useRef<Array<{ x: number; y: number; radius: number }>>([]);
  const maskInitializedRef = useRef(false);
  const spreadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSpreadingRef = useRef(false);
  const isFullyRevealedRef = useRef(false);
  
  // Figma design: 1440x1130 aspect ratio
  // Height should be responsive based on width: height = width / 1.274

  useEffect(() => {
    // Trigger loading animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Typing effect starts automatically when fully revealed (backup trigger)
  useEffect(() => {
    if (!isLoaded || !isFullyRevealed || typeof window === 'undefined' || window.innerWidth < 1024) return;
    
    // Start typing immediately when fully revealed (backup in case direct trigger didn't work)
    if (!isTyping && isLoaded && isFullyRevealed) {
      setIsTyping(true);
    }
  }, [isLoaded, isFullyRevealed]);

  // Typing animation - only start when fully revealed
  useEffect(() => {
    if (!isTyping || !isLoaded || !isFullyRevealed || typeof window === 'undefined' || window.innerWidth < 1024) {
      setTypedText('');
      return;
    }

    const fullText = '"Tại STile, chúng tôi không đơn thuần gọi đó là Showroom. Với chúng tôi, mỗi sản phẩm hiện diện ở đây đều là một tác phẩm nghệ thuật được chọn lọc, sắp đặt có chủ đích. Mỗi bề mặt, mỗi đường vân đều mang trong mình chất riêng và khi đặt cạnh nhau, chúng tạo nên một không gian kể chuyện.\n\nỞ STile, chúng tôi giới thiệu những tác phẩm nghệ thuật để khách hàng trải nghiệm và cảm nhận phong cách sống qua từng thiết kế muốn truyền tải."';
    
    // Start typing immediately with first character
    setTypedText(fullText[0] || '');
    let currentIndex = 1;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 15); // Typing speed: 15ms per character (faster)

    return () => {
      clearInterval(typingInterval);
    };
  }, [isTyping, isLoaded, isFullyRevealed]);

  // Initialize random reveal spots
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create random reveal spots (top, middle, bottom areas)
    const randomSpots: Array<{ x: number; y: number; radius: number }> = [];
    const numSpots = 8;
    
    for (let i = 0; i < numSpots; i++) {
      const area = Math.random();
      let y;
      if (area < 0.33) {
        y = Math.random() * (canvas.height * 0.3);
      } else if (area < 0.66) {
        y = canvas.height * 0.3 + Math.random() * (canvas.height * 0.4);
      } else {
        y = canvas.height * 0.7 + Math.random() * (canvas.height * 0.3);
      }
      
      randomSpots.push({
        x: Math.random() * canvas.width,
        y: y,
        radius: 60 + Math.random() * 80,
      });
    }
    
    randomRevealedRef.current = randomSpots;
  }, [isLoaded]);

  // Watercolor brush reveal effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section || typeof window === 'undefined' || window.innerWidth < 1024) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      maskInitializedRef.current = false;
      // Redraw mask when resize
      initializeMask();
    };
    
    // Initialize mask with background and random spots
    const initializeMask = () => {
      if (!ctx || maskInitializedRef.current) return;
      
      // Fill with background color
      ctx.fillStyle = '#E2DACF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Use composite to erase revealed areas
      ctx.globalCompositeOperation = 'destination-out';
      
      // Draw random revealed spots
      randomRevealedRef.current.forEach(spot => {
        const gradient = ctx.createRadialGradient(
          spot.x, spot.y, 0,
          spot.x, spot.y, spot.radius
        );
        gradient.addColorStop(0, 'rgba(226, 218, 207, 1)');
        gradient.addColorStop(0.6, 'rgba(226, 218, 207, 0.8)');
        gradient.addColorStop(1, 'rgba(226, 218, 207, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalCompositeOperation = 'source-over';
      maskInitializedRef.current = true;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initial draw
    if (isLoaded && !maskInitializedRef.current) {
      setTimeout(() => {
        initializeMask();
      }, 200);
    }

    let lastMoveTime = Date.now();
    let movementSpeed = 0;

    // Function to spread reveal from existing areas to full canvas
    const startSpreadAnimation = () => {
      if (isSpreadingRef.current || !ctx || isFullyRevealedRef.current) return;
      isSpreadingRef.current = true;
      
      const startTime = Date.now();
      const duration = 4000; // 4 seconds to spread (22% slower)
      
      const animateSpread = () => {
        if (!ctx) return;
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth spread
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // Redraw mask with spreading effect
        ctx.fillStyle = '#E2DACF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalCompositeOperation = 'destination-out';
        
        // Calculate max spread radius
        const maxRadius = Math.max(canvas.width, canvas.height) * 1.2;
        
        // Spread from random spots
        randomRevealedRef.current.forEach(spot => {
          const expandedRadius = spot.radius + (maxRadius - spot.radius) * easeProgress;
          const gradient = ctx.createRadialGradient(
            spot.x, spot.y, 0,
            spot.x, spot.y, expandedRadius
          );
          gradient.addColorStop(0, 'rgba(226, 218, 207, 1)');
          gradient.addColorStop(0.5, 'rgba(226, 218, 207, 0.8)');
          gradient.addColorStop(1, 'rgba(226, 218, 207, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(spot.x, spot.y, expandedRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Additional spread from center to cover all areas
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const spreadRadius = maxRadius * easeProgress;
        
        const spreadGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, spreadRadius
        );
        spreadGradient.addColorStop(0, 'rgba(226, 218, 207, 1)');
        spreadGradient.addColorStop(0.4, 'rgba(226, 218, 207, 0.9)');
        spreadGradient.addColorStop(0.7, 'rgba(226, 218, 207, 0.5)');
        spreadGradient.addColorStop(1, 'rgba(226, 218, 207, 0)');
        
        ctx.fillStyle = spreadGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, spreadRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
        
        if (progress < 1) {
          requestAnimationFrame(animateSpread);
        } else {
          // Final state - fully revealed
          ctx.fillStyle = '#E2DACF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(226, 218, 207, 1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'source-over';
          isSpreadingRef.current = false;
          isFullyRevealedRef.current = true;
          setIsFullyRevealed(true);
          // Start typing after 0.5 seconds delay
          setTimeout(() => {
            setIsTyping(true);
          }, 500);
        }
      };
      
      animateSpread();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!section || !ctx || !maskInitializedRef.current) return;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const now = Date.now();
      const timeDelta = now - lastMoveTime;
      
      // Clear spread timeout if mouse is moving
      if (spreadTimeoutRef.current) {
        clearTimeout(spreadTimeoutRef.current);
        spreadTimeoutRef.current = null;
      }
      
      // Calculate movement speed
      if (lastMousePosRef.current) {
        const dx = x - lastMousePosRef.current.x;
        const dy = y - lastMousePosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        movementSpeed = distance / Math.max(timeDelta, 1) * 1000; // pixels per second
      }
      
      lastMoveTime = now;

      // Only add noise/randomness when moving fast (speed > 50 px/s)
      const isMovingFast = movementSpeed > 50;
      
      // Draw brush strokes with varying widths (62-112px) - double size - direct reveal (kept forever)
      ctx.globalCompositeOperation = 'destination-out';
      
      // Multiple overlapping brush strokes for watercolor effect
      for (let i = 0; i < 3; i++) {
        const offsetX = isMovingFast ? (Math.random() - 0.5) * 16 : 0; // Increased offset for larger brush
        const offsetY = isMovingFast ? (Math.random() - 0.5) * 16 : 0;
        const brushWidth = (31 + Math.random() * 25) * 2; // 62-112px (double size)
        const brushRadius = brushWidth / 2;
        // Extended radius for softer edge (loang ra)
        const gradientRadius = brushRadius * 1.4;
        
        // Create soft brush gradient with 4 colors: #685C4E #807060 #B8A38B #E0D4C5
        const gradient = ctx.createRadialGradient(
          x + offsetX, y + offsetY, 0,
          x + offsetX, y + offsetY, gradientRadius
        );
        // Center: darkest color #685C4E
        gradient.addColorStop(0, 'rgba(104, 92, 78, 1)');
        // Transition to #807060
        gradient.addColorStop(0.25, 'rgba(128, 112, 96, 0.95)');
        // Transition to #B8A38B
        gradient.addColorStop(0.5, 'rgba(184, 163, 139, 0.7)');
        // Transition to #E0D4C5
        gradient.addColorStop(0.75, 'rgba(224, 212, 197, 0.4)');
        // Edge: fully transparent for soft bleed effect
        gradient.addColorStop(1, 'rgba(224, 212, 197, 0)');
        
        // Draw brush circle
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, gradientRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect to previous point with stroke (only first layer to avoid overdrawing)
        if (lastMousePosRef.current && i === 0) {
          const prevX = lastMousePosRef.current.x;
          const prevY = lastMousePosRef.current.y;
          
          // Create gradient along the stroke with 4 colors
          const strokeGradient = ctx.createLinearGradient(prevX, prevY, x, y);
          strokeGradient.addColorStop(0, 'rgba(104, 92, 78, 1)');
          strokeGradient.addColorStop(0.33, 'rgba(128, 112, 96, 1)');
          strokeGradient.addColorStop(0.66, 'rgba(184, 163, 139, 1)');
          strokeGradient.addColorStop(1, 'rgba(224, 212, 197, 1)');
          
          ctx.strokeStyle = strokeGradient;
          ctx.lineWidth = brushWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
      
      ctx.globalCompositeOperation = 'source-over';
      lastMousePosRef.current = { x, y };
      
      // Set timeout to start spread animation after 1.5 seconds of no movement (only if not fully revealed)
      if (!isFullyRevealedRef.current) {
        if (spreadTimeoutRef.current) {
          clearTimeout(spreadTimeoutRef.current);
        }
        spreadTimeoutRef.current = setTimeout(() => {
          if (!isSpreadingRef.current && !isFullyRevealedRef.current) {
            startSpreadAnimation();
          }
        }, 500);
      }
    };

    const handleMouseEnter = () => {
      if (!maskInitializedRef.current) {
        initializeMask();
      }
    };

    const handleMouseLeave = () => {
      lastMousePosRef.current = null;
      movementSpeed = 0;
      
      // Start spread animation after 1.5 seconds (only if not fully revealed)
      if (!isFullyRevealedRef.current) {
        if (spreadTimeoutRef.current) {
          clearTimeout(spreadTimeoutRef.current);
        }
        spreadTimeoutRef.current = setTimeout(() => {
          if (!isSpreadingRef.current && !isFullyRevealedRef.current) {
            startSpreadAnimation();
          }
        }, 500);
      }
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseenter', handleMouseEnter);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseenter', handleMouseEnter);
      section.removeEventListener('mouseleave', handleMouseLeave);
      if (spreadTimeoutRef.current) {
        clearTimeout(spreadTimeoutRef.current);
      }
    };
  }, [isLoaded]);


  return (
    <section ref={sectionRef} id="gallery" className="fullpage-section relative w-full bg-[#E3DCD1] text-black" style={{ overflow: 'visible', height: 'auto', minHeight: 'calc(1130 / 1440 * 100vw)', zIndex: 0 }}>
      {/* Desktop Version */}
      <div ref={innerRef} className="hidden lg:block relative w-full overflow-visible" style={{ height: 'calc(1130 / 1440 * 100vw)', minHeight: 'calc(1130 / 1440 * 100vw)', position: 'relative' }}>
        {/* Watercolor Background SVG - Figma: left-[-1px] top-[18px] w-[1442px] h-[956px] */}
        <div 
          className="absolute overflow-hidden pointer-events-none"
          style={{
            left: 'calc(-1px * (100vw / 1440px))',
            top: 'calc(18px * (100vw / 1440px))',
            width: 'calc(1442px * (100vw / 1440px))',
            height: 'calc(956px * (100vw / 1440px))',
          }}
        >
          <div className="absolute inset-0" style={{ opacity: isLoaded ? 1 : 0 }}>
            <img
              ref={imageRef}
              src="/ARTILE GALLERY/artile gallery water color beige trans 1.svg"
              alt="Artile Gallery Watercolor Background"
              className="absolute h-[98.73%] left-0 max-w-none top-[1.27%] w-full"
              style={{ objectFit: 'cover' }}
              onLoad={() => setIsLoaded(true)}
            />
          </div>
          {/* Reveal mask canvas - Desktop only */}
          <canvas
            ref={canvasRef}
            className="hidden lg:block absolute inset-0 pointer-events-auto z-20"
            style={{ mixBlendMode: 'normal' }}
          />
        </div>

        {/* Title "ARTILE GALLERY" - SVG - Figma: left-[calc(50%+627px)] top-[132px] with transform */}
        <div
          ref={titleRef}
          className="absolute z-30 text-right"
          style={{
            left: 'calc(50% + 627px * (100vw / 1440px))',
            top: 'calc(132px * (100vw / 1440px))',
            transform: 'translateX(-100%) translateY(-50%)',
          }}
        >
          <img
            src="/ARTILE GALLERY/ARTILE GALLERY.svg"
            alt="ARTILE GALLERY"
            className="h-auto"
            style={{ 
              width: 'auto',
              height: 'calc(170px * (100vw / 1440px))',
              maxWidth: 'none',
            }}
          />
        </div>

        {/* Tagline - Figma: right-[92px] top-[237px] */}
        <p 
          className="absolute z-20 font-montserrat font-normal text-right text-black"
          style={{
            right: 'calc(92px * (100vw / 1440px))',
            top: 'calc(237px * (100vw / 1440px))',
            fontSize: 'calc(14px * (100vw / 1440px))',
            lineHeight: 'calc(25px * (100vw / 1440px))',
            letterSpacing: 'calc(3.22px * (100vw / 1440px))',
          }}
        >
          "Nơi Không Gian kể câu chuyện về Nghệ Thuật"
        </p>

        {/* Descriptive Text - Figma: left-[calc(50%+1.5px)] top-[836px] w-[1231px] */}
        <div 
          ref={textDescriptionRef}
          className="absolute z-20 font-montserrat font-normal text-center text-black"
            style={{
            left: 'calc(50% + 1.5px * (100vw / 1440px))',
            top: 'calc(836px * (100vw / 1440px))',
            transform: 'translateX(-50%)',
            width: 'calc(1231px * (100vw / 1440px))',
            maxWidth: '85vw',
            fontSize: 'calc(14px * (100vw / 1440px))',
            lineHeight: 'calc(25px * (100vw / 1440px))',
            whiteSpace: 'pre-wrap',
            opacity: isFullyRevealed ? 1 : 0,
            transition: isFullyRevealed ? 'opacity 0.3s ease-in' : 'none',
          }}
        >
          {typedText || (isTyping ? '' : '')}
          {isTyping && typedText.length > 0 && <span className="animate-pulse">|</span>}
        </div>

        {/* Button "Khám phá ngay" - Figma: left-[calc(50%+1px)] top-[968px] */}
        <div 
          className="absolute z-20 left-1/2"
              style={{
            top: 'calc(968px * (100vw / 1440px))',
            transform: 'translateX(-50%)',
          }}
        >
          <PillButton label="Khám phá ngay" theme="light" />
        </div>
      </div>

      {/* Mobile Version */}
      <div className="relative w-full lg:hidden" style={{ aspectRatio: '1440 / 1130', minHeight: '70vh' }}>
        {/* Watercolor Background SVG */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute inset-0 ${isLoaded ? 'watercolor-loading' : ''}`} style={{ opacity: isLoaded ? 1 : 0 }}>
            <img
              src="/ARTILE GALLERY/artile gallery water color beige trans 1.svg"
              alt="Artile Gallery Watercolor Background"
              className="absolute h-full w-full object-cover"
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-full px-6 py-20">
          <div className="space-y-6 text-center max-w-[500px]">
            {/* Title */}
            <img
              src="/ARTILE GALLERY/ARTILE GALLERY.svg"
              alt="ARTILE GALLERY"
              className="h-auto w-full max-w-[700px]"
              style={{
                height: 'auto',
              }}
            />
            
            {/* Tagline */}
            <p 
              className="font-montserrat font-normal text-black"
              style={{
                fontSize: 'clamp(12px, 3vw, 14px)',
                lineHeight: 'clamp(20px, 4.5vw, 25px)',
                letterSpacing: 'clamp(2px, 0.7vw, 3px)',
              }}
            >
              "Nơi Không Gian kể câu chuyện về Nghệ Thuật"
            </p>
            
            {/* Descriptive Text */}
            <div 
              className="font-montserrat font-normal text-center space-y-3 text-black"
              style={{
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                lineHeight: 'clamp(22px, 5vw, 25px)',
              }}
            >
              <p>
                "Tại STile, chúng tôi không đơn thuần gọi đó là Showroom. Với chúng tôi, mỗi sản phẩm hiện diện ở đây đều là một tác phẩm nghệ thuật được chọn lọc, sắp đặt có chủ đích. Mỗi bề mặt, mỗi đường vân đều mang trong mình chất riêng và khi đặt cạnh nhau, chúng tạo nên một không gian kể chuyện.
              </p>
              <p>
                Ở STile, chúng tôi giới thiệu những tác phẩm nghệ thuật để khách hàng trải nghiệm và cảm nhận phong cách sống qua từng thiết kế muốn truyền tải."
              </p>
            </div>
            
            {/* Button */}
            <div className="pt-4 flex justify-center">
              <PillButton label="Khám phá ngay" theme="light" />
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
  const sectionRef = useRef<HTMLElement>(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

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

  // Typing effect when section comes into view AND image is loaded
  useEffect(() => {
    if (!sectionRef.current || isMobile || !imageLoaded) return;

    const checkVisibility = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        const isInView = rect.top < window.innerHeight * 0.7 && rect.bottom > 0;
        if (isInView && !isTyping && imageLoaded) {
          setIsTyping(true);
        }
      }
    };

    // Check on mount and scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [isMobile, isTyping, imageLoaded]);

  // Typing animation - reset and start when variant changes or when typing is triggered
  useEffect(() => {
    if (!isTyping || isMobile) {
      setTypedText('');
      return;
    }

    // Use the full description text as shown in design
    const fullText = "The profound dialog between humans and nature translates into an interplay of glimpses and reflections, where humans and the earth, twin faces, reflect each other and collaborate in perfect synergy.\n\nIn the constant interchange with the surrounding environment, nature shows us that we are part of an intricate and wonderful living system. A harmonious meeting, expressed through grandiose and cyclic movements, which give form to the structure itself of the Gemini collection, inspired by the natural flows between earth and sky.";
    
    setTypedText('');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20); // Typing speed: 20ms per character

    return () => {
      clearInterval(typingInterval);
    };
  }, [isTyping, variant.id, isMobile]);

  // Reset typing and image loaded state when variant changes
  useEffect(() => {
    setTypedText('');
    setIsTyping(false);
    setImageLoaded(false);
  }, [variant.id]);


  const imageSrc = isMobile && variant.mobileImage ? variant.mobileImage : variant.image;

  return (
    <section
      ref={sectionRef}
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
            <div
              key={v.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                ...(!isMobile && {
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)',
                }),
              }}
            >
              <Image
              src={vImageSrc}
              alt={v.title}
              fill
              priority={v.id === featuredVariants[0].id}
                className="object-cover"
              style={{
                objectPosition: isMobile ? "calc(50% - 60px) center" : "center",
                transform: isMobile ? "scale(1.6)" : undefined,
                }}
              onLoad={() => {
                if (isActive) {
                  setImageLoaded(true);
                }
              }}
              />
              {/* Gradient overlay - Desktop only: đậm ở dưới và trên, trong suốt ở giữa */}
              {!isMobile && (
                <>
                  {/* Gradient from bottom (dưới lên) - theo Figma design */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.00) 92.23%, rgba(0, 0, 0, 0.10) 96.611%, rgba(0, 0, 0, 0.50) 112.38%)',
                    }}
                  />
                  {/* Gradient from top (trên xuống) - đậm hơn */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 92.23%, rgba(0, 0, 0, 0.10) 96.611%, rgba(0, 0, 0, 0.50) 112.38%)',
                    }}
                  />
                </>
              )}
            </div>
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

      {/* Desktop: Content từ giữa màn hình, bên trái, text left */}
      {!isMobile && (
        <div 
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20"
          style={{
            paddingLeft: 'calc(104px * (100vw / 1440px))',
            maxWidth: 'calc(700px * (100vw / 1440px))',
            width: 'calc(700px * (100vw / 1440px))',
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
              ref={textRef}
              className="font-montserrat text-[#151515] text-left"
              style={{
                fontSize: 'calc(16px * (100vw / 1440px))',
                lineHeight: 'calc(25px * (100vw / 1440px))',
                marginTop: 'calc(24px * (100vw / 1440px))',
                whiteSpace: 'pre-wrap',
              }}
            >
              {typedText || (isTyping ? '' : variant.description || "The profound dialog between humans and nature translates into an interplay of glimpses and reflections, where humans and the earth, twin faces, reflect each other and collaborate in perfect synergy.\n\nIn the constant interchange with the surrounding environment, nature shows us that we are part of an intricate and wonderful living system. A harmonious meeting, expressed through grandiose and cyclic movements, which give form to the structure itself of the Gemini collection, inspired by the natural flows between earth and sky.")}
              {isTyping && typedText.length > 0 && <span className="animate-pulse">|</span>}
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
  const desktopSectionRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDiffRef = useRef<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % collectionSlides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  // Control desktop section visibility to override CSS
  useEffect(() => {
    const updateDisplay = () => {
      if (desktopSectionRef.current) {
        if (window.innerWidth >= 1024) {
          desktopSectionRef.current.style.display = 'flex';
        } else {
          desktopSectionRef.current.style.display = 'none';
        }
      }
    };
    updateDisplay();
    window.addEventListener('resize', updateDisplay);
    return () => window.removeEventListener('resize', updateDisplay);
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
    <section id="collections" className="fullpage-section relative w-full overflow-hidden" style={{ backgroundColor: '#E3DCD1', minHeight: 'calc((560px + 303px + 15px + 50px + 150px) * (100vw / 1589px))' }}>
      {/* Desktop Version - Hidden on mobile, shown on desktop (lg and above) */}
      <div 
        ref={desktopSectionRef}
        className="section-inner !p-0 hidden lg:block" 
        style={{ 
          paddingBottom: 'calc(150px * (100vw / 1589px))',
        }}
      >
        <div className="relative overflow-hidden" style={{ width: '100%', minHeight: 'calc((560px + 303px + 15px + 50px) * (100vw / 1589px))' }}>
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
                    width={80}
                    height={80}
                    className="h-auto"
                    style={{
                      width: '80px',
                      height: '80px',
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
              width={100}
              height={100}
              className="h-auto"
              style={{
                width: '100px',
                height: '100px',
              }}
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
