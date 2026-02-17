
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutGrid,
  Activity,
  Settings,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  Search,
  Menu,
  X,
  Play,
  Pause,
  MoreHorizontal,
  ArrowUpRight,
  Database,
  Globe,
  Briefcase,
  Cpu,
  CheckCircle2,
  Moon,
  Sun,
  Stethoscope,
  ShoppingCart,
  Truck,
  Layers,
  Fingerprint
} from 'lucide-react';

// --- Static Data (Outside Component) ---

const capabilities = [
  { title: "Autonomous Reasoning", icon: <Cpu size={24} />, desc: "Advanced LLM-driven logic for complex multi-step decision making without human intervention." },
  { title: "Enterprise Security", icon: <ShieldCheck size={24} />, desc: "SOC2 Type II compliant infrastructure with end-to-end encryption for all agent communications." },
  { title: "Native Integrations", icon: <Layers size={24} />, desc: "Direct connectors for Salesforce, SAP, and custom internal SQL/NoSQL databases." },
  { title: "Vector Knowledge", icon: <Database size={24} />, desc: "Real-time RAG (Retrieval-Augmented Generation) synced with your organization's internal documentation." },
  { title: "Identity Vault", icon: <Fingerprint size={24} />, desc: "Secure credential management for agents to interact safely with legacy authentication systems." },
  { title: "Scalable Infrastructure", icon: <Globe size={24} />, desc: "Globally distributed nodes ensuring sub-50ms latency for real-time agent responses." },
];

const industries = [
  { name: "Finance", icon: Briefcase, title: "Financial Intelligence Suite", desc: "Automate complex risk assessments, fraud detection, and regulatory reporting.", list: ['Real-time anomaly detection', 'Automated SEC compliance filing', 'Predictive portfolio rebalancing'] },
  { name: "Healthcare", icon: Stethoscope, title: "Medical Compliance AI", desc: "Securely handle HIPAA-regulated data flows and patient orchestration.", list: ['Data anonymization', 'Audit log automation', 'Patient flow prediction'] },
  { name: "E-Commerce", icon: ShoppingCart, title: "Marketplace Optimization", desc: "Drive customer retention with intelligent supply chain and personalized agentic support.", list: ['Dynamic pricing engines', 'Inventory replenishment', 'AI concierge services'] },
  { name: "Logistics", icon: Truck, title: "Supply Chain Autonomy", desc: "Real-time route optimization and automated carrier communication.", list: ['Route efficiency analysis', 'Automated dispatching', 'Sensor-driven maintenance'] }
];

const initialAgentList = [
  { id: 1, name: "FinAnalyze-Alpha", type: "Financial Intelligence", status: "Active", efficiency: "98.2%", tasks: 1240 },
  { id: 2, name: "HealthGuard-A1", type: "Compliance Monitoring", status: "Training", efficiency: "N/A", tasks: 0 },
  { id: 3, name: "OpsFlow-V2", type: "Supply Chain Opt", status: "Active", efficiency: "94.5%", tasks: 842 },
  { id: 4, name: "SupportBot-Pro", type: "Customer Experience", status: "Paused", efficiency: "91.0%", tasks: 3201 },
];

// --- Atomic Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-blue-700 hover:bg-blue-800 text-white shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 disabled:opacity-50',
    accent: 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95 disabled:opacity-50',
    ghost: 'hover:bg-slate-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50',
  };
  return (
    <button
      className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 hover:-translate-y-0.5 hover:shadow-xl ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    teal: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
    slate: "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${colors[color]}`}>
      {children}
    </span>
  );
};

