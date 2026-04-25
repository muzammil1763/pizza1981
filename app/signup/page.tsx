'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { validateEmail, validatePhone } from '@/lib/utils-app';
import { AlertCircle, Mail, Lock, User, Phone } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { name, email, phone, password, confirmPassword } = formData;
    
    if (!name || !email || !phone || !password || !confirmPassword) { 
      setError('Please fill in all fields'); 
      setLoading(false); 
      return; 
    }
    
    if (name.length < 2) { 
      setError('Name must be at least 2 characters'); 
      setLoading(false); 
      return; 
    }
    
    if (!validateEmail(email)) { 
      setError('Please enter a valid email'); 
      setLoading(false); 
      return; 
    }
    
    if (!validatePhone(phone)) { 
      setError('Please enter a valid phone number'); 
      setLoading(false); 
      return; 
    }
    
    if (password.length < 6) { 
      setError('Password must be at least 6 characters'); 
      setLoading(false); 
      return; 
    }
    
    if (password !== confirmPassword) { 
      setError('Passwords do not match'); 
      setLoading(false); 
      return; 
    }

    try {
      // Create account
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      // Auto login after signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/menu');
        router.refresh();
      } else {
        // Account created but login failed, redirect to login page
        router.push('/login');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  const field = 'w-full pl-10 pr-4 py-3 bg-white border border-white/20 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f5a623] transition text-sm';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Navy card */}
          <div className="bg-[#1e3a5f] rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-7">
              <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🍕</div>
              <h1 className="text-3xl font-extrabold text-white mb-1">Create Account</h1>
              <p className="text-[#8a9bb0] text-sm">Join Pizza 1981 today</p>
            </div>

            {error && (
              <div className="flex gap-3 p-3 bg-red-500/20 border border-red-400/30 rounded-xl mb-5">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name',    name: 'name',            type: 'text',     icon: <User size={18} />,  placeholder: 'Ali Hassan'       },
                { label: 'Email',        name: 'email',           type: 'email',    icon: <Mail size={18} />,  placeholder: 'your@email.com'   },
                { label: 'Phone',        name: 'phone',           type: 'tel',      icon: <Phone size={18} />, placeholder: '03001234567'      },
                { label: 'Password',     name: 'password',        type: 'password', icon: <Lock size={18} />,  placeholder: '••••••••'         },
                { label: 'Confirm Password', name: 'confirmPassword', type: 'password', icon: <Lock size={18} />, placeholder: '••••••••'     },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-white/80 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{f.icon}</span>
                    <input type={f.type} name={f.name} value={(formData as any)[f.name]}
                      onChange={handleChange} placeholder={f.placeholder} className={field} />
                  </div>
                </div>
              ))}

              <Button type="submit" disabled={loading}
                className="w-full bg-[#f5a623] hover:bg-[#e09510] text-white font-bold py-6 rounded-xl text-base mt-2 shadow-lg shadow-[#f5a623]/20">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <p className="text-center text-[#8a9bb0] text-sm mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-[#f5a623] hover:underline font-semibold">Login</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
