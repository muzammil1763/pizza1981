'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { validateEmail } from '@/lib/utils-app';
import { AlertCircle, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) { 
      setError('Please fill in all fields'); 
      setLoading(false); 
      return; 
    }
    
    if (!validateEmail(email)) { 
      setError('Please enter a valid email'); 
      setLoading(false); 
      return; 
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Fetch user session to check if admin
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        router.push(session?.user?.isAdmin ? '/admin/dashboard' : '/menu');
        router.refresh();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🍕</div>
              <h1 className="text-3xl font-extrabold text-white mb-1">Welcome Back</h1>
              <p className="text-[#8a9bb0] text-sm">Login to your Pizza 1981 account</p>
            </div>

            {error && (
              <div className="flex gap-3 p-3 bg-red-500/20 border border-red-400/30 rounded-xl mb-5">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" className={field} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className={field} />
                </div>
              </div>
              <Button type="submit" disabled={loading}
                className="w-full bg-[#f5a623] hover:bg-[#e09510] text-white font-bold py-6 rounded-xl text-base mt-2 shadow-lg shadow-[#f5a623]/20">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="text-center text-[#8a9bb0] text-sm mt-5">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#f5a623] hover:underline font-semibold">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