const WorkflowNode = ({ title, type, status, icon: Icon }) => (
  <div className="flex flex-col items-center group cursor-help">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110 shadow-lg ${status === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
      }`}>
      <Icon size={24} />
    </div>
    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{title}</span>
    <span className="text-[10px] text-slate-500">{type}</span>
  </div>
);

const Line = () => (
  <div className="flex-1 h-[2px] bg-slate-200 dark:bg-slate-700 mx-4 relative overflow-hidden mt-[-20px] hidden md:block">
    <div className="absolute inset-0 bg-blue-500 animate-[shimmer_2s_infinite] w-1/2"></div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [scrolled, setScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeIndustry, setActiveIndustry] = useState('Finance');
  const [agentList, setAgentList] = useState(initialAgentList);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef(null);

  // Persistent Dark Mode
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Lock Body Scroll on Mobile Menu
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  // Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Agent Activity Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentList(prev =>
        prev.map(agent =>
          agent.status === 'Active'
            ? { ...agent, tasks: agent.tasks + Math.floor(Math.random() * 5) }
            : agent
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Hero Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setHeroVisible(true);
    }, { threshold: 0.1 });

    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Memoized Industry Data
  const currentIndustryData = useMemo(() => {
    return industries.find(i => i.name === activeIndustry) || industries[0];
  }, [activeIndustry]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleAgentStatus = (id) => {
    setAgentList(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Active' ? 'Paused' : 'Active';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-slate-100`}>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <LayoutGrid size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">COMMAND<span className="text-blue-600 dark:text-blue-400">SUITE</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Platform', 'Solutions', 'Industries', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost">Sign In</Button>
              <Button>Request Demo</Button>
            </div>
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-white dark:bg-slate-950 transition-transform duration-500 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-bold">COMMAND SUITE</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X /></button>
          </div>
          <div className="flex flex-col gap-6 text-2xl font-bold mb-auto">
            {['Platform', 'Solutions', 'Industries', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)}>{item}</a>
            ))}
          </div>
          <div className="space-y-4">
            <Button className="w-full py-4">Request Demo</Button>
            <Button variant="secondary" className="w-full py-4">Sign In</Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 md:pt-48 pb-20 px-6 relative overflow-hidden transition-opacity duration-1000">
        <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-8">
            <Badge color="teal">v4.2 Enterprise Ready</Badge>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              Enterprise AI Agents for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Intelligent Automation</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Orchestrate, manage, and scale specialized AI agents designed for mission-critical business workflows.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="px-8 py-4 text-lg">Get Started Now</Button>
              <Button variant="secondary" className="px-8 py-4 text-lg">Schedule Strategy Call</Button>
            </div>
          </div>

          <div className={`relative hidden lg:block transition-all duration-1000 delay-300 transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <Card className="p-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 overflow-hidden">
              <div className="bg-white dark:bg-[#0B132B] rounded-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3" />
                    ))}
                  </div>
                  <div className="h-40 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <BarChart3 className="text-slate-300 dark:text-slate-700 animate-pulse" size={48} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="platform" className="py-24 px-6 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Strategic AI Capabilities</h2>
            <p className="text-slate-600 dark:text-slate-400">Enterprise-grade stability meets cutting-edge agentic intelligence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <Card key={i} className="p-8 group hover:-translate-y-1 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                  {cap.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {cap.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="solutions" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-64 space-y-1">
              {['Overview', 'Active Agents', 'Workflows', 'Compliance', 'Settings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                >
                  <LayoutGrid size={18} />
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold">{activeTab}</h2>
                <Button variant="accent"><Play size={16} /> Deploy New Agent</Button>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Agent Identification</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Efficiency</th>
                        <th className="px-6 py-4">Tasks</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {agentList.map((agent, index) => (
                        <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group animate-[fadeIn_0.6s_ease-out]" style={{ animationDelay: `${index * 100}ms` }}>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 dark:text-white">{agent.name}</div>
                            <div className="text-xs text-slate-400">{agent.type}</div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge color={agent.status === 'Active' ? 'green' : agent.status === 'Training' ? 'blue' : 'amber'}>
                              {agent.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono font-bold">{agent.efficiency}</td>
                          <td className="px-6 py-4 text-sm font-medium">{agent.tasks.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => toggleAgentStatus(agent.id)}
                                className={`p-2 rounded-lg ${agent.status === 'Active' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                              >
                                {agent.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
                              </button>
                              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Autonomous Orchestration</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 py-12 px-8 bg-slate-800/50 rounded-3xl border border-white/5 backdrop-blur-md">
            <WorkflowNode title="Ingress" type="Webhooks" status="active" icon={Globe} />
            <Line />
            <WorkflowNode title="Logic" type="Vector Search" status="active" icon={Search} />
            <Line />
            <WorkflowNode title="Action" type="AI Agent V4" status="active" icon={Cpu} />
            <Line />
            <WorkflowNode title="Review" type="Human Oversight" status="idle" icon={Users} />
          </div>
        </div>
      </section>

      {/* Industry Section */}
      <section id="industries" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {industries.map(ind => (
              <button
                key={ind.name}
                onClick={() => setActiveIndustry(ind.name)}
                className={`px-8 py-3 rounded-full border transition-all text-sm font-bold flex items-center gap-2 ${activeIndustry === ind.name
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-400'
                  }`}
              >
                <ind.icon size={18} />
                {ind.name}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[400px]">
            <div className="space-y-6">
              <Badge color="teal">{activeIndustry} Solutions</Badge>
              <h3 className="text-4xl font-bold leading-tight">{currentIndustryData.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{currentIndustryData.desc}</p>
              <ul className="space-y-4">
                {currentIndustryData.list.map(li => (
                  <li key={li} className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 size={16} className="text-teal-500" /> {li}
                  </li>
                ))}
              </ul>
              <Button className="mt-4">View Case Study</Button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl aspect-video flex items-center justify-center shadow-2xl border border-slate-200 dark:border-slate-700 relative group overflow-hidden">
              <currentIndustryData.icon className="text-slate-200 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" size={120} />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Scalable Enterprise Pricing</h2>
            <div className="flex items-center justify-center gap-4 text-sm font-medium">
              <span className={!isAnnual ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isAnnual ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
              <span className={isAnnual ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>Annual</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: isAnnual ? 399 : 499, features: ['5 Active Agents', 'Basic Analytics'] },
              { name: 'Professional', price: isAnnual ? 1039 : 1299, features: ['20 Active Agents', 'Advanced Analytics'], highlight: true },
              { name: 'Enterprise', price: 'Custom', features: ['Unlimited Agents', 'Full Orchestration'] }
            ].map((plan, i) => (
              <Card key={i} className={`p-10 flex flex-col ${plan.highlight ? 'ring-2 ring-blue-600 relative scale-105 z-10 bg-slate-50 dark:bg-slate-800/20' : ''}`}>
                <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
                <div className="text-4xl font-bold mb-6">
                  {typeof plan.price === 'number' && '$'}{plan.price}
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={16} className="text-blue-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? 'primary' : 'secondary'}>Choose {plan.name}</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-slate-950 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <LayoutGrid size={24} className="text-blue-500" />
            <span className="text-xl font-bold tracking-tight">COMMAND SUITE</span>
          </div>
          <p className="text-xs">© 2024 Command Suite AI Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
