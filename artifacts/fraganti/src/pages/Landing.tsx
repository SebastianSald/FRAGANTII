import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, X, Search, ShoppingBag, ChevronRight, Phone, 
  MessageCircle, ArrowDown, MapPin, Mail, Clock, 
  Instagram, Youtube, Check, Droplets, TreePine, 
  Sparkles, Citrus, Star, Sun, Moon, Plus, Minus, Trash2, Eye
} from "lucide-react";

// Intersection Observer Hook for fade-in animations
function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [options]);

  return [ref, isIntersecting] as const;
}

// FadeIn Wrapper Component
function FadeIn({ children, delay = 0, className = "", direction = "up" }: { children: React.ReactNode, delay?: number, className?: string, direction?: "up" | "left" | "right" | "none" }) {
  const [ref, isVisible] = useIntersectionObserver();
  
  let transformInit = "translate-y-10";
  if (direction === "left") transformInit = "translate-x-10";
  if (direction === "right") transformInit = "-translate-x-10";
  if (direction === "none") transformInit = "translate-x-0 translate-y-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0" : ("opacity-0 " + transformInit)
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const PRODUCTS = [
  { id: 1, name: "Oud Noir", notes: "ámbar, oud, sándalo", price: 85000, family: "Oriental", img: "/images/fraganti-prod1.jpg", isNew: true },
  { id: 2, name: "Fleur de Jasmin", notes: "jazmín, rosa, almizcle", price: 72000, family: "Floral", img: "/images/fraganti-prod2.jpg" },
  { id: 3, name: "Aventus Club", notes: "manzana, bergamota, cedro", price: 95000, family: "Fresca", img: "/images/fraganti-prod3.jpg" },
  { id: 4, name: "La Vie Est Belle", notes: "iris, pralinée, vainilla", price: 78000, family: "Floral Oriental", img: "/images/fraganti-prod2.jpg" },
  { id: 5, name: "Terre d'Hermès", notes: "pomelo, pimienta, vetiver", price: 110000, family: "Amaderada", img: "/images/fraganti-prod3.jpg", isNew: true },
  { id: 6, name: "Black Orchid", notes: "orquídea, vainilla, pachulí", price: 92000, family: "Oriental", img: "/images/fraganti-prod1.jpg" },
];

const FAMILIES = [
  { name: "Floral", notes: "Rosa, Jazmín, Peonía", icon: <Sparkles className="w-8 h-8 text-[#C9A96E]" /> },
  { name: "Amaderado", notes: "Cedro, Sándalo, Vetiver", icon: <TreePine className="w-8 h-8 text-[#C9A96E]" /> },
  { name: "Cítrico", notes: "Bergamota, Pomelo, Limón", icon: <Citrus className="w-8 h-8 text-[#C9A96E]" /> },
  { name: "Oriental", notes: "Oud, Ámbar, Incienso", icon: <Droplets className="w-8 h-8 text-[#C9A96E]" /> }
];

const QUIZ_QUESTIONS = [
  {
    question: "¿Cómo describes tu estilo?",
    options: ["Elegante", "Casual", "Atrevido", "Romántico"]
  },
  {
    question: "¿Qué momento describe tu uso ideal?",
    options: ["Cita romántica", "Reunión de trabajo", "Fiesta", "Día casual"]
  },
  {
    question: "¿Qué sensación buscas transmitir?",
    options: ["Fresco y limpio", "Cálido y sensual", "Misterioso", "Energizante"]
  },
  {
    question: "¿Qué nota olfativa prefieres?",
    options: ["Floral", "Oriental", "Cítrico", "Amaderado"]
  }
];

export function Landing() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizAnimating, setQuizAnimating] = useState(false);

  const [formState, setFormState] = useState({ name: "", email: "", phone: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuickViewProduct(null);
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizAnimating) return;
    setQuizAnimating(true);
    setTimeout(() => {
      setQuizAnswers([...quizAnswers, answer]);
      setQuizStep(prev => prev + 1);
      setQuizAnimating(false);
    }, 400);
  };

  const resetQuiz = () => {
    setQuizAnimating(true);
    setTimeout(() => {
      setQuizStep(0);
      setQuizAnswers([]);
      setQuizAnimating(false);
    }, 400);
  };

  const isNameValid = formState.name.length > 2;
  const isEmailValid = formState.email.includes("@") && formState.email.includes(".");
  const isMessageValid = formState.message.length > 5;
  const isFormValid = isNameValid && isEmailValid && isMessageValid;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setFormStatus("success");
      setTimeout(() => {
        setFormState({ name: "", email: "", phone: "", message: "" });
        setFormStatus("idle");
      }, 3000);
    }
  };

  const filteredProducts = activeFilter === "Todos" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.family.includes(activeFilter) || p.family === activeFilter);

  const formatPrice = (price: number) => `$${price.toLocaleString('es-CO')}`;

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
    if (quickViewProduct) setQuickViewProduct(null);
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-background text-foreground font-['Poppins'] selection:bg-[#C9A96E] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes mist-fade {
          0% { opacity: 0; filter: blur(10px); transform: translateY(20px) scale(0.95); }
          50% { opacity: 1; filter: blur(0px); transform: translateY(0) scale(1.05); }
          100% { opacity: 0; filter: blur(10px); transform: translateY(-20px) scale(1); }
        }
        
        @keyframes logo-reveal {
          0% { opacity: 0; letter-spacing: 0.5em; filter: blur(10px); }
          100% { opacity: 1; letter-spacing: 0.2em; filter: blur(0); }
        }
        
        @keyframes fade-out {
          0% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; }
        }
        
        .loader-container {
          animation: fade-out 0.8s ease-in-out 1.5s forwards;
        }
        .loader-logo {
          animation: logo-reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .loader-mist {
          animation: mist-fade 2s ease-in-out infinite;
        }

        .gold-gradient {
          background: linear-gradient(135deg, #C9A96E 0%, #E6C998 50%, #B89250 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .btn-gold {
          background: linear-gradient(135deg, #D4AF37 0%, #C9A96E 100%);
          color: #1A1A1A;
          transition: all 0.3s ease;
        }
        .btn-gold:hover {
          background: linear-gradient(135deg, #E6C998 0%, #D4AF37 100%);
          box-shadow: 0 10px 25px -5px rgba(201, 169, 110, 0.4);
          transform: translateY(-2px);
        }

        .btn-outline {
          border: 1px solid var(--foreground);
          color: var(--foreground);
          transition: all 0.3s ease;
        }
        .btn-outline:hover {
          background: var(--foreground);
          color: var(--background);
        }

        .btn-outline-cream {
          border: 1px solid #F8F5F2;
          color: #F8F5F2;
          transition: all 0.3s ease;
        }
        .btn-outline-cream:hover {
          background: #F8F5F2;
          color: #1A1A1A;
        }

        .product-card {
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
        }
        .dark .product-card:hover {
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }
        .product-image-container img {
          transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .product-card:hover .product-image-container img {
          transform: scale(1.08);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C9A96E;
          border-radius: 10px;
        }
      `}} />

      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="loader-container fixed inset-0 z-[100] bg-[#1A1A1A] flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 flex items-center justify-center">
             <div className="w-[300px] h-[300px] bg-[#C9A96E] rounded-full blur-[100px] loader-mist"></div>
          </div>
          <h1 className="loader-logo font-['Cormorant_Garamond'] text-4xl md:text-6xl text-[#F8F5F2] tracking-[0.2em] font-light z-10 relative">
            FRAGANTI
          </h1>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-[#1A1A1A]/95 backdrop-blur-md py-4 shadow-lg text-[#F8F5F2]" : "bg-transparent py-6 text-[#F8F5F2]"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden hover:text-[#C9A96E] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <a href="#" className={`font-['Cormorant_Garamond'] text-2xl md:text-3xl font-medium tracking-[0.15em] transition-colors duration-300 text-[#C9A96E]`}>
            FRAGANTI
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#coleccion" className="text-sm tracking-widest hover:text-[#C9A96E] transition-colors">COLECCIÓN</a>
            <a href="#decants" className="text-sm tracking-widest hover:text-[#C9A96E] transition-colors">DECANTS</a>
            <a href="#test" className="text-sm tracking-widest hover:text-[#C9A96E] transition-colors">TEST OLFATIVO</a>
            <a href="#contacto" className="text-sm tracking-widest hover:text-[#C9A96E] transition-colors">CONTACTO</a>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="hover:text-[#C9A96E] transition-colors">
              <Search size={20} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="hover:text-[#C9A96E] transition-colors relative">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C9A96E] text-[#1A1A1A] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button onClick={toggleDarkMode} className="hover:text-[#C9A96E] transition-colors ml-2">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-[#1A1A1A] border-t border-[#333] transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-[400px]" : "max-h-0 border-transparent"}`}>
          <div className="flex flex-col p-6 space-y-4">
            <a href="#coleccion" onClick={() => setIsMobileMenuOpen(false)} className="text-[#F8F5F2] text-lg font-['Cormorant_Garamond'] tracking-wide border-b border-[#333] pb-2">Colección</a>
            <a href="#decants" onClick={() => setIsMobileMenuOpen(false)} className="text-[#F8F5F2] text-lg font-['Cormorant_Garamond'] tracking-wide border-b border-[#333] pb-2">Decants</a>
            <a href="#test" onClick={() => setIsMobileMenuOpen(false)} className="text-[#F8F5F2] text-lg font-['Cormorant_Garamond'] tracking-wide border-b border-[#333] pb-2">Test Olfativo</a>
            <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-[#F8F5F2] text-lg font-['Cormorant_Garamond'] tracking-wide pb-2">Contacto</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <img 
            src="/images/fraganti-hero.jpg" 
            alt="Luxury perfume macro" 
            className="w-full h-full object-cover object-center scale-105"
            style={{ transform: "scale(1.05)", filter: "brightness(0.8)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/50 to-[#1a1a1a]/90"></div>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-20">
          <FadeIn delay={300} className="mb-6">
            <span className="inline-block py-1.5 px-4 border border-[#C9A96E]/50 rounded-full text-xs md:text-sm tracking-widest text-[#F8F5F2] bg-[#1A1A1A]/30 backdrop-blur-sm">
              <span className="text-[#C9A96E]">✦</span> 100% ORIGINALES • ENVÍOS A TODO COLOMBIA
            </span>
          </FadeIn>
          
          <FadeIn delay={500}>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl lg:text-8xl text-[#F8F5F2] font-light leading-tight mb-2 drop-shadow-lg">
              Descubre tu <i className="font-['Cormorant_Garamond'] italic text-[#F8F5F2]">esencia.</i>
            </h1>
          </FadeIn>
          
          <FadeIn delay={700}>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl lg:text-7xl gold-gradient font-medium mb-8 drop-shadow-md">
              Vive el lujo.
            </h2>
          </FadeIn>
          
          <FadeIn delay={900}>
            <p className="text-[#F8F5F2]/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
              Perfumes originales que cuentan tu historia. De los exóticos aromas árabes a la precisión de las casas de diseño.
            </p>
          </FadeIn>
          
          <FadeIn delay={1100} className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full justify-center">
            <a href="#coleccion" className="bg-[#D4AF37] hover:bg-[#E6C998] text-[#1A1A1A] px-8 py-4 rounded-sm font-medium tracking-wide w-full sm:w-auto text-sm text-center transition-colors">
              EXPLORAR LA COLECCIÓN
            </a>
            <a href="#test" className="btn-outline-cream px-8 py-4 rounded-sm font-medium tracking-wide w-full sm:w-auto text-sm text-center backdrop-blur-sm">
              ENCUENTRA TU AROMA
            </a>
            <button onClick={() => document.getElementById('coleccion')?.scrollIntoView()} className="bg-[#1A1A1A] text-[#F8F5F2] hover:bg-transparent border border-[#1A1A1A] hover:border-[#F8F5F2] px-8 py-4 rounded-sm font-medium tracking-wide w-full sm:w-auto text-sm text-center transition-colors">
              COMPRA AHORA
            </button>
          </FadeIn>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 text-[#F8F5F2]/50">
          <ArrowDown size={24} strokeWidth={1} />
        </div>
      </section>

      {/* COLECCIÓN DE PERFUMES */}
      <section id="coleccion" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl mb-4 text-center">Nuestra Colección</h2>
            <div className="h-[1px] w-24 bg-[#C9A96E] mb-10"></div>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3 w-full custom-scrollbar pb-2">
              {["Todos", "Oriental", "Floral", "Amaderada", "Fresca"].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                    activeFilter === filter 
                    ? "bg-foreground text-background border border-foreground" 
                    : "bg-transparent text-muted-foreground border border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product, index) => (
            <FadeIn key={product.id} delay={index * 150} direction="up">
              <div className="product-card group bg-card border border-border rounded-lg p-6 flex flex-col h-full relative overflow-hidden">
                {product.isNew && (
                  <span className="absolute top-6 left-6 z-10 bg-[#C9A96E] text-[#1A1A1A] text-[10px] font-bold px-3 py-1 tracking-widest rounded-sm">
                    NUEVO
                  </span>
                )}
                <div className="product-image-container relative h-72 mb-8 bg-muted/50 rounded-md overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                  <img 
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button className="bg-white text-[#1A1A1A] px-6 py-3 rounded-sm font-medium text-sm tracking-wide hover:bg-[#C9A96E] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                      VISTA RÁPIDA
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow text-center">
                  <span className="text-[#C9A96E] text-xs font-semibold tracking-widest uppercase mb-2">{product.family}</span>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl mb-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm italic mb-4 flex-grow font-['Cormorant_Garamond']">{product.notes}</p>
                  <p className="font-medium tracking-wide mb-6">{formatPrice(product.price)}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button onClick={() => addToCart(product)} className="flex-1 btn-outline py-3 px-2 rounded-sm text-xs tracking-widest font-medium whitespace-nowrap">
                      AGREGAR AL CARRITO
                    </button>
                    <button onClick={() => setQuickViewProduct(product)} className="flex-1 bg-transparent hover:bg-muted py-3 px-2 rounded-sm text-xs tracking-widest font-medium transition-colors whitespace-nowrap">
                      VISTA RÁPIDA
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>No se encontraron perfumes en esta categoría.</p>
            <button onClick={() => setActiveFilter("Todos")} className="mt-4 text-[#C9A96E] underline">Ver todos</button>
          </div>
        )}
      </section>

      {/* EXPERIENCIA SENSORIAL */}
      <section className="relative py-32 overflow-hidden bg-[#1A1A1A]">
        <div className="absolute inset-0">
          <img 
            src="/images/fraganti-sensory.jpg" 
            alt="Sensory background" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#1A1A1A]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <FadeIn>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl lg:text-6xl text-[#F8F5F2] font-light leading-snug mb-16 max-w-4xl mx-auto">
              Cada aroma es una <i className="italic text-[#C9A96E]">memoria</i>.<br />
              Cada fragancia, una <i className="italic text-[#C9A96E]">emoción</i>.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {FAMILIES.map((family, index) => (
              <FadeIn key={family.name} delay={index * 150} className="bg-[#1C1C1C]/60 backdrop-blur-md border border-[#333] p-8 rounded-lg flex flex-col items-center text-center hover:border-[#C9A96E]/50 transition-colors duration-300">
                <div className="mb-6 bg-[#2A2A2A] w-16 h-16 rounded-full flex items-center justify-center">
                  {family.icon}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-xl text-[#F8F5F2] mb-2">{family.name}</h3>
                <p className="text-[#A0A0A0] text-sm">{family.notes}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={600}>
            <button onClick={() => document.getElementById('test')?.scrollIntoView()} className="btn-outline-cream px-10 py-4 rounded-sm font-medium tracking-widest text-sm hover:border-[#C9A96E] hover:text-[#C9A96E] hover:bg-transparent">
              DESCUBRE TU FAMILIA OLFATIVA
            </button>
          </FadeIn>
        </div>
      </section>

      {/* TEST DE PERSONALIDAD OLFATIVA */}
      <section id="test" className="py-24 px-6 bg-[#F5F5DC] dark:bg-[#1C1C1C] border-y border-[#E5E0D5] dark:border-[#333]">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-[#C9A96E] text-sm font-semibold tracking-widest uppercase mb-3 block">Test Interactivo</span>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-[#1A1A1A] dark:text-[#F8F5F2] mb-4">¿Cuál es tu aroma ideal?</h2>
              <p className="text-[#5A5A5A] dark:text-[#A0A0A0] max-w-xl mx-auto">Responde 4 preguntas y encuentra la fragancia perfecta que hable por ti.</p>
            </div>
          </FadeIn>

          <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-center border border-[#E8E8E8] dark:border-[#333]">
            {quizStep < 4 ? (
              <div className={`transition-opacity duration-300 w-full ${quizAnimating ? "opacity-0" : "opacity-100"}`}>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-medium text-muted-foreground">Pregunta {quizStep + 1} de 4</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(step => (
                      <div key={step} className={`h-1 w-8 rounded-full ${step <= quizStep ? "bg-[#C9A96E]" : "bg-muted"}`}></div>
                    ))}
                  </div>
                </div>
                
                <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl mb-8 text-center">
                  {QUIZ_QUESTIONS[quizStep].question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {QUIZ_QUESTIONS[quizStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      className="px-6 py-5 rounded-lg border border-border text-left hover:border-[#C9A96E] hover:bg-muted/30 hover:shadow-sm transition-all group relative overflow-hidden"
                    >
                      <span className="relative z-10 font-medium group-hover:text-foreground">{option}</span>
                      <div className="absolute top-0 right-0 h-full w-1 bg-[#C9A96E] transform translate-x-full group-hover:translate-x-0 transition-transform"></div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`transition-all duration-700 ease-out flex flex-col md:flex-row gap-8 items-center ${quizAnimating ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}>
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#C9A96E] rounded-full blur-[60px] opacity-20"></div>
                    <img 
                      src={quizAnswers[3] === "Floral" ? "/images/fraganti-prod2.jpg" : quizAnswers[3] === "Amaderado" ? "/images/fraganti-prod3.jpg" : "/images/fraganti-prod1.jpg"}
                      alt="Tu perfume ideal" 
                      className="w-48 h-auto relative z-10 mix-blend-multiply dark:mix-blend-normal drop-shadow-2xl"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <span className="inline-flex items-center gap-2 text-[#C9A96E] text-xs font-semibold tracking-widest uppercase mb-4 bg-muted px-3 py-1 rounded-full border border-[#C9A96E]/20">
                    <Star size={12} fill="currentColor" /> Tu Match Perfecto
                  </span>
                  <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl mb-2">
                    {quizAnswers[3] === "Floral" ? "Fleur de Jasmin" : quizAnswers[3] === "Amaderado" ? "Terre d'Hermès" : "Oud Noir"}
                  </h3>
                  <p className="font-['Cormorant_Garamond'] italic text-muted-foreground mb-6 text-lg">
                    Basado en tu estilo {quizAnswers[0]?.toLowerCase()} y preferencia {quizAnswers[3]?.toLowerCase()}.
                  </p>
                  <p className="text-sm leading-relaxed mb-8">
                    Esta fragancia captura la esencia que buscas para una {quizAnswers[1]?.toLowerCase()}. Sus notas envuelven con un toque {quizAnswers[2]?.toLowerCase()}, creando un aura inolvidable.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                    <button onClick={() => addToCart(PRODUCTS.find(p => p.name === (quizAnswers[3] === "Floral" ? "Fleur de Jasmin" : quizAnswers[3] === "Amaderado" ? "Terre d'Hermès" : "Oud Noir")))} className="btn-gold px-8 py-4 rounded-sm font-medium tracking-wide text-sm w-full sm:w-auto">
                      VER PERFUME
                    </button>
                    <button onClick={resetQuiz} className="text-muted-foreground text-sm underline hover:text-foreground transition-colors">
                      Volver a empezar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DECANTS SECTION */}
      <section id="decants" className="py-0 flex flex-col lg:flex-row bg-[#1A1A1A] overflow-hidden">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative">
          <img 
            src="/images/fraganti-decants.jpg" 
            alt="Perfume Decants" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A1A] hidden lg:block opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent lg:hidden opacity-90"></div>
        </div>
        
        <div className="w-full lg:w-1/2 py-20 px-8 md:px-16 flex flex-col justify-center">
          <FadeIn direction="left">
            <span className="text-[#C9A96E] text-sm font-semibold tracking-widest uppercase mb-4 block">Prueba antes de comprar</span>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-[#F8F5F2] mb-6 leading-tight">Decants — Tu portal al lujo</h2>
            
            <p className="text-[#A0A0A0] text-lg mb-10 font-light max-w-lg">
              Prueba cualquier fragancia premium en presentaciones de <strong className="text-[#F8F5F2] font-medium">5ml y 10ml</strong> antes de invertir en el frasco completo. Portabilidad, exclusividad y la libertad de descubrir nuevos aromas.
            </p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center text-[#F8F5F2]">
                <Check size={18} className="text-[#C9A96E] mr-3 shrink-0" />
                <span className="font-light">Frascos atomizadores 100% originales garantizados</span>
              </li>
              <li className="flex items-center text-[#F8F5F2]">
                <Check size={18} className="text-[#C9A96E] mr-3 shrink-0" />
                <span className="font-light">Opciones de lujo desde $25.000 COP</span>
              </li>
              <li className="flex items-center text-[#F8F5F2]">
                <Check size={18} className="text-[#C9A96E] mr-3 shrink-0" />
                <span className="font-light">Ideal para viajes y para retocar tu perfume en el día</span>
              </li>
            </ul>
            
            <button className="btn-gold px-8 py-4 rounded-sm font-medium tracking-wide w-fit text-sm">
              EXPLORAR DECANTS
            </button>
          </FadeIn>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-24 px-6 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl mb-4">Hablemos</h2>
            <div className="h-[1px] w-24 bg-[#C9A96E] mx-auto"></div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FadeIn direction="right">
            <div className="bg-[#1C1C1C] p-8 md:p-12 rounded-lg text-[#F8F5F2] h-full shadow-xl">
              <h3 className="font-['Cormorant_Garamond'] text-3xl mb-2">Envíanos un mensaje</h3>
              <p className="text-[#A0A0A0] text-sm mb-8">Te asesoramos para encontrar tu fragancia ideal.</p>
              
              {formStatus === "success" ? (
                <div className="bg-[#2A2A2A] rounded-lg p-8 text-center flex flex-col items-center justify-center h-[350px]">
                  <div className="w-16 h-16 bg-[#C9A96E]/20 rounded-full flex items-center justify-center mb-4 text-[#C9A96E]">
                    <Check size={32} />
                  </div>
                  <h4 className="font-['Cormorant_Garamond'] text-2xl mb-2">¡Mensaje enviado!</h4>
                  <p className="text-[#A0A0A0]">Nos pondremos en contacto contigo muy pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2 uppercase tracking-wider">Nombre Completo</label>
                    <input 
                      type="text" 
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                      className={`w-full bg-[#2A2A2A] border ${formState.name.length > 0 ? (isNameValid ? 'border-green-500/50' : 'border-red-500/50') : 'border-[#333]'} rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors text-white`}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-[#A0A0A0] mb-2 uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                        className={`w-full bg-[#2A2A2A] border ${formState.email.length > 0 ? (isEmailValid ? 'border-green-500/50' : 'border-red-500/50') : 'border-[#333]'} rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors text-white`}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#A0A0A0] mb-2 uppercase tracking-wider">Teléfono <span className="text-[#555]">(Opcional)</span></label>
                      <input 
                        type="tel" 
                        value={formState.phone}
                        onChange={e => setFormState({...formState, phone: e.target.value})}
                        className="w-full bg-[#2A2A2A] border border-[#333] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors text-white"
                        placeholder="Tu celular"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2 uppercase tracking-wider">Mensaje</label>
                    <textarea 
                      rows={4}
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                      className={`w-full bg-[#2A2A2A] border ${formState.message.length > 0 ? (isMessageValid ? 'border-green-500/50' : 'border-red-500/50') : 'border-[#333]'} rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors resize-none text-white`}
                      placeholder="¿Qué tipo de aroma estás buscando?"
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!isFormValid}
                    className={`w-full py-4 rounded-sm font-medium tracking-widest text-sm transition-all duration-300 ${isFormValid ? "btn-gold" : "bg-[#333] text-[#666] cursor-not-allowed"}`}
                  >
                    ENVIAR MENSAJE
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

          <FadeIn direction="left">
            <div className="bg-card border border-border p-8 md:p-12 rounded-lg h-full shadow-lg">
              <h3 className="font-['Cormorant_Garamond'] text-3xl mb-8">Nuestras Boutiques</h3>
              
              <div className="space-y-8 mb-8">
                <div className="flex items-start">
                  <MapPin className="text-[#C9A96E] mt-1 mr-4 shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Medellín (Principal)</h4>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">
                      El Poblado, Cra 43A # 1-50<br />
                      Lunes a Sábado: 10am - 8pm
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-[#C9A96E] mt-1 mr-4 shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Contacto Directo</h4>
                    <a href="tel:+573001234567" className="block text-muted-foreground hover:text-[#C9A96E] text-sm font-light transition-colors">+57 300 123 4567</a>
                    <a href="https://wa.me/573001234567" className="block text-muted-foreground hover:text-[#C9A96E] text-sm font-light transition-colors">WhatsApp Disponible</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="text-[#C9A96E] mt-1 mr-4 shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Email</h4>
                    <a href="mailto:info@fraganti.co" className="text-muted-foreground hover:text-[#C9A96E] text-sm font-light transition-colors">info@fraganti.co</a>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="w-full h-[200px] rounded-lg overflow-hidden relative">
                <iframe 
                  src="https://maps.google.com/maps?q=Medellín,+Colombia&output=embed"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-[#F8F5F2] pt-20 pb-10 border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand */}
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.15em] text-[#C9A96E] mb-6">FRAGANTI</h2>
              <p className="text-[#A0A0A0] text-sm font-light leading-relaxed mb-6">
                Curaduría de perfumes originales de las mejores casas de diseño y perfumería nicho del mundo, directo a Colombia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05Z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-[#A0A0A0] hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-xl mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                <li><a href="#coleccion" className="text-[#A0A0A0] hover:text-[#C9A96E] text-sm font-light transition-colors">Colección Completa</a></li>
                <li><a href="#decants" className="text-[#A0A0A0] hover:text-[#C9A96E] text-sm font-light transition-colors">Comprar Decants</a></li>
                <li><a href="#test" className="text-[#A0A0A0] hover:text-[#C9A96E] text-sm font-light transition-colors">Test de Personalidad Olfativa</a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-[#C9A96E] text-sm font-light transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="#" className="text-[#A0A0A0] hover:text-[#C9A96E] text-sm font-light transition-colors">Políticas de Envío</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-xl mb-6">Atención al Cliente</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock size={16} className="text-[#C9A96E] mt-0.5 mr-3 shrink-0" />
                  <span className="text-[#A0A0A0] text-sm font-light">Lunes a Viernes: 9am - 6pm<br/>Sábados: 10am - 4pm</span>
                </li>
                <li className="flex items-center">
                  <Mail size={16} className="text-[#C9A96E] mr-3 shrink-0" />
                  <a href="mailto:soporte@fraganti.co" className="text-[#A0A0A0] hover:text-[#C9A96E] text-sm font-light transition-colors">soporte@fraganti.co</a>
                </li>
                <li className="flex items-center">
                  <MessageCircle size={16} className="text-[#C9A96E] mr-3 shrink-0" />
                  <a href="https://wa.me/573001234567" className="text-[#A0A0A0] hover:text-[#C9A96E] text-sm font-light transition-colors">+57 300 123 4567</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-xl mb-6">Newsletter</h4>
              <p className="text-[#A0A0A0] text-sm font-light mb-4">
                Suscríbete para recibir acceso anticipado a nuevos lanzamientos y ofertas exclusivas.
              </p>
              <form className="flex mt-4" onSubmit={e => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="bg-[#2A2A2A] border border-[#333] border-r-0 rounded-l-sm px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] w-full text-white"
                  required
                />
                <button type="submit" className="bg-[#C9A96E] text-[#1A1A1A] px-4 py-3 rounded-r-sm text-sm font-medium hover:bg-[#D4AF37] transition-colors">
                  SUSCRIBIR
                </button>
              </form>
            </div>
            
          </div>

          <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#A0A0A0] text-xs font-light">
              &copy; {new Date().getFullYear()} FRAGANTI. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <span className="text-[#A0A0A0] text-xs px-2 border-r border-[#333]">Autenticidad Garantizada</span>
              <span className="text-[#A0A0A0] text-xs px-2 border-r border-[#333]">Pago Seguro</span>
              <span className="text-[#A0A0A0] text-xs px-2">Envíos a todo el país</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-[#A0A0A0] hover:text-[#C9A96E] text-xs transition-colors">Privacidad</a>
              <a href="#" className="text-[#A0A0A0] hover:text-[#C9A96E] text-xs transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING ELEMENTS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <div className="hidden md:flex flex-col items-center group relative">
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
            Llámanos
          </div>
          <a href="tel:+573001234567" className="bg-[#1A1A1A] dark:bg-muted text-white dark:text-foreground p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
            <Phone size={24} />
          </a>
        </div>
        <div className="flex flex-col items-center group relative">
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
            Asesoría por WhatsApp
          </div>
          <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
            <MessageCircle size={24} fill="currentColor" className="text-white" />
          </a>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className={`md:hidden fixed bottom-0 left-0 w-full z-30 transition-transform duration-500 bg-[#1A1A1A] p-4 ${isScrolledPastHero ? "translate-y-0" : "translate-y-full"}`}>
        <button onClick={() => document.getElementById('coleccion')?.scrollIntoView()} className="w-full btn-gold py-4 rounded-sm font-medium tracking-widest text-sm">
          COMPRAR AHORA
        </button>
      </div>

      {/* CART DRAWER */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-background text-foreground shadow-2xl transition-transform duration-500 flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 border-b flex justify-between items-center bg-card">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-medium">Tu Carrito ({cartItemsCount})</h3>
            <button onClick={() => setIsCartOpen(false)} className="hover:text-[#C9A96E] transition-colors"><X size={24} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground mt-20">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                <p>Tu carrito está vacío.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-muted mix-blend-multiply dark:mix-blend-normal" />
                    <div className="flex-1">
                      <h4 className="font-['Cormorant_Garamond'] text-lg leading-tight">{item.name}</h4>
                      <p className="text-[#C9A96E] text-sm font-medium">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border rounded-md">
                          <button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:text-[#C9A96E]"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="p-1 hover:text-[#C9A96E]"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive text-sm"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-6 border-t bg-card">
              <div className="flex justify-between mb-4 font-medium text-lg">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <button className="w-full btn-gold py-4 rounded-sm font-medium tracking-widest text-sm mb-3">
                PROCEDER AL PAGO
              </button>
              <button onClick={() => setIsCartOpen(false)} className="w-full text-center text-sm text-muted-foreground underline hover:text-foreground transition-colors">
                Seguir explorando
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${quickViewProduct ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setQuickViewProduct(null)} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl bg-background rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ${quickViewProduct ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          {quickViewProduct && (
            <div className="flex flex-col md:flex-row max-h-[85vh]">
              <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background rounded-full p-2 backdrop-blur-sm transition-colors text-foreground"><X size={20} /></button>
              <div className="w-full md:w-1/2 bg-muted p-8 flex items-center justify-center relative">
                <img src={quickViewProduct.img} alt={quickViewProduct.name} className="w-full max-w-[250px] object-cover mix-blend-multiply dark:mix-blend-normal" />
              </div>
              <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar flex flex-col">
                <span className="text-[#C9A96E] text-xs font-semibold tracking-widest uppercase mb-2">{quickViewProduct.family}</span>
                <h3 className="font-['Cormorant_Garamond'] text-4xl mb-2">{quickViewProduct.name}</h3>
                <p className="text-muted-foreground text-sm italic mb-4 font-['Cormorant_Garamond']">{quickViewProduct.notes}</p>
                <p className="text-2xl font-medium tracking-wide mb-6">{formatPrice(quickViewProduct.price)}</p>
                <div className="h-[1px] w-full bg-border mb-6"></div>
                <p className="text-sm leading-relaxed mb-8 flex-grow">
                  Descubre la esencia única de {quickViewProduct.name}. Una fragancia diseñada para dejar una huella imborrable, con notas cuidadosamente seleccionadas de la familia {quickViewProduct.family.toLowerCase()}. Ideal para quienes buscan distinción y elegancia en cada aplicación.
                </p>
                <button onClick={() => addToCart(quickViewProduct)} className="w-full btn-gold py-4 rounded-sm font-medium tracking-widest text-sm flex items-center justify-center gap-2">
                  AGREGAR AL CARRITO <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
