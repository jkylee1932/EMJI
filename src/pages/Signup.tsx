import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Trophy,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type Role = 'student' | 'educator';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    if (!agreed) {
      toast({ title: 'Please accept the Terms of Service', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName, role, professionalTitle);
      toast({ title: 'Account created!', description: 'Welcome to ModuLearn.' });
      navigate(role === 'educator' ? '/dashboard/educator' : '/dashboard/student');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not create account';
      toast({ title: 'Sign up failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Decorative Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden gradient-hero flex-col items-center justify-center p-14">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-white/8 blur-2xl animate-float-delayed" />

        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">ModuLearn</span>
          </div>

          <h2 className="font-display text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            Start your journey today.
          </h2>
          <p className="text-white/75 mb-10 text-base leading-relaxed">
            Join a growing community of learners and expert educators.
          </p>

          <div className="space-y-4">
            {[
              { icon: BookOpen, title: 'Structured Learning', desc: 'Modular courses you can complete at your pace' },
              { icon: Trophy, title: 'Earn Certificates', desc: 'Showcase your skills with verified certificates' },
              { icon: Lightbulb, title: 'Expert Educators', desc: 'Learn from industry professionals' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{item.title}</div>
                  <div className="text-white/60 text-xs mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex flex-col justify-between p-8 md:p-12 bg-background overflow-y-auto">
        {/* Top: Logo (mobile only) */}
        <Link to="/" className="flex items-center gap-2.5 w-fit lg:hidden mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">ModuLearn</span>
        </Link>

        <div className="w-full max-w-sm mx-auto animate-fade-up">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2 tracking-tight">
              Create account
            </h1>
            <p className="text-muted-foreground">Join thousands of learners and educators</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 rounded-xl bg-muted mb-6">
            {(['student', 'educator'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  role === r
                    ? 'bg-background text-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full-name" className="text-sm font-medium text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full-name"
                  type="text"
                  placeholder={role === 'student' ? 'John Doe' : 'Jane Smith'}
                  className="pl-10 h-11 bg-muted/50 border-border/70 focus:bg-background transition-colors"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
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
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
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

            {role === 'educator' && (
              <div className="space-y-1.5 animate-fade-up">
                <Label htmlFor="title" className="text-sm font-medium text-foreground">
                  Professional Title <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. Senior Web Developer"
                  className="h-11 bg-muted/50 border-border/70 focus:bg-background transition-colors"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 rounded border-border accent-primary cursor-pointer"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-primary font-medium hover:underline">Terms</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-base shadow-elevated group mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create {role === 'educator' ? 'Educator' : 'Student'} Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="h-4 lg:hidden" />
      </div>
    </div>
  );
};

export default Signup;
