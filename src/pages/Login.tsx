import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  Award,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: 'Welcome back!' });
      setTimeout(() => {
        const role = profile?.role ?? 'student';
        navigate(role === 'educator' ? '/dashboard/educator' : '/dashboard/student');
      }, 300);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      toast({ title: 'Sign in failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Form Panel ── */}
      <div className="flex-1 flex flex-col justify-between p-8 md:p-12 bg-background">
        {/* Top: Logo */}
        <Link to="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground tracking-tight">ModuLearn</span>
        </Link>

        {/* Center: Form */}
        <div className="w-full max-w-sm mx-auto animate-fade-up">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11 bg-muted/50 border-border/70 focus:bg-background transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11 bg-muted/50 border-border/70 focus:bg-background transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-base shadow-elevated group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        {/* Bottom: Legal */}
        <p className="text-xs text-muted-foreground text-center">
          By signing in you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">Terms</Link>{' '}
          &{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</Link>
        </p>
      </div>

      {/* ── Right: Decorative Panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden gradient-hero flex-col items-center justify-center p-14">
        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full bg-white/8 blur-2xl animate-float-delayed" />

        {/* Content */}
        <div className="relative z-10 max-w-md">
          {/* Icon cluster */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>

          <h2 className="font-display text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
            Learn without
            <br />
            <span className="text-white/70">limits.</span>
          </h2>

          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Access hundreds of expert-led courses, track your progress, and earn certificates — all in one place.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-10">
            {[
              { value: '1,000+', label: 'Students' },
              { value: '200+', label: 'Educators' },
              { value: '500+', label: 'Courses' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quote card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <p className="text-white/90 italic text-base leading-relaxed mb-3">
              "The beautiful thing about learning is that nobody can take it away from you."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
              <span className="text-white/60 text-sm font-medium">B.B. King</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
