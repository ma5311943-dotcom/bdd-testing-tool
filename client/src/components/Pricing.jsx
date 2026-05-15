import React from 'react';
import { Check, Zap, Star, Shield } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
    const plans = [
        {
            name: "Basic",
            price: "$5",
            link: "https://square.link/u/kDpE0xdk",
            features: [
                "50 Searches per month",
                "Standard Web Analysis",
                "Basic Security Audit",
                "Email Support",
                "Standard Documentation"
            ],
            btnClass: "basic",
            icon: <Shield size={24} color="var(--primary)" />
        },
        {
            name: "Pro",
            price: "$15",
            link: "https://square.link/u/MaEdPXmD",
            features: [
                "500 Searches per month",
                "Deep Behavioral Analysis",
                "Advanced Security Vectors",
                "Priority Email Support",
                "Custom PDF Reporting",
                "BDD Validation Suite"
            ],
            btnClass: "pro",
            icon: <Zap size={24} color="var(--secondary)" />
        },
        {
            name: "Elite",
            price: "$50",
            link: "https://square.link/u/v0rlBgOy",
            features: [
                "Unlimited Searches",
                "AI-Driven Strategic Insights",
                "24/7 Dedicated Support",
                "Personal Security Auditor",
                "White-label Reporting",
                "API Access Integration",
                "Global Performance Node"
            ],
            btnClass: "elite",
            icon: <Star size={24} color="var(--accent)" />
        }
    ];

    return (
        <section className="pricing-section" id="pricing">
            <div className="pricing-header">
                <h2 className="gradient-text">Precision Pricing Plans</h2>
                <p>Select the optimal tier for your architectural auditing and behavioral analysis requirements.</p>
            </div>

            <div className="pricing-grid">
                {plans.map((plan, index) => (
                    <div key={index} className={`pricing-card ${plan.name.toLowerCase()}`}>
                        <div className="plan-icon">{plan.icon}</div>
                        <h3 className="plan-name">{plan.name}</h3>
                        <div className="plan-price">
                            {plan.price}
                            <span>/month</span>
                        </div>
                        <ul className="plan-features">
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex}>
                                    <Check className="feature-icon" size={18} />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`pricing-btn ${plan.btnClass}`}
                            onClick={() => window.open(plan.link, '_blank')}
                        >
                            Purchase {plan.name}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;
