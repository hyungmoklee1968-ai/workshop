/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Calendar, Check, Copy, MapPin, Users } from 'lucide-react';

type SectionId = 'hero' | 'about' | 'details' | 'contact';

const NAV_ITEMS: ReadonlyArray<{ id: SectionId; label: string; mobileLabel: string }> = [
  { id: 'hero', label: '첫 화면', mobileLabel: '첫 화면' },
  { id: 'about', label: '행사 소개', mobileLabel: '소개' },
  { id: 'details', label: '핵심 정보', mobileLabel: '정보' },
  { id: 'contact', label: '문의', mobileLabel: '문의' },
];

const EVENT_COPY_TEXT = [
  "2027 봄 워크숍 '함께 걷는 하루'",
  '주최: 온담컴퍼니 경영지원팀',
  '일시: 2027년 4월 16일(금) 09:30~16:00',
  '장소: 광교호수공원',
  '대상: 온담컴퍼니 전 직원',
  '문의: 경영지원팀 (연락처 미정)',
].join('\n');

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sectionIds: SectionId[] = ['hero', 'about', 'details', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: SectionId) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    setActiveSection(id);
  };

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(EVENT_COPY_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EVENT_COPY_TEXT;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#141A15] flex flex-col">
      {/* 상단 고정 메뉴 (단일 행 3영역 구성) */}
      <header className="sticky top-0 z-30 h-16 bg-[#F7F9F6]/92 backdrop-blur-sm border-b border-[#DCE3DA]">
        <div className="max-w-[1120px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4 sm:gap-8">
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#141A15] hover:text-[#1B4332] transition-colors whitespace-nowrap shrink-0 min-h-[40px] flex items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            aria-label="온담컴퍼니 행사 첫 화면으로 이동"
          >
            온담컴퍼니
          </button>

          <nav aria-label="주 메뉴" className="flex items-center gap-3 sm:gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative min-h-[40px] px-1 text-[13px] sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                    isActive ? 'text-[#1B4332]' : 'text-[#4B584D] hover:text-[#141A15]'
                  }`}
                >
                  <span className="sm:hidden">{item.mobileLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 bottom-1.5 h-[1.5px] bg-[#1B4332] transition-opacity duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('details')}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1B4332] hover:bg-[#143325] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              핵심 정보 보기
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 1. 첫 화면 */}
        <section
          id="hero"
          className="scroll-mt-16 max-w-[1120px] mx-auto px-4 sm:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <p className="text-xs sm:text-sm font-medium text-[#2D6A4F] tracking-tight">
                  온담컴퍼니 경영지원팀 <span aria-hidden="true">·</span> 사내 행사 안내
                </p>

                <h1 className="font-serif text-[clamp(2rem,4.5vw,3.35rem)] leading-[1.22] font-bold tracking-tight text-[#141A15] text-balance">
                  2027 봄 워크숍
                  <br />
                  ‘함께 걷는 하루’
                </h1>

                <p className="text-base sm:text-lg text-[#3D4A3F] leading-relaxed max-w-xl">
                  봄날, 동료와 나란히 걷는 하루
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('details')}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143325] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
                  >
                    <span>핵심 정보 확인하기</span>
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <dl className="border-t border-[#DCE3DA] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-xs font-medium text-[#5A685C] mb-1.5">날짜</dt>
                  <dd className="text-base sm:text-lg font-semibold text-[#141A15] tabular-nums">
                    2027년 4월 16일(금) 09:30~16:00
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-[#5A685C] mb-1.5">장소</dt>
                  <dd className="text-base sm:text-lg font-semibold text-[#141A15]">
                    광교호수공원
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[240px] sm:min-h-[300px] bg-[#EFF3EE] border border-[#DCE3DA] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#5A685C] tabular-nums">
                  <span>온담컴퍼니</span>
                  <span>2027. 04. 16.</span>
                </div>

                <div className="my-6 flex items-center justify-center">
                  <svg
                    viewBox="0 0 320 180"
                    className="w-full max-w-[300px] h-auto text-[#1B4332]"
                    fill="none"
                    role="img"
                    aria-label="광교호수공원 산책길을 형상화한 도형 그래픽"
                  >
                    <path
                      d="M16 128 C 68 92, 118 144, 174 102 C 218 68, 256 108, 304 76"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 146 C 78 116, 128 158, 186 122 C 232 94, 266 126, 304 100"
                      stroke="#6B8F71"
                      strokeWidth="1.5"
                      strokeDasharray="4 6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M24 72 Q 96 42, 168 68 T 296 52"
                      stroke="#A3B8A5"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                    <circle cx="174" cy="102" r="4.5" fill="currentColor" />
                    <circle cx="96" cy="116" r="3" fill="#6B8F71" />
                    <circle cx="246" cy="92" r="3" fill="#6B8F71" />
                  </svg>
                </div>

                <div className="border-t border-[#DCE3DA] pt-4 flex items-center justify-between text-xs sm:text-sm text-[#3D4A3F]">
                  <span>광교호수공원</span>
                  <span className="tabular-nums text-[#5A685C]">09:30~16:00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 행사 소개 */}
        <section
          id="about"
          className="scroll-mt-16 border-t border-[#DCE3DA] bg-white/60"
        >
          <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            <div className="lg:col-span-4 space-y-2">
              <p className="text-xs font-medium text-[#2D6A4F] tabular-nums">01</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#141A15]">
                행사 소개
              </h2>
            </div>

            <div className="lg:col-span-8">
              <p className="text-base sm:text-lg text-[#263027] leading-[1.8] max-w-[68ch]">
                ‘함께 걷는 하루’는 온담컴퍼니 전 직원이 일상의 업무 공간에서 잠시 벗어나 함께 걸으며 호흡을 맞추는 2027년 봄 워크숍입니다. 온담컴퍼니 경영지원팀이 주최하는 이번 행사는 2027년 4월 16일 금요일 광교호수공원에서 진행됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 핵심 정보 */}
        <section
          id="details"
          className="scroll-mt-16 border-t border-[#DCE3DA]"
        >
          <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#2D6A4F] tabular-nums">02</p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#141A15]">
                  핵심 정보
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCopyDetails}
                aria-live="polite"
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-[#1B4332] bg-white border border-[#DCE3DA] hover:border-[#1B4332] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#1B4332]" aria-hidden="true" />
                    <span>행사 정보를 복사했습니다</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#1B4332]" aria-hidden="true" />
                    <span>행사 정보 복사</span>
                  </>
                )}
              </button>
            </div>

            <dl className="grid grid-cols-3 gap-2.5 sm:gap-6">
              <div className="bg-white border border-[#DCE3DA] rounded-xl sm:rounded-2xl p-3.5 sm:p-8 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                <dt className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#5A685C]">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span>일시</span>
                </dt>
                <dd className="space-y-1">
                  <p className="text-sm sm:text-xl font-semibold text-[#141A15] leading-snug tabular-nums">
                    2027년 4월 16일(금)
                  </p>
                  <p className="text-xs sm:text-base text-[#3D4A3F] tabular-nums">09:30~16:00</p>
                </dd>
              </div>

              <div className="bg-white border border-[#DCE3DA] rounded-xl sm:rounded-2xl p-3.5 sm:p-8 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                <dt className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#5A685C]">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span>장소</span>
                </dt>
                <dd>
                  <p className="text-sm sm:text-xl font-semibold text-[#141A15] leading-snug">
                    광교호수공원
                  </p>
                </dd>
              </div>

              <div className="bg-white border border-[#DCE3DA] rounded-xl sm:rounded-2xl p-3.5 sm:p-8 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                <dt className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#5A685C]">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D6A4F] shrink-0" aria-hidden="true" />
                  <span>대상</span>
                </dt>
                <dd>
                  <p className="text-sm sm:text-xl font-semibold text-[#141A15] leading-snug">
                    온담컴퍼니 전 직원
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 4. 문의 */}
        <section
          id="contact"
          className="scroll-mt-16 border-t border-[#DCE3DA] bg-white/60"
        >
          <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            <div className="lg:col-span-4 space-y-2">
              <p className="text-xs font-medium text-[#2D6A4F] tabular-nums">03</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#141A15]">
                문의
              </h2>
            </div>

            <div className="lg:col-span-8">
              <dl className="bg-white border border-[#DCE3DA] rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-xs font-medium text-[#5A685C] mb-1.5">주최 및 담당 부서</dt>
                  <dd className="text-base sm:text-lg font-semibold text-[#141A15]">
                    온담컴퍼니 경영지원팀
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-[#5A685C] mb-1.5">연락처</dt>
                  <dd className="text-base sm:text-lg font-semibold text-[#4B584D]">
                    미정
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 안내 */}
      <footer className="border-t border-[#DCE3DA] bg-[#EFF3EE]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 text-xs sm:text-sm text-[#4B584D]">
            <p>
              온담컴퍼니 경영지원팀 <span aria-hidden="true">·</span> 2027 봄 워크숍 ‘함께 걷는 하루’
            </p>
            <p className="font-medium text-[#141A15]">교육용 가상 행사입니다</p>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#1B4332] hover:text-[#143325] transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            aria-label="페이지 맨 위로 이동"
          >
            <span>맨 위로</span>
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </footer>
    </div>
  );
}
