import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

function HomePage() {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const featureRef = useRef(null);

    const scrollToFeatures = () => {
        featureRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            {/* --- 1. 첫 화면 (Hero 섹션) --- */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1>
                        AI가 대신 정리해 드립니다.
                    </h1>
                    <p>
                        강의나 회의 녹음본을 올리면, AI가 핵심만 요약하고 Action Item까지 뽑아줍니다.
                    </p>
                    <Link to="/tool" className="hero-cta-button">
                        지금 바로 요약하기
                    </Link>
                </div>

                <div className="hero-carousel">
                    <Slider {...sliderSettings}>
                        <div>
                            <img src="/assets/기능1.png" alt="기능 1" style={{width: '100%', borderRadius: '8px'}}/>
                        </div>
                        <div>
                            <img src="/assets/기능2.png" alt="기능 2" style={{width: '100%', borderRadius: '8px'}}/>
                        </div>
                    </Slider>
                </div>

                <div onClick={scrollToFeatures} className="scroll-down-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.59L4.92999 10.52L6.33999 9.11001L12 14.77L17.66 9.11001L19.07 10.52L12 17.59Z" fill="#6B7280"/>
                    </svg>
                </div>
            </section>

            {/* --- 2. 소개 섹션 (Feature 섹션) --- */}
            <section ref={featureRef} className="features-section">
                <div className="features-container">
                    <h2 className="features-title">
                        Action-Log의 핵심 기능
                    </h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>🚀 빠른 음성 인식</h3>
                            <p>Whisper AI 엔진을 사용하여 긴 음성 파일도 순식간에 텍스트로 변환합니다.</p>
                        </div>
                        <div className="feature-card">
                            <h3>🎯 핵심 요약</h3>
                            <p>GPT가 전체 내용을 분석하여, 가장 중요한 핵심 주제와 맥락을 3줄로 요약합니다.</p>
                        </div>
                        <div className="feature-card">
                            <h3>📋 할 일 추출</h3>
                            <p>'누가, 무엇을, 언제까지' 해야 하는지 할 일 목록만 따로 정리해 시간을 절약합니다.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;